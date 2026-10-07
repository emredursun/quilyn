const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('Smart Review replaces banks without refresh when the new element connects before old disconnection',async()=>{
 let Element;const shown=[];const window={PegaStore:{state:{activeTrack:'PSA',tracks:{}}},QuilynRuntime:{learning:async()=>{},json:async path=>path==='data/registry.json'?{tracks:['PSA','PSSA','PBA'].map(t=>({trackId:t,modules:[{id:t+'-M1',file:t}]}))}:{moduleId:path+'-M1',practiceQuiz:[{questionId:path+'-Q1'}]}}};
 let source=fs.readFileSync('core/js/review-view.js','utf8').replace('  function renderDashboard() {','  function renderDashboard() {window.shown(getTrack(),Object.keys(cardBank));return;');
 window.shown=(track,keys)=>shown.push({track,keys:Array.from(keys)});
 vm.runInNewContext(source,{window,Date,Math,HTMLElement:class{constructor(){this.owned={querySelector(){return null;}};}querySelector(){return this.owned;}contains(root){return root===this.owned;}},customElements:{define(name,cls){Element=cls;}},document:{getElementById(id){return id==='paContent'?{focus(){}}:{innerHTML:''};}}});
 let old=new Element();old.connectedCallback();await new Promise(r=>setImmediate(r));
 for(const track of ['PSSA','PBA','PSA']){window.PegaStore.state.activeTrack=track;const next=new Element();next.connectedCallback();old.disconnectedCallback();await new Promise(r=>setImmediate(r));old=next;}
 assert.deepEqual(shown.map(s=>s.track),['PSA','PSSA','PBA','PSA']);assert.deepEqual(shown.map(s=>s.keys),['PSA','PSSA','PBA','PSA'].map(t=>[t+'-M1::'+t+'-Q1']));
 old.disconnectedCallback();assert.equal(typeof window.ReviewView.unmount,'function');
});
test('late responses from the old track cannot populate a newly mounted review',async()=>{
 let Element,release;const shown=[];const window={PegaStore:{state:{activeTrack:'PSA',tracks:{}}},QuilynRuntime:{json:path=>path==='data/registry.json'?Promise.resolve({tracks:['PSA','PSSA'].map(t=>({trackId:t,modules:[{id:t,file:t}]}))}):path==='PSA'?new Promise(r=>release=r):Promise.resolve({moduleId:'PSSA',practiceQuiz:[{questionId:'New'}]})}};
 let source=fs.readFileSync('core/js/review-view.js','utf8').replace('  function renderDashboard() {','  function renderDashboard() {window.shown(Object.keys(cardBank));return;');window.shown=keys=>shown.push(Array.from(keys));
 vm.runInNewContext(source,{window,Date,Math,HTMLElement:class{constructor(){this.owned={querySelector(){return null;}};}querySelector(){return this.owned;}contains(root){return root===this.owned;}},customElements:{define(n,cls){Element=cls;}},document:{getElementById:()=>({focus(){}})}});
 const old=new Element();old.connectedCallback();await new Promise(r=>setImmediate(r));window.PegaStore.state.activeTrack='PSSA';const next=new Element();next.connectedCallback();old.disconnectedCallback();release({moduleId:'PSA',practiceQuiz:[{questionId:'Old'}]});await new Promise(r=>setImmediate(r));assert.deepEqual(shown,[['PSSA::New']]);
});

