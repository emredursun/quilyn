import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { audit, banks } from '../scripts/audit-quiz-bias.mjs';
function setup(){const values=new Map();const window={dispatchEvent(){},QuilynRuntime:{safeUrl:v=>v}};const context={window,Date,Map,Set,TextEncoder,CustomEvent:class{},HTMLElement:class{},customElements:{define(){}},document:{addEventListener(){}},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}};for(const name of ['progress','learning-history'])vm.runInNewContext(readFileSync(`core/js/${name}.js`,'utf8'),context);return {p:window.QuilynProgress,j:window.QuilynJournal,migrate:window.QuilynJournal.migrateMockState,window};}
test('all live banks have valid references and acceptable position balance',()=>{for(const row of audit()){assert.deepEqual(row.errors,[],row.name);assert.equal(row.skew,false,row.track+'/'+row.name);}});
test('audit rejects invalid references and detects fully skewed small banks',()=>{const q={questionId:'one',scenario:'Stem',type:'single-select',options:[{id:'A',text:'one'},{id:'B',text:'two'},{id:'C',text:'three'},{id:'D',text:'four'}],correctOptions:['A']};const group={track:'TEST',name:'test',questions:[q,{...q,questionId:'two'}]};assert.equal(audit([group])[0].skew,true);assert.ok(audit([{...group,questions:[{...q,correctOptions:['Z']}]}])[0].errors.length);});
test('every rewritten mock preserves legacy and signed selections, grading and backup data',()=>{
 const {p,j,migrate}=setup();
 for(const g of banks().filter(g=>g.kind==='mock'&&!g.questions.some(q=>q.answerReviewVersion))){
  const old=g.questions.map(q=>{const order=q.previousOrder||q.o.map((_,i)=>i),o=[];order.forEach((a,i)=>o[a]=q.o[i]);return {...q,o,a:q.a.map(i=>order[i])};});
  const sig=rows=>j.bankSignature(g.track,g.name,rows);
  for(const signed of [false,true]){
   const saved={name:g.name,remaining:300,answers:old.map(q=>q.a.slice()),checked:old.map(()=>true),...(signed?{signature:sig(old)}:{})};const before=JSON.stringify(saved);
   const migrated=migrate(saved,g.questions,sig);
   assert.equal(JSON.stringify(saved),before,'original backup is untouched');
   assert.equal(migrated.signature,sig(g.questions));
   g.questions.forEach((q,i)=>assert.deepEqual(Array.from(migrated.answers[i]).sort(),q.a.slice().sort(),g.track+'/'+g.name+'/'+i));
   assert.equal(migrate(migrated,g.questions,sig),migrated,'idempotent');
   assert.equal(p.validEntry(`pegaMock_${g.track}_${g.name}`,migrated),true);
  }
  const unrelated={answers:old.map(()=>[]),signature:'unrelated'};assert.equal(migrate(unrelated,g.questions,sig),unrelated);
 }
});
test('practice IDs and exact previous wording signatures restore selections after edits and reorder',async()=>{
 const {p,window}=setup();
 for(const g of banks().filter(g=>g.kind==='practice'))for(const q of g.questions){
  for(const signature of [p.quizSignature(q),...(q.previousSignatures||[])]){
   const saved={version:2,answers:{[q.questionId]:{signature,selected:q.correctOptions.slice(),graded:true,correct:true}}};
   const next=p.quizState(saved,[q]);assert.deepEqual(Array.from(next.answers[q.questionId].selected),q.correctOptions);
   window.QuilynRuntime.json=async path=>path==='data/registry.json'?{tracks:[{trackId:g.track,modules:[{id:g.name,file:g.file}]}]}:{practiceQuiz:[q]};
   assert.deepEqual(Array.from(await p.validateReferences({version:2,state:{[`pq_state_#${g.track}/${g.name}`]:saved}})),[]);
  }
 }
});
test('mapping metadata is a complete permutation and historical snapshots remain valid',()=>{
 const {p,j}=setup();for(const g of banks().filter(g=>g.kind==='mock'))for(const [i,q]of g.questions.entries()){
  if(q.previousOrder)assert.deepEqual(q.previousOrder.slice().sort((a,b)=>a-b),q.o.map((_,j)=>j));
  const snapshot=j.mockQuestion(g.track,g.name,q,i);assert.ok(snapshot.signature);
 }
 const legacy={version:1,attempts:[],mistakes:{}};assert.equal(p.validEntry('quilyn_learning',legacy),true);
});

