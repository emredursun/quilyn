const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){const values=new Map(),notices=[];let fail=false;const window={dispatchEvent:e=>notices.push(e.detail),QuilynRuntime:{safeUrl:v=>v},crypto:{randomUUID:()=>Math.random().toString(36)}};
 const context={window,Date,Set,Map,TextEncoder,CustomEvent:class{constructor(t,o){this.detail=o.detail;}},localStorage:{get length(){return values.size;},key:i=>[...values.keys()][i]??null,removeItem:k=>values.delete(k),getItem:k=>values.get(k)??null,setItem(k,v){if(fail)throw Error('quota');values.set(k,v);}}};
 for(const file of ['progress','learning-history'])vm.runInNewContext(fs.readFileSync('core/js/'+file+'.js','utf8'),context);
 return {j:window.QuilynJournal,p:window.QuilynProgress,context,values,notices,fail(){fail=true;}};}
const question={questionId:'Q1',type:'single-select',scenario:'Which choice?',options:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctOptions:['A'],rationale:'First is correct',sourceUrl:'https://academy.pega.com/'};
const meta=(id,track='PSSA',kind='quiz')=>({id,track,kind,name:'Lesson',mode:'practice',total:1,status:'completed'});
test('grades are deduplicated; correction resolves mistakes without altering historical snapshots',()=>{
 const {j}=setup(),snapshot=j.quizQuestion('PSSA','M1',question,'Security'),row={snapshot,selected:['B'],conf:'sure'};
 assert.equal(j.record(meta('one'),[row]),true);assert.equal(j.record(meta('one'),[row]),true);
 assert.equal(j.read().mistakes[snapshot.key].failures,1);
 j.record(meta('two'),[{...row,selected:['A']}]);const state=j.read();assert.equal(state.mistakes[snapshot.key].resolved,true);
 assert.equal(state.attempts.find(a=>a.id==='one').rows[0].selected[0],'B');assert.equal(state.attempts.length,2);
 j.record(meta('three'),[row]);assert.equal(j.read().mistakes[snapshot.key].failures,2);assert.equal(j.read().mistakes[snapshot.key].resolved,false);
});
test('quiz and sourced mock questions share mistake identity; tracks remain isolated',()=>{
 const {j}=setup();const quiz=j.quizQuestion('PSSA','M1',question,'Security');
 const mock=j.mockQuestion('PSSA','Exam',{sourceModuleId:'M1',sourceQuestionId:'Q1',d:'Security',q:question.scenario,o:['First','Second'],a:[0],r:'First is correct'},0);
 assert.equal(quiz.key,mock.key);assert.equal(quiz.signature,mock.signature);
 j.record(meta('quiz'),[{snapshot:quiz,selected:['B'],conf:null}]);j.record(meta('mock','PSSA','mock'),[{snapshot:mock,selected:['A'],conf:null}]);
 assert.equal(j.read().mistakes[quiz.key].resolved,true);
 const other=j.quizQuestion('PBA','M1',question,'Security');j.record(meta('other','PBA'),[{snapshot:other,selected:['B'],conf:null}]);assert.equal(Object.keys(j.read().mistakes).length,2);
});
test('revised content retains historical explanations and requires a matching-version correction',()=>{
 const {j}=setup();const first=j.quizQuestion('PSSA','M1',question);j.record(meta('one'),[{snapshot:first,selected:['B'],conf:null}]);
 const revised=j.quizQuestion('PSSA','M1',{...question,scenario:'New wording',rationale:'New explanation'});
 j.record(meta('two'),[{snapshot:revised,selected:['A'],conf:null}]);assert.equal(j.read().mistakes[first.key].resolved,false);
 assert.equal(j.read().attempts.find(a=>a.id==='one').rows[0].snapshot.rationale,'First is correct');
});
test('backup validation rejects malformed answers, snapshots and prototype keys without throwing',()=>{
 const {j,p}=setup();j.record(meta('one'),[{snapshot:j.quizQuestion('PSSA','M1',question),selected:['B'],conf:null}]);const state=j.read();
 assert.deepEqual(Array.from(p.validateBundle({version:2,state:{quilyn_learning:state}})),['quilyn_learning']);
 for(const mutate of [s=>s.attempts[0].rows[0]={},s=>s.attempts[0].rows[0].selected=['X'],s=>s.attempts[0].rows[0].snapshot.scenario='modified',s=>s.attempts[0].mode='unknown']){
  const invalid=structuredClone(state);mutate(invalid);assert.equal(p.validEntry('quilyn_learning',invalid),false);
 }
 assert.equal(p.validEntry('quilyn_learning',JSON.parse('{"version":1,"attempts":[],"mistakes":{"__proto__":{}}}')),false);
});
test('retention bounds history and mistakes; failed writes preserve existing records',()=>{
 const {j,fail,notices}=setup();for(let i=0;i<510;i++)j.record(meta('attempt-'+i),[{snapshot:j.quizQuestion('PSSA','M'+i,question),selected:['B'],conf:null}]);
 const before=JSON.stringify(j.read());assert.equal(j.read().attempts.length,50);assert.equal(Object.keys(j.read().mistakes).length,500);
 fail();assert.equal(j.record(meta('quota'),[]),false);assert.equal(JSON.stringify(j.read()),before);assert.ok(notices.length);
});
test('duplicate source questions remain separate exam slots and unanswered submissions are recorded',()=>{
 const {j}=setup(),snapshot=j.quizQuestion('PSSA','M1',question);
 j.record({...meta('exam','PSSA','mock'),total:2,mode:'simulation'},[{slot:'0',snapshot,selected:['A'],conf:null},{slot:'1',snapshot,selected:[],conf:null}]);
 assert.equal(j.read().attempts[0].rows.length,2);assert.equal(j.read().mistakes[snapshot.key].resolved,false);
});

