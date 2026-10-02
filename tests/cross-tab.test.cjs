const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function make(shared){const events=new Map();let tick=null;const storage={getItem:k=>shared.get(k)??null,setItem:(k,v)=>shared.set(k,v),removeItem:k=>shared.delete(k)},window={setInterval(fn){tick=fn;},addEventListener(k,fn){const list=events.get(k)||[];list.push(fn);events.set(k,list);},dispatchEvent(e){(events.get(e.type)||[]).forEach(f=>f(e));}};const context={window,localStorage:storage,document:{addEventListener(){}},CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail;}},Date,Promise,Map,Set,WeakMap,Proxy,Reflect,console};vm.runInNewContext(fs.readFileSync('core/js/progress.js','utf8'),context);vm.runInNewContext(fs.readFileSync('core/js/store.js','utf8'),context);return {window,storage,tick(){tick();},event(key){window.dispatchEvent({type:'storage',key,newValue:shared.get(key)??null,storageArea:storage});}};}
test('a stale tab merges unrelated track changes before saving, even before its storage event arrives',async()=>{
 const shared=new Map(),a=make(shared),b=make(shared);a.window.PegaStore.state.tracks.PSA.mock.Exam=85;a.window.PegaStore.flush();b.window.PegaStore.state.tracks.PBA.mock.Other=72;b.window.PegaStore.flush();await Promise.resolve();const saved=JSON.parse(shared.get('pega_universal_state'));assert.equal(saved.tracks.PSA.mock.Exam,85);assert.equal(saved.tracks.PBA.mock.Other,72);
});
test('remote updates refresh stable store references without navigating the receiving tab or writing an echo',()=>{
 const shared=new Map(),a=make(shared),b=make(shared);const reference=b.window.PegaStore.state.tracks.PSA;let notices=0;b.window.PegaStore.watch(()=>notices++);a.window.PegaStore.state.activeTrack='PBA';a.window.PegaStore.state.tracks.PSA.mock.Exam=90;a.window.PegaStore.flush();const raw=shared.get('pega_universal_state');b.event('pega_universal_state');assert.equal(b.window.PegaStore.state.activeTrack,'PSA');assert.equal(reference.mock.Exam,90);assert.equal(b.window.PegaStore.state.tracks.PSA,reference);assert.equal(shared.get('pega_universal_state'),raw);assert.equal(notices,2);
 shared.set('pega_universal_state','{"tracks":"invalid"}');b.event('pega_universal_state');assert.equal(reference.mock.Exam,90);
});
test('a stale quiz or exam cannot overwrite or remove a newer session; reopening accepts the current version',()=>{
 const shared=new Map(),a=make(shared),b=make(shared),key='pq_state_#PSA/SA-M01';const empty={version:2,answers:{}},answered={version:2,answers:{Q1:{selected:['A'],graded:false,signature:'v1'}}};a.window.QuilynProgress.read(key,empty);b.window.QuilynProgress.read(key,empty);assert.ok(a.window.QuilynProgress.write(key,answered));assert.equal(b.window.QuilynProgress.write(key,empty),false);assert.equal(b.window.QuilynProgress.remove(key),false);assert.deepEqual(JSON.parse(shared.get(key)),answered);b.window.QuilynProgress.read(key,empty);assert.ok(b.window.QuilynProgress.write(key,empty));
 const exam='pegaMock_PSA_Mock Exam 1',value={name:'Mock Exam 1',answers:[[]],checked:[false],remaining:60};a.window.QuilynProgress.read(exam,null);b.window.QuilynProgress.read(exam,null);assert.ok(a.window.QuilynProgress.write(exam,value));assert.equal(b.window.QuilynProgress.write(exam,{...value,remaining:90}),false);
});
test('progress broadcasts only relevant same-origin storage changes',()=>{
 const shared=new Map(),a=make(shared),updates=[];a.window.addEventListener('quilyn-progress-external',e=>updates.push(e.detail.key));a.event('quilyn_study');a.event('unrelated-key');a.window.dispatchEvent({type:'storage',key:'quilyn_study',storageArea:{}});assert.deepEqual(updates,['quilyn_study']);
});

test('visible-tab fallback detects updates when the embedded browser omits storage events',()=>{
 const shared=new Map(),a=make(shared),b=make(shared),updates=[];b.window.addEventListener('quilyn-progress-external',e=>updates.push(e.detail.key));a.window.QuilynProgress.write('pega_theme','light');b.tick();assert.deepEqual(updates,['pega_theme']);b.tick();assert.equal(updates.length,1);b.window.QuilynProgress.write('pega_theme','dark');b.tick();assert.equal(updates.length,1);
});