test('PSA review keeps legacy SRS keys but uses registry IDs for domain and lesson feedback',async()=>{
 let Element,bank,domain;const cards={'m01::Q1':{box:2,dueDate:'2026-10-01',totalSeen:1,totalCorrect:1}};
 const window={PegaStore:{state:{activeTrack:'PSA',tracks:{PSA:{srs:{cards}}}}},QuilynRuntime:{json:async path=>path==='data/registry.json'?{tracks:[{trackId:'PSA',modules:[{id:'SA-M01',file:'lesson',examDomain:'Application Development'}]}]}:{moduleId:'m01',practiceQuiz:[{questionId:'Q1'}]}}};
 window.shown=(b,d)=>{bank=b;domain=d;};
 const source=fs.readFileSync('core/js/review-view.js','utf8').replace('  function renderDashboard() {','  function renderDashboard() {window.shown(cardBank,MOD_DOMAIN);return;');
 vm.runInNewContext(source,{window,Date,Math,HTMLElement:class{constructor(){this.owned={querySelector(){return null;}};}querySelector(){return this.owned;}contains(root){return root===this.owned;}},customElements:{define(n,cls){Element=cls;}},document:{getElementById:()=>({focus(){}})}});
 new Element().connectedCallback();await new Promise(r=>setImmediate(r));
 assert.deepEqual(Object.keys(bank),['m01::Q1']);assert.equal(bank['m01::Q1'].moduleId,'SA-M01');assert.equal(domain['SA-M01'],'Application Development');assert.equal(cards['m01::Q1'].box,2);
});
test('review confidence hides and refuses grading when multi-select count becomes invalid',()=>{
 function el(id){const classes=new Set(),handlers={};return {style:{},classList:{contains:v=>classes.has(v),add:v=>classes.add(v),remove:v=>classes.delete(v),toggle(v,on){if(on)classes.add(v);else classes.delete(v);}},getAttribute:()=>id,addEventListener:(n,f)=>handlers[n]=f,click:()=>handlers.click(),querySelector:()=>null};}
 const opts=['A','B','C'].map(el),confidence=el('sure'),wrap=el(),qn={querySelectorAll:s=>s==='.opt'?opts:[confidence],querySelector:()=>null};
 const root={querySelector:s=>s==='#rv-qcontainer'?qn:s==='#rv-conf-wrap'?wrap:null};let recorded=0,activity=0;
 const window={PegaStore:{state:{activeTrack:'PSA'}},QuilynProgress:{localDay:()=> '2026-10-07',activity:()=>activity++},QuilynJournal:{feedbackHTML:()=>'',quizQuestion:()=>({}),record:()=>recorded++}};
 const question={type:'multi-select',scenario:'Choose two',options:['A','B','C'].map(id=>({id,text:id})),correctOptions:['A','B'],rationale:''};
 const source=fs.readFileSync('core/js/review-view.js','utf8').replace('  global.ReviewView=', '  global.testReview=function(root,q){_root=root;srs={cards:{},surpriseIds:[]};cardBank={key:{moduleId:"SA-M01",q:q}};session=["key"];renderQ(0);};\n  global.ReviewView=');
 vm.runInNewContext(source,{window,Date,Math,HTMLElement:class{},customElements:{define(){}}});window.testReview(root,question);
 opts[0].click();assert.equal(wrap.classList.contains('show'),false);confidence.click();assert.equal(recorded,0);
 opts[1].click();assert.equal(wrap.classList.contains('show'),true);
 opts[0].click();assert.equal(wrap.classList.contains('show'),false);confidence.click();assert.equal(recorded,0);assert.equal(activity,0);
 opts[0].click();opts[2].click();assert.equal(wrap.classList.contains('show'),false);confidence.click();assert.equal(recorded,0);
 opts[2].click();confidence.click();assert.equal(recorded,1);assert.equal(activity,1);confidence.click();opts[2].click();assert.equal(recorded,1);
});

test('each real track domain overview accounts for every loaded review card and has no empty inherited domains',async()=>{
 const registry=JSON.parse(fs.readFileSync('data/registry.json','utf8'));let Element;const grid={innerHTML:''},sidebar={innerHTML:'',querySelector:()=>({addEventListener(){}})};
 const window={PegaStore:{state:{activeTrack:'PSA',tracks:{}}},QuilynProgress:{localDay:()=> '2026-10-07'},QuilynRuntime:{json:async path=>path==='data/registry.json'?registry:JSON.parse(fs.readFileSync(path,'utf8'))}};
 vm.runInNewContext(fs.readFileSync('core/js/review-view.js','utf8'),{window,Date,Math,HTMLElement:class{constructor(){this.owned={querySelector:s=>s==='#rv-domain-grid'?grid:null};}querySelector(){return this.owned;}contains(root){return root===this.owned;}},customElements:{define(n,cls){Element=cls;}},document:{getElementById:id=>id==='paContent'?{focus(){}}:id==='paModList'?sidebar:null}});
 let old;for(const track of registry.tracks){window.PegaStore.state.activeTrack=track.trackId;const current=new Element();current.connectedCallback();if(old)old.disconnectedCallback();await new Promise(r=>setImmediate(r));old=current;
  const expected=track.modules.filter(m=>m.ready!==false).reduce((n,m)=>n+JSON.parse(fs.readFileSync(m.file,'utf8')).practiceQuiz.length,0);
  const counts=[...grid.innerHTML.matchAll(/0% \(0\/(\d+)\)/g)].map(m=>Number(m[1]));
  assert.match(sidebar.innerHTML,/<button type="button" id="rv-sb-start"/);assert.doesNotMatch(sidebar.innerHTML,/javascript:/);
  assert.equal(counts.reduce((a,b)=>a+b,0),expected,track.trackId);assert.ok(counts.every(n=>n>0),track.trackId);
  if(track.trackId==='AE1'){assert.match(grid.innerHTML,/General/);assert.doesNotMatch(grid.innerHTML,/Case Management|Pega GenAI/);}
 }
});
