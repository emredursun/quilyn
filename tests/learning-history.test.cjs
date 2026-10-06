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

test('reviewed PBA questions have complete feedback and real lesson targets',()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json'));let count=0;
 for(const m of registry.tracks.find(t=>t.trackId==='PBA').modules){const d=JSON.parse(fs.readFileSync(m.file));const ids=new Set(d.studyGuide.map(s=>s.sectionId));
  for(const q of d.practiceQuiz){assert.ok(q.optionExplanations,m.id+' '+q.questionId);count++;assert.ok(ids.has(q.lessonSection),m.id+' '+q.questionId);assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));}
 }
 assert.equal(count,293);
 const d=JSON.parse(fs.readFileSync('data/business-architect/m03_pega_center_out_architecture.json'));
 assert.match(d.practiceQuiz[13].options[0].text,/evaluate/);
 assert.match(d.studyGuide[5].elements[0].description,/evaluation/);
 assert.ok(!JSON.stringify(d).includes('automatically brings all consuming applications into compliance'));
});

test('PSA foundation feedback resolves to real sections and preserves the reviewed answer keys',()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json'));let count=0;
 const keys=[{3:['A','B'],5:['B'],6:['A','B','C'],10:['A','B'],16:['A','B','C'],20:['A','B']},{6:['A','B'],15:['A','B','C'],19:['A','B'],20:['A','B'],21:['A','B']},{8:['A','B'],15:['A','B'],16:['A','B'],17:['A','B']}];
 registry.tracks.find(t=>t.trackId==='PSA').modules.slice(0,3).forEach((m,index)=>{
  const d=JSON.parse(fs.readFileSync(m.file)),sections=new Set(d.studyGuide.map(s=>s.sectionId));
  d.practiceQuiz.forEach((q,i)=>{count++;assert.deepEqual(q.correctOptions,keys[index][i+1]||['A']);assert.ok(sections.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.equal(q.explanationReviewedOn,index<2?'2026-10-04':index===2?'2026-10-05':'2026-10-02');});
 });assert.equal(count,60);
});
test('PSA draft, naming and access questions avoid the reviewed misleading claims',()=>{
 const d=JSON.parse(fs.readFileSync('data/system-architect/m02_defining_customer_microjourney.json'));
 const draft=d.practiceQuiz.find(q=>q.questionId==='m02_q20');assert.doesNotMatch(draft.options[0].text,/without.*live application/);assert.match(draft.options[1].text,/before.*production/);assert.match(draft.rationale,/not a deployment isolation/);
 const naming=d.practiceQuiz.find(q=>q.questionId==='m02_q12');assert.match(naming.scenario,/Process = 'Review documents'/);assert.match(naming.rationale,/verb\+noun/);
 const users=JSON.parse(fs.readFileSync('data/system-architect/m03_inviting_users_to_application.json'));assert.match(users.practiceQuiz[15].options[0].text,/individual user.*People tab/);assert.doesNotMatch(users.practiceQuiz[15].options[1].text,/includes.*Persona/);
});

test('PSA Center-out, GenAI and Blueprint feedback has complete, real lesson targets',()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json'));let count=0;
 for(const m of registry.tracks.find(t=>t.trackId==='PSA').modules.slice(3,6)){const d=JSON.parse(fs.readFileSync(m.file)),ids=new Set(d.studyGuide.map(s=>s.sectionId));for(const q of d.practiceQuiz){count++;assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.equal(q.explanationReviewedOn,['SA-M04','SA-M05','SA-M06'].includes(m.id)?'2026-10-05':'2026-10-02');}}
 assert.equal(count,49);
 const center=JSON.parse(fs.readFileSync(registry.tracks.find(t=>t.trackId==='PSA').modules[3].file));assert.match(center.practiceQuiz[7].options[1].text,/testing remains necessary/);assert.match(center.practiceQuiz[13].options[0].text,/validate/);
 const genai=JSON.parse(fs.readFileSync(registry.tracks.find(t=>t.trackId==='PSA').modules[4].file));assert.match(genai.practiceQuiz[14].options[0].text,/individual features/);assert.doesNotMatch(genai.practiceQuiz[14].rationale,/cannot access any/);
});

test('PSA data feedback has real targets and distinguishes ownership, cardinality and caching',()=>{
 const r=JSON.parse(fs.readFileSync('data/registry.json'));let count=0;
 for(const m of r.tracks.find(t=>t.trackId==='PSA').modules.slice(6,9)){const d=JSON.parse(fs.readFileSync(m.file)),ids=new Set(d.studyGuide.map(s=>s.sectionId));for(const q of d.practiceQuiz){count++;assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));}}
 assert.equal(count,54);
 const rel=JSON.parse(fs.readFileSync('data/system-architect/m09_creating_a_data_relationship.json'));
 assert.match(rel.practiceQuiz[1].scenario,/delivery address/);assert.doesNotMatch(rel.practiceQuiz[1].scenario,/CVV/);
 assert.match(rel.practiceQuiz[8].rationale,/not a security boundary/);assert.doesNotMatch(rel.practiceQuiz[8].options[0].text,/cannot be accessed/);
 assert.doesNotMatch(rel.practiceQuiz[4].rationale,/retrieves a single record, not/);assert.match(rel.practiceQuiz[18].options[1].text,/List of records/);
 const data=JSON.parse(fs.readFileSync('data/system-architect/m08_the_data_model.json'));assert.match(data.practiceQuiz[5].scenario,/configured to a system of record/);assert.match(data.practiceQuiz[16].rationale,/refresh and invalidation/);
});

test('PSA UI, guidance and routing review has complete feedback and current source evidence',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));let count=0;
 const r=JSON.parse(fs.readFileSync('data/registry.json')),modules=r.tracks.find(t=>t.trackId==='PSA').modules.slice(9,12);
 for(const m of modules){const bytes=fs.readFileSync(m.file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),review=inventory.modules.find(x=>x.id===m.id);
  assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.sourceReviewedOn,'2026-10-02');
  for(const q of d.practiceQuiz){count++;assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.deepEqual(q.correctOptions,q.type==='multi-select'?['A','B']:['A']);}
 }assert.equal(count,55);
 const ui=JSON.parse(fs.readFileSync(modules[0].file)),guidance=JSON.parse(fs.readFileSync(modules[1].file)),routing=JSON.parse(fs.readFileSync(modules[2].file));
 assert.match(ui.practiceQuiz[18].options[1].text,/Form View/);assert.doesNotMatch(JSON.stringify(ui),/Full Page views.*assigned directly|DEPTH LIMIT|Cosmos React/);
 assert.match(ui.studyGuide.find(s=>s.sectionTitle==='Model-driven UI Controls').elements[0].description,/supported/);
 assert.match(guidance.practiceQuiz[16].options[0].text,/New, Open, Pending and Resolved/);assert.match(guidance.practiceQuiz[15].options[1].text,/configured/);
 assert.match(routing.practiceQuiz[10].options[0].text,/preceding task/);assert.match(routing.practiceQuiz[5].options[0].text,/Roles/);assert.doesNotMatch(JSON.stringify(routing),/would create 25 separate|creates 30 separate/);
});

test('approval review keeps answer identities, complete feedback and evidence for the local content',()=>{
 const crypto=require('node:crypto'),r=JSON.parse(fs.readFileSync('data/registry.json')),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));let count=0;
 const modules=r.tracks.find(t=>t.trackId==='PSA').modules.slice(12,14);
 modules.forEach((m,index)=>{const bytes=fs.readFileSync(m.file),d=JSON.parse(bytes),sections=new Set(d.studyGuide.map(s=>s.sectionId)),review=inventory.modules.find(x=>x.id===m.id);
  assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
  d.practiceQuiz.forEach((q,i)=>{count++;assert.equal(q.questionId,'m'+(13+index)+'_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,index===0&&i>=12||index===1&&[7,12,13].includes(i)?['A','B']:['A']);assert.ok(sections.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.equal(q.explanationReviewedOn,'2026-10-02');});
 });assert.equal(count,29);
 const approval=JSON.parse(fs.readFileSync(modules[0].file)),cascade=JSON.parse(fs.readFileSync(modules[1].file));
 assert.match(approval.practiceQuiz[0].options[0].text,/shared Work Queue/);assert.match(approval.practiceQuiz[7].options[0].text,/Resolved-Rejected/);
 assert.match(approval.practiceQuiz[4].options[0].text,/Reject flow/);assert.doesNotMatch(JSON.stringify(approval.studyGuide),/auto-approve|Three approval actions|default is to return/);
 assert.match(cascade.practiceQuiz[11].scenario,/reporting-structure/);assert.match(cascade.practiceQuiz[13].optionExplanations.B,/not assume arbitrary middle tiers/);
 assert.match(cascade.studyGuide[2].elements[0].description,/Data Page, Activity or Data Transform/);
 assert.doesNotMatch(JSON.stringify(cascade),/authority matrix traverses|can be configured in App Studio|not an\./);
});

test('late-work feedback distinguishes finite recurrence, assignment completion and urgency caps',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m16_escalating_late_work.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const review=inventory.modules.find(m=>m.id==='SA-M16');assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,15);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m16_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[6].scenario,/at least three events/);assert.match(d.practiceQuiz[11].scenario,/timely processing/);assert.match(d.practiceQuiz[14].scenario,/Assignment remains incomplete/);
 assert.match(d.studyGuide[0].elements.at(-1).description,/six/);assert.doesNotMatch(JSON.stringify(d),/continues firing indefinitely|fires continuously until case resolution|Passed Deadline Interval rule/);
 assert.match(d.practiceQuiz[9].optionExplanations.A,/notification action still runs/);
});

test('SLA feedback separates configured actions and Case inheritance from task urgency',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m15_completing_work_on_time.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M15');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,15);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m15_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[1].scenario,/no resolution action/);assert.match(d.practiceQuiz[9].scenario,/no resolution action/);assert.match(d.practiceQuiz[11].options[0].text,/passed deadline interval 3 days, one event/);
 assert.match(d.studyGuide[1].elements[1].description,/existing Assignment’s own SLA/);assert.match(d.practiceQuiz[14].scenario,/milestones/);
 assert.doesNotMatch(JSON.stringify(d),/not at data or\.|Urgency only goes up, never down|goal, additional interval|changing an SLA's Urgency increment affects/);
});

test('email editorial review distinguishes recipient references, templates and send events',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m17_sending_emails_case_processing.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M17');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m17_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,[3,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.doesNotMatch(JSON.stringify(d),/Hardcoded = violation|Create Operator.{0,80}(?:built-in system templates|operator lifecycle notifications)|only pattern.*external emails|Notify sends only|Case owner \+ creator|fire-and-forget/);
 assert.match(d.studyGuide[0].elements.at(-1).caption,/references, not message templates/);assert.match(d.practiceQuiz[12].hint,/not a claim that no other/);
});


test('team editorial review preserves keys and replaces unsupported management claims',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m18_creating_managing_teams_users.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M18');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m18_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,[5,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[9].options[0].text,/Authorized managers on the Work Group tab/);assert.match(d.practiceQuiz[11].scenario,/Roles restriction configured/);assert.match(d.practiceQuiz[13].options[1].text,/not required to belong/);
 assert.doesNotMatch(JSON.stringify(d),/scoped per Case Type|operator belongs to one Work Group|Deputy WGM field|requires a manager to manually act/);
});

test('parallel development editorial review separates integration from release and checks metric names',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m19_team_application_development.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M19');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.platformVersion,"Pega Platform '25");
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m19_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,[4,10,12].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[11].options[0].text,/integration, before release/);assert.match(d.studyGuide[1].elements[4].caption,/deployment guarantee/);assert.match(d.examPitfalls[5].bestPractice,/Approval is a separate/);
 assert.doesNotMatch(JSON.stringify(d),/PREREQUISITE: Lock|unlocked Ruleset cannot be branched|all must pass|all delivery-phase roles who join after/);
});

test('Pulse editorial review keeps notification preferences explicit and avoids invented storage guarantees',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m20_collaboration_with_users.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M20');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m20_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,[3,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[9].scenario,/chosen Pulse email/);assert.match(d.practiceQuiz[9].options[0].text,/email notification/);assert.match(d.practiceQuiz[11].options[0].text,/dialog listing Cases/);assert.match(d.practiceQuiz[13].options[1].text,/comment/);
 assert.doesNotMatch(JSON.stringify(d),/permanent case history data|persist as long as the case exists|not external email by default|original CSR loses access/);
});