test('every real mock bank can be snapshotted and validated, including multi-select legacy questions',()=>{
 const {j}=setup();const banks=JSON.parse(fs.readFileSync('data/mock-exams.json','utf8'));
 for(const [track,exams] of Object.entries(banks))for(const [name,questions] of Object.entries(exams)){
  const rows=questions.map((q,i)=>({slot:String(i),snapshot:j.mockQuestion(track,name,q,i),selected:[],conf:null}));
  assert.equal(j.record({id:track+name,track,kind:'mock',mode:'simulation',name,total:questions.length,status:'completed'},rows),true,track+' '+name);
 }
});

test('starting fresh abandons an unfinished attempt without changing completed history',()=>{
 const {j}=setup();const row={snapshot:j.quizQuestion('PSSA','M1',question),selected:['B'],conf:null};
 j.record({...meta('pending'),status:'in-progress'},[row]);assert.equal(j.abandon('pending'),true);assert.equal(j.read().attempts[0].status,'abandoned');
 j.record(meta('finished'),[row]);j.abandon('finished');assert.equal(j.read().attempts.find(a=>a.id==='finished').status,'completed');
});

test('Settings export and progress import round-trip journal snapshots and resolved states',()=>{
 const {j,p,context,values}=setup();
 const snapshot=j.quizQuestion('PSSA','M1',question);j.record(meta('wrong'),[{snapshot,selected:['B'],conf:'sure'}]);j.record(meta('correct'),[{snapshot,selected:['A'],conf:null}]);
 const source=fs.readFileSync('core/js/settings.js','utf8').replace('global.PegaSettings = {','global.PegaSettings = {gatherState:gatherState,');vm.runInNewContext(source,context);
 const bundle=context.window.PegaSettings.gatherState();assert.equal(bundle.state.quilyn_learning.attempts.length,2);
 const expected=JSON.stringify(j.read());values.clear();p.applyBundle(bundle);assert.equal(JSON.stringify(j.read()),expected);assert.equal(j.read().mistakes[snapshot.key].resolved,true);
});

