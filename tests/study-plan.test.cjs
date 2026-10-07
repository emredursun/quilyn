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
 const controls={},toolbar={setAttribute(){},querySelector(id){return controls[id]||(controls[id]={setAttribute(){},classList:{add(){}}});}},tab={dataset:{v:'guide'},click(){}};let headingTop=-10;const heading={textContent:'Section two',getBoundingClientRect:()=>({top:headingTop})};
 const root={isConnected:true,querySelector(selector){return selector==='.sp-section-bar'?{before(){},appendChild(){},getBoundingClientRect:()=>({bottom:140})}:tab;},querySelectorAll:()=>[heading]};context.document.createElement=()=>toolbar;
 s.attachLesson(root,'PSSA','M1');events.scroll();headingTop=900;events.scroll();s.leaveLesson();assert.equal(s.preferences('PSSA').positions.M1.section,'Section two');assert.equal(events.scroll,undefined);
});

test('guide and recap deep links use the same quiz storage slot as the module route',()=>{
 const window={location:{hash:'#PSSA/SSA-M01/guide'}};vm.runInNewContext(fs.readFileSync('core/js/quiz-engine.js','utf8').replace('global.PegaQuiz = {','global.PegaQuiz = {storageKey:storageKey,'),{window});
 const original=window.PegaQuiz.storageKey();assert.equal(original,'pq_state_#PSSA/SSA-M01');for(const hash of ['#PSSA/SSA-M01','#PSSA/SSA-M01/quiz','#PSSA/SSA-M01/recap']){window.location.hash=hash;assert.equal(window.PegaQuiz.storageKey(),original);}
});

function lessonHarness(env,{saved,requestedTab,headingTops=[-500,155]}={}){
 const events={},controls={},moved=new Set();let active='guide',focus=null;const tabs=Object.fromEntries(['guide','pitfalls','quiz','recap'].map(v=>[v,{dataset:{v},click(){active=v;},focus(){focus=v;}}]));
 if(saved)env.s.change('PSA',p=>p.positions.M1=saved);
 const toolbar={setAttribute(){},querySelector(id){if(moved.has(id))return null;return controls[id]||(controls[id]={id,setAttribute(){},classList:{add(){}}});}};
 const bar={before(){},appendChild(node){moved.add(node.id);},getBoundingClientRect:()=>({bottom:140})};
 const headings=['First section','Saved section'].map((text,i)=>({textContent:text,getBoundingClientRect:()=>({top:headingTops[i]}),focus(){focus=text;},scrollIntoView(){headingTops[i]=155;}}));
 const root={isConnected:true,querySelector(selector){if(selector==='.sp-section-bar')return bar;if(selector==='.pa-tabs button.active')return tabs[active];const match=/data-v="([^"]+)"/.exec(selector);return match?tabs[match[1]]:null;},querySelectorAll:()=>headings};
 env.context.document.createElement=()=>toolbar;env.context.window.addEventListener=(name,fn)=>events[name]=fn;env.context.window.removeEventListener=name=>delete events[name];
 env.s.attachLesson(root,'PSA','M1',requestedTab);return {controls,events,headings,active:()=>active,focus:()=>focus};
}
test('resuming under the sticky bar keeps the same section on a subsequent save',()=>{
 const env=setup(),saved={tab:'guide',section:'Saved section',at:'2026-10-02T12:00:00Z'},h=lessonHarness(env,{saved});
 h.controls['#sp-resume'].onclick();assert.equal(h.focus(),'Saved section');env.s.leaveLesson();assert.equal(env.s.preferences('PSA').positions.M1.section,'Saved section');
 assert.deepEqual([...env.values.keys()],['quilyn_study']);
});
test('explicit guide link overrides saved tab, while Resume restores quiz without changing mastery',()=>{
 const env=setup(),saved={tab:'quiz',section:null,at:'2026-10-02T12:00:00Z'},h=lessonHarness(env,{saved,requestedTab:'guide'});
 assert.equal(h.active(),'guide');h.controls['#sp-resume'].onclick();assert.equal(h.active(),'quiz');assert.equal(h.focus(),'quiz');env.s.leaveLesson();assert.equal(env.s.preferences('PSA').positions.M1.tab,'quiz');assert.deepEqual([...env.values.keys()],['quilyn_study']);
});

test('discarding a lesson removes its listeners without saving on later pagehide',()=>{
 const env=setup(),h=lessonHarness(env);h.events.scroll();env.s.discardLesson();env.values.clear();env.s.leaveLesson();
 assert.equal(env.values.size,0);assert.equal(h.events.scroll,undefined);assert.equal(h.events['quilyn-progress-external'],undefined);
});

test('study workspace separates saved collection from daily planning and escapes bookmark content',()=>{
 const env=setup();vm.runInNewContext(fs.readFileSync('core/js/study-plan.js','utf8').replace('global.QuilynStudy={','global.QuilynStudy={workspace:workspace,'),env.context);
 const s=env.context.window.QuilynStudy,p=preferences(),t={...track,trackName:'Track <unsafe>'},plan=s.recommend(t,user(),{mistakes:{}},p,date),saved=[{id:'M1',name:'Saved <script>lesson</script>'}];
 const bookmarks=s.workspace(t,p,plan,saved,[],'Estimate','', 'bookmarks',date);
 assert.ok(bookmarks.includes('id="sp-search"'));assert.ok(bookmarks.includes('aria-current="page"'));assert.ok(bookmarks.includes('data-remove="M1"'));assert.ok(bookmarks.includes('&lt;script&gt;'));assert.ok(!bookmarks.includes('<script>'));assert.ok(!bookmarks.includes('id="sp-form"'));assert.ok(!bookmarks.includes('TODAY’S FOCUS'));
 const daily=s.workspace(t,p,plan,saved,[],'Estimate','',null,date);assert.ok(daily.includes('id="sp-form"'));assert.ok(daily.includes('Suggested time, not completed time'));assert.ok(daily.includes('How the estimate works'));assert.ok(!daily.includes('data-remove='));assert.equal((daily.match(/>Start activity /g)||[]).length,1);
 const empty=s.workspace(t,p,plan,[],[],'Estimate','', 'bookmarks',date);assert.ok(empty.includes('Build your revision shortlist'));assert.ok(empty.includes('href="#home"'));
});

test('PSA legacy SRS IDs count scheduled cards without migrating saved identities',()=>{
 const {s,p}=setup(),cards={'m01::Q1':{dueDate:date},'m02::Q1':{dueDate:'2099-01-01'},'m99::Q1':{dueDate:date}};
 const psa={trackId:'PSA',modules:[{id:'SA-M01',name:'First'},{id:'SA-M02',name:'Second'}]};
 const state={tracks:{PSA:{srs:{cards}}}},before=JSON.stringify(cards);
 const plan=s.recommend(psa,state,{mistakes:{}},preferences(),date);
 assert.equal(plan.due,1);assert.equal(plan.actions[0].id,'review');assert.equal(JSON.stringify(cards),before);
 assert.equal(p.moduleId('PSA','m48'),'SA-M48');assert.equal(p.moduleId('PSA','m49'),'m49');assert.equal(p.moduleId('PBA','m01'),'m01');
});
