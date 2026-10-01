import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateContent } from '../scripts/validate-content.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'quilyn-content-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'data'));
  const registry = { tracks: [{ trackId: 'PSA', trackName: 'System Architect', modules: [
    { id: 'SA-M01', name: 'Module', ready: true, file: 'data/module.json' }
  ] }] };
  const module = { moduleId: 'SA-M01', moduleTitle: 'Module', learningObjectives: [],
    studyGuide: [], examPitfalls: [], quickRecap: [], practiceQuiz: [{
      questionId: 'Q1', scenario: 'Choose one', rationale: 'Explanation', type: 'single-select',
      options: [{ id: 'A', text: 'Yes' }, { id: 'B', text: 'No' }], correctOptions: ['A']
    }] };
  const bank = { PSA: { 'Exam 1': [{ d: 'Domain', q: 'Choose one', r: 'Explanation',
    t: 'single', o: ['Yes', 'No'], a: [0] }] } };
  function write() {
    for (const [file, value] of [['registry.json', registry], ['module.json', module], ['mock-exams.json', bank]])
      writeFileSync(join(root, 'data', file), JSON.stringify(value));
  }
  return { root, registry, module, bank, write };
}

test('valid content and supported legacy formats pass', t => {
  const f = fixture(t);
  f.write();
  assert.deepEqual(validateContent(f.root).errors, []);
  f.module.moduleId = 'm01';
  Object.assign(f.bank.PSA['Exam 1'][0], { t: 'multiple', a: [0, 1] });
  f.write();
  assert.deepEqual(validateContent(f.root).errors, []);
});

test('unknown answers, duplicate question IDs and inconsistent selection counts fail', t => {
  const f = fixture(t);
  f.module.practiceQuiz[0].correctOptions = ['Z'];
  f.module.practiceQuiz[0].selectCount = 2;
  f.module.practiceQuiz.push({ ...f.module.practiceQuiz[0] });
  f.bank.PSA['Exam 1'][0].a = [9];
  f.write();
  const errors = validateContent(f.root).errors.join('\n');
  for (const message of ['invalid correct answer', 'duplicate question ID', 'selectCount does not match', 'invalid answer index'])
    assert.ok(errors.includes(message), errors);
});

test('duplicate registry IDs and mismatched content IDs fail', t => {
  const f = fixture(t);
  f.registry.tracks[0].modules.push({ ...f.registry.tracks[0].modules[0] });
  f.module.moduleId = 'unrelated';
  f.write();
  const errors = validateContent(f.root).errors.join('\n');
  assert.match(errors, /duplicate module ID/);
  assert.match(errors, /content ID does not match/);
});

test('missing files and paths escaping data are rejected', t => {
  const f = fixture(t);
  f.registry.tracks[0].modules[0].file = 'data/missing.json';
  f.write();
  assert.ok(validateContent(f.root).errors.some(error => error.includes('missing.json')));
  f.registry.tracks[0].modules[0].file = 'data/../../outside.json';
  f.write();
  assert.ok(validateContent(f.root).errors.some(error => error.includes('inside data/')));
});

test('unsafe source URLs and malformed top-level files fail', t => {
  const f = fixture(t);
  f.module.moduleUrl = 'javascript:alert(1)';
  f.write();
  assert.ok(validateContent(f.root).errors.some(error => error.includes('HTTPS source URL')));
  writeFileSync(join(f.root, 'data/registry.json'), '{broken');
  assert.ok(validateContent(f.root).errors.some(error => error.includes('registry.json')));
});
