/* Offline analysis of consented, pseudonymous first-attempt mock data. No telemetry. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const bankPath=fileURLToPath(new URL('../data/mock-exams.json',import.meta.url));
export const fingerprint=bank=>createHash('sha256').update(JSON.stringify(bank)).digest('hex');
const mean=xs=>xs.reduce((s,x)=>s+x,0)/xs.length;
function correlation(xs,ys){if(xs.length<3)return null;const mx=mean(xs),my=mean(ys),cross=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0),vx=xs.reduce((s,x)=>s+(x-mx)**2,0),vy=ys.reduce((s,y)=>s+(y-my)**2,0);return vx&&vy?cross/Math.sqrt(vx*vy):null;}
function interval(successes,n){if(!n)return null;const z=1.95996398454,p=successes/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return [Math.max(0,c-h),Math.min(1,c+h)];}
const equal=(a,b)=>a.length===b.length&&[...a].sort((x,y)=>x-y).every((x,i)=>x===[...b].sort((x,y)=>x-y)[i]);
export function analyzePilot(input,bank){
 if(input?.version!==1||input.bankFingerprint!==fingerprint(bank)||!Array.isArray(input.attempts))throw Error('Expected version 1, the exact current bankFingerprint and an attempts array.');
 const seen=new Set(),eligible=[],excluded={nonSimulation:0,notFirstExposure:0,incomplete:0,duplicate:0};
 for(const [index,a] of input.attempts.entries()){
  const form=a&&typeof a.form==='string'&&Object.hasOwn(bank,a.form)?bank[a.form]:null;if(!form||typeof a.candidateId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(a.candidateId))throw Error('Invalid form or pseudonymous candidateId at attempt '+index);
  if(a.mode!=='simulation'){excluded.nonSimulation++;continue;}
  if(a.firstExposure!==true){excluded.notFirstExposure++;continue;}
  if(a.completed!==true){excluded.incomplete++;continue;}
  const key=a.candidateId+':'+a.form;if(seen.has(key)){excluded.duplicate++;continue;}
  if(![60,75].includes(a.durationMinutes)||!Array.isArray(a.responses)||a.responses.length!==form.length)throw Error('Complete attempts require the stated 60/75-minute timer and one response per question.');
  const responses=new Map();for(const r of a.responses){const q=form.find(q=>q.questionId===r.questionId);if(!q||responses.has(r.questionId)||!Array.isArray(r.selected)||new Set(r.selected).size!==r.selected.length||!r.selected.every(i=>Number.isInteger(i)&&i>=0&&i<q.o.length))throw Error('Invalid/duplicate response at attempt '+index);responses.set(r.questionId,r.selected);}
  if(!Number.isFinite(a.elapsedSeconds)||a.elapsedSeconds<0||a.elapsedSeconds>a.durationMinutes*60)throw Error('Invalid elapsedSeconds at attempt '+index);
  const scores=form.map(q=>Number(equal(responses.get(q.questionId),q.a))),total=scores.reduce((s,n)=>s+n,0);seen.add(key);eligible.push({form:a.form,duration:a.durationMinutes,responses,scores,total,seconds:a.elapsedSeconds});
 }
 // Keep 60- and 75-minute conditions separate. No cross-form difficulty ranking without an equivalent cohort/anchor design.
 const strata=Object.entries(bank).flatMap(([name,questions])=>[60,75].map(duration=>{
  const rows=eligible.filter(a=>a.form===name&&a.duration===duration),n=rows.length;
  return {form:name,durationMinutes:duration,n,status:n?'observed-unvalidated':'awaiting-candidate-data',meanScore:n?mean(rows.map(r=>r.total)):null,passProportion:n?rows.filter(r=>r.total>=26).length/n:null,meanElapsedSeconds:n?mean(rows.map(r=>r.seconds)):null,
   items:questions.map((q,i)=>{const scores=rows.map(r=>r.scores[i]),passed=scores.reduce((s,n)=>s+n,0),p=n?passed/n:null,r=correlation(scores,rows.map(row=>row.total-row.scores[i]));return {questionId:q.questionId,learningObjectiveId:q.learningObjectiveId,kLevel:q.kLevel,n,proportionCorrect:p,proportionCorrect95Wilson:interval(passed,n),correctedItemTotalCorrelation:r,
    unanswered:n?rows.filter(row=>row.responses.get(q.questionId).length===0).length/n:null,
    optionSelectionProportions:q.o.map((_,j)=>n?rows.filter(row=>row.responses.get(q.questionId).includes(j)).length/n:null),
    reviewFlags:[...(n&&n<30?['small-sample']:[]),...(r!==null&&r<0?['negative-discrimination']:[]),...(p!==null&&p>.95?['very-high-proportion-correct']:[]),...(p!==null&&p<.25?['low-proportion-correct']:[])]};})};
 }));
 return {version:1,bankFingerprint:input.bankFingerprint,eligibleAttempts:eligible.length,excluded,status:eligible.length?'observed-statistics-require-expert-interpretation':'awaiting-candidate-data',
  note:'No live-exam equivalence, calibrated pass probability or IRT scale is established. K levels are cognitive targets, not measured difficulty. Review flags are local screening choices, not ISTQB standards. No candidate IDs appear in this aggregate output.',strata};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const bank=JSON.parse(readFileSync(bankPath)).CTFL,ii=process.argv.indexOf('--input'),oi=process.argv.indexOf('--output');
 if(process.argv.includes('--fingerprint'))console.log(fingerprint(bank));
 else {if(ii<0||!process.argv[ii+1]||oi<0||!process.argv[oi+1])throw Error('Usage: node scripts/analyze-istqb-pilot.mjs --input private-pilot.json --output aggregate-report.json');const inputPath=resolve(process.argv[ii+1]),outputPath=resolve(process.argv[oi+1]);if(inputPath===outputPath)throw Error('Output must not overwrite input.');const input=JSON.parse(readFileSync(inputPath,'utf8'));if(input.evidenceType==='synthetic')throw Error('Synthetic fixtures are not accepted as candidate calibration evidence.');const result=analyzePilot(input,bank);writeFileSync(outputPath,JSON.stringify(result,null,2)+'\n');console.log(result.status+': '+result.eligibleAttempts+' eligible attempts.');}
}