test('reuse editorial review aligns principles and avoids integration guarantees',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m21_modular_architecture_enterprise_reuse.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M21');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.platformVersion,"Pega Platform '25");
 assert.equal(d.practiceQuiz.length,16);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m21_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,[0,5].includes(i)?['A','B','C']:[10,15].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[1].elements[5].caption,/Interoperable, Updateable, Configurable, Modular and Governed/);assert.match(d.practiceQuiz[1].hint,/not the complete rule-resolution/);assert.match(d.practiceQuiz[15].options[1].text,/governed compatibility/);
 assert.doesNotMatch(JSON.stringify(d),/first matching rule wins|Single, Maximize, Manage, Build|Division → Region → Channel → Product|thresholds directly in App Studio/);
});

test('Rule creation review corrects version increments and prefix inheritance',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m22_creating_a_rule.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M22');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,22);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m22_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,i===2?['C']:[4,18,19,20,21].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[3].elements[4].description,/timestamp normalized to GMT/);assert.match(d.studyGuide[2].elements[3].caption,/patch increment/);assert.match(d.practiceQuiz[18].options[0].text,/Application Layer/);assert.match(d.practiceQuiz[18].options[1].text,/directly from @baseclass/);
 assert.doesNotMatch(JSON.stringify(d),/inherits from Work because|Only the major version number matters|checking in the earlier version|Promoted via Guardrails/);
});

test('relevant-record review separates discovery from execution and guardrail enforcement',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m23_promoting_rule_reuse_relevant_records.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M23');
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,12);d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m23_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,i===3?['A','B','C']:i===4?['A','B']:i===11?['A','C']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[2].rationale,/not evidence that every warning/);assert.match(d.practiceQuiz[7].scenario,/no class-specific inactive/);assert.match(d.practiceQuiz[9].scenario,/configured primary context/);assert.equal(d.topics[0].duration,'10 min');
 assert.doesNotMatch(JSON.stringify(d),/Mark as mobile-eligible|Rules EXECUTED during the last|violations block marking|Guardrail compliance is prerequisite|only location for the full/);
});

test('Automation review scopes system actions and corrects ambiguous stage and update questions',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m24_automation_shapes_case_life_cycle.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M24');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'20 min');
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===4?['A','B','C']:[11,12].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[0].scenario,/generation.*supported/);assert.match(d.practiceQuiz[8].scenario,/Run Data Transform/);assert.doesNotMatch(d.practiceQuiz[9].scenario,/not only the current/);assert.match(d.practiceQuiz[11].options[3].text,/previously visited.*next Stage/);assert.match(d.studyGuide[0].elements[0].description,/Questionnaire/);
 assert.doesNotMatch(JSON.stringify(d),/all run automatically, no Assignment|SYSTEM-EXECUTED, NO ASSIGNMENT|CREATE CASE — creates child Cases|always cascades to child Cases automatically.*Correct/);
});

test('Process-modeling review corrects swapped colors and distinguishes End from Case resolution',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m25_automating_workflow_decisions.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M25');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.platformVersion,"Pega Platform '25");
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=11?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[12].options[0].text,/green rectangle.*Subprocess.*blue rectangle/);assert.match(d.practiceQuiz[8].rationale,/not inherently the whole Case/);assert.match(d.practiceQuiz[13].rationale,/not a promise/);
 assert.doesNotMatch(JSON.stringify(d),/blue for Assignment steps|green for Subprocess steps|original flow does NOT resume|Utility Action \(reusable|End shape resolves the Case|exactly one green Start/);
});

test('calculation review corrects category diagram and explains ordered condition evaluation',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m26_calculating_fields_decision_tables.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M26');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'25 min');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=11?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[1].elements[3].description,/first row.*otherwise/);assert.match(d.practiceQuiz[13].options[0].text,/aggregate choices/);assert.match(d.practiceQuiz[3].scenario,/including its quantity/);assert.match(d.practiceQuiz[4].scenario,/comparable numeric monetary/);
 assert.doesNotMatch(JSON.stringify(d),/Default Value \(once at creation\)|Sum, Count, Average|Expressions are supported only.*Double|tables can return any data type|built-in operations like @Sum/);assert.ok(d.topics.some(t=>t.url.includes('calculated-values/v6')));
});

test('Decision Rule review allows multi-column tables and scopes conflict and delegation tools',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m27_decision_tables_and_trees.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M27');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[7,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[0].elements[0].description,/different columns may test different fields/);assert.match(d.practiceQuiz[0].scenario,/already has authorized/);assert.match(d.practiceQuiz[3].rationale,/not a requirement/);assert.match(d.practiceQuiz[13].options[0].text,/unreachable.*earlier broader/);
 assert.doesNotMatch(JSON.stringify(d),/Different properties → Decision tree.*rule|table's columnar structure cannot handle|all rows always execute|Test tab on a Decision Rule|Both can return any data type/);
});

test('conditional-execution review avoids universal OR bans and extra required Rules',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m28_skipping_process_or_stage.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M28');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.topics[0].duration,'5 min');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[7,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[9].scenario,/combined.*same way.*single-valued/);assert.match(d.practiceQuiz[12].options[1].text,/not require a second separately/);assert.match(d.practiceQuiz[1].rationale,/start condition/);
 assert.doesNotMatch(JSON.stringify(d),/Cannot express OR logic|condition \(When Rule\) is composed of exactly|Stage skip and Process skip are entirely independent|can reference any Case property/);
});

test('optional-work review distinguishes promotion eligibility from lifecycle effects',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m29_adding_optional_actions_workflow.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M29');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.sourceReviewedOn,'2026-10-04');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[8,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[0].elements[4].description,/first Stage-wide Action other than Edit details/);assert.match(d.studyGuide[0].elements[4].description,/Optional Processes are not supported/);assert.match(d.practiceQuiz[11].rationale,/Change Stage.*cancellation/);assert.match(d.practiceQuiz[9].scenario,/distinct configured Steps/);
 assert.doesNotMatch(JSON.stringify(d),/required workflow continues uninterrupted|never mandatory.*no|Every Case Type includes two|do NOT interrupt required Case flow/);
});

test('duplicate-search review preserves inclusive threshold and user resolution without ranking promises',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m30_identifying_duplicate_cases.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M30');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.sourceReviewedOn,'2026-10-04');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[7,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[2].scenario,/All basic conditions pass/);assert.match(d.practiceQuiz[8].options[0].text,/depends.*20 or lower/);assert.match(d.practiceQuiz[2].optionExplanations.A,/threshold of 70 accepts 70/);assert.match(d.studyGuide[0].elements[4].description,/requires customized behavior/);assert.equal(d.topics[0].url,'https://academy.pega.com/topic/duplicate-search/v7/in/96211/67036');
 assert.doesNotMatch(JSON.stringify(d),/ranked list|runs automatically at case creation|all match exactly|cannot be saved without at least one|higher total score = higher likelihood/);
});

test('child-Case review separates resolution dependency from every-Step blocking and copy from reference',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m31_creating_a_child_case.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M31');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.topics[0].duration,'10 min');
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[1,11,12].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[0].elements[1].text,/not mean every intermediate parent Step is blocked/);assert.match(d.practiceQuiz[8].scenario,/configured to create a child/);assert.match(d.practiceQuiz[10].options[2].text,/copy propagation/);assert.match(d.practiceQuiz[12].optionExplanations.D,/does not establish write-back/);
 assert.doesNotMatch(JSON.stringify(d),/Parent waits for ALL children.*advancing|parent case waits for all children.*advances|passes a pointer to the parent's data page|B and C are available in App Studio/);
});

test('Wait review supports custom statuses and resolves prefix semantics without business-day assumptions',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m32_pausing_resuming_case_processing.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M32');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[8,12,13].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[2].options[0].text,/custom target status.*Resolved-prefixed/);assert.match(d.studyGuide[1].elements[0].description,/any or all.*already exist/);assert.match(d.practiceQuiz[4].options[3].text,/72 minutes/);assert.match(d.practiceQuiz[13].scenario,/48-hour/);
 assert.doesNotMatch(JSON.stringify(d),/No custom status values allowed|exactly 2\).*Trigger|To be resolved.*child still open|5 business days|only two statuses that trigger/);
});

test('Configuration Set review scopes DSS guidance and role defaults without instant-refresh promises',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m33_creating_setting_application_variables.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M33');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'20 min');
 assert.equal(d.practiceQuiz.length,15);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[1].elements[0].description,/only after it contains a setting/);assert.match(d.practiceQuiz[7].rationale,/menu identifies.*Set and setting/);assert.match(d.practiceQuiz[13].scenario,/Email integration/);assert.match(d.examPitfalls[3].bestPractice,/WorkMgr4 also reads individual settings/);
 assert.doesNotMatch(JSON.stringify(d),/Pega 8\.5\+|changes app behavior instantly|should not be manually edited|passes.*no|Runtime customization means Admins\/Managers/);
});

test('data-validation review corrects Stage entry timing and removes the ambiguous exit answer',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m34_validating_data_business_logic.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M34');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===11?['A','B','C']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[2].options[0].text,/Before.*Settlement/);assert.match(d.practiceQuiz[13].options[1].text,/block entry/);assert.match(d.practiceQuiz[6].options[0].text,/error prevents entry/);assert.match(d.studyGuide[1].elements[3].description,/different validation conditions at each use/);assert.match(d.practiceQuiz[9].optionExplanations.A,/passes.*comparison/);
 assert.doesNotMatch(JSON.stringify(d),/prevent the Case from exiting|Nothing automatically|both are needed|automatically repeat.*Correct|custom Java/);
});

test('Dev Studio validation review corrects qualifier diagrams and invocation-dependent timing',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m35_validating_data_dev_studio.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M35');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===7?['A','C']:i===11?['D']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[6].rationale,/Stage-specific sets/);assert.match(d.practiceQuiz[3].options[0].text,/can also call Edit Validate/);assert.match(d.practiceQuiz[5].scenario,/proposes to apply/);assert.match(d.practiceQuiz[12].options[1].text,/containing Rule runs on submission/);
 assert.doesNotMatch(JSON.stringify(d),/four: Stages, Role, Skill|4 types: Stages, Role|fire on every change|executes every time|custom Java bypasses|client-side in the browser.*no server round-trip/);
});

test('data-manipulation review restores calculation support and scopes the clipboard declaration example',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m36_application_data_manipulation.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M36');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'15 min');assert.ok(d.topics.every(t=>t.duration==='5 min'));
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===1?['C']:i===8?['A','C']:i>=11?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[0].elements[1].description,/calculate values/);assert.match(d.practiceQuiz[0].scenario,/attached to the next form Step itself/);assert.match(d.practiceQuiz[7].scenario,/illustrated.*Clipboard Page/);assert.match(d.practiceQuiz[1].options[2].text,/Either a following/);
 assert.doesNotMatch(JSON.stringify(d),/Does NOT validate or calculate|must register any Data Page|Without this step.*fails at runtime|guardrail violation.*regenerates it on save/);
});

test('Dev Studio transform review distinguishes class superclassing from Case hierarchy and ordinary invocation',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m37_application_data_manipulation_dev_studio.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M37');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===8?['A','B']:i===11?['A','C']:i===12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[1].elements[4].description,/class inheritance, not.*Case instances/);assert.match(d.practiceQuiz[3].scenario,/explicitly invoked.*no other definitions/);assert.match(d.practiceQuiz[11].options[0].text,/not two same-named superclass/);assert.match(d.practiceQuiz[7].scenario,/Clipboard Page/);
 assert.doesNotMatch(JSON.stringify(d),/Any Data Page.*must be added|runtime cannot resolve the page|Data initialization page does not support expression|auto-enabled.*pySetFieldDefaults transform/);
});

test('sourced-data review corrects mapping structures, copied-value limits and optional refresh',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m38_accessing_sourced_data_case.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M38');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'75 min · 6 topics');
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=10?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[2].elements[1].description,/Report definition with List structure, Lookup with Page/);assert.match(d.studyGuide[4].elements[1].description,/Changed parameters overwrite.*removing.*clipboard/);assert.match(d.practiceQuiz[8].options[0].text,/Only SED/);assert.match(d.practiceQuiz[12].scenario,/optional but recommended/);assert.match(d.practiceQuiz[10].rationale,/Thread.*Node/);
 assert.doesNotMatch(JSON.stringify(d),/other 5 source types map automatically|Reference = always current|Saved with the Case permanently|DataPageName\[index\]|Report definition \(page structure\)|Lookup \(list structure\)/);
});

