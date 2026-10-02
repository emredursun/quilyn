const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){const values=new Map(),notices=[];let fail=false;const window={addEventListener(){},dispatchEvent:e=>notices.push(e.detail)};
 const context={window,Date,Set,Map,TextEncoder,document:{addEventListener(){}},CustomEvent:class{constructor(t,o){this.detail=o.detail;}},localStorage:{get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:k=>values.get(k)??null,removeItem:k=>values.delete(k),setItem(k,v){if(fail)throw Error('quota');values.set(k,v);}}};
 for(const file of ['progress','study-plan'])vm.runInNewContext(fs.readFileSync('core/js/'+file+'.js','utf8'),context);
 return {s:window.QuilynStudy,p:window.QuilynProgress,context,values,notices,fail(){fail=true;}};
}
const date='2026-10-02',track={trackId:'PSSA',modules:[{id:'M1',name:'First'},{id:'M2',name:'Second'},{id:'M3',name:'Third'},{id:'Soon',name:'Unavailable',ready:false}],exam:{timeMinutes:90}};
const preferences=()=>({minutes:30,examDate:null,bookmarks:[],positions:{},skipped:{day:null,ids:[]}});
const user=()=>({lms:{userProgress:{PSSA:{completedModules:[],quizRecords:{}}}},tracks:{PSSA:{srs:{cards:{}}}}});
test('fresh plans stay within every supported time budget and exclude unavailable content',()=>{
 const {s}=setup();for(const minutes of [10,15,20,30,45,60,90,120]){
  const plan=s.recommend(track,user(),{mistakes:{}},{...preferences(),minutes},date);
  assert.ok(plan.used<=minutes);assert.equal(plan.used,plan.actions.reduce((sum,a)=>sum+a.minutes,0));assert.equal(new Set(plan.actions.map(a=>a.id)).size,plan.actions.length);assert.ok(plan.actions.every(a=>!a.url.includes('Soon')));
 }
 assert.equal(s.recommend({...track,modules:[]},user(),{mistakes:{}},preferences(),date).actions.length,0);
});
test('due reviews and active mistakes precede weak modules; later scores update recommendations',()=>{
 const {s}=setup(),u=user();u.tracks.PSSA.srs.cards={'M1::Q1':{dueDate:date},'M2::Q1':{dueDate:'2099-01-01'},'Gone::Q1':{dueDate:date}};
 u.lms.userProgress.PSSA.quizRecords.M2={scoreHistory:[95,40,20]};
 const journal={mistakes:{active:{resolved:false,snapshot:{track:'PSSA'}},resolved:{resolved:true,snapshot:{track:'PSSA'}},other:{resolved:false,snapshot:{track:'PBA'}}}};
 const plan=s.recommend(track,u,journal,preferences(),date);assert.deepEqual(Array.from(plan.actions,a=>a.id),['review','mistakes','lesson:M2']);assert.equal(plan.due,1);assert.equal(plan.mistakes,1);assert.match(plan.actions[2].reason,/52%/);assert.match(plan.actions[2].url,/\/guide$/);
 u.lms.userProgress.PSSA.quizRecords.M2.scoreHistory=[90,90,90];assert.equal(s.recommend(track,u,journal,preferences(),date).weak,0);
});
test('skips are local to the day and the track, never marking modules complete',()=>{
 const {s}=setup(),p=preferences(),u=user();p.skipped={day:date,ids:['lesson:M1']};
 assert.ok(!s.recommend(track,u,{mistakes:{}},p,date).actions.some(a=>a.id==='lesson:M1'));
 assert.equal(s.recommend(track,u,{mistakes:{}},p,'2026-10-03').actions[0].id,'lesson:M1');assert.equal(u.lms.userProgress.PSSA.completedModules.length,0);
 s.change('PSSA',profile=>{profile.skipped=p.skipped;});assert.equal(s.preferences('PBA').skipped.ids.length,0);
});
test('date calculations include today and are independent of daylight saving transitions',()=>{
 const {s}=setup(),p={...preferences(),examDate:'2026-10-25'};const plan=s.recommend(track,user(),{mistakes:{}},p,'2026-10-24');assert.equal(plan.days,2);assert.equal(plan.capacity,60);
 p.examDate='2026-10-02';assert.equal(s.recommend(track,user(),{mistakes:{}},p,date).days,1);
 assert.equal(s.recommend(track,user(),{mistakes:{}},p,'2026-10-04').capacity,0);
});
test('completed tracks suggest periodic recall or a full mock only when it fits',()=>{
 const {s}=setup(),u=user();u.lms.userProgress.PSSA.completedModules=['M1','M2','M3'];const short=s.recommend(track,u,{mistakes:{}},preferences(),date);assert.match(short.actions[0].id,/^recap:/);assert.match(short.actions[0].url,/\/recap$/);assert.ok(!short.actions.some(a=>a.id==='mock'));
 assert.equal(s.recommend(track,u,{mistakes:{}},{...preferences(),minutes:90},date).actions[0].id,'mock');
});
test('study preferences, bookmarks and positions round-trip through Settings backup',()=>{
 const {s,p,context,values}=setup();s.change('PSSA',profile=>{profile.examDate='2026-12-01';profile.minutes=45;profile.bookmarks=['M1'];profile.positions.M1={tab:'quiz',section:'Security rules',at:'2026-10-02T12:00:00Z'};});
 vm.runInNewContext(fs.readFileSync('core/js/settings.js','utf8').replace('global.PegaSettings = {','global.PegaSettings = {gatherState:gatherState,'),context);
 const bundle=context.window.PegaSettings.gatherState();assert.deepEqual(Array.from(p.validateBundle(bundle)),['quilyn_study']);const expected=JSON.stringify(s.read());values.clear();p.applyBundle(bundle);assert.equal(JSON.stringify(s.read()),expected);assert.equal(s.preferences('PBA').bookmarks.length,0);
});
test('invalid dates, duplicate bookmarks, unsafe IDs and malformed positions are rejected',()=>{
 const {s,p}=setup();s.change('PSSA',profile=>{profile.bookmarks=['M1'];});const state=s.read();
 for(const mutate of [s=>s.tracks.PSSA.examDate='2026-02-30',s=>s.tracks.PSSA.minutes=-1,s=>s.tracks.PSSA.bookmarks.push('M1'),s=>s.tracks.PSSA.bookmarks=['<script>'],s=>s.tracks.PSSA.positions.M1={tab:'invalid',at:'bad',section:null}]){const bad=structuredClone(state);mutate(bad);assert.equal(p.validEntry('quilyn_study',bad),false);}
 assert.equal(p.validEntry('quilyn_study',JSON.parse('{"version":1,"tracks":{"__proto__":{}}}')),false);
});
test('quota errors preserve saved preferences and bookmarks',()=>{
 const {s,fail,notices}=setup();s.change('PSSA',p=>p.minutes=45);fail();assert.equal(s.change('PSSA',p=>p.minutes=60),false);assert.equal(s.preferences('PSSA').minutes,45);assert.ok(notices.length);
});