test('mock conflict locks option clicks, grading and the answered counter before any save',()=>{
 const events={},writes=[],attrs={},classes=new Set(),counter={textContent:0},bar={style:{}},controls=[{disabled:false}];let refreshes=0,locks=0;
 const option={dataset:{j:'0'},classList:{add:c=>classes.add(c),toggle(c,on){on?classes.add(c):classes.delete(c);}},setAttribute:(k,v)=>attrs[k]=v};
 const card={querySelectorAll:()=>[option],querySelector:()=>controls[0]};
 const root={querySelector:s=>s==='#mv-ansCount'?counter:s==='#mv-prog'?bar:{prepend(){}},querySelectorAll:s=>s.includes('.opt')?[option]:controls};
 const window={addEventListener:(k,fn)=>events[k]=fn,PegaStore:{state:{activeTrack:'PSA'}},QuilynProgress:{write:(k,v)=>writes.push(v)}};
 const source=fs.readFileSync('core/js/mock-view.js','utf8').replace('})(window);',`window.testMock={pick,checkAnswer,updateBar,submitExam,doSubmit,prime:function(){mountedTrack='PSA';current='Exam';EXAMS={Exam:[{t:'single',o:['A'],a:[0]}]};answers=[[]];checked=[false];_root=window.root;examNav=window.nav;},answers:()=>answers,checked:()=>checked};})(window);`);
 window.root=root;window.nav={refresh(){refreshes++;},disable(){locks++;}};
 vm.runInNewContext(source,{window,HTMLElement:class{},customElements:{define(){}},document:{addEventListener(){},createElement:()=>({setAttribute(){},appendChild(){}})},clearInterval(){},Date});
 window.testMock.prime();option.onclick=()=>window.testMock.pick(0,0,card);
 events['quilyn-progress-external']({detail:{key:'pegaMock_PSA_Exam'}});
 option.onclick();window.testMock.checkAnswer(0,card);window.testMock.updateBar();window.testMock.submitExam(true);window.testMock.doSubmit(true);
 assert.equal(window.testMock.answers()[0].length,0);assert.equal(window.testMock.checked()[0],false);assert.equal(counter.textContent,0);assert.equal(refreshes,0);assert.equal(locks,1);assert.equal(writes.length,0);assert.equal(attrs['aria-disabled'],'true');assert.ok(classes.has('disabled'));assert.ok(!classes.has('sel'));
});

test('disabled exam navigation rejects stale handlers and stays disabled after refresh',()=>{
 const nodes={},cards=[{},{}];let saves=0;
 const nav={contains:()=>false,querySelector:s=>nodes[s]||(nodes[s]={}),querySelectorAll:()=>Object.values(nodes),scrollIntoView(){}};
 const root={querySelector:()=>({children:cards,before(){}})},window={};
 vm.runInNewContext(fs.readFileSync('core/js/learning-history.js','utf8'),{window,document:{createElement:()=>nav},Date});
 const config={index:0,view:'single',flags:[false,false],answers:[[],[]],save(){saves++;}};
 const api=window.QuilynJournal.examControls(root,config),next=nodes['#jl-next'].onclick,flag=nodes['#jl-flag'].onclick,jump=nodes['#jl-jump'].onchange,layout=nodes['#jl-layout'].onchange;
 api.disable();next();flag();jump.call({value:'1'});layout.call({value:'list'});api.refresh();
 assert.equal(config.index,0);assert.equal(config.view,'single');assert.equal(config.flags[0],false);assert.equal(saves,0);assert.ok(Object.values(nodes).every(n=>n.disabled));
});

test('reset suspension cancels scheduled store writes and rejects later progress writes',async()=>{
 const shared=new Map(),a=make(shared);a.window.PegaStore.state.tracks.PSA.mock.Exam=88;
 a.window.QuilynProgress.beginReset();a.window.PegaStore.discard();shared.clear();
 a.window.PegaStore.flush();await Promise.resolve();a.window.PegaStore.state.tracks.PSA.mock.Exam=99;await Promise.resolve();
 assert.equal(shared.size,0);assert.equal(a.window.QuilynProgress.write('quilyn_study',{version:1,tracks:{}}),false);assert.equal(a.window.QuilynProgress.archive('pq_state_#PSA/SA-M01',{version:2,answers:{}}),false);assert.equal(shared.size,0);
});
