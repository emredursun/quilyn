const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const pending=[],location={hash:'#library'},window={QuilynRuntime:{json:()=>new Promise(resolve=>pending.push(resolve))}},nodes={};let focusCount=0;
 const el={isConnected:true,innerHTML:'',querySelector(s){return nodes[s]||(nodes[s]={value:s==='#lib-track'?'PSA':'',events:{},addEventListener(name,fn){this.events[name]=fn;}});},focus(){focusCount++;}};
 vm.runInNewContext(fs.readFileSync('core/js/library.js','utf8'),{window,location});
 return {api:window.QuilynLibrary,el,pending,location,nodes,focusCount:()=>focusCount};
}
const data={entries:[],tracks:[]};
test('an older library mount cannot overwrite a newer mount on the same route',async()=>{
 const h=setup(),old=h.api.mount(h.el,'PSA','library'),current=h.api.mount(h.el,'PBA','library');
 h.pending[1](data);await current;assert.equal(h.focusCount(),1);h.pending[0](data);await old;assert.equal(h.focusCount(),1);
});
test('a pending library response cannot render after its topic route changes',async()=>{
 const h=setup();h.location.hash='#library/area/Security';const old=h.api.mount(h.el,'PSA','library');h.location.hash='#library/search/Data';h.el.innerHTML='New route';
 h.pending[0](data);await old;assert.equal(h.el.innerHTML,'New route');assert.equal(h.focusCount(),0);
});
test('the updates screen invalidates an older pending library mount',async()=>{
 const h=setup(),old=h.api.mount(h.el,'PSA','library');await h.api.mount(h.el,'PSA','updates');const html=h.el.innerHTML;
 h.pending[0](data);await old;assert.equal(h.el.innerHTML,html);assert.equal(h.focusCount(),1);
});
test('a cross-track topic deep link and topic selection choose a compatible track',async()=>{
 const h=setup(),entries=[{track:'PSA',studyArea:'Security',title:'Security',text:'',moduleTitle:'A',kind:'module',href:'#PSA/M1'},{track:'TAPI',studyArea:'API foundations',title:'API',text:'',moduleTitle:'B',kind:'module',href:'#TAPI/M1'}];
 h.location.hash='#library/area/API%20foundations';const mounted=h.api.mount(h.el,'PSA','library');h.pending[0]({entries,tracks:[]});await mounted;
 assert.equal(h.nodes['#lib-track'].value,'TAPI');assert.match(h.nodes['#lib-count'].textContent,/1 results/);
 h.nodes['#lib-area'].value='Security';h.nodes['#lib-area'].events.input();assert.equal(h.nodes['#lib-track'].value,'PSA');assert.match(h.nodes['#lib-count'].textContent,/1 results/);
 h.nodes['#lib-track'].value='TAPI';h.nodes['#lib-track'].events.input();assert.equal(h.nodes['#lib-area'].value,'');assert.match(h.nodes['#lib-count'].textContent,/1 results/);
});
