const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function setup(){const values=new Map(),notices=[];const window={dispatchEvent:e=>notices.push(e.detail)};let fail=false;
 vm.runInNewContext(fs.readFileSync('core/js/progress.js','utf8'),{window,Date,localStorage:{getItem:k=>values.get(k)??null,setItem(k,v){if(fail)throw Error('quota');values.set(k,v);}},CustomEvent:class{constructor(t,o){this.detail=o.detail;}}});
 return {api:window.QuilynProgress,values,notices,window,fail(){fail=true;}};}
const key='pq_state_#PBA/BA-M01';
const question=(id,scenario)=>({questionId:id,type:'single-select',scenario,options:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctOptions:['A']});
const questions=[question('Q1','One'),question('Q2','Two')];
test('legacy answers migrate by question ID and remain valid for backups',()=>{
 const {api}=setup();const migrated=api.quizState({0:{selected:['A'],graded:true,correct:true}},questions);
 assert.equal(migrated.answers.Q1.selected[0],'A');assert.equal(api.validEntry(key,migrated),true);assert.equal(api.validEntry(key,{0:{selected:['A'],graded:true}}),true);
});
test('question and option reordering preserves answers; revised wording and answer invalidate them',()=>{
 const {api}=setup();const state=api.quizState({0:{selected:['A'],graded:true,correct:true}},questions);
 const reordered=[questions[1],{...questions[0],options:questions[0].options.slice().reverse()}];assert.equal(api.quizState(state,reordered).answers.Q1.selected[0],'A');
 assert.equal(Object.keys(api.quizState(state,[question('Q1','Changed')]).answers).length,0);
 assert.equal(Object.keys(api.quizState(state,[{...questions[0],correctOptions:['B']}]).answers).length,0);
 assert.equal(Object.keys(api.quizState(state,[questions[1]]).answers).length,0);
});
test('original quiz snapshots are archived; quota failure is visible',()=>{
 const {api,values,notices,fail}=setup();const old={0:{selected:['A'],graded:true}};assert.equal(api.archive(key,old),true);
 assert.deepEqual(JSON.parse([...values.values()][0]),old);fail();assert.equal(api.archive(key,old),false);assert.equal(notices.length,1);
});
test('modern backup references use IDs and report changed content for review',async()=>{
 const {api,window}=setup();window.QuilynRuntime={json:async path=>path==='data/registry.json'?{tracks:[{trackId:'PBA',modules:[{id:'BA-M01',file:'module'}]}]}:{practiceQuiz:questions}};
 const state=api.quizState({0:{selected:['A'],graded:true}},questions);assert.equal((await api.validateReferences({version:2,state:{[key]:state}})).length,0);
 state.answers.Q1.signature='old';assert.equal((await api.validateReferences({version:2,state:{[key]:state}})).length,1);
 state.answers.Q1.signature=api.quizSignature(questions[0]);state.answers.Q1.selected=['Z'];await assert.rejects(api.validateReferences({version:2,state:{[key]:state}}),/do not match/);
});