test('savable-page review corrects Copy answer and avoids universal remote rollback promises',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m39_saving_data_system_of_record.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M39');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,13);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===3?['A','B']:i===4?['B']:i===11?['A','C']:i===12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[2].elements[2].description,/recommends Copy.*overwrite/);assert.match(d.studyGuide[1].elements[0].description,/not universally mandatory/);assert.match(d.practiceQuiz[8].rationale,/Database delete/);assert.match(d.studyGuide[0].elements[2].description,/Do not assume every remote API/);
 assert.doesNotMatch(JSON.stringify(d),/must REFER, not Copy|always REFER, never copy|each clipboard property must be explicitly mapped|rolls back both sides|exactly one SOR commit|Navigation action|Case Close action/);
});

test('application security review uses client-based CBAC and version-scoped policy guidance',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m40_application_security.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M40');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'40 min · 3 topics');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===8?['A','B','C']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[11].rationale,/Client-based access.*requests/);assert.match(d.practiceQuiz[6].scenario,/configured failed-attempt threshold/);assert.match(d.studyGuide[1].elements[1].description,/earlier.*v5/);assert.match(d.studyGuide[0].elements[3].description,/not every listed task applies/);
 assert.doesNotMatch(JSON.stringify(d),/CBAC \(Claim-Based|CBAC controls access to entire rule classes|Ranks above MFA|distinction frequently tested|not a soft warning that can be overridden|until every item on the checklist/);
});

test('application access review restores production scale and permits intermediate Rule values',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m41_managing_application_access.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M41');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,15);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[1].elements[3].description,/5 Production.*4 Staging.*3 Quality assurance.*2 Development.*1 Sandbox/);assert.match(d.studyGuide[1].elements[2].bulletPoints[0],/other than.*0\/5/);assert.match(d.practiceQuiz[6].rationale,/five to Production/);assert.match(d.practiceQuiz[8].rationale,/one application.*different role sets/);assert.match(d.practiceQuiz[1].scenario,/no applicable Access Deny/);assert.match(d.practiceQuiz[14].options[0].text,/Access Groups/);
 assert.doesNotMatch(JSON.stringify(d),/1 = Production|1=Production|5 = Sandbox|5=Sandbox|ARO records.*they do not deny|Access Role Objects|ALWAYS overrides ARO|Lower = More Restrictive/);
});

test('UI-element review scopes control examples and resolves hidden-input and disabled-after-entry ambiguity',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m42_configuring_ui_elements.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M42');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===5?['A','B','C']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[3].scenario,/confirmation View.*selected earlier/);assert.match(d.practiceQuiz[4].scenario,/After account creation.*confirmation View/);assert.match(d.practiceQuiz[7].scenario,/not whether the control is supported/);assert.match(d.practiceQuiz[10].scenario,/pair of conditional settings/);assert.match(d.studyGuide[2].elements[1].description,/does not replace server-side authorization/);
 assert.doesNotMatch(JSON.stringify(d),/only for Visible\/Disabled|Autocomplete, Button, Checkbox, Date, Grid, Text|frequently tested exam|require custom configuration|no page reload needed|Settings → Themes/);
});

test('Portal-content review separates theme sharing from inheritance and corrects widget diagrams',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m43_configuring_portal_content.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M43');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'40 min · 5 topics');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===6?['A','B','C']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[4].elements[1].description,/themes do not support inheritance/);assert.match(d.practiceQuiz[13].options[0].text,/higher Ruleset/);assert.match(d.studyGuide[1].elements[3].svg,/Portal = a web Channel/);assert.match(d.studyGuide[3].elements[4].svg,/App announcement/);assert.match(d.practiceQuiz[7].hint,/configured Widgets.*data.*empty/);assert.match(d.practiceQuiz[4].hint,/copied dashboard.*source visibility/);
 assert.doesNotMatch(JSON.stringify(d),/Amazon Connect|App analytics|all Portals inherit|all pages and portals|auto-generates platform-specific tokens|brand-new themes default to Private/);
});

test('development-management review accepts both status methods and distinguishes Publishing from pipeline management',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m44_application_development_management.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M44');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'45 min · 3 topics');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===3||i===9||i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.equal(d.practiceQuiz[3].type,'multi-select');assert.equal(d.practiceQuiz[3].selectCount,2);assert.match(d.studyGuide[0].elements[3].description,/dragging.*or using the Status list/);assert.match(d.studyGuide[1].elements[4].items[1],/App Studio Settings > Versions/);assert.match(d.studyGuide[2].elements[1].items[4],/archives.*repository/);assert.match(d.practiceQuiz[11].rationale,/separate.*expands/);assert.match(d.practiceQuiz[9].optionExplanations.D,/does not prove.*unsupported/);
 assert.doesNotMatch(JSON.stringify(d),/not by editing a form field|not editing a form|do not edit a form field|component of it|features and epics automatically|real-time.*guardrail \+ performance tracking/);
});

test('PegaUnit review separates coverage privileges, Rule eligibility and Rule versus path coverage',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m45_devops_pega_platform.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M45');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'40 min · 3 topics');
 assert.equal(d.practiceQuiz.length,15);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[2].elements[2].items[1],/SysAdm4 or User4/);assert.equal(d.practiceQuiz[10].options[0].text,'pzStartOrStopMasterAppRuleCoverage');assert.match(d.practiceQuiz[1].scenario,/eligible.*no Branch/);assert.match(d.practiceQuiz[13].options[1].text,/does not prove every internal path/);assert.match(d.studyGuide[0].elements[4].description,/Decision result/);assert.ok(review.localReview.sources.includes('https://academy.pega.com/topic/unit-tests/v5'));
 assert.doesNotMatch(JSON.stringify(d),/No real data source called|requires the SysAdm4 role.*Lower roles|Only latest app-level report shown|aggregates results across all users/);
});

test('Tracer review replaces archived source and distinguishes server debug setting from browser tools',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m46_debugging_application_errors.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M46');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.moduleUrl,'https://academy.pega.com/module/debugging-application-errors/v8');assert.equal(d.topics.length,3);
 assert.equal(d.practiceQuiz.length,15);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[0].elements[5].description,/request ID/);assert.match(d.studyGuide[2].elements[2].description,/unavailable in the App Studio shell/);assert.match(d.studyGuide[2].elements[4].svg,/dynamic system setting, not URL parameter/);assert.match(d.practiceQuiz[11].rationale,/Break Conditions.*errors/);assert.match(d.practiceQuiz[13].scenario,/non-Constellation, non-Service/);assert.match(d.practiceQuiz[14].options[1].text,/UI Inspector/);
 assert.doesNotMatch(JSON.stringify(d),/only the most recently opened|opening a new one closes|logs every Rule execution event|NEVER run in production|Inspect \/ clipboard icon/);
});

test('Insights review uses property optimization and relevant records instead of blanket permission expansion',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m47_exploring_application_data_insights.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M47');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.estTime,'25 min · 3 topics');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===11?['A','B','C']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.practiceQuiz[9].scenario,/Show\/hide columns/);assert.match(d.practiceQuiz[9].options[0].text,/parent classes.*specific Class/);assert.match(d.practiceQuiz[13].options[1].text,/relevant record/);assert.match(d.studyGuide[1].elements[0].description,/excludes adding them directly to a View/);assert.match(d.studyGuide[1].elements[2].description,/not configured through.*Portal authoring/);
 assert.doesNotMatch(JSON.stringify(d),/typically a.*permissions issue|CAUSE: insufficient user permissions|Not a report definition bug|all widgets update|Token expiry controls how long/);
});

test('localization review distinguishes packaged Paragraph translation from Data Page preparation and table restrictions',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m48_localizing_application_content.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId)),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M48');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.moduleUrl,'https://academy.pega.com/module/localizing-application-content/v7');
 assert.equal(d.practiceQuiz.length,14);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===6?['A','B','C']:i>=12?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));});
 assert.match(d.studyGuide[1].elements[2].description,/included in the ZIP.*paragraph\/base/);assert.match(d.studyGuide[1].elements[3].description,/rebuild and import/);assert.match(d.studyGuide[1].elements[4].svg,/Radio\/drop-down in tables/);assert.match(d.practiceQuiz[4].rationale,/fresh login/);assert.match(d.practiceQuiz[13].options[1].text,/Manually prepare/);assert.match(d.studyGuide[0].elements[7].description,/not fully localized/);
 assert.doesNotMatch(JSON.stringify(d),/NOT automatically extracted|Cannot be localized at all|manual translation outside the standard package|✗ Data Page controls|ensures dropdown options are locale-aware/);
});

test('low-code review separates configured studio default from recommended authoring and business days from hours',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m01_low_code_defined.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M01');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.practiceQuiz.length,22);
 assert.deepEqual(d.practiceQuiz[4].correctOptions,['B']);assert.deepEqual(d.practiceQuiz[5].correctOptions,['A','B','C']);assert.match(d.examPitfalls[1].trapDescription,/configured default/);assert.match(d.studyGuide[0].elements[6].svg,/pxPredictionStudio access/);assert.match(d.practiceQuiz[16].rationale,/not the same.*office opening hours/);assert.match(d.practiceQuiz[18].rationale,/high-level layer overview/);
 assert.doesNotMatch(JSON.stringify(d),/Technical members default to Dev Studio|Requires separate license|SA\/LSA roles|business-hours-only timer|Agile Workbench both live in Dev Studio/);
});

test('BA low-code review scopes co-development and integration replacement while preserving historical question IDs',()=>{
 const crypto=require('node:crypto'),file='data/business-architect/m02_low_code_defined.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='BA-M02'),q=Object.fromEntries(d.practiceQuiz.map(q=>[q.questionId,q]));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,21);assert.equal(q.Q4,undefined);assert.deepEqual(q.Q1.correctOptions,['C']);assert.deepEqual(q.Q5.correctOptions,['B']);assert.deepEqual(q.Q10.correctOptions,['A','B']);
 assert.match(q.Q10.options[1].text,/technical members also use App Studio/);assert.match(q.Q12.optionExplanations.D,/UI Ruleset/);assert.match(q.Q18.rationale,/configuration and testing/);assert.match(d.studyGuide[3].elements[3].description,/except the base Pega Platform layer/);assert.match(q.Q17.rationale,/distinct from.*office opening hours/);
});

test('Case Life Cycle review separates Process draft mode from designer data placeholders and permits explicit Stage returns',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m02_defining_customer_microjourney.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M02');
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.moduleUrl,'https://academy.pega.com/module/defining-case-lifecycle/v8');assert.equal(d.estTime,'45 min · 4 topics');assert.equal(d.practiceQuiz.length,21);
 assert.match(d.studyGuide[4].elements[1].description,/Merely enabling Process draft mode is not the trigger/);assert.match(d.studyGuide[2].elements[6].html,/Add a Change Stage automation targeting Review/);assert.match(d.studyGuide[2].elements[7].description,/ordinary Process Steps/);assert.match(d.studyGuide[1].elements[4].svg,/named as verb \+ noun/);assert.match(d.practiceQuiz[2].rationale,/does not universally require/);
 assert.doesNotMatch(JSON.stringify(d),/One Microjourney = one Case Type|loops between primary Stages|always placeholders regardless of which studio|It is the outbound\/engagement layer|must start with a capital letter/);
});

test('user-management review separates business Personas from identity and avoids automatic permission guarantees',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m03_inviting_users_to_application.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M03'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(review.localContentReview,'source-compared');assert.equal(d.practiceQuiz.length,17);assert.equal(d.estTime,'10 min · 1 topic');assert.equal(d.topics[0].duration,'5 min');
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[7,14,15,16].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[7].options[1].text,/default permissions and a Work Queue/);assert.match(d.practiceQuiz[14].optionExplanations.D,/Multiple Personas can share/);assert.match(d.studyGuide[2].elements[3].html,/People, enter Dana/);assert.match(d.studyGuide[2].elements[1].description,/not every role has a Persona/);
 assert.doesNotMatch(JSON.stringify(d),/Inviting sends credentials|automatically updates the Access Group|Persona assignment IS access assignment|Work is routed to Personas|Assigned 1\+ Personas/);
});

