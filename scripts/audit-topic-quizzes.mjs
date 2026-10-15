import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { banks, audit, report, root } from './audit-quiz-bias.mjs';

// Inspect only literal authored data, never execute an exercise's renderer.
export function literalArray(source, start) {
  let depth=0, quote='', escaped=false, comment='';
  for(let i=start;i<source.length;i++){
    const c=source[i],next=source[i+1];
    if(comment==='line'){if(c==='\n')comment='';continue;}
    if(comment==='block'){if(c==='*'&&next==='/'){comment='';i++;}continue;}
    if(quote){if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}if(c===quote)quote='';continue;}
    if(c==='/'&&next==='/'){comment='line';i++;continue;}
    if(c==='/'&&next==='*'){comment='block';i++;continue;}
    if(c==='"'||c==="'"){quote=c;continue;}
    if(c==='[')depth++;
    if(c===']'&&--depth===0){
      const text=source.slice(start,i+1);
      const value=JSON.parse(JSON.stringify(vm.runInNewContext('('+text+')',Object.create(null),{timeout:100})));
      return {start,end:i+1,value};
    }
  }
  throw Error('Unterminated exercise array');
}
export function exercises(revision) {
  const result=[];
  for(const g of banks(revision).filter(g=>g.kind==='practice'))for(const [sectionIndex,section]of g.data.studyGuide.entries())for(const [elementIndex,element]of(section.elements||[]).entries()){
    if(element.type!=='interactive'||!element.html)continue;
    const match=/\bvar\s+(S|scenarios|problems)\s*=\s*(?:\/\* quilyn-topic-balance-v1 \*\/\s*)?(\[)/.exec(element.html);
    const array=match?literalArray(element.html,match.index+match[0].lastIndexOf('[')):null;
    if(array&&!array.value.every(q=>Array.isArray(q.opts)&&Array.isArray(q.fbs)&&Number.isInteger(q.correct)))throw Error('Unknown decision schema: '+g.name);
    const kind=array?'topic':/var pairs=/.test(element.html)?'matching':/var PRINCIPLES =/.test(element.html)?'ordering':(/<details\b/.test(element.html)||/Show answer/.test(element.html))?'retrieval':'unclassified';
    result.push({...g,kind,name:g.name+' / '+(section.sectionId||sectionIndex)+' / '+element.title,sectionIndex,elementIndex,element,array,
      questions:array?array.value.map((q,i)=>({questionId:'Q'+(i+1),type:'single-select',scenario:[q.label,q.intro||q.scenario,...q.config||[]].filter(Boolean).join(' '),options:q.opts.map((text,j)=>({id:String(j),text})),correctOptions:[String(q.correct)],rationale:q.fbs.join(' ')})):[]});
  }
  return result;
}
export function topicAudit(revision){return audit(exercises(revision).filter(e=>e.array));}
export function topicReport(revision) {
  const all=exercises(revision),rows=topicAudit(revision);
  return report(rows)+'\n## Complete interactive inventory\n\n'+all.map(e=>`- ${e.track} / ${e.name}: ${e.kind}${e.array?' ('+e.questions.length+' questions)':''}`).join('\n')+'\n\nMatching already randomizes both sides; ordering already randomizes items. Retrieval checks intentionally disclose model responses only when expanded; they have no multiple-choice answer position. None of these embedded exercises persists option selections or scores to localStorage/SRS/backups.\n';
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const ri=process.argv.indexOf('--revision'),revision=ri<0?undefined:process.argv[ri+1],rows=topicAudit(revision),all=exercises(revision);
  const errors=rows.flatMap(r=>r.errors.map(e=>r.name+': '+e));
  for(const e of all){if(e.kind==='unclassified')errors.push(e.name+': unclassified interactive');if(e.array)for(const [i,q]of e.array.value.entries()){if(q.opts.length!==q.fbs.length)errors.push(e.name+'/Q'+(i+1)+': feedback does not match options');}}
  if(process.argv.includes('--check'))errors.push(...rows.filter(r=>r.skew).map(r=>r.name+': skewed answers'));
  const oi=process.argv.indexOf('--report');if(oi>=0){const path=resolve(root,process.argv[oi+1]);mkdirSync(resolve(path,'..'),{recursive:true});writeFileSync(path,topicReport(revision));}
  console.log(`${all.length} topic interactives; ${rows.length} decision banks; ${rows.reduce((n,r)=>n+r.questions.length,0)} questions; ${rows.filter(r=>r.skew).length} skewed banks. Other types: ${[...new Set(all.filter(e=>!e.array).map(e=>e.kind))].join(', ')}.`);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
}
