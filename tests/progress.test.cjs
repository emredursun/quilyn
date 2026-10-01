const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup() {
  const values = new Map(), notices = [];
  let failingKey = null;
  const localStorage = { getItem:k=>values.get(k) ?? null, removeItem:k=>values.delete(k),
    setItem(k,v) { if (k === failingKey) throw Error('quota'); values.set(k,v); } };
  const window = {dispatchEvent:e=>notices.push(e.detail)};
  vm.runInNewContext(fs.readFileSync('core/js/progress.js','utf8'), {window,localStorage,Date,crypto:require('node:crypto').webcrypto,
    CustomEvent:class {constructor(type,options){this.detail=options.detail;}}});
  return {api:window.QuilynProgress,values,notices,fail:k=>{failingKey=k;},window};
}
const validLms = () => ({userProgress:{PBA:{completedModules:['BA-M01'],quizRecords:{'BA-M01':{highScore:80,attempts:1,lastAttempted:'2026-10-01T10:00:00Z',scoreHistory:[80]}}}}});
test('backup validates nested scores, SRS, quiz and exam values', () => {
  const {api} = setup();
  assert.equal(api.validEntry('pega_lms_state',validLms()),true);
  const bad=validLms();bad.userProgress.PBA.quizRecords['BA-M01'].highScore=101;
  assert.equal(api.validEntry('pega_lms_state',bad),false);
  assert.equal(api.validEntry('pega_universal_state',{activeTrack:'PBA',tracks:{PBA:{srs:{cards:{x:{box:6,dueDate:'2026-10-01',totalSeen:1,totalCorrect:1}}}}}}),false);
  assert.equal(api.validEntry('pq_state_#PBA/BA-M01',{0:{selected:'A',graded:false}}),false);
  assert.equal(api.validEntry('pegaMock_PBA_Exam',{name:'Exam',remaining:60,answers:[[0]],checked:[false]}),true);
  assert.equal(api.validEntry('pegaMock_PBA_Exam',{name:'Exam',remaining:60,answers:[[0,0]],checked:[false]}),false);
  assert.throws(()=>api.validateBundle(JSON.parse('{"version":2,"state":{"pega_lms_state":{"userProgress":{},"__proto__":{}}}}')));
});
test('import validates before writing and recovers earlier writes after quota failure', () => {
  const {api,values,fail}=setup();values.set('pega_theme','dark');
  assert.throws(()=>api.applyBundle({version:2,state:{pega_theme:'light',pega_lms_state:{userProgress:[]}}}));
  assert.equal(values.get('pega_theme'),'dark');
  fail('pega_lms_state');
  assert.throws(()=>api.applyBundle({version:2,state:{pega_theme:'light',pega_lms_state:validLms()}}),/restored/);
  assert.equal(values.get('pega_theme'),'dark');
});
test('corrupt saved data remains recoverable and write failure is visible', () => {
  const {api,values,notices,fail}=setup();values.set('pega_lms_state','{broken');
  assert.deepEqual(JSON.parse(JSON.stringify(api.read('pega_lms_state',{userProgress:{}}))),{userProgress:{}});
  assert.equal(values.get('pega_lms_state'),'{broken');
  fail('pega_theme');assert.equal(api.write('pega_theme','light'),false);
  assert.equal(notices.length,2);
});
test('study events use local calendar day and event ID deduplication', () => {
  const {api,values}=setup();api.activity('quiz','PBA','BA-M01','attempt-1');api.activity('quiz','PBA','BA-M01','attempt-1');
  const events=JSON.parse(values.get('quilyn_activity')).events;
  assert.equal(events.length,1);assert.equal(events[0].day,api.localDay(new Date()));
  const d=new Date(2026,9,1,23,59);assert.equal(api.localDay(d),'2026-10-01');d.setMinutes(d.getMinutes()+2);assert.equal(api.localDay(d),'2026-10-02');
});
test('a new write preserves an unreadable original for export recovery', () => {
  const {api,values}=setup();values.set('pega_lms_state','{broken');
  assert.equal(api.write('pega_lms_state',validLms()),true);
  assert.equal(values.get('quilyn_recovery_pega_lms_state'),'{broken');
  assert.equal(JSON.parse(values.get('pega_lms_state')).userProgress.PBA.quizRecords['BA-M01'].highScore,80);
});
test('known quiz and mock answers are checked against actual content', async () => {
  const {api,window}=setup();window.QuilynRuntime={json:async path=>{
    if(path==='data/registry.json')return {tracks:[{trackId:'PBA',modules:[{id:'BA-M01',file:'data/module.json'}]}]};
    if(path==='data/module.json')return {practiceQuiz:[{type:'single-select',options:[{id:'A'},{id:'B'}]}]};
    return {PBA:{Exam:[{t:'single',o:['A','B']}]}};
  }};
  await assert.rejects(api.validateReferences({version:2,state:{'pq_state_#PBA/BA-M01':{0:{selected:['Z'],graded:false}}}}),/do not match/);
  await assert.rejects(api.validateReferences({version:2,state:{pegaMock_PBA_Exam:{name:'Exam',remaining:30,answers:[[2]],checked:[false]}}}),/do not match/);
  const unmatched=await api.validateReferences({version:2,state:{'pq_state_#PBA/OLD':{}}});
  assert.equal(unmatched.length,1);
});