test('Center-out review aligns diagram principles/benefits and permits non-drag sequencing with locked-state guards',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m04_pega_center_out_architecture.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M04'),h=d.studyGuide[2].elements[7].html;
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.estTime,'20 min · 2 topics');assert.equal(d.practiceQuiz.length,16);assert.match(d.studyGuide[1].elements[6].svg,/I · Intelligence/);assert.match(d.studyGuide[3].elements[5].svg,/Governance/);assert.match(d.studyGuide[5].elements[7].description,/Accessibility Inspector is not supported/);
 assert.doesNotMatch(JSON.stringify(d),/Intention-driven|Directly related|Value in business|every room built from it is compliant|auto-generated control → WCAG|for the exam/);
 const fn=h.slice(h.indexOf('function moveItem('),h.indexOf('var dragSrc = null;')),context={order:[2,0,1,3,4],checked:false,renderList(){},document:{querySelectorAll(){return [];}}};vm.runInNewContext(fn,context);context.moveItem(1,-1);assert.deepEqual(Array.from(context.order),[0,2,1,3,4]);context.moveItem(0,-1);assert.deepEqual(Array.from(context.order),[0,2,1,3,4]);context.checked=true;context.moveItem(1,1);assert.deepEqual(Array.from(context.order),[0,2,1,3,4]);assert.match(h,/if \(checked \|\| !dragSrc/);assert.match(h,/Move principle.*up/);assert.match(h,/button.addEventListener\('click', function\(\) \{ moveItem/);assert.doesNotMatch(h,/onclick="moveItem/);assert.match(h,/PRINCIPLES\[pi\].letter/);
});

test('GenAI review covers all procedural topics and scopes historical defaults and sample form data',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m05_pega_genai_pega_platform.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M05'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.estTime,'30 min · 4 topics');assert.equal(d.studyGuide.length,9);assert.equal(d.practiceQuiz.length,16);
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,i===5?['A','B','C']:[2,8,11].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[6].elements[1].description,/technical ID/);assert.match(d.studyGuide[7].elements[1].description,/part of the Case data/);assert.match(d.studyGuide[8].elements[1].description,/Personas & Channels/);assert.equal(d.practiceQuiz[15].lessonSection,'section-sa05-testing-data');assert.match(d.examPitfalls[1].trapDescription,/historical note/);
 assert.doesNotMatch(JSON.stringify(d),/has no role after the application is deployed|not a chatbot for customer-facing|accepts any length|only supported AI-search trigger|must match the declared Data Transform/);
});

test('Blueprint review distinguishes branch placement from missing assets and covers import choices',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m06_accelerating_app_building_blueprint.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M06'),ids=new Set(d.studyGuide.map(s=>s.sectionId)),h=d.studyGuide[1].elements[3].html,a=h.indexOf('var S=')+6,sc=JSON.parse(h.slice(a,h.indexOf(',cur=0,score=0;',a)));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.estTime,'65 min · 4 topics');assert.deepEqual(d.topics.map(t=>t.duration),['5 min','35 min','15 min','5 min']);assert.equal(d.practiceQuiz.length,17);
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[7,12,15,16].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(sc[1].opts[0],/does not mean.*excluded/);assert.match(sc[1].fbs[0],/placement, not exclusion/);assert.doesNotMatch(JSON.stringify(sc),/\\\\u[0-9a-f]{4}/i);assert.match(d.studyGuide[2].elements[5].description,/without its own new class/);assert.match(d.studyGuide[3].elements[0].description,/add it to a View/);assert.match(d.practiceQuiz[12].options[0].text,/saving.*as a template/);
 assert.doesNotMatch(JSON.stringify(d),/Not generated: Access Roles|Anyone with the URL can collaborate|no special role needed|Access Roles are the ONE asset|no Pega account of any kind|functional application in minutes|Pega is not responsible/);
});

test('BA Blueprint review retains answers and covers SaaS access and wizard import constraints',()=>{
 const crypto=require('node:crypto'),file='data/business-architect/m07_accelerating_app_building_blueprint.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='BA-M07'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.estTime,'65 min · 4 topics');assert.equal(d.practiceQuiz.length,13);
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[7,11].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.equal(q.explanationReviewedOn,'2026-10-05');});
 assert.match(d.studyGuide[2].elements[5].description,/without its own class/);assert.match(d.studyGuide[3].elements[0].description,/Picklist and add it to a View/);assert.match(d.practiceQuiz[11].options[0].text,/saving it as a template/);assert.match(d.practiceQuiz[4].rationale,/does not imply they were not created/);
 assert.doesNotMatch(JSON.stringify(d),/no Pega instance or login is required to collaborate|functional application in minutes|LSA performs the import|The LSA imports the Blueprint file/);
});

test('Capturing and presenting data review follows the Fields, Calculated values and Views topics',()=>{
 const crypto=require('node:crypto'),file='data/system-architect/m07_capturing_presenting_data.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='SA-M07'),ids=new Set(d.studyGuide.map(s=>s.sectionId)),h=d.studyGuide[2].elements[3].html,a=h.indexOf('var S=')+6,sc=JSON.parse(h.slice(a,h.indexOf(',cur=0,score=0;',a)));
 assert.equal(review.localContentReview,'source-compared');assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.sourceReviewedOn,'2026-10-05');assert.equal(d.estTime,'45 min · 3 topics');
 assert.deepEqual(d.topics.map(t=>t.url),['https://academy.pega.com/topic/fields/v7','https://academy.pega.com/topic/calculated-values/v6','https://academy.pega.com/topic/views/v6']);assert.deepEqual(d.topics.map(t=>t.duration),['15 min','20 min','5 min']);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'m07_q'+String(i+1).padStart(2,'0'));assert.deepEqual(q.correctOptions,[7,14,15,16].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.equal(q.explanationReviewedOn,'2026-10-05');});
 assert.match(d.practiceQuiz[10].options[0].text,/not a form/);assert.match(d.practiceQuiz[15].options[1].text,/^Date only/);assert.match(d.studyGuide[1].elements[4].description,/relevant record/);assert.match(d.studyGuide[0].elements[3].items[4],/leading zeros/);
 assert.equal(sc.length,4);assert.match(sc[3].fbs[0],/mix read-only/);assert.doesNotMatch(JSON.stringify(sc),/Autocomplete field type|always read-only|read-only by default/);
 assert.match(d.studyGuide[1].elements[0].description,/App Studio.*read-only/);assert.match(d.studyGuide[1].elements[1].description,/does not establish whether the value is persisted/);assert.match(d.quickRecap[2].value,/App Studio.*read-only/);assert.doesNotMatch(JSON.stringify(d),/Whether users may override a result is a separate View design decision/);
 assert.doesNotMatch(JSON.stringify(d),/Rich Text|Editable by default|Calculated fields are always read-only|Text for everything' is always wrong|List Views are read-only by default|locale-aware/);
});

test('BA Center-out review keeps stable answer keys and scopes architectural guarantees',()=>{
 const crypto=require('node:crypto'),file='data/business-architect/m03_pega_center_out_architecture.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='BA-M03'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.sourceReviewedOn,'2026-10-05');assert.equal(d.practiceQuiz.length,16);assert.equal(d.studyGuide.length,6);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,i===14?['A','B','C']:[4,7,11].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[14].hint,/Three options/);assert.match(d.practiceQuiz[6].options[0].text,/Case Lifecycles/);assert.match(d.studyGuide[4].elements[1].description,/select and configure/);assert.match(d.studyGuide[5].elements[7].description,/Accessibility Inspector is not supported/);
 assert.doesNotMatch(JSON.stringify(d),/Four real principles|instantly reaches|logic never has to be rebuilt|neither can break/);
});

test('TDS Expert review separates non-locking reads from unlocking and preserves keys',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds2/m05_expert_module.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS2-M05'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.match(d.platformVersion,/2026.1 LTS.*video version unverified/);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[i===2?'B':'C']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);assert.equal(q.explanationReviewedOn,'2026-10-05');});
 assert.match(d.studyGuide[2].elements[0].description,/not the UnlockItem operation/);assert.match(d.studyGuide[1].bulletPoints[0],/First, Random or a positive index/);assert.match(d.quickRecap[1].value,/DeleteItem.*UnlockItem/);assert.doesNotMatch(JSON.stringify(d),/DeleteRecord|automatically unlocks that record|Every task locks by default|FIRST match only|seven Test data task/);
});

test('TDS retrieval review uses resource aliases and the TDS expression command',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds2/m04_retrieving_and_updating_records.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS2-M04'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,4);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.equal(d.practiceQuiz[0].options[1].text,'{TDS[customer.Email]}');assert.match(d.practiceQuiz[0].options[3].text,/^\{TD\[/);assert.match(d.practiceQuiz[3].rationale,/alias name.*customer, not the source type/);assert.match(d.studyGuide[4].elements[1].description,/One move targets one known item/);
 assert.doesNotMatch(JSON.stringify(d.studyGuide),/\{TD\[|always works together with a search|200 OK response, confirming/);
});

test('TDS creation review separates alias identity, item selection and execution repetition',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds2/m03_create_and_register_records.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS2-M03'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,3);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.practiceQuiz[0].scenario,/Find & provide item/);assert.match(d.practiceQuiz[1].options[1].text,/criteria.*distinct aliases/);assert.match(d.practiceQuiz[2].rationale,/does not guarantee success or uniqueness/);assert.match(d.studyGuide[2].elements[1].text,/ReadOnly does not acquire/);assert.doesNotMatch(JSON.stringify(d),/Test Data - Create & provide new record|only unlocks automatically|exactly the sender\/recipient example/);
});

test('TDS repository review uses installed contracts and distinguishes save/export and configuration/data deletion',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds2/m06_managing_tds_via_api.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS2-M06'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.studyGuide.length,7);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[2].elements[0].description,/Do not assume a four-field/);assert.match(d.studyGuide[5].elements[0].description,/separate Also delete database option/);assert.match(d.studyGuide[6].elements[0].text,/separate operations/);
 assert.doesNotMatch(JSON.stringify(d),/required for every one of these calls|re-imported into any Tosca workspace|same repository path in the Endpoint used during creation/);
});

test('TDS preparation review corrects invalid naming answer and separates type rules and configuration scope',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds2/m02_preparing_your_project.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS2-M02'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[i===2?'C':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.equal(d.practiceQuiz[2].options[2].text,'CustomerDetails');assert.match(d.practiceQuiz[2].optionExplanations.B,/square brackets are forbidden/);assert.match(d.studyGuide[3].elements[2].description,/override an inherited/);assert.match(d.studyGuide[3].elements[0].description,/Standard.tsu/);
 assert.doesNotMatch(JSON.stringify(d),/single entry point to every TDS feature|In Memory is the only type that doesn't need|repository\/type name/);
});

test('TDS introductions scope reuse and require explicit application-state updates',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['m00_introduction.json','m01_introduction_to_test_data_service.json'].forEach((name,i)=>{
  const bytes=fs.readFileSync('data/tosca-tds2/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.studyGuide.length,3);assert.equal(d.practiceQuiz.length,3);
  d.practiceQuiz.forEach((q,j)=>{assert.equal(q.questionId,'Q'+(j+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/can generally only be used once|automatically updates each record|TDM Studio handles|can't be tested independently|Every change is reflected back/);
  if(i===0){assert.equal(d.practiceQuiz[1].options[1].text,'Expert Module ReadOnly');assert.match(d.studyGuide[1].elements[1].description,/not inherently single-use/);}
  else{assert.match(d.practiceQuiz[2].scenario,/next TDS Update step/);assert.match(d.studyGuide[1].elements[1].description,/does not automatically synchronize/);assert.match(d.studyGuide[2].elements[1].text,/rather than automatic TDS lifecycle rules/);}
 });
});

test('BA role review separates import responsibilities from permissions and supports multiple Workspaces',()=>{
 const crypto=require('node:crypto'),file='data/business-architect/m01_role_of_pega_business_architect.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='BA-M01'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,18);
 const keys=[['A'],['C'],['A','C'],['B'],['D'],['A','B'],['A'],['A'],['A'],['A'],['A'],['A'],['A','B','C'],['A'],['A'],['A','B'],['A'],['A']];
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,keys[i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);assert.equal(q.explanationReviewedOn,'2026-10-05');});
 assert.match(d.studyGuide[6].elements[0].description,/multiple Workspaces/);assert.match(d.studyGuide[6].elements[1].description,/common strategy, not a mandatory/);assert.match(d.practiceQuiz[1].rationale,/not proof of exclusive platform permissions/);assert.match(d.practiceQuiz[4].optionExplanations.D,/does not mean they are absent/);assert.match(d.studyGuide[6].bulletPoints[1],/Infinity Studio/);
 assert.doesNotMatch(JSON.stringify(d),/One Branch per feature is the standard strategy|not hand-drawn flows|preventing rule conflicts during parallel/);
});

test('BA GenAI review covers missing procedures and scopes response structures and search examples',()=>{
 const crypto=require('node:crypto'),file='data/business-architect/m06_pega_genai_pega_platform.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='BA-M06'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.studyGuide.length,9);assert.equal(d.practiceQuiz.length,16);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,i===5?['A','B','C']:[2,8,11].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[6].elements[1].description,/technical ID/);assert.match(d.studyGuide[7].elements[1].description,/Personas & Channels/);assert.match(d.studyGuide[8].elements[1].description,/part of the Case data/);assert.match(d.practiceQuiz[7].scenario,/configured with the Unstructured response type/);assert.equal(d.practiceQuiz[12].lessonSection,'section-c649697939ef');assert.equal(d.practiceQuiz[15].lessonSection,'section-ba06-sample-data');
 assert.doesNotMatch(JSON.stringify(d),/no Pega login for collaboration|no login needed to collaborate|about twice as fast|within ~90 days|consistent AI-enforced outcomes/);
});

test('BA modular reuse distinguishes relevant records from library eligibility and consuming applications',()=>{
 const crypto=require('node:crypto'),file='data/business-architect/m04_modular_architecture_enterprise_reuse.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='BA-M04'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,16);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[0,5].includes(i)?['A','B','C']:[10,15].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[5].elements[0].description,/SLA can be relevant without appearing/);assert.match(d.studyGuide[2].bulletPoints[2],/Business applications build on module applications/);assert.match(d.practiceQuiz[9].hint,/insurer/);assert.match(d.practiceQuiz[6].rationale,/creation context/);
 assert.doesNotMatch(JSON.stringify(d),/most-missed on exams|contains all reusable assets|propagates the fix everywhere|Governed = a Center of Excellence/);
});

test('TDS1 introduction requires recalculation and avoids guaranteed test completeness',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m00_introduction.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M00'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,3);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.practiceQuiz[2].options[1].text,/recalculate.*restart Tosca/);assert.match(d.studyGuide[0].elements[0].text,/not a transcript/);assert.doesNotMatch(JSON.stringify(d),/only fails for one reason|roll up automatically|10 lessons, using the DemoWebShop/);
});

test('TDS1 Requirements review separates class inputs, risk weight and executed coverage',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m01_requirements.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M01'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,4);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[i===2?'A':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[1].elements[0].description,/Do not confuse direct weights/);assert.match(d.studyGuide[3].bulletPoints[0],/both passed and failed/);assert.match(d.practiceQuiz[2].rationale,/values can coincide/);assert.match(d.practiceQuiz[3].options[1].text,/restart/);assert.equal(d.practiceQuiz[1].options[1].text,'2^3 × 2^2 = 32');
 assert.doesNotMatch(JSON.stringify(d),/always sums to 100% per level|10.2 and earlier|base adjustable|press F6/);
});

