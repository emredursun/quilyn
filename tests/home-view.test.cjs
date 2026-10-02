const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function view(){const window={};vm.runInNewContext(fs.readFileSync('core/js/home-view.js','utf8'),{window});return window.QuilynHome;}
function data(overrides){const next={id:'M1',name:'First <module>'};return Object.assign({track:{trackId:'PSA',trackName:'Track & learning',modules:[next]},next,returning:false,resuming:false,done:0,total:1,due:0,scores:[]},overrides);}
test('home distinguishes new, continuing, completed and unavailable learning without false readiness claims',()=>{
 const api=view(),fresh=api.render(data());assert.match(fresh,/Start learning/);assert.match(fresh,/0 of 1/);assert.match(fresh,/No scheduled cards due/);assert.match(fresh,/Your first practice exam awaits/);assert.match(fresh,/First &lt;module&gt;/);assert.match(fresh,/Track &amp; learning/);
 const active=api.render(data({returning:true,resuming:true,due:4,done:1,total:4,scores:[50,80]}));assert.match(active,/PICK UP WHERE YOU LEFT OFF/);assert.match(active,/Continue learning/);assert.match(active,/4 <span>cards due today/);assert.match(active,/value="25"/);assert.match(active,/Best practice result: 80%/);
 const complete=api.render(data({done:1}));assert.match(complete,/Revisit module/);assert.match(complete,/value="100"/);
 const empty=api.render(data({next:null,total:0,track:{trackId:'T',trackName:'Upcoming',modules:[],plannedModuleCount:10}}));assert.match(empty,/New learning is on the way/);assert.doesNotMatch(empty,/#T\//);assert.doesNotMatch(empty,/NaN|Infinity/);assert.match(empty,/0 of 10 planned modules/);
 for(const href of ['#plan','#plan/bookmarks','#history','#mistakes','#library','#updates','learn/','#mock','#review'])assert.ok(fresh.includes('href="'+href+'"'),href);
});
test('a late home feature response cannot overwrite a newer lesson or track route',async()=>{
 const source=fs.readFileSync('core/js/engine.js','utf8');const body=source.slice(source.indexOf('  function renderHome()'),source.indexOf('  function selectNextModule'));
 let release;const node={textContent:'',innerHTML:'',focus(){}},track={trackId:'PSA',trackName:'Track',modules:[]};
 const context={activeTrackId:'PSA',moduleRequest:1,getTrack:()=>track,setCrumbs(){},buildWeakAreaPanel:()=>'',selectNextModule:()=>null,isModuleComplete:()=>false,quizRecord:()=>null,document:{getElementById:()=>node},window:{PegaStore:{state:{tracks:{}}},QuilynProgress:{read:()=>({events:[]}),localDay:()=> '2026-10-02'},QuilynRuntime:{home:()=>new Promise(resolve=>release=resolve)},scrollTo(){}}};
 vm.createContext(context);vm.runInContext(body,context);context.renderHome();context.moduleRequest++;node.innerHTML='New route';release({render:()=> 'Old home'});await Promise.resolve();await Promise.resolve();assert.equal(node.innerHTML,'New route');
});
