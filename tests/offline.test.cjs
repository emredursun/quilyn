const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto');
function setup(fail) {
  const stores=new Map();
  const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const map=stores.get(name);return {
    async match(key){return map.get(String(key))?.clone();},async put(key,response){map.set(String(key),response.clone());}
  };},async delete(name){return stores.delete(name);}};
  const bytes='{"moduleId":"M1"}';
  const track={id:'PBA',version:'new',bytes:bytes.length,modules:1,files:[{path:'data/module.json',sha256:crypto.createHash('sha256').update(bytes).digest('hex')}]};
  const window={};
  vm.runInNewContext(fs.readFileSync('core/js/offline.js','utf8'),{window,caches,URL,Response,TextDecoder,crypto:crypto.webcrypto,
    document:{baseURI:'https://example.test/quilyn/'},fetch:async()=>{if(fail==='network')throw Error('network');return new Response(fail==='integrity'?'{}':bytes);}});
  return {api:window.QuilynOffline,stores,caches,track};
}
test('completed package commits only after every hash verifies',async()=>{
  const {api,stores,track}=setup();await api.download(track,()=>{},new AbortController().signal);
  const index=await api.readIndex();assert.equal(index.PBA.version,'new');assert.ok(stores.has(index.PBA.cache));
});
for(const mode of ['network','integrity'])test('failed '+mode+' download never commits a partial package',async()=>{
  const {api,stores,track}=setup(mode);
  await assert.rejects(api.download(track,()=>{},new AbortController().signal));
  assert.deepEqual(JSON.parse(JSON.stringify(await api.readIndex())),{});
  assert.equal(stores.has('quilyn-package-PBA-new'),false);
});
test('cancelled download keeps prior package and does not mark new version ready',async()=>{
  const {api,caches,stores,track}=setup();
  const meta=await caches.open('quilyn-package-index');
  await meta.put('https://example.test/quilyn/data/offline-packages',new Response(JSON.stringify({PBA:{cache:'quilyn-package-PBA-old',version:'old'}})));
  await caches.open('quilyn-package-PBA-old');
  const controller=new AbortController();controller.abort();
  await assert.rejects(api.download(track,()=>{},controller.signal),/cancelled/);
  assert.equal((await api.readIndex()).PBA.version,'old');assert.ok(stores.has('quilyn-package-PBA-old'));
});