test('TDS1 Attributes review scopes the example layout and tests documented nesting',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m02_attributes.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M02'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,4);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[i%2?'C':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[2].elements[0].description,/Independent Quilyn/);assert.match(d.practiceQuiz[0].options[1].text,/parent Attribute grouping/);assert.match(d.studyGuide[4].elements[1].items[1],/characters are removed/);assert.doesNotMatch(JSON.stringify(d),/AttrType is calculated automatically|starting every TestSheet|Not user-editable/);
});

test('TDS1 Instances review requires assertions and retains boundary regression relevance',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m03_instances.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M03'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,4);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[i===3?'A':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[1].elements[3].text,/Position to Inner/);assert.match(d.practiceQuiz[0].scenario,/All explicit assertions pass/);assert.match(d.practiceQuiz[3].scenario,/no additional thresholds/);assert.match(d.studyGuide[2].elements[1].description,/reintroduce/);
 assert.doesNotMatch(JSON.stringify(d),/usually a one-time test|cannot have sub-Instances|F7 cycles Character/);
});

test('TDS1 combinations review scopes counts and separates arranging, merging and visibility',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m04_combinatorial_methods.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M04'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,5);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[[0,1,4].includes(i)?'C':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.practiceQuiz[0].rationale,/64 datasets/);assert.match(d.practiceQuiz[2].scenario,/no additional relation rules/);assert.match(d.studyGuide[3].elements[1].description,/Character and Position/);assert.match(d.quickRecap[6].value,/F12/);assert.doesNotMatch(JSON.stringify(d),/Tricentis-recommended default|industries mandate|StraightThrough → Valid Inner/);
});

test('TDS1 specification review does not infer mutation scope from filters and checks XL prerequisites',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m05_testcase_specifications.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M05'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,4);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[2].elements[2].text,/do not establish.*bulk-fill/);assert.match(d.practiceQuiz[3].options[1].text,/Empty TestStepValues.*uniquely matching/);assert.doesNotMatch(JSON.stringify(d),/corrupting the existing structure|only the matching columns are visible\/editable|never higher/);
});

test('TDS1 Class review warns about bidirectional edits and uses documented Relevance column',()=>{
 const crypto=require('node:crypto'),file='data/tosca-tds1/m06_classes.json',bytes=fs.readFileSync(file),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id==='TDS1-M06'),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,4);
 d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[0].elements[1].description,/editing an unresolved reference changes/);assert.match(d.practiceQuiz[1].scenario,/no child elements/);assert.match(d.practiceQuiz[2].rationale,/Other consumers may still reference/);assert.match(d.practiceQuiz[3].options[1].text,/Relevance checkbox/);assert.doesNotMatch(JSON.stringify(d),/auto-generates Instance combinations|Relevant column\/F11|4 creation methods exist/);
});

test('TDS1 Requirement links require explicit substitute replacement and distinguish execution entry scope',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-tds1/m07_link_to_requirements.json'),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[i===1?'C':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[1].elements[2].description,/does not by itself replace/);assert.match(d.studyGuide[1].elements[2].description,/must be used in an ExecutionList/);assert.match(d.studyGuide[3].elements[0].description,/AlwaysAdd, AskUser or NeverAdd/);assert.match(d.studyGuide[3].elements[1].text,/off by default/);assert.match(d.practiceQuiz[1].scenario,/distinct from dragging an individual ExecutionEntry/);
 assert.doesNotMatch(JSON.stringify(d),/When ExecutionLists are created, they are linked|earlier TestCase-Substitute links become full/);
});

test('TDS1 added Attribute example scopes Linear Expansion counts and checks stale Requirement values',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-tds1/m08_integration_of_new_attributes.json'),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.practiceQuiz[0].rationale,/does not establish coverage of other values/);assert.match(d.practiceQuiz[1].scenario,/unconstrained Linear Expansion/);assert.match(d.practiceQuiz[2].options[1].text,/refresh outdated/);assert.match(d.studyGuide[1].elements[0].description,/Propagate Instance\(s\)/);
 assert.doesNotMatch(JSON.stringify(d),/existing 9 TestSheet-level|Instances are NOT automatically|don't inherit existing TestCase-Substitute links automatically/);
});

test('TDS1 maintenance review preserves boundary coverage and removes unsupported vendor thresholds',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-tds1/m09_best_practices.json'),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[i===2?'A':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[0].elements[0].description,/editing the reference also changes the Class/);assert.match(d.practiceQuiz[1].options[1].text,/Create Element Structure from Clipboard/);assert.match(d.examPitfalls[3].bestPractice,/Retain boundary coverage/);assert.match(d.studyGuide[1].elements[2].text,/does not automatically execute Gherkin/);
 assert.doesNotMatch(JSON.stringify(d),/Tricentis recommends using Classes only|Usually one-time tests|Notepad uses Tab indentation|backbone of every TestSheet/);
});

test('TDS1 automatic generation review uses documented targets and distinguishes verification from execution',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-tds1/m10_automatic_generation_of_instances.json'),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.equal(d.practiceQuiz[0].options[1].text,'TestSheets, TestCase-Design Classes and Attributes.');assert.match(d.studyGuide[0].elements[1].description,/1000 combinations/);assert.match(d.studyGuide[3].elements[1].description,/Uncombined Instances appear in bold/);assert.equal(d.practiceQuiz[3].options[1].text,'BusinessRelevant = Result.');
 assert.doesNotMatch(JSON.stringify(d),/requires an empty Instance Folder first|excluded from combinatorics entirely|instantly combines every/);
});

test('TDS1 capstone review scopes Guest assumptions and equal single-Attribute counts without claiming official scenarios',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-tds1/m11_scenarios.json'),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[i===2?'C':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[1].elements[0].description,/exercise assumptions/);assert.match(d.studyGuide[1].elements[3].description,/100, 95, 90 and 85/);assert.match(d.studyGuide[1].elements[4].description,/All Combinations also produces five/);assert.match(d.practiceQuiz[3].optionExplanations.D,/Position property/);assert.match(d.practiceQuiz[2].options[2].text,/Planned design coverage/);
 assert.doesNotMatch(JSON.stringify(d),/Tricentis default recommendation|official course closes with three|effectively every order|All Combinations would be unnecessary/);
 const added=JSON.parse(fs.readFileSync('data/tosca-tds1/m08_integration_of_new_attributes.json'));assert.match(added.studyGuide[1].elements[2].text,/right-click the top-level Instance/);
});

test('API foundations review scopes launch, HTTP semantics, service generation and test evidence',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const names=['m00_introduction.json','m01_getting_started.json','m02_introduction_to_api_scan.json'],keys=[['B','A','A','C','C'],['B','C','B','B','B'],['B','C','C','A','B']];
 names.forEach((name,n)=>{
  const bytes=fs.readFileSync('data/tosca-api/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(d.practiceQuiz.length,5);
  d.practiceQuiz.forEach((q,i)=>{assert.equal(q.questionId,'Q'+(i+1));assert.deepEqual(q.correctOptions,[keys[n][i]]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/ApiScanStandalone\.exe|valid for 24 hours|SOAP uses only POST|500 = server down\/unreachable|16 syllabus sections|two very mundane causes|a physical API/);
  if(n===0){assert.match(d.practiceQuiz[0].options[1].text,/ApiScan\.exe/);assert.match(d.studyGuide[2].elements[1].description,/does not establish/);assert.match(d.practiceQuiz[3].options[2].text,/explicit assertions/);}
  else if(n===1){assert.match(d.studyGuide[1].elements[2].text,/SOAP-response pattern to GET/);assert.match(d.practiceQuiz[2].options[1].text,/create or replace/);assert.match(d.studyGuide[3].elements[1].description,/not universal REST requirements/);}
  else{assert.match(d.practiceQuiz[0].scenario,/not a simple message file/);assert.match(d.practiceQuiz[1].scenario,/contract defines POST/);assert.match(d.practiceQuiz[2].rationale,/no HTTP response/);assert.match(d.studyGuide[1].elements[3].rows[3][1],/unexpected server condition/);}
 });
});

test('API project and result review preserves payload scope, explicit recovery and current multipart workflow',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['m03_the_project_section.json','m04_api_scan_results.json'].forEach((name,n)=>{
  const bytes=fs.readFileSync('data/tosca-api/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
  d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[[['B','B','B','B'],['B','C','B','A']][n][i]]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/There is no Undo in the API Scan|closing the whole API Scan window.*also saves|Save as workspace template|new entries appear last|Method tab specifically/);
  if(!n){assert.match(d.studyGuide[0].elements[2].text,/not a complete message backup/);assert.match(d.quickRecap[2].value,/replaces existing payload/);assert.match(d.practiceQuiz[2].options[1].text,/actual exported test-step order/);assert.match(d.practiceQuiz[3].options[1].text,/context menu/);}
  else{assert.match(d.studyGuide[0].elements[1].items[1],/Add Files is disabled/);assert.match(d.practiceQuiz[1].options[2].text,/Add Files > Attachment/);assert.match(d.studyGuide[1].elements[0].items[2],/200 alone does not prove persistence/);assert.match(d.practiceQuiz[2].rationale,/every observed value/);}
 });
});

test('API export and Module review separates destinations, request buffer defaults and mapping updates',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['m05_tosca_export.json','m06_api_modules.json'].forEach((name,n)=>{
  const bytes=fs.readFileSync('data/tosca-api/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
  d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[!n&&i===2?'C':'B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/Buffer only applies to Response|fully independent once|verbatim from the course|Shift\+click does NOT work|named.*ApiScan_Import/);
  if(!n){assert.match(d.practiceQuiz[3].options[1].text,/without creating a new/);assert.match(d.studyGuide[1].elements[1].text,/multiple folders/);}
  else{assert.match(d.practiceQuiz[3].options[1].text,/Insert.*buffer reference/);assert.match(d.studyGuide[3].elements[1].text,/automatically applied to corresponding messages/);assert.match(d.practiceQuiz[4].options[1].text,/validate/);assert.match(d.studyGuide[4].elements[0].text,/not proof of server behavior/);}
 });
});

test('API TestCase review supports whole-case defaults, preserves clipboard omissions and uses current navigation',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['m07_api_testcases.json','m08_building_the_testcase.json'].forEach((name,n)=>{
  const bytes=fs.readFileSync('data/tosca-api/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
  d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[[['B','B','B','A'],['B','C','B','C','B']][n][i]]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/verbatim from the course|ValueRange column on the corresponding TestCase|TestCase itself is.*unsupported/);
  if(!n){assert.match(d.practiceQuiz[1].options[1].text,/whole API TestCase/);assert.match(d.studyGuide[1].elements[1].text,/retain their existing values/);}
  else{assert.match(d.practiceQuiz[0].options[1].text,/Ctrl\+Shift\+J/);assert.match(d.studyGuide[0].elements[1].text,/Do not create a separate TCP on every TestStepValue/);assert.match(d.studyGuide[0].elements[3].text,/empty ActionMode/);}
 });
});

test('SOAP review scopes HTTP bindings, authentication, month coverage and predeployment preparation',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['m09_soap_vs_rest.json','m10_soap_export_testcase.json','m11_self_created_soap.json'].forEach((name,n)=>{
  const bytes=fs.readFileSync('data/tosca-api/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
  d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[[['A','B','A','A'],['A','B','A','A'],['A','A','A']][n][i]]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/SOAP is a stateless protocol|SOAP = POST-only|SOAP remains extremely widespread|never changes the payload's content/);
  if(!n){assert.match(d.studyGuide[0].elements[0].text,/GET with SOAP-response/);assert.match(d.practiceQuiz[3].options[0].text,/security contract/);}
  else if(n===1){assert.match(d.practiceQuiz[1].rationale,/omits the first hour/);assert.match(d.studyGuide[2].elements[1].text,/subsecond events/);assert.match(d.practiceQuiz[0].options[0].text,/Insert/);}
  else{assert.match(d.practiceQuiz[0].options[0].text,/requires an endpoint/);assert.match(d.studyGuide[1].elements[1].text,/SOAPAction header is universally required/);assert.match(d.studyGuide[1].elements[2].text,/whitespace-sensitive/);}
 });
});

test('XML review separates transport, resource persistence and existing element modification',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['m12_xml_modules.json','m13_xml_data.json'].forEach((name,n)=>{
  const bytes=fs.readFileSync('data/tosca-api/'+name),d=JSON.parse(bytes),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
  assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
  d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[[['B','A','A'],['B','B','B','A']][n][i]]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
  assert.doesNotMatch(JSON.stringify(d),/Response view is always completely blank|original file on disk is never overwritten|All 12 lessons.*now covered/);
  if(!n){assert.match(d.practiceQuiz[0].options[1].text,/transport must be configured/);assert.equal(d.practiceQuiz[1].options[0].text,'Input');}
  else{assert.match(d.practiceQuiz[1].scenario,/remains connected/);assert.match(d.studyGuide[0].elements[0].text,/Input can modify existing XML/);assert.match(d.studyGuide[1].elements[1].text,/reload that file/);assert.match(d.studyGuide[1].elements[0].text,/duplicate IDs/);}
 });
});

