const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(path,mode,failWrite=false){
  const handlers={},writes=[],warnings=[],tasks=[];
  let release,opens=0,dispatching=true;
  const gate=new Promise(resolve=>release=resolve);
  const cache={match:async()=>undefined,put:async(key,response)=>{
    if(failWrite) throw Error('quota');
    writes.push({url:key.url,body:await response.text()});
  }};
  const caches={open:async name=>{
    if(name.startsWith('quilyn-v')){
      opens++;
      // Asset requests read the shell cache once before fetching a miss.
      if(!(mode!=='navigate'&&!path.includes('.json')&&opens===1)) await gate;
    }
    return cache;
  }};
  const self={location:{origin:'https://example.test'},registration:{scope:'https://example.test/quilyn/'},addEventListener:(type,fn)=>handlers[type]=fn};
  vm.runInNewContext(fs.readFileSync('sw.js','utf8'),{self,caches,URL,Request,Response,fetch:async()=>new Response('network body'),console:{warn:(...args)=>warnings.push(args)}});
  let response;
  handlers.fetch({request:{url:'https://example.test/quilyn/'+path,method:'GET',mode},respondWith:p=>response=p,
    waitUntil:p=>{assert(dispatching,'waitUntil must be registered during dispatch');tasks.push(p);}});
  dispatching=false;
  return {response,tasks,writes,warnings,release};
}
for(const [path,mode] of [['index.html','navigate'],['data/registry.json?v=123','cors'],['core/js/new.js','cors']]){
  test('worker clones '+path+' before client consumes body while cache opening is delayed',async()=>{
    const s=setup(path,mode);
    assert.equal(await (await s.response).text(),'network body');
    s.release();await Promise.all(s.tasks);
    assert.equal(s.warnings.length,0);assert.equal(s.writes.length,1);
    assert.equal(s.writes[0].body,'network body');assert(!s.writes[0].url.includes('?'));
  });
}
test('cache quota failure keeps successful network response and handles rejection',async()=>{
  const s=setup('data/registry.json','cors',true);
  assert.equal(await (await s.response).text(),'network body');
  s.release();await Promise.all(s.tasks);assert.equal(s.warnings.length,1);
});
