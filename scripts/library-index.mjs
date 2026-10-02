import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const registry=JSON.parse(readFileSync(resolve(root,'data/registry.json')));
const entries=[];
for(const track of registry.tracks) for(const meta of track.modules.filter(m=>m.ready!==false)) {
 const module=JSON.parse(readFileSync(resolve(root,meta.file)));
 const common={track:track.trackId,trackName:track.trackName,module:meta.id,moduleTitle:module.moduleTitle||meta.name,source:module.moduleUrl||'',version:module.platformVersion||null,reviewedOn:module.sourceReviewedOn||null};
 entries.push({...common,kind:'module',title:common.moduleTitle,text:(module.topics||[]).map(t=>t.title).join(' · '),href:'#'+track.trackId+'/'+meta.id});
 for(const section of module.studyGuide) {
  if(!section.sectionId)throw new Error('Missing stable section ID: '+meta.id);
  const href='#'+track.trackId+'/'+meta.id+'/guide/'+section.sectionId;
  const refs=(section.elements||[]).filter(e=>e.type==='links').flatMap(e=>e.items||[]);
  entries.push({...common,kind:'topic',title:section.sectionTitle,text:'',href,source:refs[0]?.url||common.source});
  for(const el of section.elements||[]) if(el.type==='concept'&&el.term&&el.description) {
   entries.push({...common,kind:'concept',title:el.term,text:el.description+(el.items?.length?' ' + el.items.join(' · '):''),href,source:refs[0]?.url||common.source});
  }
 }
}
const contents=JSON.stringify({version:1,note:'Definitions are existing independent study notes, not official glossary entries. Missing review metadata remains unknown.',tracks:registry.tracks.map(t=>({id:t.trackId,name:t.trackName})),entries})+'\n';
const path=resolve(root,'data/library-index.json');
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==contents)throw new Error('Library index is stale. Run npm run manifest:content.');}
else writeFileSync(path,contents);
console.log('Library index verified: '+entries.length+' entries (loaded on demand).');
