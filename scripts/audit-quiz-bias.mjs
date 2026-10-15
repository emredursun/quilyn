import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
export const anchored = text => /\b(?:all|none) of (?:the )?(?:above|following)|\b(?:both )?[A-H] (?:and|or|&) [A-H]\b|\b(?:option|answer|choice)s?\s+[A-H]\b|\b[A-H]\s*\)/i.test(text);
export function banks(revision) {
  const read = path => JSON.parse(revision ? execFileSync('git', ['show', `${revision}:${path}`], {cwd:root,encoding:'utf8'}) : readFileSync(resolve(root,path),'utf8'));
  const groups = [];
  for (const track of read('data/registry.json').tracks) for (const module of track.modules.filter(m => m.ready !== false)) {
    const data = read(module.file);
    groups.push({track:track.trackId, name:module.id, file:module.file, data, kind:'practice', questions:data.practiceQuiz});
  }
  const mocks = read('data/mock-exams.json');
  for (const [track, exams] of Object.entries(mocks)) for (const [name, questions] of Object.entries(exams)) groups.push({track,name,file:'data/mock-exams.json',data:mocks,kind:'mock',questions});
  return groups;
}
export function normalized(q, i) {
  return q.options ? {id:q.questionId, stem:q.scenario, options:q.options.map(o=>o.text), answers:q.correctOptions.map(id=>q.options.findIndex(o=>o.id===id)), hint:q.hint||'', explanation:q.rationale||'', raw:q} : {id:q.questionId||`Q${i+1}`,stem:q.q,options:q.o,answers:q.a,hint:'',explanation:q.r,raw:q};
}
const words = text => new Set((text.toLowerCase().match(/[a-z]{4,}/g)||[]).filter(w=>!['which','following','should','would','what','that','this','with','from','when','have','does','your','they','their','these','into','most','best'].includes(w)));
export function inspect(q) {
  const flags=[]; const lengths=q.options.map(o=>o.trim().split(/\s+/).length), max=Math.max(...lengths);
  if(q.answers.some(a=>lengths[a]===max)&&lengths.filter(n=>n===max).length===1)flags.push('longest');
  const min=Math.min(...lengths);
  if(q.answers.some(a=>lengths[a]===min)&&lengths.filter(n=>n===min).length===1)flags.push('shortest');
  if(q.answers.some(a=>lengths[a]===max)&&max>=2*Math.max(1,...lengths.filter((_,i)=>!q.answers.includes(i)))&&max>=8)flags.push('detailed');
  if(q.options.some(anchored)||anchored(q.explanation)||anchored(q.hint))flags.push('anchored/letter-reference');
  const correct=q.answers.map(a=>q.options[a]?.toLowerCase()).filter(Boolean);
  if(q.hint && (correct.some(t=>{const term=t.split(/\s+[—–]\s+/)[0].replace(/[.!]$/,'');return term.length>=5&&q.hint.toLowerCase().includes(term);})||/\b(?:answer|option|choose|select)\s+(?:is\s+)?[A-H]\b/.test(q.hint)))flags.push('hint-answer');
  const stem=words(q.stem), overlaps=q.options.map(o=>[...words(o)].filter(w=>stem.has(w)));
  if(q.answers.length===1&&overlaps[q.answers[0]]?.length>=3&&overlaps.every((v,i)=>i===q.answers[0]||v.length===0))flags.push('stem-echo');
  if(q.options.some((o,i)=>!q.answers.includes(i)&&/\b(always|never|only)\b/i.test(o))&&!q.answers.some(i=>/\b(always|never|only)\b/i.test(q.options[i])))flags.push('wrong-absolutes');
  return flags;
}
export function audit(groups=banks()) {
  return groups.map(g=>{
    const width=Math.max(0,...g.questions.map(q=>q.options?.length||q.o.length));
    const counts=Array(width).fill(0),single=Array(width).fill(0),multi={},flags={}, offenders=[],errors=[]; let singles=0,multis=0;
    g.questions.forEach((raw,i)=>{const q=normalized(raw,i); const ids=raw.options?.map(o=>o.id);
      if(!q.answers.length||new Set(q.answers).size!==q.answers.length||q.answers.some(a=>!Number.isInteger(a)||a<0||a>=q.options.length)||ids&&new Set(ids).size!==ids.length||(raw.type==='single-select'||raw.t==='single')&&q.answers.length!==1)errors.push(q.id+': invalid answer reference');
      if(raw.previousOrder && (raw.previousOrder.length!==q.options.length || raw.previousOrder.slice().sort((a,b)=>a-b).some((v,j)=>v!==j)))errors.push(q.id+': invalid previousOrder permutation');
      q.answers.forEach(a=>counts[a]=(counts[a]||0)+1);
      if(q.answers.length===1){singles++;single[q.answers[0]]=(single[q.answers[0]]||0)+1;}else{multis++;multi[q.answers.length]=(multi[q.answers.length]||0)+1;}
      const f=inspect(q);f.forEach(k=>flags[k]=(flags[k]||0)+1);if(f.length)offenders.push({id:q.id,flags:f});
    });
    const sizes=[...new Set(g.questions.filter((q,i)=>normalized(q,i).answers.length===1).map((q,i)=>q.options?.length||q.o.length))];
    // Integer rounding tolerance for small banks; assess each option-count stratum independently.
    const skew=sizes.some(n=>{const rows=g.questions.map(normalized).filter(q=>q.answers.length===1&&q.options.length===n);const c=Array(n).fill(0);rows.forEach(q=>c[q.answers[0]]++);return Math.max(...c)>Math.max(Math.ceil(rows.length/n),Math.floor(rows.length*(n===4?.4:1/n+.15)));});
    return {...g,counts,single,singles,multis,multi,flags,offenders,errors,skew};
  });
}
export function report(rows) {
  const total=rows.reduce((a,r)=>a+r.questions.length,0), flags={}; rows.forEach(r=>Object.entries(r.flags).forEach(([k,n])=>flags[k]=(flags[k]||0)+n));
  const tracks=[...new Set(rows.map(r=>r.track))];
  const trackTable='## Track totals\n\n| Track | Questions | Single positions A/B/C/D… | Multi questions | Skewed banks |\n|---|---:|---|---:|---:|\n'+tracks.map(t=>{const rs=rows.filter(r=>r.track===t);return `| ${t} | ${rs.reduce((n,r)=>n+r.questions.length,0)} | ${Array.from({length:Math.max(...rs.map(r=>r.single.length))},(_,i)=>rs.reduce((n,r)=>n+(r.single[i]||0),0)).join('/')} | ${rs.reduce((n,r)=>n+r.multis,0)} | ${rs.filter(r=>r.skew).length} |`;}).join('\n')+'\n\n';
  const sums=key=>Array.from({length:Math.max(...rows.map(r=>r[key].length))},(_,i)=>rows.reduce((s,r)=>s+(r[key][i]||0),0));
  return `# Quiz bias audit\n\n${rows.length} banks; ${total} questions; ${rows.filter(r=>r.skew).length} skewed banks.\n\nSingle-select positions: ${sums('single').join(' / ')}. All correct-option positions (includes multi-select): ${sums('counts').join(' / ')}.\n\nHeuristic flags: ${Object.entries(flags).map(([k,n])=>`${k}: ${n}`).join('; ')}.\n\nCounts use words; longest/shortest exclude ties; detailed means at least twice the longest distractor and at least 8 words. Hints are opt-in before grading; rationales and option explanations are revealed after grading. Stem echo and absolutes are review leads, not factual findings. Anchored detection is deliberately conservative. Skew allows integer rounding for small quizzes, otherwise >40% for four options (1/N + 15 points for others). Multi-select counts measure inclusion, not mutually exclusive outcomes. Archived data_backup directories and data/review design metadata are not loaded by the site.\n\n| Track / bank | Kind | Questions | Single A/B/C/D… | Multi correct-count distribution | All correct positions | Longest / detailed | Flags | Skew |\n|---|---|---:|---|---|---|---|---|---|\n`+rows.map(r=>`| ${r.track} / ${r.name} | ${r.kind} | ${r.questions.length} | ${r.single.join('/')} | ${JSON.stringify(r.multi)} | ${r.counts.join('/')} | ${r.flags.longest||0} / ${r.flags.detailed||0} | ${Object.entries(r.flags).map(([k,n])=>`${k}: ${n}`).join(', ')} | ${r.skew?'YES':''} |`).join('\n')+'\n\n'+trackTable+'## Per-bank editorial candidates (worst first)\n\n'+rows.filter(r=>r.offenders.length).map(r=>`### ${r.track} / ${r.name}\n\n`+r.offenders.sort((a,b)=>b.flags.length-a.flags.length).map(o=>`- ${o.id}: ${o.flags.join(', ')}`).join('\n')).join('\n\n')+'\n';
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const revision=process.argv.indexOf('--revision');
  const rows=audit(banks(revision>=0?process.argv[revision+1]:undefined));const output=process.argv.indexOf('--report');
  if(output>=0){const path=resolve(root,process.argv[output+1]);mkdirSync(resolve(path,'..'),{recursive:true});writeFileSync(path,report(rows));}
  console.log(report(rows).split('| Track')[0]);
  const errors=rows.flatMap(r=>r.errors.map(e=>`${r.track}/${r.name}: ${e}`));
  if(process.argv.includes('--check'))errors.push(...rows.filter(r=>r.skew).map(r=>`${r.track}/${r.name}: skewed answers`));
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
}
