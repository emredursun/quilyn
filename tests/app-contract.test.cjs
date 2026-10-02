const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
function blocks(css,selector){const start=css.indexOf(selector);return css.slice(start,css.indexOf('\n}',start));}
function color(block,name){const match=block.match(new RegExp('--pa-'+name+':\\s*(#[a-f0-9]{6})','i'));assert.ok(match,name);return match[1];}
function luminance(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('semantic reading colors meet normal-text contrast in both themes',()=>{
  const css=fs.readFileSync('core/css/tokens.css','utf8');
  for(const selector of [':root {',':root[data-theme="light"] {']){
    const block=blocks(css,selector);
    for(const pair of [['ink','nav-hover-bg'],['hover-ink','nav-hover-bg'],['primary-ink','primary-hover']])assert.ok(contrast(color(block,pair[0]),color(block,pair[1]))>=4.5,selector+' hover '+pair.join('/'));
    for(const text of ['ink','ink-soft','muted','brand','ok','bad','warn']){
      const ratio=contrast(color(block,text),color(block,'surface-1'));
      assert.ok(ratio>=4.5,`${selector} ${text}: ${ratio.toFixed(2)}`);
    }
  }
});
test('app assets are local, precached and fit the initial shell budget',()=>{
  const html=fs.readFileSync('index.html','utf8'), sw=fs.readFileSync('sw.js','utf8');
  assert.ok(html.includes("script-src 'self';"));
  assert.doesNotMatch(html,/<script\s*>|https:\/\/fonts\.|cdn\.jsdelivr/);
  const assets=[...html.matchAll(/(?:src|href)="(core\/[^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]);
  let bytes=fs.statSync('index.html').size;
  for(const path of new Set(assets)){assert.ok(fs.existsSync(path),path);assert.ok(sw.includes("'./"+path+"'"),'Missing precache '+path);bytes+=fs.statSync(path).size;}
  assert.ok(bytes<=300000,`Shell ${bytes} bytes exceeds 300 KB uncompressed budget`);
  console.log(`Initial shell source: ${(bytes/1000).toFixed(1)} KB uncompressed; excludes background content downloads.`);
  assert.ok(sw.includes("{cache:'reload'}"),'Worker update must bypass stale HTTP assets');
  assert.ok(sw.includes("key.startsWith('quilyn-')")===false,'Package caches must survive shell updates');
});
