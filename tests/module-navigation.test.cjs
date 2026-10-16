const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){const window={addEventListener(){},QuilynProgress:{read:()=>({version:1,tracks:{}})}};vm.runInNewContext(fs.readFileSync('core/js/study-plan.js','utf8'),{window,document:{addEventListener(){}}});return window.QuilynStudy;}
const track={trackId:'T',modules:[{id:'M1',name:'First <lesson>',studyArea:'Basics'},{id:'M2',name:'Second',studyArea:'Practice'},{id:'M3',name:'Third',studyArea:'Basics'},{id:'M4',name:'Fourth',studyArea:'Practice'},{id:'Soon',name:'Later',ready:false}]};
const progress={completedModules:['M1','M2'],quizRecords:{M1:{attempts:4,highScore:100,scoreHistory:[100,30,30,30]},M2:{attempts:1,highScore:90,scoreHistory:[90]}}};
test('module status uses recent results without revoking completion or changing module order',()=>{
 const api=setup(),before=JSON.stringify(progress),rows=api.moduleRows(track,progress,{M3:{tab:'guide'}},'M3');
 assert.deepEqual(Array.from(rows,r=>r.meta.id),['M1','M2','M3','M4','Soon']);assert.deepEqual(Array.from(rows,r=>r.number),[1,2,3,4,5]);assert.equal(rows[0].done,true);assert.equal(rows[0].weak,true);assert.equal(rows[1].weak,false);assert.equal(rows[2].started,true);assert.equal(rows[2].active,true);assert.equal(rows[3].started,false);assert.equal(JSON.stringify(progress),before);
});
test('opening a module alone does not claim learning progress',()=>{
 const rows=setup().moduleRows(track,{}, {},'M3');assert.equal(rows[2].active,true);assert.equal(rows[2].started,false);
});
function menu(activeId='M3'){const api=setup(),nodes={};const root={querySelector(s){return nodes[s]||(nodes[s]={hidden:false,focus(){},querySelectorAll:()=>[]});}};api.moduleNavigation(root,track,{...progress,quizRecords:{...progress.quizRecords,M3:{attempts:1,highScore:80}}},activeId);return {root,nodes};}
test('utility routes do not report a current module outside the filter',()=>{
 const {nodes}=menu('bookmarks');assert.equal(nodes['.sp-module-count'].textContent,'5 of 5 modules');
 const status=nodes['.sp-module-status'];status.value='review';status.onchange();assert.equal(nodes['.sp-module-count'].textContent,'1 of 5 modules');
 const actual=menu();actual.nodes['.sp-module-status'].value='review';actual.nodes['.sp-module-status'].onchange();assert.match(actual.nodes['.sp-module-count'].textContent,/Current module is outside this filter/);
});
test('filters keep original numbers, escape content and explain an empty result without changing stored progress',()=>{
 const {nodes}=menu(),status=nodes['.sp-module-status'],results=nodes['.sp-module-results'];assert.match(results.innerHTML,/First &lt;lesson&gt;/);assert.match(results.innerHTML,/>Coming soon</);assert.match(results.innerHTML,/aria-current="page"/);
 status.value='review';status.onchange();assert.match(results.innerHTML,/Completed · review suggested/);assert.doesNotMatch(results.innerHTML,/#T\/M2|#T\/M3|#T\/Soon/);assert.equal(nodes['.sp-module-explanation'].hidden,false);
 status.value='new';status.onchange();assert.match(results.innerHTML,/class="mnum">4</);assert.doesNotMatch(results.innerHTML,/#T\/M1|#T\/M3/);
 status.value='progress';status.onchange();assert.match(results.innerHTML,/#T\/M3/);assert.doesNotMatch(results.innerHTML,/#T\/M4/);
 nodes['.sp-module-clear'].onclick();assert.equal(status.value,'all');assert.match(results.innerHTML,/#T\/M4/);
});
test('topic grouping keeps each original module once, with the current topic open',()=>{
 const {nodes}=menu(),view=nodes['.sp-module-view'];view.value='topic';view.onchange();const html=nodes['.sp-module-results'].innerHTML;
 for(const m of track.modules)assert.equal(html.split('href="#T/'+m.id+'"').length-1,1,m.id);
 assert.match(html,/<details class="sp-module-group" open><summary>Basics/);assert.match(html,/<summary>Practice/);
});
test('all published modules have meaningful study areas and preserve stable identities',()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json'));let count=0;
 for(const t of registry.tracks){const groups=new Set();for(const m of t.modules){assert.equal(typeof m.studyArea,'string',m.id);assert.ok(m.studyArea.trim()&&m.studyArea!=='General',m.id);groups.add(m.studyArea);const data=JSON.parse(fs.readFileSync(m.file));assert.ok(data.practiceQuiz.every(q=>q.questionId));count++;}assert.ok(groups.size>=2,t.trackId);}
 assert.equal(count,registry.tracks.reduce((sum,t)=>sum+t.modules.length,0));
});

test('an existing partial quiz counts as in progress even when its backup has no reading position',()=>{
 const rows=setup().moduleRows(track,{}, {},null,{M4:true});assert.equal(rows[3].started,true);assert.equal(rows[3].done,false);assert.equal(rows[3].weak,false);
});

test('a late sidebar feature cannot overwrite the mock or a newer route',async()=>{
 const source=fs.readFileSync('core/js/engine.js','utf8'),body=source.slice(source.indexOf('  function renderSidebar()'),source.indexOf('  /* Router */'));
 let resolve,draws=0;const list={},elements={paProgFill:{style:{}},paProgLabel:{},paModList:list};
 const context={activeTrackId:'T',moduleRequest:1,getTrack:()=>track,isModuleComplete:()=>false,parseHash:()=>({moduleId:'M1'}),loadState:()=>({userProgress:{}}),esc:x=>x,document:{querySelector:()=>null,getElementById:id=>elements[id]},window:{QuilynRuntime:{personalization:()=>new Promise(r=>resolve=r)}}};
 vm.createContext(context);vm.runInContext(body,context);context.renderSidebar();context.moduleRequest++;list.innerHTML='Mock navigation';resolve({moduleNavigation(){draws++;}});await Promise.resolve();await Promise.resolve();assert.equal(draws,0);assert.equal(list.innerHTML,'Mock navigation');
});
