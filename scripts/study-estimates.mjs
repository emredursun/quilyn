/* Copy authored estimates verbatim; ranges and reference-only entries are not converted to invented durations. */
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),path=resolve(root,'data/registry.json');
const original=readFileSync(path,'utf8'),registry=JSON.parse(original);
for(const track of registry.tracks)for(const meta of track.modules){
 if(meta.ready===false)continue;
 const data=JSON.parse(readFileSync(resolve(root,meta.file),'utf8'));
 meta.studyEstimate=typeof data.estTime==='string'&&data.estTime.trim()?data.estTime:null;
}
const result=JSON.stringify(registry,null,2)+'\n';
if(process.argv.includes('--check')){if(result!==original)throw Error('Study estimates are stale. Run npm run manifest:content.');}
else writeFileSync(path,result);
console.log('Module study estimates match authored content.');
