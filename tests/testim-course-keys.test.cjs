const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/testim-course-keys.json')),bank=JSON.parse(fs.readFileSync('data/mock-exams.json'));
const sorted=a=>a.slice().sort();
test('superseded Testim practice grading is retained as input but cannot silently become course-key grading',()=>{
 const vm=require('node:vm'),window={addEventListener(){}},values=new Map();vm.runInNewContext(fs.readFileSync('core/js/progress.js','utf8'),{window,document:{addEventListener(){}},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}});
 for(const spec of fixture.modules){const q=JSON.parse(fs.readFileSync(spec.file)).practiceQuiz.find(q=>q.questionId===spec.id),prior={version:2,answers:{[spec.id]:{selected:spec.superseded.correctOptions.slice(),graded:true,signature:window.QuilynProgress.quizSignature(spec.superseded)}}},before=JSON.stringify(prior);
  assert.equal(Object.keys(window.QuilynProgress.quizState(prior,[q]).answers).length,0,spec.file+'/'+spec.id);assert.equal(JSON.stringify(prior),before);
 }
});
test('screenshot-verified Testim course keys override product-doc interpretations in all restored modules',()=>{
 assert.equal(fixture.modules.length,16);
 for(const spec of fixture.modules){const d=JSON.parse(fs.readFileSync(spec.file)),q=d.practiceQuiz.find(q=>q.questionId===spec.id);assert.equal(q.courseKeyReviewVersion,1);assert.equal(q.scenario,spec.scenario);assert.deepEqual(sorted(q.options.map(o=>o.text)),sorted(spec.options.map(o=>o.text)));assert.deepEqual(sorted(q.correctOptions.map(id=>q.options.find(o=>o.id===id).text)),sorted(spec.correctTexts),spec.file+'/'+spec.id);if(q.type==='multi-select')assert.equal(q.selectCount,q.correctOptions.length);assert.match(q.rationale,/Course Knowledge Check key:.*Documentation context \(not the grading key\)/);assert.ok(d.studyGuide.some(s=>s.sectionId===q.lessonSection));for(const o of q.options)assert.match(q.optionExplanations[o.id],q.correctOptions.includes(o.id)?/^Accepted/:/^Not accepted/);}
 const pins=fixture.modules.filter(q=>q.file.includes('m02_')&&['Q2','Q12'].includes(q.id)||q.file.includes('m28_')&&q.id==='Q3');assert.equal(pins.length,3);
});
test('all 55 hand-curated Testim Mock Exam 6 questions retain original course text, alternatives and keys',()=>{
 assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(bank.TESTIM['Mock Exam 6'])).digest('hex'),fixture.protectedBankSha256,'the entire curated bank, including rationale and recovery metadata, is untouched');
 const rows=bank.TESTIM['Mock Exam 6'];assert.equal(rows.length,55);rows.forEach((q,i)=>{const expected=fixture.curated[i];assert.equal(q.q,expected.scenario,'row '+i);assert.deepEqual(sorted(q.o),sorted(expected.options));assert.deepEqual(sorted(q.a.map(a=>q.o[a])),sorted(expected.correctTexts),'row '+i);});
 assert.deepEqual(bank.TESTIM['Mock Exam 6'][54].a,[0,3]);assert.match(rows[54].r,/course's answer key/);
});
test('generated Testim mock copies match restored module content and consistent option feedback',()=>{
 const copies=JSON.parse(fs.readFileSync('docs/reports/testim-key-review.json')).updatedMockCopies;assert.equal(copies.length,16);
 for(const ref of copies){const spec=fixture.modules.find(s=>s.id===ref.questionId&&JSON.parse(fs.readFileSync(s.file)).moduleId===ref.module),q=bank.TESTIM[ref.bank][ref.index];assert.equal(q.q,spec.scenario);assert.deepEqual(sorted(q.o),sorted(spec.options.map(o=>o.text)));assert.deepEqual(sorted(q.a.map(i=>q.o[i])),sorted(spec.correctTexts));q.o.forEach((o,i)=>assert.match(q.optionExplanations[String.fromCharCode(65+i)],q.a.includes(i)?/^Accepted/:/^Not accepted/));assert.equal(q.answerReviewVersion,1);assert.ok(q.previousQuestion);}
});