test('AS1 prerequisites use model-specific licensing and current resources without promising host support',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m00_prerequisites.json'),d=JSON.parse(bytes),inventory=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inventory.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['D'],['A'],['B'],['C'],['A','B','C'],['D'],['A'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[1].elements[0].text,/8 GB RAM \(16 GB recommended\)/);
 assert.match(d.practiceQuiz[1].scenario,/online node-locked.*2023.2 or later/);
 assert.match(d.practiceQuiz[3].options[2].text,/source, availability, validity and connectivity/);
 assert.match(d.studyGuide[0].elements[0].text,/no named hypervisor.*certified/);
 const diagrams=d.studyGuide[0].elements.filter(e=>e.type==='diagram');assert.equal(diagrams.length,2);
 diagrams.forEach(e=>assert.doesNotMatch(e.svg,/Help → License|1–2 business days|Parallels/));
 assert.doesNotMatch(JSON.stringify(d),/typically valid 30–90|minimum 4 GB|free training licenses are requested|no Certificate is granted/);
});

test('AS1 workspace review distinguishes local workspaces, admin revocation and independent review policy',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m01_getting_started.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),review=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(review.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['D'],['A'],['B'],['C'],['D'],['A','B','C'],['A'],['B'],['C'],['D']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),['A','B','C','D']);});
 assert.match(d.studyGuide[1].elements[0].text,/separate workspace per user and machine/);
 assert.match(d.studyGuide[1].elements[2].text,/revoke checkouts.*rejecting/);
 assert.match(d.studyGuide[2].elements[0].text,/does not keep the two copies synchronized/);
 assert.match(d.practiceQuiz[8].scenario,/ordinary Tester B.*without administrative recovery/);
 assert.match(d.practiceQuiz[9].options[3].text,/local\/repository state/);
 assert.match(d.studyGuide[3].elements[1].text,/not a universal built-in Tosca enforcement/);
 assert.doesNotMatch(JSON.stringify(d),/Only a check-in by the holder|force-override are not supported|Contains 9 sections|Save disables undo\/redo|shared Google Doc/);
 assert.equal(d.studyGuide.flatMap(s=>s.elements).filter(e=>e.type==='diagram').length,3);
});

test('AS1 Modules review corrects control attributes, anchor fallback and same-type conversion',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m02_modules.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['D'],['A','B','C'],['A'],['D'],['A'],['B'],['C'],['D'],['B','C','F','G','H'],['A'],['B'],['C']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.equal(d.practiceQuiz.reduce((n,q)=>n+q.options.length,0),53);
 assert.match(d.practiceQuiz[2].options[0].text,/ModuleAttribute/);
 assert.match(d.practiceQuiz[6].options[2].text,/stable unique property combination.*parent/);
 assert.match(d.studyGuide[5].elements[2].text,/Auto is the default.*then Coordinate/);
 assert.match(d.studyGuide[6].elements[0].text,/same type.*radio buttons, buttons and links/);
 assert.match(d.practiceQuiz[11].options[2].text,/Convert to ControlGroup/);
 assert.match(d.studyGuide[6].elements[1].text,/does not automatically execute every/);
 assert.doesNotMatch(JSON.stringify(d),/Tosca never auto-fills|Always prefer Shortest Path|Breaks only if the anchor|Attributes describe the Module itself|Ctrl\+Click multi-select → Create ControlGroup/);
 assert.equal(d.studyGuide.flatMap(s=>s.elements).filter(e=>e.type==='diagram').length,5);
});

test('AS1 TestCases review disambiguates dates and distinguishes progress, waits and resolved dependencies',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m03_testcases.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 const keys=[['A','B','C'],['D'],['C'],['D'],['C'],['D'],['C'],['D'],['A'],['E'],['B'],['A','B'],['A','B'],['C'],['B'],['D'],['A'],['B'],['A']];
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,keys[i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.equal(q.source,undefined);});
 assert.equal(d.practiceQuiz.reduce((n,q)=>n+q.options.length,0),75);
 assert.match(d.practiceQuiz[4].scenario,/including its day/);assert.match(d.practiceQuiz[4].options[2].text,/ddMMMyyyy/);
 assert.equal(d.practiceQuiz[18].options[2].text,'{DATE[][-4M][MM]}');
 assert.match(d.studyGuide[15].elements[3].text,/w means workdays, not weeks/);
 assert.match(d.studyGuide[12].elements[0].text,/Secret and RawString/);
 assert.match(d.studyGuide[8].elements[0].text,/bounded by Synchronization Timeout/);
 assert.match(d.studyGuide[19].elements[1].text,/does not remove Module references, TCP/);
 assert.match(d.practiceQuiz[16].scenario,/moved into a TestStepLibrary/);
 assert.doesNotMatch(JSON.stringify(d),/confirmed exam question|w=weeks|ONLY before saving|completely self-contained|official knowledge check/i);
 assert.equal(d.studyGuide.flatMap(s=>s.elements).filter(e=>e.svg).length,3);
});

test('AS1 maintenance review keeps ValueRange suggestions separate from enforcement and covers partial merges',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m04_advanced_module_actions.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['D'],['C'],['A'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[2].scenario,/suggestions.*allowing user-specific/);
 assert.match(d.studyGuide[1].elements[0].text,/not an assertion/);
 assert.match(d.practiceQuiz[4].scenario,/successful full.*not.*partial/);
 assert.match(d.studyGuide[2].elements[1].text,/Partial Merge can leave the source/);
 assert.match(d.studyGuide[0].elements[1].text,/same business type/);
 assert.doesNotMatch(JSON.stringify(d),/enforced everywhere|flags it as invalid|red cross icon|automatically restricted/i);
 assert.match(d.studyGuide[2].elements.find(e=>e.svg).svg,/same-technology.*Partial merge can retain/);
});

test('AS1 parameter guidance uses scope rather than job role and preserves override caveats',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m05_advanced_testcase_parameters.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['C'],['D'],['A'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[0].text,/CP is outside square brackets.*overridden/);
 assert.match(d.studyGuide[2].elements[1].text,/include URL data/);
 assert.match(d.practiceQuiz[0].options[0].text,/replace literal uses/);
 assert.match(d.practiceQuiz[5].scenario,/uniqueness check/);
 assert.doesNotMatch(JSON.stringify(d),/CP in square brackets|exact tip given in Exercise|for non-technical business users managing.*not technical/i);
 assert.equal(d.studyGuide.flatMap(s=>s.elements).filter(e=>e.svg).length,2);
});

test('AS1 execution guidance separates default references, latest summary and retained logs',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m06_executionlists.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['C'],['D'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[0].options[0].text,/Once by default/);
 assert.match(d.studyGuide[0].elements[1].text,/MultipleReferencesToIdenticalTestCaseAllowed/);
 assert.match(d.studyGuide[0].elements[2].text,/ActualLog.*overwritten.*TestCaseLog/);
 assert.match(d.studyGuide[1].elements[1].text,/context menu or F6/);
 assert.match(d.practiceQuiz[3].options[3].text,/ActualLog is only the latest summary/);
 assert.doesNotMatch(JSON.stringify(d),/all historic results permanently|UNLIMITED reuse|not F6|four-section structure|confirmed.*exam/i);
});

test('AS1 requirements separates risk class scales from weights and links from completion',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m07_requirements.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['C'],['D'],['A'],['B'],['C'],['D'],['A'],['B'],['C']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[0].text,/enter weights manually.*not restricted to 1–10/);
 assert.match(d.studyGuide[1].elements[1].text,/yields 128/);
 assert.match(d.studyGuide[2].elements[0].text,/COMPLETED is not required/);
 assert.match(d.studyGuide[2].elements[2].text,/defaults to Off/);
 assert.match(d.studyGuide[2].elements[3].text,/Neither means always use the newest run/);
 assert.match(d.practiceQuiz[5].options[1].text,/ddMMMyyyy/);
 assert.match(d.practiceQuiz[6].options[2].text,/RequirementSet/);
 assert.doesNotMatch(JSON.stringify(d),/confirmed AS1 exam|verbatim official|not manually entered|Integer 1–10|CP in square brackets|var\(--pa-ink-[23]\)/i);
});

test('AS1 advanced guidance distinguishes ownership, retry scope, counts and shifting row indexes',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as1/m08_additional_advanced_topics.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['D'],['A'],['D'],['A'],['B'],['C'],['D'],['A'],['B','C'],['B'],['C']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[0].text,/green.*red.*white/i);
 assert.match(d.studyGuide[3].elements[1].text,/granularity.*not describe the object/);
 assert.match(d.studyGuide[9].elements[2].text,/General|general/);
 assert.match(d.studyGuide[9].elements[2].text,/Table ResultCount.*excludes configured headers/);
 assert.match(d.studyGuide[12].elements[1].text,/skip items/);
 assert.match(d.practiceQuiz[4].options[3].text,/current first data row/);
 assert.match(d.practiceQuiz[6].options[1].text,/additional stable properties/);
 assert.doesNotMatch(JSON.stringify(d),/confirmed Knowledge Check|verbatim official|RowCount==RowNum|\$\{Repetition\}|var\(--pa-ink-[23]\)/i);
});

test('AS1 reference review corrects expression, shortcut and repair advice without inventing guide downloads',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const bytes=fs.readFileSync('data/tosca-as1/m09_guides_reference.json'),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['C'],['D']][i%4]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[2].elements[0].text,/w means workdays/);
 assert.match(d.studyGuide[3].elements[0].text,/RowCount->RowNum/);
 assert.match(d.studyGuide[4].elements[0].text,/Module references and TCP dependencies remain/);
 assert.match(d.practiceQuiz[14].options[2].text,/locally editable/);
 assert.match(d.practiceQuiz[17].options[1].text,/one or several/);
 assert.match(d.studyGuide[5].elements[0].rows[1][0],/Ctrl\+X/);
 assert.doesNotMatch(JSON.stringify(d),/runtime-only|NO IF|ONLY before saving|RowCount==RowNum|w=weeks|var\(--pa-ink-[23]\)/i);
 const b=fs.readFileSync('data/tosca-as1/m10_original_guides.json'),guide=JSON.parse(b);
 assert.equal(inv.modules.find(m=>m.id===guide.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(b).digest('hex'));
 assert.doesNotMatch(JSON.stringify(guide.learningObjectives),/open it in the viewer|Download any guide/);
 assert.match(guide.studyGuide[0].elements[0].text,/have not been inspected/);
});

