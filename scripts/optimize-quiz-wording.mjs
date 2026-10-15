// Reviewed edits only: shorten redundant option detail; retain exact old signatures.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { banks, root } from './audit-quiz-bias.mjs';
const edits={
 'PBA/BA-M02/Q9':'Generated Rules inherit these names, hindering later identification',
 'PBA/BA-M02/Q22':'Layers organize reusable application tiers above Pega Platform; Rulesets bundle reusable Rules',
 'PBA/BA-M03/Q4':'The data access layer insulates business logic from system-of-record details',
 'PSA/SA-M15/m15_q01':'Both measure time from work start: the goal is the desired target; the deadline is the later mandatory limit.',
 'PSA/SA-M15/m15_q03':'Case Urgency prioritizes the Case; Assignment Urgency prioritizes a task and initially inherits Case Urgency (default 10).',
 'PSSA/SSA-M09/SSA-M09-Q08':'Save changes to one case in two sessions and observe the second save',
 'PSSA/SSA-M14/SSA-M14-Q04':'A keyed lookup does not itself reload the cached source list',
 'TAS1/TAS1-M00/Q3':'Enable the required extension in the guest browser being scanned.',
 'TAS1/TAS1-M05/Q3':'A Business Parameter linked to the TestStepValue and set at each block reference.',
 'TAS2/TAS2-M03/Q4':'Inspect automatic XL paths for uniquely matching empty values; explicitly map the remaining values.',
 'TAS2/TAS2-M08/Q3':'Use the common linking, mapping, checking and generation workflow; review API transport and assertions.',
 'TAPI/TAPI-M00/Q4':'Verify response data and business effects with explicit assertions.',
 'TAPI/TAPI-M03/Q3':'They indicate intended sequence; verify the actual exported test-step order.',
 'TAPI/TAPI-M06/Q3':'Select the ModuleAttribute and new element, use API Testing Update, then inspect XPath.',
 'TDS2/TDS2-M00/Q3':'Acquiring specific test data and efficiently tracking its state.',
 'TDS2/TDS2-M02/Q2':'Assign to a ComponentFolder or applicable TestCase/execution objects; check scope and inheritance.',
 'TDS2/TDS2-M03/Q2':'Select items by criteria and assign distinct aliases to sender and recipient.',
 'AE1/AE1-M01/Q1':'The .NET foundation for Engines 3.0, providing a common GUI/non-GUI interface.',
 'AE1/AE1-M01/Q6':'Constraint matches the Product row before acting on its Price cell.',
 'AE1/AE1-M02/Q5':'When testing the Excel interface: windows, dialogs or embedded controls.',
 'TMOB/TMOB-M05/Q3':'Compare effective TCPs, endpoint reachability and session logs.',
 'TMOB/TMOB-M06/Q4':'Weak accessibility metadata exposed by the native app.',
 'TMOB/TMOB-M12/Q1':'Whether the device/AVD is booted and responsive without TMA or Tosca.',
 'TESTIM/TESTIM-M05/Q3':'Isolation from ordinary saved cookies and login state.',
 'TESTIM/TESTIM-M08/Q5':'A CSV/database source linked through a Config File.',
 'TESTIM/TESTIM-M09/Q1':'Repeat actions/validations for similar elements, such as table rows.'
};
const signature=q=>JSON.stringify([q.type,q.scenario,q.options.map(o=>[o.id,o.text]).sort((a,b)=>a[0].localeCompare(b[0])),q.correctOptions.slice().sort()]);
if(!process.argv.includes('--write'))throw Error('Use --write to apply the reviewed wording edits.');
const found=new Set();let count=0;
for(const g of banks().filter(g=>g.kind==='practice')){let changed=false;for(const q of g.questions){const key=g.track+'/'+g.name+'/'+q.questionId,text=edits[key];if(!text)continue;found.add(key);if(q.correctOptions.length!==1)throw Error('Unexpected multi-select edit '+key);const option=q.options.find(o=>o.id===q.correctOptions[0]);if(option.text===text)continue;const previous=signature(q);q.previousSignatures=[...new Set([...(q.previousSignatures||[]),previous])];option.text=text;changed=true;count++;}if(changed)writeFileSync(resolve(root,g.file),JSON.stringify(g.data,null,2)+'\n');}
if(found.size!==Object.keys(edits).length)throw Error('A reviewed edit target is missing');
console.log(`Applied ${count} reviewed wording edits; answer IDs and prior-signature compatibility retained.`);