test('notebook retries keep same-named question IDs from different modules independent',()=>{
 const {j,p,context}=setup();for(const module of ['M1','M2'])j.record(meta(module),[{snapshot:j.quizQuestion('PSSA',module,question),selected:['B'],conf:null}]);
 const controls={},root={isConnected:true,contains(){return false;},querySelector(selector){return controls[selector]||(controls[selector]={});},appendChild(){}};let retryQuestions;
 context.document={createElement:()=>root,getElementById:()=>({focus(){}})};root.scrollIntoView=()=>{};context.window.PegaQuiz={render:(host,qs)=>retryQuestions=qs};
 j.mount({replaceChildren(){}},'PSSA','mistakes');controls['#jl-retry'].onclick.call({});assert.equal(retryQuestions.length,2);
 const restored=p.quizState({0:{selected:['A'],graded:true},1:{selected:['B'],graded:true}},retryQuestions);assert.equal(Object.keys(restored.answers).length,2);assert.equal(Object.values(restored.answers)[0].selected[0],'A');assert.equal(Object.values(restored.answers)[1].selected[0],'B');
 assert.notEqual(retryQuestions[0].learningSnapshot.key,retryQuestions[1].learningSnapshot.key);
});

test('option explanations and lesson section survive history and backup without changing answer identity',()=>{
 const {j,p}=setup(),q={...question,lessonSection:'topic-1',optionExplanations:{A:'Matches the requirement.',B:'Does not meet the scope.'},explanationReviewedOn:'2026-10-02'};
 const snapshot=j.quizQuestion('PSSA','M1',q);assert.equal(snapshot.signature,j.quizQuestion('PSSA','M1',question).signature);
 j.record(meta('feedback'),[{snapshot,selected:['B'],conf:null}]);q.optionExplanations.B='Later editorial revision';assert.equal(j.read().attempts[0].rows[0].snapshot.optionExplanations.B,'Does not meet the scope.');
 assert.deepEqual(Array.from(p.validateBundle({version:2,state:{quilyn_learning:j.read()}})),['quilyn_learning']);
 const html=j.feedbackHTML(snapshot);assert.match(html,/#PSSA\/M1\/guide\/topic-1/);assert.match(html,/Why each option fits or fails/);
});
test('malformed editorial metadata cannot enter stored learning snapshots',()=>{
 const {j}=setup();for(const extra of [{lessonSection:'../bad'},{optionExplanations:{A:'Only one'}},{optionExplanations:{A:'',B:'Text'}},{explanationReviewedOn:'invalid'}]){
  const snapshot=j.quizQuestion('PSSA','M1',{...question,...extra});assert.equal(j.valid({version:1,attempts:[{...meta('bad'),updatedAt:new Date().toISOString(),startedAt:new Date().toISOString(),elapsedSeconds:0,rows:[{snapshot,selected:['B'],conf:null}]}],mistakes:{}}),false);
 }
});
test('old snapshots keep their fallback lesson links and authored text is escaped',()=>{
 const {j}=setup();assert.match(j.feedbackHTML(j.quizQuestion('PSSA','M1',question)),/#PSSA\/M1\/guide"/);
 const snapshot=j.quizQuestion('PSSA','M1',{...question,optionExplanations:{A:'<script>bad()</script>',B:'safe'}});assert.ok(!j.feedbackHTML(snapshot).includes('<script>'));assert.match(j.feedbackHTML(snapshot),/&lt;script&gt;/);
});
test('all PSSA lesson targets resolve and sourced mock feedback matches its originating question',()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json')),bank=JSON.parse(fs.readFileSync('data/mock-exams.json')),lookup=new Map();let mapped=0,explained=0;
 for(const m of registry.tracks.find(t=>t.trackId==='PSSA').modules){const d=JSON.parse(fs.readFileSync(m.file));const ids=new Set(d.studyGuide.map(s=>s.sectionId));
  for(const q of d.practiceQuiz){assert.ok(ids.has(q.lessonSection));lookup.set(m.id+'/'+q.questionId,q);mapped++;if(q.optionExplanations){explained++;assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());}}
 }
 assert.equal(mapped,203);assert.equal(explained,203);
 for(const qs of Object.values(bank.PSSA))for(const q of qs){const original=lookup.get(q.sourceModuleId+'/'+q.sourceQuestionId);if(original){assert.equal(q.lessonSection,original.lessonSection);assert.deepEqual(q.optionExplanations,original.optionExplanations);}}
});