test('AS2 foundations separate official policy, instance Character and negative-test status',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const files=['data/tosca-as2/m00_introduction.json','data/tosca-as2/m01_testsheet_creation.json'];
 const docs=files.map((file,n)=>{const bytes=fs.readFileSync(file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,(n?[['A'],['B'],['D'],['C'],['A'],['B'],['D'],['B']]:[['D'],['C'],['D'],['C'],['D']])[i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});return d;});
 assert.match(docs[0].studyGuide[1].elements[0].text,/read-only.*restarting/);
 assert.match(docs[0].practiceQuiz[2].options[3].text,/current official course account/);
 assert.doesNotMatch(JSON.stringify(docs[0].quickRecap),/60%|2-week|Badge \+ points/);
 assert.match(docs[1].studyGuide[2].elements[0].description,/neither that name nor the leftmost/);
 assert.match(docs[1].practiceQuiz[2].scenario,/every other assertion succeeds/);
 assert.match(docs[1].studyGuide[0].elements[0].text,/hypothetical specification/);
 assert.doesNotMatch(JSON.stringify(docs[1]),/var\(--pa-ink-[23]\)|shown in the official Exercise/);
 ['data/tosca-as1/m03_testcases.json','data/tosca-as1/m04_advanced_module_actions.json'].forEach(file=>assert.doesNotMatch(fs.readFileSync(file,'utf8'),/var\(--pa-ink-[23]\)/));
});

test('AS2 template review covers broader validation and explicit regeneration without mandatory reference resolution',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const docs=['m02_templates.json','m03_how_to_use_templates.json'].map((file,n)=>{const bytes=fs.readFileSync('data/tosca-as2/'+file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,(n?[['C'],['D'],['B'],['A'],['A','B','D'],['A'],['B']]:[['B'],['B'],['C'],['C'],['A'],['D'],['D']])[i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});return d;});
 assert.match(docs[0].studyGuide[0].elements[2].description,/need reinstantiation/);
 assert.match(docs[0].studyGuide[1].elements[0].text,/not a universal conversion prerequisite/);
 assert.match(docs[0].practiceQuiz[3].options[2].text,/information is lost/);
 assert.match(docs[1].studyGuide[1].elements[0].text,/empty.*uniquely match/);
 assert.match(docs[1].practiceQuiz[1].options[3].text,/conditions.*TCPs and InstanceName/);
 assert.match(docs[1].studyGuide[2].elements[0].text,/Completed is not listed/);
 docs.forEach(d=>assert.doesNotMatch(JSON.stringify(d),/ONLY checks that the links exist|only validates that XL references exist|exactly ONE Template|Undo ONLY before|BEFORE the project is saved/i));
});

test('AS2 modification and conditions distinguish generation, safe updates and runtime branching',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const docs=['m04_modifications_to_templates.json','m05_conditions.json'].map((file,n)=>{const bytes=fs.readFileSync('data/tosca-as2/'+file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,(n?[['A'],['D'],['C'],['D'],['B'],['A'],['C']]:[['D'],['A'],['B'],['A'],['D'],['B'],['B']])[i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});return d;});
 assert.match(docs[0].studyGuide[0].elements[0].text,/property alone does not change.*ActionMode/);
 assert.match(docs[0].studyGuide[1].elements[0].text,/deleting.*not a universal prerequisite/i);
 assert.match(docs[0].studyGuide[2].elements[0].text,/not a guaranteed additive merge/);
 assert.match(docs[1].practiceQuiz[1].scenario,/controlled, non-null/);
 assert.match(docs[1].practiceQuiz[2].scenario,/explicit logical operator/);
 assert.match(docs[1].practiceQuiz[6].options[2].text,/during generation.*during execution/);
 docs.forEach(d=>assert.doesNotMatch(JSON.stringify(d),/delete the OLD TemplateInstance|holds only one link|safer, additive option|Tosca's default for 2\+ conditions/));
});

test('AS2 execution review separates specified coverage, completion and synchronization scope',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as2/m06_run_report_automated_tests.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A','B','D'],['A'],['A'],['C'],['B'],['B'],['A'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[2].elements[0].text,/Completed is not a universal linking prerequisite/);
 assert.match(d.practiceQuiz[3].options[2].text,/creation progress/);
 assert.match(d.studyGuide[2].elements[0].text,/Do not assume synchronizing one list/);
 assert.match(d.studyGuide[0].elements[0].text,/Alternatively, dropping/);
 assert.doesNotMatch(JSON.stringify(d),/never individual TestCases|must be set to COMPLETED|updates every linked ExecutionList/);
});

test('AS2 recap distinguishes generated negative paths, Character and bounded state waits',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as2/m07_build_template_link_values_recap.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['C'],['D'],['B'],['A'],['B'],['A'],['A'],['A'],['A'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[4].elements[0].text,/including Straight Through/);
 assert.match(d.studyGuide[4].elements[0].text,/rather than jumping folders at runtime/);
 assert.match(d.practiceQuiz[8].scenario,/independent negative-test specification/);
 assert.match(d.practiceQuiz[9].options[0].text,/rescan only when needed/);
 assert.doesNotMatch(JSON.stringify(d),/discount must verify as a negative number|must be typed manually, not drag-and-dropped|usually indicates an unstable module/);
});

test('AS2 independent capstone qualifies catalogue assumptions and does not invent original guide UI',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const docs=['m09_grand_scenario.json','m10_original_guides.json'].map(file=>{const bytes=fs.readFileSync('data/tosca-as2/'+file),d=JSON.parse(bytes);assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));return d;});
 const d=docs[0],ids=new Set(d.studyGuide.map(s=>s.sectionId));d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['D'],['B'],['B'],['B'],['D'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[0].scenario,/hypothetical price table/);
 assert.match(d.practiceQuiz[1].options[1].text,/Verify the expected rejection/);
 assert.match(d.practiceQuiz[5].options[0].text,/actual Module inventory/);
 assert.match(docs[1].studyGuide[0].elements[0].text,/no embedded PDF viewer/);
 assert.doesNotMatch(JSON.stringify(docs[1].learningObjectives),/Click either|Download either/);
});

test('AS2 API review scopes message patterns, TCPs and composed source values',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-as2/m08_create_api_testcases.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['D'],['C'],['C'],['A'],['B'],['A'],['A'],['B'],['C'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[1].scenario,/synchronous/);
 assert.match(d.practiceQuiz[4].options[0].text,/scoped.*inheritance or overrides/);
 assert.match(d.practiceQuiz[7].options[0].text,/retaining intentional composition/);
 assert.doesNotMatch(JSON.stringify(d),/every Message.*PAIR|reusable, project-wide|No partial credit|SKU isn't visible on the UI/);
});

test('PBA rule review avoids architecture-specific UI and first-match resolution guarantees',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/business-architect/m05_creating_a_rule.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,19);d.practiceQuiz.forEach(q=>{assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.equal(q.explanationReviewedOn,'2026-10-06');});
 assert.match(d.studyGuide[0].elements[2].items[2],/Constellation/);
 assert.match(d.studyGuide[2].elements[2].description,/other eligibility criteria/);
 assert.match(d.studyGuide[3].elements[1].description,/identifier, class or Ruleset/);
 assert.doesNotMatch(d.studyGuide[2].elements[3].text,/first matching Rule/);
});

test('PSA relationship review separates ownership, physical storage, source and cardinality',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/system-architect/m09_creating_a_data_relationship.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(inv.modules.find(m=>m.id==='SA-M09').localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,19);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[9,16,17,18].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.equal(q.explanationReviewedOn,'2026-10-06');});
 assert.match(d.studyGuide[2].elements[0].description,/not specify a universal physical table layout/);
 assert.match(d.studyGuide[2].elements[4].html,/does not itself guarantee write access/);
 assert.match(d.quickRecap[2].value,/local or external/);
 assert.doesNotMatch(d.examPitfalls[3].trapDescription,/inside the Case work object/);
 assert.doesNotMatch(d.practiceQuiz[17].rationale,/requires an external data source/);
});

test('PSA data model review distinguishes defaults, edit modes, simulation and structural changes',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/system-architect/m08_the_data_model.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));
 assert.equal(inv.modules.find(m=>m.id==='SA-M08').localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 assert.equal(d.practiceQuiz.length,18);d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[9,15,16,17].includes(i)?['A','B']:['A']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.equal(q.explanationReviewedOn,'2026-10-06');});
 assert.match(d.studyGuide[0].elements[4].description,/Conceptual.*Logical.*Physical/);
 assert.match(d.studyGuide[2].elements[1].description,/Read-only\/Editable\/Savable/);
 assert.match(d.practiceQuiz[13].scenario,/simulated/);
 assert.doesNotMatch(JSON.stringify(d),/one for the Operator context|requires Dev Studio|A 'data class' is not a Pega term|not a\."|there is\."|--pa-ink-2|--pa-ink-3/);
});

test('AE1 introduction and framework review correct positional table syntax and qualify course access',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 const docs=['m00_introduction.json','m01_tbox_engines_frameworks.json'].map(file=>{const bytes=fs.readFileSync('data/tosca-ae1/'+file),d=JSON.parse(bytes),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));d.practiceQuiz.forEach(q=>{assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});return d;});
 assert.deepEqual(docs[0].practiceQuiz.map(q=>q.correctOptions),[['B'],['B'],['B']]);
 assert.deepEqual(docs[1].practiceQuiz.map(q=>q.correctOptions),[['B'],['B'],['C'],['A'],['B'],['B'],['B'],['A']]);
 assert.match(docs[1].studyGuide[4].elements[0].description,/relative to the configured header/);
 assert.match(docs[1].practiceQuiz[4].options[1].text,/unique Order ID/);
 assert.match(docs[1].practiceQuiz[7].options[0].text,/NONE on the report definition/);
 assert.doesNotMatch(JSON.stringify(docs),/\$ = by a cell|\$ notation instead targets the row|only the visuals shift|Final Exam draws no questions/);
 assert.match(docs[0].studyGuide[0].elements[2].text,/unavailable during review/);
});

test('AE1 Excel review separates manipulation, file comparison defaults and save operations',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m02_excel_engine.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['C'],['C'],['A'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[3].elements[0].description,/off by default/);
 assert.match(d.practiceQuiz[0].rationale,/File Compare is a separate path/);
 assert.match(d.studyGuide[1].elements[1].description,/only applies with Save Path/);
 assert.doesNotMatch(JSON.stringify(d),/23 sub-lessons|TBox XEngines|every other Excel Module depends on it/);
});

test('AE1 PDF review distinguishes anchor defaults, relative offsets and explicit exclusions',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m03_pdf_engine.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['A','B','C'],['A'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[2].elements[0].description,/100%.*99%/);
 assert.match(d.studyGuide[1].elements[1].description,/distance between them changes/);
 assert.match(d.practiceQuiz[3].options[1].text,/dimensions.*pages/);
 assert.match(d.studyGuide[3].elements[0].description,/does not support OCR/);
 assert.doesNotMatch(JSON.stringify(d),/TBox XEngines|lower it via OCR settings|a shifted layout no longer breaks/);
});

test('AE1 mail review scopes protocols and cloud prerequisites instead of promising account bypasses',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m04_mail_engine.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.equal(d.practiceQuiz[1].options[1].text,'POP3 or IMAP');
 assert.match(d.studyGuide[1].elements[1].description,/token-acquisition failure/);
 assert.match(d.studyGuide[1].elements[2].description,/Client Secret.*Graph/);
 assert.match(d.studyGuide[2].elements[2].items[1],/does not guarantee availability/);
 assert.doesNotMatch(JSON.stringify(d),/TBox XEngines|personal mailbox.*avoids this entirely|Authentication Type off 'Direct'|whichever step ran last/);
});

test('AE1 Windows review preserves conditional engine guidance and control capabilities',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m05_winx_uia_engines.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['C'],['B'],['A'],['A'],['B'],['C']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[1].description,/recommends.*standard engine/);
 assert.match(d.studyGuide[2].elements[0].description,/depend on the control and engine/);
 assert.match(d.practiceQuiz[2].options[1].text,/evaluate.*references/);
 assert.doesNotMatch(JSON.stringify(d),/does not prescribe one|Not prescribed by Tricentis|Unchanged — same|also reaches desktop elements and the taskbar/);
});

