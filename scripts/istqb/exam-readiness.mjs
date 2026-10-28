import { official, syllabus, rules, structure, reviewedOn } from './resources.mjs';
export const examReadiness = {
 sectionId:'exam-readiness',sectionTitle:'Exam essentials and booking checklist',elements:[
  {type:'note',text:'Verified against the official CTFL downloads on '+reviewedOn+'. Qualification: CTFL v4.0; English syllabus: v4.0.1. The structure tables (v1.19) are shared by all ISTQB schemes; their newer date does not change the CTFL v4.0 exam.'},
  {type:'table',headers:['Requirement','What it means for your preparation'],rows:[
   ['Format and pass mark','40 multiple-choice questions, 40 points; 26 points (65%) pass. Each question is worth one point, including K3 application questions.'],
   ['Time','60 minutes normally; 75 minutes with the non-native exam-language extension. Confirm the request process and arrangements before booking.'],
   ['Scope','All substantive content in chapters 1–6 matters, including concepts without a dedicated LO. Keywords require understanding under rules v1.2; the LO labels retain their specified K levels. Glossary keywords related to the syllabus are examinable, and keyword answers are judged against the ISTQB Glossary definitions (rules 4.1.3, 2.1.4).'],
   ['Scope boundary','Introduction and appendices are excluded from the examinable sections. Referenced standards/books are examinable only to the extent summarized in the syllabus; external reading is not an extra syllabus.'],
   ['Chapter allocation','Chapters 1–6: 8, 6, 4, 11, 9, 2 questions. Chapters 4 and 5 together account for 20/40; do not omit lower-weight chapters.'],
   ['Cognitive allocation','8 K1 recall, 24 K2 understanding, 8 K3 application questions. K3 is a cognitive task level, not a measured difficulty rating.'],
   ['Preparation route','The official qualification page supports self-study as an option. Quilyn does not issue the ISTQB certificate or provide accredited training.']
  ]},
  {type:'steps',title:'Before paying for an exam',items:[
   'Use the official provider directory. Confirm CTFL v4.0, the exam language, delivery method and the syllabus edition covered by your booking.',
   'Check the provider’s current identity requirements, fees, rescheduling/retake terms, accessibility arrangements and permitted materials. These administrative details depend on your provider; they are not Quilyn settings.',
   'For a remote exam, complete the provider’s equipment, network and room checks. Arrange any language extension or other accommodation before the deadline given by that provider.',
   'Keep official sample D unseen. Attempt it under your approved time conditions, then use its answer explanations to diagnose gaps across the full syllabus.'
  ]},
  {type:'text',text:'Timed rehearsal strategy (Quilyn advice): budget about one minute per K1/K2 item and three minutes per K3 item: 32 + 24 = 56 minutes, leaving about four minutes to check flagged items and selection counts. Read how many answers are requested. Move on from a stalled calculation and return if the exam interface permits it. The tables give approximate task timings, not individual time limits.'},
  {type:'text',text:'Readiness self-check: can you solve an unfamiliar model without hints, explain a term with a new example, and justify rejected alternatives? Keep a short error log with LO, mistaken rule, corrected derivation and a later closed-notes retry. Fresh results are useful evidence; a repeated passing score or a local mastery badge is not proof of a future pass.'},
  {type:'links',title:'Official requirements and registration',items:[{label:'CTFL qualification and current downloads',url:official},{label:'Find an ISTQB exam provider',url:'https://istqb.org/exam-providers/?directory_type=exam-providers&exam=CTFL+4.0'},{label:'Syllabus: scope and examination sections 0.5–0.6',url:syllabus+'#page=11'},{label:'Exam rules v1.2',url:rules},{label:'Structure tables v1.19: CTFL overview and allocation',url:structure+'#page=3'}]}
 ]
};
