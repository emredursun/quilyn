import { official, syllabus, rules, structure, reviewedOn, attribution } from './resources.mjs';
// Neutral orientation shown first in the track: purpose, version basis, recommended use and limits.
export const introduction = {
 sectionId:'about-this-track',sectionTitle:'About this preparation track',elements:[
  {type:'text',text:'This track is a structured reference and practice resource for candidates preparing for the ISTQB® Certified Tester Foundation Level (CTFL) v4.0 exam. It is based on the current official publications: CTFL Syllabus v4.0.1, Exam Structures and Rules v1.2 and Exam Structures and Rules Tables v1.19. These versions were last checked against the official ISTQB page on '+reviewedOn+'.'},
  {type:'table',headers:['This track provides','Use the official ISTQB sources for'],rows:[
   ['Study notes for every learning objective in chapters 1–6','The complete syllabus text, on which every exam question is based'],
   ['Worked examples and “Try first” exercises for the K3 (apply) learning objectives','Authoritative terminology in the ISTQB Glossary'],
   ['Topic quizzes, keyword self-checks and six timed practice exams','The official sample exams A–D and their answer explanations'],
   ['Exam-format practice: 40 questions, 26 points to pass, 60 minutes (75 if you take the exam in a non-native language)','Exam rules, exam providers and registration']
  ]},
  {type:'note',text:'Recommended use: read the official syllabus in full and treat it as the primary source. Use this track to organise your study, practise applying the content and identify gaps. Where anything here differs from an official ISTQB document, the official document applies.'},
  {type:'list',title:'Quality and limitations',items:[
   'All notes and questions are original. They are not official, past or live exam questions and do not predict future exam content.',
   'The content was checked against the official documents in several AI-assisted reviews, and the issues found were corrected. It has not been signed off by a human ISTQB subject-matter expert.',
   'Question difficulty has not yet been calibrated with candidate results, so practice scores are an indication, not a prediction of the exam result.',
   'Official documents may be updated. Check the official CTFL page for the current versions before you book.'
  ]},
  {type:'note',text:attribution+' ISTQB® is a registered trademark of the International Software Testing Qualifications Board. Completing this track does not lead to certification; certification requires passing the official exam with an ISTQB-recognised exam provider. Accredited training is optional and available from ISTQB Accredited Training Providers.'},
  {type:'links',title:'Official sources',items:[{label:'ISTQB CTFL v4.0 certification page',url:official},{label:'CTFL Syllabus v4.0.1',url:syllabus},{label:'Exam Structures and Rules v1.2',url:rules},{label:'Exam Structures and Rules Tables v1.19',url:structure},{label:'ISTQB exam providers',url:'https://istqb.org/exam-providers/'},{label:'ISTQB Glossary',url:'https://glossary.istqb.org/'}]}
 ]
};
