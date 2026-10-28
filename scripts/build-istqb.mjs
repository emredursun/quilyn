import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { objectives, chapters } from './istqb/curriculum.mjs';
import { practice } from './istqb/practice.mjs';
import { misconceptions } from './istqb/pitfalls.mjs';
import { keywords } from './istqb/keywords.mjs';
import { keywordChecks } from './istqb/keyword-checks.mjs';
import { examReadiness } from './istqb/exam-readiness.mjs';
import { introduction } from './istqb/introduction.mjs';
import { workedModels, exampleAfterPractice } from './istqb/worked-models.mjs';
import { forms, parseRows } from './istqb/mock-concepts.mjs';
import { applications } from './istqb/mock-applications.mjs';
import { revise } from './istqb/structure-revisions.mjs';
import { groups } from './istqb/blueprint.mjs';
import { official,syllabus,structure,rules,samples,reviewedOn,attribution,disclosure,learningSource,bvaClarification } from './istqb/resources.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)), checking=process.argv.includes('--check');
function write(path,value){const full=resolve(root,path),text=JSON.stringify(value,null,2)+'\n';if(checking){if(readFileSync(full,'utf8')!==text)throw Error('Stale ISTQB content: '+path);}else{mkdirSync(resolve(full,'..'),{recursive:true});writeFileSync(full,text);}}
const byId=new Map(objectives.map(o=>[o.id,o]));
const page=[14,24,32,38,47,58];
const sourceFor=lo=>syllabus+'#page='+page[byId.get(lo).chapter-1];
const sectionFor=lo=>lo.toLowerCase().replaceAll('.','-');
function ordered(q,id){
 if(!byId.has(q.lo)||!q.q||!q.r||q.o.length!==(q.a.length===1?4:5)||new Set(q.o).size!==q.o.length)throw Error('Malformed authored question '+id);
 // Reproducible hash-based permutation, independent of correctness and wording length.
 const order=q.o.map((_,i)=>i).sort((a,b)=>Buffer.compare(createHash('sha256').update(id+':'+a).digest(),createHash('sha256').update(id+':'+b).digest()));
 return {...q,questionId:id,o:order.map(i=>q.o[i]),a:q.a.map(i=>order.indexOf(i)).sort((a,b)=>a-b)};
}
// Balance correct single-answer positions without creating a periodic answer pattern.
function balance(rows,seed){
 const single=rows.filter(q=>q.a.length===1),targets=single.map((_,i)=>i%4);
 const keyed=single.map(q=>({q,key:createHash('sha256').update(seed+q.questionId).digest('hex')})).sort((a,b)=>a.key.localeCompare(b.key));
 keyed.forEach(({q},i)=>{const target=targets[i],old=q.a[0];[q.o[target],q.o[old]]=[q.o[old],q.o[target]];q.a=[target];});
 return rows;
}
const registry=JSON.parse(readFileSync(resolve(root,'data/registry.json'))),bank=JSON.parse(readFileSync(resolve(root,'data/mock-exams.json')));
const track={trackId:'CTFL',trackName:'ISTQB Certified Tester Foundation Level (CTFL v4.0)',missionUrl:official,plannedModuleCount:6,
 exam:{version:'CTFL v4.0',syllabusVersion:'4.0.1',timeMinutes:60,extendedTimeMinutes:75,passPercent:65,questionCount:40,passingScore:26,bankDisclosure:disclosure,sourceUrl:official},modules:[]};
