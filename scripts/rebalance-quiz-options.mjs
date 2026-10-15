// One-time, deterministic rewrite. Option IDs and question order are identities.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { banks, normalized, inspect, anchored, audit, root } from './audit-quiz-bias.mjs';
const seed='quilyn-answer-balance-2026-10-15';
const rank=value=>createHash('sha256').update(seed+value).digest().readUInt32BE();
const signature=q=>JSON.stringify([q.type,q.scenario,q.options.map(o=>[o.id,o.text]).sort((a,b)=>a[0].localeCompare(b[0])),q.correctOptions.slice().sort()]);
// These edits retain the full answer in the rationale and remove redundant option detail.
const edits={
 'PBA/BA-M01/Q9':['The Project Delivery Lead (PDL), along with the PO','The Project Delivery Lead and Product Owner'],
 'PBA/BA-M04/Q9':['Value measurement — dashboards and reports on usage and ROI','Value measurement'],
 'PBA/BA-M05/Q3':['Versioning — review history and revert the form Rule','Versioning'],
 'PBA/BA-M17/Q2':['BIX (Business Intelligence Exchange) to extract data out of Pega','BIX (Business Intelligence Exchange)'],
 'PSA/SA-M18/m18_q01':['A Work Group — a cross-functional team (with one Work Queue) whose members share work regardless of business unit','A Work Group'],
 'PSA/SA-M19/m19_q08':['A Ruleset that is based on (branched from) another Ruleset and holds the Rules in active development in that Branch','A branched Ruleset holding Rules under development'],
 'TAS1/TAS1-M08/KC5':["It's a type of ActionMode used to identify one specific item in a list of similar items",'It identifies one specific item in a list of similar items']
};
const hintEdits={
  "SA-M01/m01_q03": "Compare the architecture names with the terminology used for their UI components.",
  "SA-M01/m01_q11": "Consider the intended reuse scope and each workspace's configuration capabilities.",
  "SA-M01/m01_q15": "Distinguish application authoring from operating a fleet of automations.",
  "SA-M01/m01_q19": "Compare each tool's purpose with the information the BA wants to inspect.",
  "SA-M01/m01_q20": "Separate supported business benefits from claims that remove delivery responsibilities.",
  "SA-M01/m01_q21": "Distinguish the configured starting workspace from the workspaces a user is authorized to access.",
  "SA-M01/m01_q22": "Compare architectural organization with how related Rules are packaged for reuse.",
  "SA-M02/m02_q05": "Consider how a Case reaches an explicit business outcome.",
  "SA-M02/m02_q09": "Consider how navigation is configured for a form.",
  "SA-M02/m02_q12": "Compare the naming guidance for different levels of the life cycle.",
  "SA-M02/m02_q15": "Separate workflow structure from access-control configuration.",
  "SA-M02/m02_q17": "How does the scope of a business journey relate to its workflow model?",
  "SA-M02/m02_q19": "Separate containers from individual actions."
};
if(banks().some(g=>g.questions.some(q=>q.previousOrder||q.previousSignatures)))throw Error('Already rewritten: run only against the original baseline.');
const files=new Map();let moved=0,hints=0,edited=0;
for(const g of audit()) {
 if(g.kind==='mock' && !g.skew){
  // A positional aggregate belongs after the alternatives it summarizes.
  for(const [index,raw] of g.questions.entries()){
   if(g.track==='PBA'&&g.name==='Mock Exam 2'&&index===4)raw.r=raw.r.replace('Options C and D swap these pairings and are incorrect.','The cross-pairings swap these architectures and Rulesets and are incorrect.');
   const last=raw.o.findIndex(o=>/\b(?:all|none) of (?:the )?above\b/i.test(o));
   if(last>=0&&last!==raw.o.length-1){const order=raw.o.map((_,i)=>i).filter(i=>i!==last).concat(last);raw.previousOrder=order;raw.o=order.map(i=>raw.o[i]);raw.a=raw.a.map(i=>order.indexOf(i));moved++;}
  }
  files.set(g.file,g.data);continue;
 }
 if(g.questions.some(q=>q.previousOrder))throw Error('Already rewritten: restore the baseline before rerunning this one-time script.');
 const counts=new Map(), singles=new Map();
 const locked=q=>anchored(q.stem)||q.options.some(anchored)||/\b[B-H]\b/.test(q.explanation)||anchored(q.explanation);
 // Reserve positions of letter-dependent explanations, then balance the movable rows.
 for(const [i,raw] of g.questions.entries()) {const q=normalized(raw,i),n=q.options.length;if(!counts.has(n)){counts.set(n,Array(n).fill(0));singles.set(n,Array(n).fill(0));}if(locked(q)){q.answers.forEach(a=>counts.get(n)[a]++);if(q.answers.length===1)singles.get(n)[q.answers[0]]++;}}
 for(const [i,raw] of g.questions.entries()) {
  const q=normalized(raw,i),n=q.options.length, key=`${g.track}/${g.name}/${q.id}`;
  if(raw.options){
   const edit=edits[key];if(edit){const option=raw.options.find(o=>o.text===edit[0]);if(!option)throw Error('Edit target missing '+key);raw.previousSignatures=[signature(raw)];option.text=edit[1];edited++;}
   // Remove direct answer text, including the named term before an explanatory dash.
   const hint=q.hint.toLowerCase();const reveals=q.answers.some(a=>{const term=q.options[a].split(/\s+[—–]\s+/)[0].replace(/[.!]$/,'').toLowerCase();return term.length>=5&&hint.includes(term);});
   if(inspect(q).includes('hint-answer')||reveals){delete raw.hint;hints++;}
   if(g.track==='PSA' && hintEdits[g.name+'/'+q.id])raw.hint=hintEdits[g.name+'/'+q.id];
  }
  if(locked(q))continue;
  const c=counts.get(n),s=singles.get(n),k=q.answers.length;
  const targets=Array.from({length:n},(_,j)=>j).sort((a,b)=>(k===1?s[a]-s[b]:c[a]-c[b])||c[a]-c[b]||rank(key+'/'+a)-rank(key+'/'+b)).slice(0,k);
  const correct=q.answers.slice().sort((a,b)=>rank(key+'/correct/'+a)-rank(key+'/correct/'+b));
  const wrong=Array.from({length:n},(_,j)=>j).filter(j=>!q.answers.includes(j)).sort((a,b)=>rank(key+'/wrong/'+a)-rank(key+'/wrong/'+b));
  const order=Array(n);targets.forEach((pos,j)=>{order[pos]=correct[j];c[pos]++;if(k===1)s[pos]++;});
  for(let j=0;j<n;j++)if(order[j]===undefined)order[j]=wrong.shift();
  if(order.some((old,j)=>old!==j))moved++;
  if(raw.options)raw.options=order.map(j=>raw.options[j]);
  else {raw.previousOrder=order;raw.o=order.map(j=>raw.o[j]);raw.a=raw.a.map(a=>order.indexOf(a)).sort((a,b)=>a-b);}
 }
 files.set(g.file,g.data);
}
if(!process.argv.includes('--write'))throw Error('Use --write to apply this one-time rewrite.');
for(const [file,data] of files)writeFileSync(resolve(root,file),JSON.stringify(data,null,2)+'\n');
console.log({moved,hintsRemoved:hints,wordingEdits:edited});
