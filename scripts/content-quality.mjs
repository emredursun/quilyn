import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const registry=JSON.parse(readFileSync(resolve(root,'data/registry.json')));
const modules=registry.tracks.flatMap(track=>track.modules.filter(m=>m.ready!==false).map(meta=>{
  const data=JSON.parse(readFileSync(resolve(root,meta.file)));
  return {track:track.trackId,id:meta.id,hasSource:Boolean(data.moduleUrl),version:data.platformVersion||null,
    reviewedOn:data.sourceReviewedOn||null,needsReview:!data.platformVersion || !data.sourceReviewedOn};
}));
const report={version:1,modules:modules.length,sourceCount:modules.filter(m=>m.hasSource).length,
  versionedCount:modules.filter(m=>m.version).length,reviewDatedCount:modules.filter(m=>m.reviewedOn).length,
  note:'Metadata coverage is not a verification of content accuracy. Missing dates and versions require editorial review.',
  legacyBlockedSources:['http://webservice.toscacloud.com/training'],reviewQueue:modules.filter(m=>m.needsReview)};
const result=JSON.stringify(report,null,2)+'\n';
const target=resolve(root,'data/content-quality.json');
if(process.argv.includes('--check')) {
  if(readFileSync(target,'utf8')!==result) {console.error('Content quality inventory is stale. Run npm run manifest:content.');process.exitCode=1;}
} else writeFileSync(target,result);
console.log(`Provenance: ${report.sourceCount}/${report.modules} module sources; ${report.reviewDatedCount} review dates; ${report.versionedCount} documented versions.`);
