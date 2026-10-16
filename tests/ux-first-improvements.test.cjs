const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function review(cards,bank){
 const window={QuilynProgress:{localDay:()=> '2026-10-16'}};
 const source=fs.readFileSync('core/js/review-view.js','utf8').replace('  global.ReviewView=', '  global.inspectReview=function(cards,bank){srs={cards:cards,surpriseIds:[]};cardBank=bank;return {stats:getStats(),due:getDueKeys(),session:selectSession()};};\n  global.ReviewView=');
 vm.runInNewContext(source,{window,Date,Math,HTMLElement:class{},customElements:{define(){}}});
 return window.inspectReview(cards,bank);
}
test('scheduled review counts exclude new cards without removing them from sessions or changing saved state',()=>{
 const cards={due:{box:2,dueDate:'2026-10-15'},future:{box:5,dueDate:'2026-10-20'}},before=JSON.stringify(cards),bank=Object.fromEntries(['due','future','new'].map(k=>[k,{moduleId:k}]));
 const result=review(cards,bank);assert.equal(result.stats.due,1);assert.equal(result.stats.newCards,1);assert.equal(result.stats.mastered,1);assert.equal(result.stats.total,3);
 assert.deepEqual(Array.from(result.due).sort(),['due','new']);assert.deepEqual(Array.from(result.session).sort(),['due','new']);assert.equal(JSON.stringify(cards),before);
 const fresh=review({},bank);assert.equal(fresh.stats.due,0);assert.equal(fresh.stats.newCards,3);assert.equal(fresh.session.length,3);
 const caughtUp=review({due:{box:2,dueDate:'2026-10-20'}},{due:{moduleId:'M'}});assert.equal(caughtUp.stats.due+caughtUp.stats.newCards,0);assert.equal(caughtUp.session.length,0);
});
function searchHarness(failCatalogue=false){
 const registry=JSON.parse(fs.readFileSync('data/registry.json')),catalogue=JSON.parse(fs.readFileSync('data/library-index.json'));
 const window={PegaStore:{state:{activeTrack:'PSA'}},QuilynRuntime:{json:async path=>{if(path.includes('library')){if(typeof failCatalogue==='function'?failCatalogue():failCatalogue)throw Error('offline');return catalogue;}return registry;}}};
 vm.runInNewContext(fs.readFileSync('core/js/library.js','utf8'),{window});window.QuilynRuntime.library=async()=>window.QuilynLibrary;
 const source=fs.readFileSync('core/js/search-view.js','utf8').replace('global.PegaSearchView = {','global.PegaSearchView = {load:loadRegistry,find:search,');
 vm.runInNewContext(source,{window,document:{addEventListener(){}}});return window.PegaSearchView;
}
test('unified search loads on first use, finds concepts and topic deep links and prioritizes the selected track',async()=>{
 const api=searchHarness();await api.load();const found=api.find('Ruleset');assert.ok(found.length);assert.equal(found[0].track,'PSA');assert.ok(found.some(e=>e.kind==='concept'));assert.ok(found.some(e=>e.href.includes('/guide/section-')));
 const words=api.find('business days');assert.ok(words.length);assert.ok(words.every(e=>(e.title+' '+e.text+' '+e.moduleTitle+' '+e.module).toLowerCase().includes('business')));
 assert.ok(api.find('SA-M48').some(e=>e.module==='SA-M48'));assert.equal(api.find('   ').length,0);assert.equal(api.find('no-such-zzzz-content').length,0);assert.ok(api.find('a').length<=20);
});
test('catalogue failure retains module search and subsequent opens still return a promise',async()=>{
 const api=searchHarness(true);await api.load();await api.load();const found=api.find('Ruleset');assert.ok(found.length);assert.ok(found.every(e=>e.kind==='module'));assert.ok(found.some(e=>e.track==='PSSA'));
});
test('search retries a temporarily unavailable catalogue on the next open',async()=>{
 let offline=true;const api=searchHarness(()=>offline);await api.load();assert.ok(api.find('Ruleset').every(e=>e.kind==='module'));
 offline=false;await api.load();assert.ok(api.find('Ruleset').some(e=>e.kind==='concept'));
});
test('concurrent search opens share one catalogue request and successful loads stay cached',async()=>{
 let calls=0;const api=searchHarness(()=>{calls++;return false;});const first=api.load(),second=api.load();assert.equal(first,second);await Promise.all([first,second]);await api.load();assert.equal(calls,1);
});
