const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('install and Apple icons exist at declared raster dimensions and are precached',()=>{
  const manifest=JSON.parse(fs.readFileSync('manifest.json')),sw=fs.readFileSync('sw.js','utf8');
  assert(manifest.icons.some(icon=>icon.purpose==='maskable'));
  for(const icon of manifest.icons.filter(icon=>icon.type==='image/png')){
    const png=fs.readFileSync(icon.src),size=Number(icon.sizes.split('x')[0]);
    assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
    assert(sw.includes("'./"+icon.src+"'"));
  }
  const apple=fs.readFileSync('assets/brand/apple-touch-icon.png');
  assert.equal(apple.readUInt32BE(16),180);assert.equal(apple.readUInt32BE(20),180);
  const ico=fs.readFileSync('favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
});
