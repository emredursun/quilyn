const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const registry=JSON.parse(fs.readFileSync('data/registry.json')),index=JSON.parse(fs.readFileSync('data/library-index.json'));
test('every library result resolves to an existing lesson and stable topic; metadata is not invented',()=>{
 for(const e of index.entries){const track=registry.tracks.find(t=>t.trackId===e.track),meta=track.modules.find(m=>m.id===e.module),module=JSON.parse(fs.readFileSync(meta.file));assert.ok(e.href.startsWith('#'+e.track+'/'+e.module));if(e.kind!=='module'){const section=e.href.split('/').at(-1);assert.ok(module.studyGuide.some(s=>s.sectionId===section),e.href);}assert.equal(e.version,module.platformVersion||null);assert.equal(e.reviewedOn,module.sourceReviewedOn||null);}
 for(const t of registry.tracks)for(const m of t.modules){const d=JSON.parse(fs.readFileSync(m.file));assert.equal(new Set(d.studyGuide.map(s=>s.sectionId)).size,d.studyGuide.length);}
});
test('library filters combine track, kind and all search words; feedback URLs preserve lesson context',()=>{
 const window={};vm.runInNewContext(fs.readFileSync('core/js/library.js','utf8'),{window});const api=window.QuilynLibrary;
 const hits=api.find(index.entries,'PSSA','concept','case locking');assert.ok(hits.length);assert.ok(hits.every(e=>e.track==='PSSA'&&e.kind==='concept'));assert.equal(api.find(index.entries,'PSSA','','nonexistentwordunlikely').length,0);
 const url=new URL(api.reportLink('PBA','BA-M04','section-123'));assert.equal(url.hostname,'github.com');assert.match(url.searchParams.get('body'),/#PBA\/BA-M04\/guide\/section-123/);assert.doesNotMatch(url.searchParams.get('body'),/answers|progress|localStorage/);
});
test('all static lesson URLs have unique metadata, substantial HTML content, canonicals and compatible app links',()=>{
 const sitemap=fs.readFileSync('sitemap.xml','utf8'),titles=new Set();
 for(const t of registry.tracks)for(const m of t.modules){const path='learn/'+t.trackId.toLowerCase()+'/'+m.id.toLowerCase()+'/',html=fs.readFileSync(path+'index.html','utf8'),d=JSON.parse(fs.readFileSync(m.file)),title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),title);titles.add(title);assert.ok(html.includes('href="https://emredursun.github.io/quilyn/'+path+'"'));assert.ok(sitemap.includes('https://emredursun.github.io/quilyn/'+path));assert.ok(html.includes('index.html#'+t.trackId+'/'+m.id));for(const s of d.studyGuide)assert.ok(html.includes('id="'+s.sectionId+'"'));assert.doesNotMatch(html,/Version undefined|Reviewed undefined|<script>/);assert.match(html,/<meta name="description" content="[^\"]+"/);}
 assert.equal(titles.size,210);assert.equal((sitemap.match(/<loc>/g)||[]).length,223);
});
