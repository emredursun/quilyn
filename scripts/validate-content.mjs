import { readFileSync, statSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;

export function validateContent(root) {
  const errors = [];
  const stats = { tracks: 0, modules: 0, practiceQuestions: 0, mockQuestions: 0, jsonBytes: 0 };
  const check = (condition, message) => { if (!condition) errors.push(message); };
  function readJson(file) {
    try {
      const absolute = resolve(root, file);
      const data = JSON.parse(readFileSync(absolute, 'utf8'));
      stats.jsonBytes += statSync(absolute).size;
      return data;
    } catch (error) {
      errors.push(`${file}: ${error.message}`);
      return null;
    }
  }
  function sourceUrl(value, label) {
    if (value === undefined) return;
    // Historical training endpoint is retained as provenance. Runtime blocks
    // this HTTP-only external link; do not invent an unverified HTTPS target.
    if (value === 'http://webservice.toscacloud.com/training') return;
    try { check(new URL(value).protocol === 'https:', `${label}: expected an HTTPS source URL`); }
    catch { errors.push(`${label}: invalid source URL`); }
  }
  function unique(values, label) {
    check(new Set(values).size === values.length, `${label}: duplicate IDs or answers`);
  }
  const registry = readJson('data/registry.json');
  if (!record(registry) || !Array.isArray(registry.tracks)) {
    errors.push('data/registry.json: tracks must be an array');
    return { errors, stats };
  }
  check(registry.tracks.length > 0, 'Registry must contain a learning track');
  const trackIds = new Set();
  const moduleIds = new Set();
  const moduleFiles = new Set();
  for (const track of registry.tracks) {
    if (!record(track)) { errors.push('Registry track must be an object'); continue; }
    const label = `Track ${track.trackId}`;
    check(text(track.trackId) && /^[A-Za-z0-9-]+$/.test(track.trackId), `${label}: invalid ID`);
    check(!trackIds.has(track.trackId), `${label}: duplicate track ID`);
    trackIds.add(track.trackId);
    stats.tracks++;
    check(text(track.trackName), `${label}: missing name`);
    sourceUrl(track.missionUrl, `${label} missionUrl`);
    if (track.plannedModuleCount !== undefined) check(Number.isInteger(track.plannedModuleCount) && track.plannedModuleCount >= (Array.isArray(track.modules) ? track.modules.length : 0), `${label}: invalid planned module count`);
    if (!Array.isArray(track.modules)) { errors.push(`${label}: modules must be an array`); continue; }
    for (const meta of track.modules) {
      if (!record(meta)) { errors.push(`${label}: module metadata must be an object`); continue; }
      const moduleLabel = `${label} / ${meta.id}`;
      check(text(meta.id) && /^[A-Za-z0-9-]+$/.test(meta.id), `${moduleLabel}: invalid ID`);
      check(!moduleIds.has(meta.id), `${moduleLabel}: duplicate module ID`);
      moduleIds.add(meta.id);
      check(text(meta.name), `${moduleLabel}: missing name`);
      check(meta.ready === undefined || typeof meta.ready === 'boolean', `${moduleLabel}: ready must be boolean`);
      if (meta.ready === false) continue;
      if (!text(meta.file)) { errors.push(`${moduleLabel}: missing file`); continue; }
      const relativePath = relative(resolve(root, 'data'), resolve(root, meta.file));
      if (isAbsolute(meta.file) || relativePath.startsWith('..') || isAbsolute(relativePath) || !meta.file.endsWith('.json')) {
        errors.push(`${moduleLabel}: file must be a JSON file inside data/`);
        continue;
      }
      check(!moduleFiles.has(meta.file), `${moduleLabel}: file is registered more than once`);
      moduleFiles.add(meta.file);
      const data = readJson(meta.file);
      if (!record(data)) { errors.push(`${moduleLabel}: module must be an object`); continue; }
      stats.modules++;
      // Existing PSA files predate registry IDs. Keep this narrow compatibility
      // rule so validation does not require changing users' stored progress IDs.
      const legacyPsaId = track.trackId === 'PSA' && /^SA-M\d{2}$/.test(meta.id)
        ? `m${meta.id.slice(-2)}` : null;
      check(data.moduleId === meta.id || (legacyPsaId !== null && data.moduleId === legacyPsaId), `${moduleLabel}: content ID does not match registry`);
      check(text(data.moduleTitle), `${moduleLabel}: missing title`);
      for (const key of ['learningObjectives', 'studyGuide', 'examPitfalls', 'practiceQuiz', 'quickRecap'])
        check(Array.isArray(data[key]), `${moduleLabel}: ${key} must be an array`);
      sourceUrl(data.moduleUrl, `${moduleLabel} moduleUrl`);
      sourceUrl(data.moduleQuizUrl, `${moduleLabel} moduleQuizUrl`);
      if (data.sourceReviewedOn !== undefined) check(/^\d{4}-\d{2}-\d{2}$/.test(data.sourceReviewedOn) && Number.isFinite(Date.parse(data.sourceReviewedOn)), `${moduleLabel}: invalid review date`);
      for (const objective of (Array.isArray(data.learningObjectives) ? data.learningObjectives : [])) check(text(objective), `${moduleLabel}: invalid learning objective`);
      for (const topic of (Array.isArray(data.topics) ? data.topics : [])) {
        check(record(topic) && text(topic.title), `${moduleLabel}: invalid topic`);
        sourceUrl(topic.url, `${moduleLabel} topic URL`);
      }
      for (const section of (Array.isArray(data.studyGuide) ? data.studyGuide : [])) {
        if (!record(section) || !text(section.sectionTitle) || !Array.isArray(section.elements)) {
          errors.push(`${moduleLabel}: invalid study-guide section`); continue;
        }
        for (const el of section.elements) {
          if (!record(el)) { errors.push(`${moduleLabel}: invalid study-guide element`); continue; }
          check(['concept','analogy','text','interactive','diagram','links','list','note','table','steps','warning','pdf','pdfLibrary'].includes(el.type), `${moduleLabel}: unknown study-guide element ${el.type}`);
          if (el.type === 'concept') check(text(el.term) && text(el.description), `${moduleLabel}: invalid concept`);
          if (['analogy','text','note','warning'].includes(el.type)) check(text(el.text), `${moduleLabel}: invalid text element`);
          if (el.type === 'interactive') check(text(el.html) && text(el.title), `${moduleLabel}: invalid exercise`);
          if (el.type === 'diagram') check(text(el.svg) && !/<script\b|\son\w+\s*=|javascript:/i.test(el.svg), `${moduleLabel}: unsafe or empty SVG`);
          if (el.type === 'table') check(Array.isArray(el.headers) && el.headers.every(value => typeof value === 'string') && Array.isArray(el.rows) && el.rows.every(row => Array.isArray(row) && row.length === el.headers.length && row.every(cell => typeof cell === 'string')), `${moduleLabel}: invalid table`);
          if (['links','list','steps'].includes(el.type)) {
            check(Array.isArray(el.items), `${moduleLabel}: element items must be an array`);
            if (el.type === 'links') for (const item of el.items || []) sourceUrl(item.url, `${moduleLabel} reference URL`);
          }
        }
      }
      for (const pitfall of (Array.isArray(data.examPitfalls) ? data.examPitfalls : [])) check(record(pitfall) && text(pitfall.title) && text(pitfall.trapDescription) && text(pitfall.bestPractice), `${moduleLabel}: invalid pitfall`);
      for (const recap of (Array.isArray(data.quickRecap) ? data.quickRecap : [])) check(text(recap) || (record(recap) && text(recap.key) && text(recap.value)), `${moduleLabel}: invalid recap`);
      const questionIds = new Set();
      for (const question of Array.isArray(data.practiceQuiz) ? data.practiceQuiz : []) {
        const qLabel = `${moduleLabel} / ${question?.questionId}`;
        if (!record(question)) { errors.push(`${qLabel}: question must be an object`); continue; }
        stats.practiceQuestions++;
        check(text(question.questionId), `${qLabel}: missing ID`);
        check(!questionIds.has(question.questionId), `${qLabel}: duplicate question ID`);
        questionIds.add(question.questionId);
        check(text(question.scenario) && text(question.rationale), `${qLabel}: scenario and rationale are required`);
        check(['single-select', 'multi-select'].includes(question.type), `${qLabel}: unsupported type`);
        if (!Array.isArray(question.options) || !Array.isArray(question.correctOptions)) {
          errors.push(`${qLabel}: options and correctOptions must be arrays`); continue;
        }
        check(question.options.length >= 2, `${qLabel}: at least two options required`);
        const optionIds = question.options.map(option => option?.id);
        unique(optionIds, qLabel);
        check(question.options.every(option => record(option) && text(option.id) && text(option.text)), `${qLabel}: invalid option`);
        unique(question.correctOptions, qLabel);
        check(question.correctOptions.length > 0 && question.correctOptions.every(id => optionIds.includes(id)), `${qLabel}: invalid correct answer`);
        check(question.type !== 'single-select' || question.correctOptions.length === 1, `${qLabel}: single-select requires one correct answer`);
        check(question.type !== 'multi-select' || question.correctOptions.length >= 2, `${qLabel}: multi-select requires multiple correct answers`);
        check(question.selectCount === undefined || question.selectCount === question.correctOptions.length, `${qLabel}: selectCount does not match answers`);
        sourceUrl(question.sourceUrl, `${qLabel} sourceUrl`);
      }
    }
  }
  const bank = readJson('data/mock-exams.json');
  if (!record(bank)) errors.push('data/mock-exams.json: exam bank must be an object');
  for (const [trackId, exams] of Object.entries(record(bank) ? bank : {})) {
    check(trackIds.has(trackId), `Mock bank: unknown track ${trackId}`);
    if (!record(exams)) { errors.push(`Mock bank ${trackId}: exams must be an object`); continue; }
    for (const [name, questions] of Object.entries(exams)) {
      const label = `Mock ${trackId} / ${name}`;
      if (!Array.isArray(questions)) { errors.push(`${label}: questions must be an array`); continue; }
      check(questions.length > 0, `${label}: exam is empty`);
      for (const [index, question] of questions.entries()) {
        const qLabel = `${label} / question ${index + 1}`;
        if (!record(question)) { errors.push(`${qLabel}: question must be an object`); continue; }
        stats.mockQuestions++;
        check(text(question.q) && text(question.r) && text(question.d), `${qLabel}: missing scenario, rationale or domain`);
        if (!Array.isArray(question.o) || !Array.isArray(question.a)) {
          errors.push(`${qLabel}: options and answers must be arrays`); continue;
        }
        check(question.o.length >= 2 && question.o.every(text), `${qLabel}: invalid options`);
        unique(question.a, qLabel);
        check(question.a.length > 0 && question.a.every(index => Number.isInteger(index) && index >= 0 && index < question.o.length), `${qLabel}: invalid answer index`);
        check(['single', 'multi', 'multiple'].includes(question.t), `${qLabel}: unsupported type`);
        check(question.t !== 'single' || question.a.length === 1, `${qLabel}: single requires one answer`);
        check(!['multi', 'multiple'].includes(question.t) || question.a.length >= 2, `${qLabel}: multi requires multiple answers`);
        sourceUrl(question.src, `${qLabel} source URL`);
      }
    }
  }
  return { errors, stats };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const { errors, stats } = validateContent(root);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Content verified: ${stats.tracks} tracks, ${stats.modules} modules, ${stats.practiceQuestions} practice questions, ${stats.mockQuestions} mock questions; ${(stats.jsonBytes / 1000000).toFixed(2)} MB JSON.`);
  }
}
