// Render every raster app icon from the same vector master.
// Requires sharp; optional first argument resolves a preinstalled sharp module.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || 'sharp');
const source = readFileSync('icon.svg');
const square = Buffer.from(source.toString().replace('rx="112"','rx="0"'));
mkdirSync('assets/brand', { recursive: true });
for (const [name,size,input] of [
  ['icon-192',192,source], ['icon-512',512,source],
  ['icon-maskable-512',512,square], ['apple-touch-icon',180,square], ['favicon-32',32,source]
]) await sharp(input).resize(size,size).png().toFile(`assets/brand/${name}.png`);
const sizes=[16,32,48], frames=[];
for (const size of sizes) frames.push(await sharp(source).resize(size,size).png().toBuffer());
const header=Buffer.alloc(6+16*frames.length);header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);
let offset=header.length;
frames.forEach((frame,i)=>{const entry=6+16*i;header[entry]=sizes[i];header[entry+1]=sizes[i];header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(frame.length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=frame.length;});
writeFileSync('favicon.ico',Buffer.concat([header,...frames]));
console.log('Brand assets generated from icon.svg.');