test('unknown bookmark references are preserved and reported during backup import',async()=>{
 const {s,p,context}=setup();s.change('PSSA',profile=>profile.bookmarks=['M1','Removed']);context.window.QuilynRuntime={json:async()=>({tracks:[track]})};
 const unknown=await p.validateReferences({version:2,state:{quilyn_study:s.read()}});assert.deepEqual(Array.from(unknown),['PSSA/Removed']);assert.equal(s.preferences('PSSA').bookmarks.length,2);
});
test('scrolling back to the toolbar does not erase the last reading section and listeners are cleaned up',()=>{
 const {s,context}=setup();const events={};context.window.addEventListener=(name,fn)=>events[name]=fn;context.window.removeEventListener=(name,fn)=>{if(events[name]===fn)delete events[name];};
 const controls={},toolbar={querySelector(id){return controls[id]||(controls[id]={setAttribute(){}});}},tab={dataset:{v:'guide'},click(){}};let headingTop=-10;const heading={textContent:'Section two',getBoundingClientRect:()=>({top:headingTop})};
 const root={isConnected:true,querySelector(selector){return selector==='.pa-tabs'?{before(){}}:tab;},querySelectorAll:()=>[heading]};context.document.createElement=()=>toolbar;
 s.attachLesson(root,'PSSA','M1');events.scroll();headingTop=900;events.scroll();s.leaveLesson();assert.equal(s.preferences('PSSA').positions.M1.section,'Section two');assert.equal(events.scroll,undefined);
});

test('guide and recap deep links use the same quiz storage slot as the module route',()=>{
 const window={location:{hash:'#PSSA/SSA-M01/guide'}};vm.runInNewContext(fs.readFileSync('core/js/quiz-engine.js','utf8').replace('global.PegaQuiz = {','global.PegaQuiz = {storageKey:storageKey,'),{window});
 const original=window.PegaQuiz.storageKey();assert.equal(original,'pq_state_#PSSA/SSA-M01');for(const hash of ['#PSSA/SSA-M01','#PSSA/SSA-M01/quiz','#PSSA/SSA-M01/recap']){window.location.hash=hash;assert.equal(window.PegaQuiz.storageKey(),original);}
});
