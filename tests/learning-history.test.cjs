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
  d.practiceQuiz.forEach((q,i)=>{count++;assert.deepEqual(q.correctOptions,keys[index][i+1]||['A']);assert.ok(sections.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.equal(q.explanationReviewedOn,'2026-10-02');});
 });assert.equal(count,60);
});
test('PSA draft, naming and access questions avoid the reviewed misleading claims',()=>{
 const d=JSON.parse(fs.readFileSync('data/system-architect/m02_defining_customer_microjourney.json'));
 const draft=d.practiceQuiz.find(q=>q.questionId==='m02_q20');assert.doesNotMatch(draft.options[0].text,/without.*live application/);assert.match(draft.options[1].text,/before.*production/);assert.match(draft.rationale,/not a deployment isolation/);
 const naming=d.practiceQuiz.find(q=>q.questionId==='m02_q12');assert.match(naming.scenario,/Process = 'Review documents'/);assert.match(naming.rationale,/verb\+noun/);
 const users=JSON.parse(fs.readFileSync('data/system-architect/m03_inviting_users_to_application.json'));assert.match(users.practiceQuiz[15].options[0].text,/configured authentication/);assert.doesNotMatch(users.practiceQuiz[15].options[1].text,/includes.*Persona/);
});

test('PSA Center-out, GenAI and Blueprint feedback has complete, real lesson targets',()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json'));let count=0;
 for(const m of registry.tracks.find(t=>t.trackId==='PSA').modules.slice(3,6)){const d=JSON.parse(fs.readFileSync(m.file)),ids=new Set(d.studyGuide.map(s=>s.sectionId));for(const q of d.practiceQuiz){count++;assert.ok(ids.has(q.lessonSection));assert.deepEqual(Object.keys(q.optionExplanations).sort(),q.options.map(o=>o.id).sort());assert.ok(Object.values(q.optionExplanations).every(s=>s.length>25));assert.equal(q.explanationReviewedOn,'2026-10-02');}}
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
