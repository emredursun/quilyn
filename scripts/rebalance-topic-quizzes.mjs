import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { exercises } from './audit-topic-quizzes.mjs';
import { root } from './audit-quiz-bias.mjs';
const rank=s=>createHash('sha256').update('quilyn-topic-balance-2026-10-15/'+s).digest().readUInt32BE();
// Answer prose is shortened only where the full rationale already supplies it.
const edits={
  "SA-M01/Q1": [
    "App Studio",
    "Dev Studio",
    "Admin Studio",
    "Prediction Studio"
  ],
  "SA-M01/Q2": [
    "Dev Studio",
    "App Studio",
    "Admin Studio",
    "A separate Wait Step with a Timer"
  ],
  "SA-M01/Q3": [
    "Attended RPA",
    "Unattended RPA queued for tonight",
    "A standard API connector",
    "Manual terminal re-entry by the CSR"
  ],
  "SA-M01/Q4": [
    "Extend the Rule scope in Dev Studio to the shared application level",
    "Copy the Rule into each Case Type using App Studio",
    "Create a separate Rule for each Case Type",
    "Set an 'All Case Types' visibility flag in Admin Studio"
  ],
  "SA-M02/Q1": [
    "A second Create Stage was added",
    "The Resolution Stage name lacks a 'Resolved-' prefix",
    "Credit bureau lookup is an Automation Step",
    "The Credit Check Stage uses a noun phrase"
  ],
  "SA-M02/Q3": [
    "An empty placeholder requiring separate field and integration configuration",
    "No draft object: all data objects must be fully configured",
    "A configured object from names entered during the workshop",
    "A fully configured object, but only when using Dev Studio"
  ],
  "SA-M03/Q1": [
    "595 Operators and 3 Personas",
    "3 Operators and 3 Personas",
    "595 Operators and 595 Personas",
    "0 Operators and 3 Personas"
  ],
  "SA-M03/Q2": [
    "Nurse: Web and Mobile; Reviewer: Web",
    "One Channel per Persona; create a separate NurseMobile Persona",
    "Both Personas automatically get every configured Channel",
    "Mobile requires a separate Pega application"
  ],
  "SA-M05/Q1": [
    "Pega Blueprint design service",
    "Pega GenAI Autopilot",
    "Pega GenAI Coach",
    "Pega GenAI Connect"
  ],
  "SA-M05/Q2": [
    "Pega GenAI Autopilot",
    "Pega Blueprint",
    "Pega GenAI Knowledge Buddy",
    "Pega GenAI Agents with Tool Rules"
  ],
  "SA-M05/Q3": [
    "Pega GenAI Coach",
    "Pega Blueprint",
    "Pega GenAI Autopilot",
    "Pega GenAI Knowledge Buddy"
  ],
  "SA-M05/Q4": [
    "Pega GenAI Connect",
    "Pega GenAI Coach",
    "Pega Blueprint",
    "Pega GenAI Knowledge Buddy"
  ],
  "SA-M06/Q3": [
    "Blueprint accelerates initial design; continue configuration in App Studio",
    "Blueprint replaces App Studio with a deploy-ready application requiring no configuration",
    "Blueprint replaces App Studio during design; return there after the application goes live",
    "Blueprint output requires Dev Studio for every subsequent configuration change"
  ],
  "SA-M06/Q4": [
    "Review and refine the generated proposal before exporting it",
    "Export within 30 minutes before the proposal expires",
    "Run PremBridge before generation to ensure correct field names",
    "Rely on automatic schema validation instead of reviewing the proposal"
  ],
  "SA-M07/Q1": [
    "Use a Picklist to constrain the eight valid titles",
    "Keep free text and validate allowed titles on submission",
    "Encode job titles in a Boolean true/false field",
    "Keep Text and rely on automatic allowed-list autocomplete"
  ],
  "SA-M07/Q2": [
    "Calculate the fee from shipping type and show it read-only",
    "Keep an editable fee and validate it on submission",
    "Keep an editable fee alongside a hidden calculated fee",
    "Let the user select the fee from a Picklist"
  ],
  "SA-M08/Q1": [
    "The first: a data object defines structure; a record holds instance values",
    "The second: data object and record both combine structure and values",
    "The terms are reversed: a record defines structure; an object holds instance values",
    "They are identical in App Studio but distinct in Dev Studio"
  ],
  "SA-M08/Q2": [
    "Node scope, with appropriate refresh and parameter settings",
    "Requestor scope, shared across a user's Cases during their session",
    "Thread scope, limited to one Case thread",
    "Application scope, shared across every application node"
  ],
  "SA-M08/Q3": [
    "Integration Map",
    "Case Life Cycle",
    "Ruleset stack",
    "Security Checklist"
  ],
  "SA-M15/Q1": [
    "Goal: 2 hours; Deadline: 8 hours",
    "Deadline: 2 hours; Goal: 8 hours",
    "Only an 8-hour deadline; no goal",
    "Two deadlines at different urgency levels"
  ],
  "SA-M18/Q1": [
    "The manager's personal Worklist",
    "The Contract Approval Work Queue",
    "Broadcast to approver Worklists",
    "Route by lowest Assignment count"
  ],
  "SA-M18/Q2": [
    "The shared Document Verification Work Queue",
    "Each analyst's individual Worklist",
    "Round-robin across the twelve individual Worklists",
    "The team lead's personal Worklist"
  ],
  "SA-M18/Q3": [
    "It stays in their Worklist until the CSR or manager reassigns it",
    "It automatically returns to the Work Queue after 30 minutes of inactivity",
    "It becomes shared with the team when the CSR becomes inactive",
    "The SLA escalates it to the manager, who manually reassigns it"
  ],
  "SA-M21/Q1": [
    "The Enterprise base layer",
    "The Regional middle layer",
    "The Local Branch layer",
    "A new Global layer"
  ],
  "SA-M21/Q2": [
    "The UK Regional layer",
    "The shared Enterprise layer",
    "Each Local Branch layer",
    "A separate UK application"
  ],
  "SA-M22/Q2": [
    "Separate branch Rulesets for each developer's experiment",
    "Parallel minor Ruleset versions, merged after the experiments",
    "Separate studio rule repositories, merged on publishing",
    "Separate Pega servers, synchronized through export/import"
  ],
  "SA-M24/Q1": [
    "Create PDF",
    "Attach content",
    "Generate document",
    "Post to Pulse"
  ],
  "SA-M24/Q2": [
    "Push notification",
    "Send notification",
    "Send email",
    "Post to Pulse"
  ],
  "SA-M24/Q3": [
    "Run Data Transform",
    "Questionnaire",
    "Update a Case",
    "Wait"
  ],
  "SA-M25/Q1": [
    "A Decision shape",
    "A Subprocess",
    "An Automation shape",
    "An Assignment shape"
  ],
  "SA-M25/Q3": [
    "The Change Stage shape",
    "The End shape",
    "A Local Action",
    "A Collect information Step"
  ],
  "SA-M26/Q1": [
    "Function: Sum of",
    "Expression: field reference",
    "Decision table: conditions",
    "A When condition"
  ],
  "SA-M26/Q2": [
    "Expression: field multiplication",
    "Function: Maximum of",
    "Decision table: conditions",
    "Text concatenation"
  ],
  "SA-M15/Q3": [
    "Existing Assignments retain their Urgency; new Assignments inherit 30",
    "All open Assignments immediately inherit the new Urgency 30",
    "All Assignments reset to 10 and start climbing again",
    "Nothing changes until each Assignment's goal has elapsed"
  ],
  "SA-M16/Q2": [
    "Urgency remains 100; Notify Manager still executes",
    "Urgency remains 100; Notify Manager is suppressed",
    "Urgency increases beyond the maximum of 100",
    "Urgency reaches 100; the Assignment automatically completes"
  ]
};
if(!process.argv.includes('--write'))throw Error('Use --write for the one-time authored exercise rewrite.');
const all=exercises(),groups=all.filter(e=>e.array);
if(groups.some(e=>/quilyn-topic-balance-v1/.test(e.element.html)))throw Error('Topic exercises already rebalanced.');
const globalCounts=Array(4).fill(0),files=new Map();let questions=0,wording=0;
for(const e of groups){const counts=Array(4).fill(0),rows=e.array.value;for(const [i,q]of rows.entries()){
 const key=e.name+'/'+i,edit=edits[e.name.split(' / ')[0]+'/Q'+(i+1)];
 if(edit)for(const [index,text]of Object.entries(edit)){if(q.opts[index]!==text){q.opts[index]=text;wording++;}}
 if(e.name.startsWith('SA-M02 /')&&i===0)q.config=q.config.map(line=>line.replace(/\s*←\s*\[SA added a second Create Stage for document upload\]/,''));
 if(e.name.startsWith('SA-M02 /')&&i===2)q.scenario=undefined,q.intro='An SA creates CustomerProfile in the designer’s Data & Interfaces area. What should the SA expect from the new draft data object?';
 if(q.opts.length!==4)throw Error('Unexpected exercise option count');
 if(q.opts.some(o=>/\b(?:all|none) of (?:the )?above|\b(?:option|choice) [A-D]\b/i.test(o))||q.fbs.some(o=>/\b(?:option|choice) [A-D]\b|\b[B-D] (?:is|are|and|or)\b/.test(o)))throw Error('Review positional references manually: '+key);
 const target=[0,1,2,3].sort((a,b)=>counts[a]-counts[b]||globalCounts[a]-globalCounts[b]||rank(key+'/'+a)-rank(key+'/'+b))[0];
 const correct=q.correct,wrong=[0,1,2,3].filter(j=>j!==correct).sort((a,b)=>rank(key+'/wrong/'+a)-rank(key+'/wrong/'+b));
 const order=Array.from({length:4},(_,j)=>j===target?correct:wrong.shift());
 q.opts=order.map(j=>q.opts[j]);q.fbs=order.map(j=>q.fbs[j]);q.correct=target;counts[target]++;globalCounts[target]++;questions++;
 }
 e.element.html=e.element.html.slice(0,e.array.start)+JSON.stringify(rows,null,2)+e.element.html.slice(e.array.end);
 e.element.html=e.element.html.replace(/\bvar\s+(S|scenarios|problems)\s*=/,'/* quilyn-topic-balance-v1 */\n$&');
 const variable=/\bvar\s+(S|scenarios|problems)\s*=/.exec(e.element.html)[1];
 const increment=/if\s*\(\s*(?:ok|correct)\s*\)\s*score\+\+;/;
 const update="document.getElementById('prog').textContent='"+(variable==='problems'?'Problem':'Scenario')+" '+(cur+1)+' of '+"+variable+".length+' — Score: '+score+'/'+"+variable+".length;";
 if(!increment.test(e.element.html))throw Error('Unknown grading handler '+e.name);
 e.element.html=e.element.html.replace(increment,(match,offset,source)=>source.slice(offset+match.length).trimStart().startsWith(update)?match:match+'\n'+update);
 // Each exercise owns a module snapshot; merge edits before writing shared modules.
 if(!files.has(e.file))files.set(e.file,e.data);
 files.get(e.file).studyGuide[e.sectionIndex].elements[e.elementIndex]=e.element;
}
for(const [file,data]of files)writeFileSync(resolve(root,file),JSON.stringify(data,null,2)+'\n');
console.log({banks:groups.length,questions,positions:globalCounts,wordingEdits:wording});