test('AE1 self healing review separates identification recovery from final assertions and weighted setup',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m06_self_healing.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['C'],['A'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[2].elements[2].text,/ARA.*rescan.*Weight -1/);
 assert.match(d.practiceQuiz[1].scenario,/remaining assertions succeed/);
 assert.match(d.studyGuide[3].elements[1].description,/Review.*first/);
 assert.doesNotMatch(JSON.stringify(d),/A successful heal means a normal pass|when self-healing succeeds, the TestCase passes normally/);
});

test('AE1 custom control review keeps unverified on-prem installation open and scopes Cloud distribution',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m07_custom_controls.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(r.localContentReview,'partial-source-comparison');assert.equal(d.sourceReviewedOn,undefined);
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['C'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[1].description,/does not affect on-prem customizations/);
 assert.match(d.practiceQuiz[3].options[1].text,/robustness still needs validation/);
 assert.doesNotMatch(JSON.stringify(d),/survives cosmetic changes|Tosca has to be restarted|same ActionModes/);
});

test('AE1 standard Modules review corrects name editing, dialog scope and execution restrictions',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m08_standard_modules.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['A'],['C'],['A'],['B'],['B'],['C'],['A'],['B'],['C'],['A'],['B'],['B'],['A'],['B'],['B'],['A'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.equal(d.practiceQuiz[18].options[1].text,'Editing the name of the referenced XTestStepValue.');
 assert.match(d.studyGuide[8].elements[0].description,/Customized dialogs must be scanned/);
 assert.match(d.studyGuide[8].elements[3].text,/ScratchBook does not support/);
 assert.match(d.studyGuide[3].elements[2].description,/permission, lock or path errors/);
 assert.doesNotMatch(JSON.stringify(d),/wildcarded Module actually bind|same TestStep.*any webpage|TBox XEngines|today's date is later than yesterday's/);
});

test('AE1 image review distinguishes XScan anchors from PDF and checks identifier reliability',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m09_image_based_controls.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['B'],['A','B','C'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[0].description,/sequentially.*increase execution time/);
 assert.match(d.studyGuide[1].elements[1].description,/non-unique identifier remains unreliable/);
 assert.deepEqual(d.studyGuide[2].elements[1].items.map(s=>s.split(' — ')[0]),['ShortestPath','Coordinate','Auto']);
 assert.match(d.studyGuide[2].elements[0].description,/not the PDF Scan/);
 assert.match(d.studyGuide[3].elements[1].text,/does not establish that every identification mode is covered/);
});

test('AE1 mobile review scopes app opening, capability exception and Agent version requirements',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m10_mobile_engine.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['A'],['B'],['C']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[0].scenario,/does not set Desired Capabilities first/);
 assert.match(d.studyGuide[3].elements[2].description,/exception.*Set Desired Capabilities.*Mobile websites.*OpenUrl/);
 assert.match(d.studyGuide[1].elements[2].text,/2025.4.*iOS hosting to macOS/);
 assert.match(d.studyGuide[4].elements[1].description,/--rest-address.*--appium-port.*separately/);
 assert.doesNotMatch(JSON.stringify(d),/safe to skip|fault is on Tosca's side|no Android Emulator exists|GET.*api\/devices|BundleID.*those are for installing from an APK/);
});

test('AE1 Vision AI review requires configured recovery and preserves UIDC sizing limits',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m11_vision_ai.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[3].text,/administrator-enabled.*RetryLevel=TestStepValue.*OnDialogFailure=Recover.*TestStepValueRetries=1.*ExecutionList/);
 assert.match(d.studyGuide[3].elements[1].description,/single anchor.*may fail.*UidcCategory/);
 assert.match(d.studyGuide[0].elements[0].text,/blueprint was not accessible/);
 assert.doesNotMatch(JSON.stringify(d),/nothing here will be tested|stable, self-healing Modules for any UI|TBox XEngines|self-healing does not cover/);
});

test('AE1 capstone review separates verified mechanisms from unverified Academy sequence',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-ae1/m12_grand_scenario.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.equal(r.localContentReview,'partial-source-comparison');assert.equal(d.sourceReviewedOn,undefined);
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['B'],['B'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[2].elements[1].description,/resolved reference.*independent copy/);
 assert.match(d.studyGuide[4].elements[1].description,/not automatic PDF verification.*identifier separately/);
 assert.match(d.studyGuide[1].elements[2].text,/do not themselves guarantee.*does not undo/);
 assert.doesNotMatch(JSON.stringify(d),/every TestCase referencing it is fixed at once|TBox lets engines mix freely|differs on every execution/);
});

test('BA life cycle review separates recommendations, parallel work and configured notifications',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/business-architect/m08_case_life_cycle_design.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[1].description,/normally run sequentially.*instead run in parallel/);
 assert.match(d.practiceQuiz[12].rationale,/not a hard platform limit/);
 assert.match(d.practiceQuiz[18].rationale,/not every status change automatically/);
 assert.match(d.practiceQuiz[5].rationale,/may resolve a Case negatively/);
 assert.equal(d.practiceQuiz[11].lessonSection,d.studyGuide[0].sectionId);
 assert.equal(d.practiceQuiz[12].lessonSection,d.studyGuide[0].sectionId);
});

test('mobile introduction reviews distinguish Agent support, web engine and unresolved Academy outline',()=>{
 const crypto=require('node:crypto'),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json'));
 ['data/tosca-mobile/m00_introduction.json','data/tosca-mobile/m01_mobile_engine_and_tma.json'].forEach((f,n)=>{const bytes=fs.readFileSync(f),d=JSON.parse(bytes),r=inv.modules.find(m=>m.id===d.moduleId),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(r.localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));d.practiceQuiz.forEach(q=>{assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 if(!n){assert.equal(r.localContentReview,'partial-source-comparison');assert.equal(d.sourceReviewedOn,undefined);assert.match(d.practiceQuiz[1].scenario,/TMA 2025.4 support matrix/);assert.match(d.practiceQuiz[2].rationale,/do not quantify/);}
 else{assert.equal(r.localContentReview,'source-compared');assert.match(d.studyGuide[1].elements[1].description,/Mobile Web Engine 3.0/);assert.match(d.practiceQuiz[5].options[2].text,/every Tosca author.*manually install/);assert.deepEqual(d.practiceQuiz[5].correctOptions,['C']);assert.match(d.practiceQuiz[3].rationale,/does not prove an engine defect/);}
 assert.doesNotMatch(JSON.stringify(d),/large majority|most real-world.*problems hide|Eliminates configuration challenges|Tosca Commander itself runs there/);
 });
});

test('mobile installation review distinguishes Appium port, REST bindings and readiness evidence',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m02_installing_configuring_tma.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['C'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[1].scenario,/default Appium port/);
 assert.match(d.studyGuide[1].elements[1].description,/--rest-address.*--appium-port.*--grpc-address/);
 assert.match(d.practiceQuiz[2].rationale,/not proof/);
 assert.doesNotMatch(JSON.stringify(d),/default REST port is 8585|Only the --rest-address|api\/devices|installer itself is identical|VM installs work unofficially/);
});

test('Android preparation review scopes vendor security, host support and installed app identifiers',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m03_preparing_android.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A','B','C'],['B'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[0].items[3],/Trust can need renewal/);
 assert.match(d.studyGuide[2].elements[1].items[1],/does discuss Permission Monitoring/);
 assert.match(d.studyGuide[2].elements[1].items[2],/verify.*application owner/);
 assert.match(d.studyGuide[3].elements[3].text,/BundleID identifies an installed iOS/);
 assert.doesNotMatch(JSON.stringify(d),/only appears the first time|safe to skip|debug keystore|two most common|ships no ARM64 Windows|grep mCurrentFocus/);
});

test('iOS preparation review scopes host support and keeps pairing, signing and hardware evidence distinct',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m04_preparing_ios.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[1].text,/Windows instructions.*vendor confirmation/);
 assert.match(d.studyGuide[1].elements[1].text,/pairing.*not the only trigger/);
 assert.match(d.studyGuide[2].elements[0].description,/Simulated biometric.*different/);
 assert.match(d.studyGuide[3].elements[2].text,/\.ipa.*physical.*\.app.*Simulator/);
 assert.doesNotMatch(JSON.stringify(d),/free Apple ID is sufficient|any iOS automation|full stop|only appears after Xcode|simulator\/app's BundleID|Tosca and TMA together/);
});

test('mobile connection review uses documented dynamic selection without inventing session health guarantees',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m05_connecting_tosca_to_tma.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['B'],['C'],['C'],['A','C','E'],['B'],['A','B','D'],['A'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[1].description,/TOSCA_DYNAMIC_DEVICE_SELECTION.*not an arbitrary wildcard/);
 assert.match(d.practiceQuiz[2].rationale,/do not rule out driver, app, network/);
 assert.match(d.studyGuide[3].elements[3].items[1],/REST bind port equals the Appium port/);
 assert.doesNotMatch(JSON.stringify(d),/api\/devices|never even leaves Tosca|Scan tolerates|most connection failures|Every run always|live visual feed/);
});

test('mobile scan review separates driver capabilities, named set entries and execution evidence',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m06_mobile_scan.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['B'],['B'],['A'],['A','B'],['B'],['C'],['C'],['A']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[1].elements[2].description,/entry to the selected group/);
 assert.match(d.studyGuide[1].elements[3].text,/UiAutomator2.*target SDK\/API.*XCUITest.*privacy alerts/);
 assert.match(d.practiceQuiz[7].scenario,/XCUITest iOS/);
 assert.doesNotMatch(JSON.stringify(d),/almost always|more forgiving|same capabilities apply|current session only|not the permissions one/);
});

test('first mobile TestCase review includes capabilities exception, relative coordinates and iOS keyboard scope',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m07_first_mobile_testcase.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['B'],['B'],['B'],['B'],['A','C','D']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[0].description,/Desired Capabilities setup.*exception.*Mobile websites use OpenUrl/);
 assert.match(d.studyGuide[1].elements[1].text,/percentages as well as pixels/);
 assert.match(d.studyGuide[2].elements[1].description,/iOS.*True.*False/);
 assert.match(d.practiceQuiz[4].rationale,/does support native and hybrid/);
 assert.doesNotMatch(JSON.stringify(d),/no exceptions|Mandatory first TestStep of any|near-real-time|only when no scanned|same shape as TBox/);
});

test('advanced mobile review corrects hardware buttons, virtual biometrics and Android transfer scope',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m08_advanced_modules_troubleshooting.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach(q=>{assert.deepEqual(q.correctOptions,['B']);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[0].items[0],/ApplicationSelector.*do not include volume or power/);
 assert.match(d.studyGuide[1].elements[0].items[0],/Android emulator.*not a universal physical/);
 assert.match(d.studyGuide[2].elements[0].items[0],/Android.*overwritten/);
 assert.match(d.practiceQuiz[3].options[1].text,/reservation release.*separately/);
 assert.doesNotMatch(JSON.stringify(d),/api\/devices|almost always|very often|more forgiving|only then network|re-sign with apksigner/);
});

test('AVD review separates profile names, runtime ports and session-readiness evidence',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m09_avd_setup_tma_integration.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.practiceQuiz[1].options[1].text,/console port.*adb port.*5555/);
 assert.match(d.studyGuide[2].elements[2].description,/displayed full emulator name.*Do not interchange/);
 assert.match(d.studyGuide[1].elements[2].text,/Do not assume.*translation/);
 assert.doesNotMatch(JSON.stringify(d),/Official course description|surprising share|runs, technically, through translation|isolates whether the problem is|in that order/);
});

test('mobile app-type review distinguishes opening and engine paths from shared modeling concepts',()=>{
 const crypto=require('node:crypto'),bytes=fs.readFileSync('data/tosca-mobile/m10_testing_native_hybrid_web.json'),d=JSON.parse(bytes),inv=JSON.parse(fs.readFileSync('docs/source-review-inventory-2026-10-02.json')),ids=new Set(d.studyGuide.map(s=>s.sectionId));assert.equal(inv.modules.find(m=>m.id===d.moduleId).localReview.contentSha256,crypto.createHash('sha256').update(bytes).digest('hex'));
 d.practiceQuiz.forEach((q,i)=>{assert.deepEqual(q.correctOptions,[['A','B','D'],['B'],['B']][i]);assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());});
 assert.match(d.studyGuide[0].elements[0].description,/websites use OpenUrl.*Buffer stores data.*Verify/);
 assert.match(d.studyGuide[3].elements[0].description,/Mobile Web Engine 3.0/);
 assert.match(d.studyGuide[2].elements[2].text,/one-time Verify.*not a substitute for waiting/);
 assert.doesNotMatch(JSON.stringify(d),/every mobile TestCase starts|Open Mobile App first|most predictable|timing matters more|engine isn't separate|native and web TestCases never/);
});
