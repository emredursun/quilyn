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
