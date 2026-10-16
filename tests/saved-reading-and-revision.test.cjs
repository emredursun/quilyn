const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){const values=new Map();let fail=false;const window={addEventListener(){},dispatchEvent(){},QuilynRuntime:{safeUrl:v=>v}},localStorage={get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:k=>values.get(k)??null,setItem(k,v){if(fail)throw Error('quota');values.set(k,v);},removeItem:k=>values.delete(k)};
 const context={window,localStorage,Date,TextEncoder,CustomEvent:class{},document:{addEventListener(){}}};for(const name of ['progress','study-plan','learning-history','settings'])vm.runInNewContext(fs.readFileSync('core/js/'+name+'.js','utf8').replace('global.PegaSettings = {','global.PegaSettings = {gather:gatherState,'),context);return {window,values,context,fail:()=>fail=true};}
const section={module:'SA-M01',section:'section-one',title:'First section'},concept={...section,concept:'Layers & Rulesets / A'};
test('section and concept bookmarks coexist with legacy module saves and round-trip through backup unchanged',()=>{
 const {window:w,values}=setup(),s=w.QuilynStudy;s.change('PSA',p=>{p.bookmarks=['SA-M01'];p.positions['SA-M01']={tab:'quiz',section:null,at:'2026-10-16T00:00:00Z'};});assert.equal(s.valid(s.read()),true);
 s.toggleReading('PSA',section);s.toggleReading('PSA',concept);assert.equal(s.preferences('PSA').savedSections.length,2);assert.equal(s.preferences('PSA').bookmarks[0],'SA-M01');assert.match(s.readingHref('PSA',concept),/section-one\/Layers%20%26%20Rulesets%20%2F%20A$/);
 const before=JSON.stringify(s.read()),backup=w.PegaSettings.gather();values.clear();w.QuilynProgress.applyBundle(backup);assert.equal(JSON.stringify(s.read()),before);
 s.toggleReading('PSA',concept);assert.equal(s.preferences('PSA').savedSections.length,1);assert.equal(s.preferences('PSA').positions['SA-M01'].tab,'quiz');assert.equal(s.preferences('PBA').savedSections,undefined);
});
test('invalid or duplicate reading bookmarks are rejected and quota failure keeps prior saves',()=>{
 const {window:w,fail}=setup(),s=w.QuilynStudy;s.toggleReading('PSA',section);const original=JSON.stringify(s.read());for(const extra of [{...concept,module:'../bad'},{...concept,section:'<script>'},{...concept,title:''},section]){const state=JSON.parse(original);state.tracks.PSA.savedSections.push(extra);assert.equal(s.valid(state),false);}
 fail();assert.equal(s.toggleReading('PSA',concept),false);assert.equal(JSON.stringify(s.read()),original);
});
test('missing section or renamed concept is preserved and reported during import reference checks',async()=>{
 const {window:w}=setup(),s=w.QuilynStudy;s.toggleReading('PSA',section);s.toggleReading('PSA',concept);const before=JSON.stringify(s.read());w.QuilynRuntime.json=async path=>path==='data/registry.json'?{tracks:[{trackId:'PSA',modules:[{id:'SA-M01',file:'lesson'}]}]}:{studyGuide:[{sectionId:'section-one',elements:[{type:'concept',term:'Renamed'}]}]};
 const unknown=await w.QuilynProgress.validateReferences(w.PegaSettings.gather());assert.deepEqual(Array.from(unknown),['PSA/SA-M01/section-one']);assert.equal(JSON.stringify(s.read()),before);
});
test('mock recommendations use explicit module references, exact course titles or confirmed topic metadata',()=>{
 const w=setup().window,track={trackId:'PSA',modules:[{id:'M1',name:'A lesson',studyArea:'Data & Integration'},{id:'M2',name:'Other',studyArea:'Security'}]},questions=[{a:[0],d:'Data and Integration'},{a:[1],d:'Security',sourceModuleId:'M2'},{a:[0],d:'A lesson'},{a:[0],d:'Unmapped <topic>'},{a:[0],d:'Security'}],answers=[[1],[0],[1],[1],[]],before=JSON.stringify(answers);
 const plan=w.QuilynJournal.revisionPlan(track,questions,answers);assert.equal(plan.unanswered,1);assert.ok(plan.topics.some(t=>t.href==='#library/area/Data%20%26%20Integration'));assert.ok(plan.topics.some(t=>t.href==='#PSA/M2/guide'));assert.ok(plan.topics.some(t=>t.href==='#PSA/M1/guide'));assert.equal(JSON.stringify(answers),before);
 const html=w.QuilynJournal.revisionHTML({unanswered:2,topics:[{title:'<topic>',count:1,href:'#library/search/x',specific:false}]});assert.match(html,/&lt;topic&gt;/);assert.doesNotMatch(html,/<topic>/);assert.match(html,/2 unanswered/);
 const blank=w.QuilynJournal.revisionPlan(track,questions,questions.map(()=>[]));assert.equal(blank.topics.length,0);assert.equal(blank.unanswered,5);
});
test('library topic filters and recommendation routes use the generated study area metadata',()=>{
 const window={};vm.runInNewContext(fs.readFileSync('core/js/library.js','utf8'),{window});const entries=JSON.parse(fs.readFileSync('data/library-index.json')).entries;
 const found=window.QuilynLibrary.find(entries,'PSA','module','','Security');assert.ok(found.length);assert.ok(found.every(e=>e.track==='PSA'&&e.studyArea==='Security'&&e.kind==='module'));
});
test('an explicit mock source module takes priority over another lesson with a matching domain title',()=>{
 const track={trackId:'T',modules:[{id:'M1',name:'Security',studyArea:'Security'},{id:'M2',name:'Access control',studyArea:'Security'}]},q={a:[0],d:'Security',sourceModuleId:'M2'};
 const plan=setup().window.QuilynJournal.revisionPlan(track,[q],[[1]]);assert.equal(plan.topics[0].href,'#T/M2/guide');
 const stale=setup().window.QuilynJournal.revisionPlan(track,[{...q,sourceModuleId:'removed'}],[[1]]);assert.equal(stale.topics[0].specific,false);
});
test('a delayed concept focus cannot affect a new route that reused the same content root',()=>{
 let frame;const guide={isConnected:true,hidden:false,querySelectorAll:()=>[]},status={textContent:'New page status'},root={isConnected:true,querySelector:s=>s==='#v-guide'?guide:status};
 const window={addEventListener(){},location:{hash:'#PSA/SA-M01/guide/section-one/Old'},requestAnimationFrame:fn=>frame=fn,QuilynProgress:{read:()=>({version:1,tracks:{}})}};
 const source=fs.readFileSync('core/js/study-plan.js','utf8').replace('global.QuilynStudy={','global.QuilynStudy={attachReadingSaves:attachReadingSaves,');vm.runInNewContext(source,{window,document:{addEventListener(){}}});window.QuilynStudy.attachReadingSaves(root,'PSA','SA-M01');guide.isConnected=false;frame();assert.equal(status.textContent,'New page status');
});
test('concept focus has a timer fallback when animation frames are unavailable or suspended',()=>{
 for(const frames of [true,false]){
  let frame,timer,focused=0,scrolled=0;const term={focus(){focused++;},scrollIntoView(){scrolled++;}},card={appendChild(b){b.parentNode=this;},querySelector:()=>term},heading={textContent:'First section',after(){}},section={getAttribute:()=> 'section-one',querySelector:()=>heading,querySelectorAll:()=>[card]},guide={isConnected:true,hidden:false,querySelectorAll:()=>[section]},status={};
  const root={isConnected:true,querySelector:s=>s==='#v-guide'?guide:status},window={addEventListener(){},location:{hash:'#PSA/SA-M01/guide/section-one/Term'},setTimeout:fn=>timer=fn,QuilynProgress:{read:()=>({version:1,tracks:{}})}};
  if(frames)window.requestAnimationFrame=fn=>frame=fn;
  term.textContent='Term';const source=fs.readFileSync('core/js/study-plan.js','utf8').replace('global.QuilynStudy={','global.QuilynStudy={attachReadingSaves:attachReadingSaves,');
  vm.runInNewContext(source,{window,document:{addEventListener(){},createElement:()=>({appendChild(b){b.parentNode=this;},setAttribute(){}})}});window.QuilynStudy.attachReadingSaves(root,'PSA','SA-M01');assert.equal(focused,0);timer();assert.equal(focused,1);assert.equal(scrolled,1);assert.equal(term.tabIndex,-1);if(frame)frame();assert.equal(focused,1);
 }
});
