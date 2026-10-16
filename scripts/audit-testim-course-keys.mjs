// Course evidence, not product documentation, controls these grading keys.
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
export const normalize=text=>String(text).normalize('NFKC').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const key=texts=>JSON.stringify(texts.map(normalize).sort());
export function auditCourseKeys({fixture=read('tests/fixtures/testim-course-keys.json'),bank=read('data/mock-exams.json'),readModule=read}={}){
  const conflicts=[],modules=new Map(),copies=new Set();
  for(const mapping of fixture.courseMappings){
    if(!modules.has(mapping.file))modules.set(mapping.file,readModule(mapping.file));
    const q=modules.get(mapping.file).practiceQuiz.find(q=>q.questionId===mapping.questionId),expected=key(fixture.curated[mapping.courseIndex].correctTexts);
    const actual=q&&q.correctOptions.map(id=>q.options.find(o=>o.id===id)?.text);
    if(!actual||actual.some(v=>v===undefined)||key(actual)!==expected)conflicts.push(mapping.moduleId+'/'+mapping.questionId+': differs from course question '+(mapping.courseIndex+1));
    for(const ref of mapping.mockCopies){copies.add(ref.bank+'/'+ref.index);const q=bank.TESTIM?.[ref.bank]?.[ref.index],actual=q&&q.a.map(i=>q.o[i]);if(!actual||actual.some(v=>v===undefined)||key(actual)!==expected)conflicts.push('TESTIM/'+ref.bank+'/'+(ref.index+1)+': differs from course question '+(mapping.courseIndex+1));}
  }
  const curated=bank.TESTIM?.['Mock Exam 6']||[];
  if(curated.length!==fixture.curated.length)conflicts.push('Mock Exam 6: question count changed');
  fixture.curated.forEach((source,i)=>{const q=curated[i];if(!q||q.q!==source.scenario||JSON.stringify(q.o.slice().sort())!==JSON.stringify(source.options.slice().sort())||q.a.some(a=>q.o[a]===undefined)||key(q.a.map(a=>q.o[a]))!==key(source.correctTexts))conflicts.push('Mock Exam 6/'+(i+1)+': curated source changed');});
  return {moduleQuestions:fixture.courseMappings.length,mockCopies:copies.size,curatedQuestions:curated.length,conflicts};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=auditCourseKeys();console.log(`Testim course keys: ${report.moduleQuestions} module links; ${report.mockCopies} generated copies; ${report.curatedQuestions} curated questions; ${report.conflicts.length} conflicts.`);
  if(report.conflicts.length){console.error(report.conflicts.join('\n'));process.exitCode=1;}
}
