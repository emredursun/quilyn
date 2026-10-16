import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditCourseKeys} from '../scripts/audit-testim-course-keys.mjs';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
test('all linked course questions and generated copies follow the unchanged curated source',()=>{
  const result=auditCourseKeys();assert.equal(result.moduleQuestions,49);assert.equal(result.mockCopies,49);assert.equal(result.curatedQuestions,55);assert.deepEqual(result.conflicts,[]);
});
test('the course audit detects a key changed in place even when the correct-option ID stays the same',()=>{
  const changed=read('data/tosca-testim/m22_enhancing_test_workflows_integrations.json');changed.practiceQuiz[0].options.find(o=>o.id==='A').text='False';
  const result=auditCourseKeys({readModule:path=>path.endsWith('m22_enhancing_test_workflows_integrations.json')?changed:read(path)});assert.ok(result.conflicts.some(c=>c.startsWith('TESTIM-M22/Q1:')));
});
test('the course audit catches generated-copy drift and changes to the curated source independently',()=>{
  const bank=read('data/mock-exams.json');bank.TESTIM['Mock Exam 2'][10].a=[0,1];bank.TESTIM['Mock Exam 6'][48].a=[1];
  const result=auditCourseKeys({bank});assert.ok(result.conflicts.some(c=>c.startsWith('TESTIM/Mock Exam 2/11:')));assert.ok(result.conflicts.some(c=>c.startsWith('Mock Exam 6/49:')));
});
