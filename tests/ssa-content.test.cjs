const fs = require('fs');
const assert = require('assert');
const registry = JSON.parse(fs.readFileSync('data/registry.json', 'utf8'));
const track = registry.tracks.find(t => t.trackId === 'PSSA');
assert(track, 'SSA track is registered');
assert.equal(Object.values(track.exam.blueprint).reduce((a, b) => a + b, 0), 100);
const moduleIds = new Set();
const questionIds = new Set();
let topicCount = 0;
for (const meta of track.modules.filter(m => m.ready !== false)) {
  assert(!moduleIds.has(meta.id), 'Unique module ID');
  moduleIds.add(meta.id);
  const data = JSON.parse(fs.readFileSync(meta.file, 'utf8'));
  assert.equal(data.moduleId, meta.id, 'Stable IDs for progress and SRS');
  assert.equal(data.examDomain, meta.examDomain);
  const sources = new Set(data.topics.map(t => t.url));
  topicCount += sources.size;
  assert(data.studyGuide.length >= data.topics.length);
  for (const question of data.practiceQuiz) {
    assert(!questionIds.has(question.questionId), 'Unique SRS card ID');
    questionIds.add(question.questionId);
    assert(sources.has(question.sourceUrl), 'Question links to a module topic');
    const options = new Set(question.options.map(o => o.id));
    assert.equal(options.size, question.options.length);
    assert(question.correctOptions.length > 0);
    assert.equal(new Set(question.correctOptions).size, question.correctOptions.length);
    assert(question.correctOptions.every(a => options.has(a)));
    assert.equal(question.type, question.correctOptions.length === 1 ? 'single-select' : 'multi-select');
    assert(question.rationale && question.hint);
  }
  for (const source of sources) {
    assert(data.practiceQuiz.some(q => q.sourceUrl === source), 'Each topic has retrieval practice');
  }
}
console.log(`SSA content verified: ${moduleIds.size} modules, ${topicCount} topics, ${questionIds.size} questions.`);
assert.equal(moduleIds.size, 25, 'Full SSA mission is available');
const forms = JSON.parse(fs.readFileSync('data/mock-exams.json', 'utf8')).PSSA;
assert.equal(Object.keys(forms).length, 3);
const used = new Set();
for (const questions of Object.values(forms)) {
  assert.equal(questions.length, 60, 'Full exam length');
  const domains = {};
  const covered = new Set();
  for (const question of questions) {
    assert(questionIds.has(question.sourceQuestionId), 'Mock question lineage exists');
    assert(!used.has(question.sourceQuestionId), 'No repeat between forms');
    used.add(question.sourceQuestionId);
    covered.add(question.sourceModuleId);
    domains[question.d] = (domains[question.d] || 0) + 1;
  }
  assert.equal(covered.size, 25, 'Each form covers all modules');
  for (const [domain, percent] of Object.entries(track.exam.blueprint)) {
    assert.equal(domains[domain], percent * 60 / 100, 'Blueprint matches official weighting');
  }
}
