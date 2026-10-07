const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('import teardown stops a live exam without overwriting imported answers',()=>{
  const writes=[];
  const window={PegaStore:{state:{activeTrack:'PBA'}},QuilynProgress:{write:(key,value)=>writes.push({key,value})}};
  let source=fs.readFileSync('core/js/mock-view.js','utf8');
  source=source.replace('})(window);', 'window.primeExam = function(){current="Exam";mountedTrack="PBA";_root={};paused=true;remaining=50;examFinished=false;answers=[[1]];checked=[false];}; })(window);');
  vm.runInNewContext(source,{window,HTMLElement:class{},customElements:{define(){}},clearInterval(){},
    document:{addEventListener(){},getElementById:()=>null,querySelectorAll:()=>[]},console,Date});
  window.primeExam();window.MockView.unmount(true);assert.equal(writes.length,0);
  window.primeExam();window.MockView.discard();window.MockView.flush();assert.equal(writes.length,0);
  window.primeExam();window.MockView.unmount();assert.equal(writes.length,1);
  assert.equal(writes[0].key,'pegaMock_PBA_Exam');assert.equal(writes[0].value.remaining,50);
});
test('track switch mounts the newly selected bank when new connection precedes old disconnection',async()=>{
  let MockElement;
  const mounted=[];
  const window={PegaStore:{state:{activeTrack:'PSA'}},QuilynProgress:{write(){}},
    QuilynRuntime:{json:async path=>path.includes('mock-exams')?{PSA:{Old:[]},PBA:{New:[]}}:{tracks:[{trackId:'PSA'},{trackId:'PBA'}]}}};
  let source=fs.readFileSync('core/js/mock-view.js','utf8');
  source=source.replace('mount(self, document.getElementById(\'paModList\'));','window.recordMount(track,Object.keys(EXAMS));');
  source=source.replace('})(window);','window.primeOldTrack=function(){mountedTrack="PSA";}; })(window);');
  window.recordMount=(track,exams)=>mounted.push({track,exams:Array.from(exams)});
  vm.runInNewContext(source,{window,HTMLElement:class{},customElements:{define(name,cls){MockElement=cls;}},
    clearInterval(){},document:{addEventListener(){},getElementById:()=>null,querySelectorAll:()=>[]},console,Date});
  window.primeOldTrack();window.PegaStore.state.activeTrack='PBA';
  const replacement=new MockElement();replacement.isConnected=true;replacement.connectedCallback();
  window.MockView.unmount();
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(mounted,[{track:'PBA',exams:['New']}]);
});
test('shell unmounts old views before replacing their custom elements',()=>{
  const calls=[];
  const content={set innerHTML(value){calls.push('replace:'+value);}};
  const sidebar={};
  const window={MockView:{unmount(){calls.push('unmount:mock');}},ReviewView:{unmount(){calls.push('unmount:review');}}};
  const document={readyState:'complete',documentElement:{getAttribute(){return 'light';}},querySelector(){return null;},
    querySelectorAll(){return [];},getElementById(id){return id==='paContent'?content:id==='paModList'?sidebar:null;}};
  vm.runInNewContext(fs.readFileSync('core/js/app-shell.js','utf8'),{window,document});
  window.QuilynShell.renderMode('mock');
  assert.deepEqual(calls.slice(0,3),['unmount:mock','unmount:review','replace:<pega-mock-view></pega-mock-view>']);
  assert.equal(sidebar.textContent,'Loading…');
});

test('review and mock transitions clear stale lesson breadcrumbs and browser titles',()=>{
 const crumbs={title:'PSA / Old lesson',_paTrack:'PSA',_paModule:'Old lesson'},content={};let disconnected=0;
 const window={_paCrumbObs:{disconnect(){disconnected++;}}};
 const document={readyState:'complete',title:'Old lesson — Quilyn',documentElement:{getAttribute:()=> 'light'},querySelector:()=>null,querySelectorAll:()=>[],getElementById:id=>id==='paCrumbs'?crumbs:id==='paContent'?content:null};
 vm.runInNewContext(fs.readFileSync('core/js/app-shell.js','utf8'),{window,document});
 window.QuilynShell.renderMode('review');assert.equal(disconnected,1);assert.equal(window._paCrumbObs,null);assert.equal(crumbs._paModule,null);assert.equal(crumbs.title,'Smart Review');assert.equal(document.title,'Smart Review — Quilyn');
 window.QuilynShell.renderMode('mock');assert.equal(crumbs.title,'Mock Exams');assert.equal(document.title,'Mock Exams — Quilyn');
});