test('feedback follows displayed letters after stable IDs are reordered',()=>{const {j}=setup();const html=j.feedbackHTML({options:[{id:'B',text:'Second'},{id:'A',text:'First'}],correct:['A'],optionExplanations:{A:'First explanation',B:'Second explanation'},track:'PSA',moduleId:'SA-M01'});assert.match(html,/A · Second · Incorrect/);assert.match(html,/B · First · Correct/);});
test('legacy mock backup references remain importable before numeric migration',async()=>{
 const {p,j,window,migrate}=setup();
 const g=banks().find(g=>g.kind==='mock'&&g.questions.some(q=>q.previousOrder)&&!g.questions.some(q=>q.answerReviewVersion));
 const old=g.questions.map(q=>{const order=q.previousOrder||q.o.map((_,i)=>i),o=[];order.forEach((a,i)=>o[a]=q.o[i]);return {...q,o,a:q.a.map(i=>order[i])};});
 const value={name:g.name,answers:old.map(q=>q.a),checked:old.map(()=>true),remaining:60,signature:j.bankSignature(g.track,g.name,old)};
 window.QuilynRuntime.json=async path=>path==='data/registry.json'?{tracks:[{trackId:g.track,exam:{timeMinutes:90},modules:[]}]}:{[g.track]:{[g.name]:g.questions}};
 const key=`pegaMock_${g.track}_${g.name}`,bundle={version:2,state:{[key]:value}};
 assert.deepEqual(Array.from(await p.validateReferences(bundle)),[]);p.applyBundle(bundle);
 const restored=p.read(key,null),mapped=migrate(restored,g.questions,rows=>j.bankSignature(g.track,g.name,rows));
 assert.deepEqual(JSON.parse(JSON.stringify(mapped.answers)),g.questions.map(q=>q.a));
 assert.equal(p.read(key,null).optionOrderVersion,undefined,'imported backup remains unchanged until resume saves');
});

test('source corrections preserve old attempts for review rather than silently regrade them',()=>{
 const {j,migrate}=setup();let affected=0;
 for(const g of banks().filter(g=>g.kind==='mock'&&g.questions.some(q=>q.answerReviewVersion))){affected++;
  for(const signed of [false,true]){const saved={name:g.name,remaining:60,answers:g.questions.map(()=>[0]),checked:g.questions.map(()=>true),...(signed?{signature:'original-bank-signature'}:{})};const before=JSON.stringify(saved);const result=migrate(saved,g.questions,()=> 'current');assert.equal(result.requiresContentReview,true);assert.equal(JSON.stringify(saved),before);assert.deepEqual(JSON.parse(JSON.stringify(result.answers)),saved.answers);}
  const modern={optionOrderVersion:1,answers:g.questions.map(()=>[])};assert.equal(migrate(modern,g.questions,()=>''),modern);
  for(const [i,q]of g.questions.entries())if(q.answerReviewVersion){assert.ok(q.previousQuestion);const snapshot=j.mockQuestion(g.track,g.name,q.previousQuestion,i);assert.equal(snapshot.scenario,q.previousQuestion.q);assert.deepEqual(Array.from(snapshot.correct),q.previousQuestion.a.map(a=>String.fromCharCode(65+a)));}
 }assert.equal(affected,8);
});
test('mock start archives original answers and displays the content-change notice before a new attempt',()=>{
 const {j}=setup();const values=new Map(),saved={name:'Exam',remaining:60,answers:[[1]],checked:[true]},notice={textContent:''};values.set('pegaMock_PSA_Exam',JSON.stringify(saved));let archived=null,started=0,home=0,allowArchive=true;
 const window={PegaStore:{state:{activeTrack:'PSA'}},QuilynJournal:{...j,abandon:()=>true},QuilynProgress:{read:key=>values.has(key)?JSON.parse(values.get(key)):null,archive(key,value){if(!allowArchive)return false;archived=JSON.parse(JSON.stringify(value));return true;},remove:key=>values.delete(key)},home(){home++;},start(){started++;}};
 let source=readFileSync('core/js/mock-view.js','utf8').replace('function renderHome() {','function renderHome() { global.home(); return;').replace('function doStartExam(name, saved) {','function doStartExam(name, saved) { global.start(); return;');
 source=source.replace('})(window);',`window.tryStart=function(){EXAMS={Exam:[{q:'Updated',o:['one','two'],a:[0],t:'single',d:'General',r:'Reviewed',answerReviewVersion:1}]};_root={querySelector:function(selector){return selector==='#mv-bankDisclosure'?window.notice:null;}};startExam('Exam');};})(window);`);window.notice=notice;
 vm.runInNewContext(source,{window,Date,HTMLElement:class{},customElements:{define(){}},document:{addEventListener(){}},localStorage:{getItem:key=>values.get(key)||null}});
 allowArchive=false;window.tryStart();assert.equal(values.has('pegaMock_PSA_Exam'),true);assert.equal(started,0);assert.equal(home,0);
 allowArchive=true;window.tryStart();assert.deepEqual(archived,saved);assert.equal(values.has('pegaMock_PSA_Exam'),false);assert.equal(home,1);assert.equal(started,0);assert.match(notice.textContent,/archived in your backup/);
 window.tryStart();assert.equal(started,1,'a second explicit start opens a fresh attempt');
});