const studyMethod={sectionId:'study-method',sectionTitle:'How to study and use the official sources',elements:[
 {type:'text',text:'Target: CTFL v4.0 using the v4.0.1 errata syllabus (2024-09-15). Each mock has 40 one-point questions; 26 points pass in 60 minutes. The official tables include 75 minutes for eligible non-native-language candidates: confirm eligibility and arrangements with your provider. Multi-select items require the complete correct set; no partial credit is awarded in Quilyn.'},
 {type:'text',text:'Use the entire official syllabus and its chapter keywords alongside these notes. The May 2025 Exam Structures and Rules v1.2 says Foundation keywords are examinable for understanding (K2), while the older syllabus introduction describes recall (K1). Practice explaining and applying terms, not just recognizing labels.'},
 {type:'steps',title:'A repeatable study session',items:['Before reading, write down what you already know or guess about the topic, then attempt its two-question quiz. Wrong first guesses are expected. Mark uncertain correct guesses for review too.','Read the decision rule and the worked example. Then attempt each Try first exercise on paper before opening its solution. In quizzes, explain why each wrong option fails before reading the rationale. If you already use a technique at work, go straight to its exercise.','Use the topic selector for focused practice, then take the full chapter quiz. Only the full quiz updates module mastery.','Return on later days through Smart Review. As a practical starting schedule, revisit after 1, 3, 7 and 14 days; adjust to your results and exam date. These intervals are a study suggestion, not a validated optimal schedule.','Mix related techniques after you can solve them individually: EP/BVA, state/table models, statement/branch coverage, estimation/prioritization. Mixing helps you choose the right technique; its evidence is less consistent than for testing and spacing. Record the mistaken rule, corrected reasoning and a new example.','Take each mock once under simulation conditions before reading feedback. Review wrong answers and correct guesses. Use official samples A–C as timed checks between mocks and keep sample D unseen for a final external check.']},
 {type:'table',headers:['Phase','Suggested work','Evidence to inspect'],rows:[['Days 1–5','Chapter 1 and 2 topics, daily due reviews','Explain objectives, activities, levels and types without notes'],['Days 6–8','Chapter 3 and early chapter 4 topics','Resolve review roles and derive partitions and boundary sets'],['Days 9–14','Remaining chapter 4 and chapter 5','Solve unfamiliar models and calculations, including why alternatives fail'],['Days 15–17','Chapter 6, mixed recall, mocks 1–2','Identify weak objectives and high-confidence mistakes'],['Days 18–21+','Mocks 3–6 on separate days with correction between attempts','Use fresh first-attempt results, timing and per-chapter weaknesses'],['Before booking','Unseen official sample D and a full syllabus/keyword sweep','No pass guarantee: confirm rules and arrangements with the provider']]},
 {type:'note',text:'This is a flexible sequence, not a promise of preparation in 21 days. The syllabus requires accredited courses to provide at least '+chapters.reduce((sum,chapter)=>sum+chapter[1],0).toLocaleString('en-US')+' teaching minutes (18 h 55 min) of instruction. That is a course minimum, not a self-study estimate; beginners may need substantially longer. A 70% Quilyn module mastery score is a local study rule, separate from the official 65% exam pass mark. Two correct topic answers are a starting check, not mastery evidence.'},
 {type:'links',title:'Verified official sources and learning research',items:[{label:'ISTQB CTFL certification and current downloads',url:official},{label:'Full syllabus v4.0.1, including all chapter keywords',url:syllabus},{label:'Exam Structures and Rules v1.2 (2025-05-02)',url:rules},{label:'Exam Structure Tables v1.19 (2026-08-19)',url:structure},{label:'ISTQB official glossary: use the CTFL syllabus context',url:'https://glossary.istqb.org/'},{label:'Dunlosky et al. (2013): practice testing and distributed practice',url:learningSource},...samples.flatMap(s=>[{label:'Official sample '+s.set+' questions v'+s.version,url:s.questions},{label:'Official sample '+s.set+' answers v'+s.version+' — open after attempting',url:s.answers}])]},
 {type:'note',text:'The official A–D documents are published sample exams, not authenticated past live papers. Open them at ISTQB; their questions are not republished in this repository. Quilyn forms are independently authored syllabus-aligned practice, not predictions of the next live paper.'}
]};
const modules=chapters.map(([title,minutes,count],i)=>{
 const n=i+1,id='CTFL-C'+n,file='data/istqb-ctfl/chapter-'+n+'.json',los=objectives.filter(o=>o.chapter===n),k3=los.filter(o=>o.k==='K3').map(o=>o.id);
 const rows=balance(practice.filter(q=>byId.get(q.lo).chapter===n).map((q,j)=>ordered(q,id+'-Q'+String(j+1).padStart(2,'0'))),id);
 const data={moduleId:id,moduleTitle:n+'. '+title,moduleUrl:syllabus+'#page='+page[i],platformVersion:'CTFL v4.0 / syllabus v4.0.1',sourceReviewedOn:reviewedOn,
  examDomain:title,estTime:minutes+' min syllabus teaching allocation + retrieval practice (not a measured completion estimate)',
  learningObjectives:los.map(o=>o.id+' ('+o.k+'): '+o.title),quizTopics:los.map(o=>({id:o.id,title:o.title})),
  topics:[{title:'Official chapter '+n+' — '+title,url:syllabus+'#page='+page[i]}],
  studyGuide:[...(i===0?[introduction,examReadiness,studyMethod]:[]),{sectionId:'chapter-keywords',sectionTitle:'Chapter keywords: explain, distinguish and exemplify',elements:[{type:'note',text:'These are original plain-language explanations, not quotations from the official glossary. For each term, give a new example and explain its difference from a neighboring term. Use the official glossary with the CTFL syllabus context for authoritative wording.'},{type:'table',headers:['Keyword','Working explanation'],rows:keywords[i]},{type:'links',items:[{label:'ISTQB official glossary',url:'https://glossary.istqb.org/'}]}]},{sectionId:'chapter-orientation',sectionTitle:'Chapter plan',elements:[{type:'text',text:'Official exam weighting: '+count+'/40 questions ('+(Math.round(count/40*1000)/10)+'%). Work in short topic blocks; retrieve before rereading. The chapter quiz contains '+rows.length+' original questions across all objectives of this chapter. Revisit high-confidence errors with Smart Review and use the full official chapter and keywords to check completeness.'},...(k3.length?[{type:'note',text:'K3 application objectives here: '+k3.join(', ')+'. Practise them on paper with the Try first exercises until you can solve unseen examples without hints.'}]:[])]},...los.map(o=>({sectionId:sectionFor(o.id),sectionTitle:o.id+' · '+o.title+' · '+o.k,elements:[{type:'concept',term:o.title,description:o.rule},...(exampleAfterPractice.has(o.id)?[]:[{type:'text',text:'Worked example: '+o.example}]),...(workedModels[o.id]||[]),...(exampleAfterPractice.has(o.id)?[{type:'text',text:'Recap example: '+o.example}]:[]),{type:'note',text:'Close the notes: '+o.recall},{type:'links',title:'Source',items:[{label:'CTFL syllabus v4.0.1, section '+o.section+' ('+o.id+')',url:sourceFor(o.id)},...(o.id==='FL-4.2.2'?[{label:'ISTQB clarification: derive BVA from the domain and all partition boundaries',url:bvaClarification}]:[])]}]})),{sectionId:'keyword-self-check',sectionTitle:'Keyword self-check: chapter '+n,elements:[{type:'note',text:'Attempt these after studying the chapter, without looking at the keyword table. Explain each answer in your own words, then open the solution.'},...keywordChecks[i]]}],
  examPitfalls:los.map(o=>({title:o.id+' · '+o.title,trapDescription:misconceptions[o.id],bestPractice:o.rule+' Self-check: '+o.recall})),
  practiceQuiz:rows.map(q=>({questionId:q.questionId,type:'single-select',scenario:q.q,options:q.o.map((text,j)=>({id:'ABCD'[j],text})),correctOptions:q.a.map(j=>'ABCD'[j]),rationale:q.r,hint:'Identify the objective and apply the decision rule to the facts before comparing alternatives.',learningObjectiveId:q.lo,kLevel:byId.get(q.lo).k,lessonSection:sectionFor(q.lo),sourceUrl:sourceFor(q.lo),provenance:'original-quilyn',sourceReviewedOn:reviewedOn})),
  quickRecap:los.map(o=>({key:o.id+' · '+o.title,value:o.rule}))};
 write(file,data);track.modules.push({id,name:n+'. '+title,file,ready:true,studyArea:title,studyEstimate:data.estTime});return data;
});
const exams=Object.fromEntries(forms.map((form,i)=>{
 const name='Mock Exam '+(i+1),rows=balance([...revise(parseRows(form),i),...parseRows(applications[i])].map((q,j)=>ordered(q,'CTFL-M'+(i+1)+'-Q'+String(j+1).padStart(2,'0'))),'CTFL-M'+i);
 for(const group of groups)if(rows.filter(q=>group.ids.includes(q.lo)).length!==group.count)throw Error(name+': official LO group mismatch '+group.ids);
 // Interleave chapters reproducibly, preserving permanent item IDs and answer keys.
 rows.sort((a,b)=>createHash('sha256').update('form-order:'+a.questionId).digest('hex').localeCompare(createHash('sha256').update('form-order:'+b.questionId).digest('hex')));
 return [name,rows.map(q=>({questionId:q.questionId,d:chapters[byId.get(q.lo).chapter-1][0],chapter:byId.get(q.lo).chapter,learningObjectiveId:q.lo,kLevel:byId.get(q.lo).k,t:q.a.length===1?'single':'multi',q:q.q+(q.a.length>1?' Select TWO answers.':''),o:q.o,a:q.a,r:q.r,src:sourceFor(q.lo),provenance:'original-quilyn',sourceReviewedOn:reviewedOn,points:1}))];
}));
const stems=[...modules.flatMap(m=>m.practiceQuiz.map(q=>q.scenario)),...Object.values(exams).flat().map(q=>q.q)];
if(new Set(stems.map(s=>s.toLowerCase().replace(/[^a-z0-9]/g,''))).size!==stems.length)throw Error('Duplicate ISTQB question stem');
registry.tracks=registry.tracks.filter(t=>t.trackId!=='CTFL');registry.tracks.push(track);bank.CTFL=exams;
write('data/registry.json',registry);write('data/mock-exams.json',bank);
write('data/istqb-ctfl/coverage.json',{version:1,reviewedOn,examVersion:'CTFL v4.0',syllabusVersion:'4.0.1',rulesVersion:'1.2',structureVersion:'1.19',official,syllabus,rules,structure,bvaClarification,samples,attribution,disclosure,
 chapterKeywords:keywords.map(rows=>rows.map(row=>row[0])),chapterQuestionCounts:[8,6,4,11,9,2],kLevelCounts:{K1:8,K2:24,K3:8},groups,
 objectives:objectives.map(o=>({id:o.id,kLevel:o.k,title:o.title,chapter:o.chapter,section:o.section,sourceUrl:sourceFor(o.id),practiceIds:modules.flatMap(m=>m.practiceQuiz).filter(q=>q.learningObjectiveId===o.id).map(q=>q.questionId),mockIds:Object.values(exams).flat().filter(q=>q.learningObjectiveId===o.id).map(q=>q.questionId)}))});
console.log('ISTQB: 6 chapters, 64 objectives, 128 topic questions, 6 × 40 separate mock questions; official LO groups checked.');
