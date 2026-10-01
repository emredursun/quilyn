const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const storage = new Map();
const localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value)
};
let engine = fs.readFileSync('core/js/engine.js', 'utf8');
engine = engine.replace('  document.addEventListener("DOMContentLoaded", boot);',
  '  window.testEngine = { recordQuiz, loadState, selectNextModule };');
const context = {
  window: {}, document: {}, localStorage, console,
  location: { hash: '' }, fetch: () => Promise.reject(new Error('unused'))
};
vm.runInNewContext(engine, context);
context.window.testEngine.recordQuiz('PBA', 'BA-M01', 80);
let progress = context.window.testEngine.loadState().userProgress.PBA;
assert.equal(progress.quizRecords['BA-M01'].highScore, 80);
assert.equal(progress.quizRecords['BA-M01'].attempts, 1);
assert.deepEqual(Array.from(progress.completedModules), ['BA-M01']);
const modules = [{id:'M1'},{id:'M2'},{id:'M3'}];
assert.equal(context.window.testEngine.selectNextModule(modules,['M1'],'M1').id,'M2');
assert.equal(context.window.testEngine.selectNextModule(modules,[],'M3').id,'M3');
context.window.testEngine.recordQuiz('PBA', 'BA-M01', 60);
progress = context.window.testEngine.loadState().userProgress.PBA;
assert.equal(progress.quizRecords['BA-M01'].attempts, 2);
assert.deepEqual(Array.from(progress.completedModules), ['BA-M01']);

const sw = fs.readFileSync('sw.js', 'utf8') + '\nself.testCacheKey = cacheKey;';
const self = { location: { origin: 'https://example.com' }, addEventListener() {} };
vm.runInNewContext(sw, { self, URL, Request, caches: {}, fetch() {} });
assert.equal(
  self.testCacheKey(new Request('https://example.com/quilyn/data/registry.json?v=123')).url,
  'https://example.com/quilyn/data/registry.json'
);

let clock = 100000;
let tick;
let mock = fs.readFileSync('core/js/mock-view.js', 'utf8');
mock = mock.replace('})(window);',
  'window.testTimer = { startTimer, getRemaining: () => remaining, setRemaining: n => { remaining = n; } }; })(window);');
const mockWindow = {};
vm.runInNewContext(mock, {
  window: mockWindow, HTMLElement: class {}, customElements: { define() {} },
  Date: { now: () => clock },
  setInterval: fn => { tick = fn; return 1; }, clearInterval() {}, console
});
mockWindow.testTimer.setRemaining(60);
mockWindow.testTimer.startTimer();
clock += 30000;
tick();
assert.equal(mockWindow.testTimer.getRemaining(), 30);

let settings = fs.readFileSync('core/js/settings.js', 'utf8');
settings = settings.replace('})(window);',
  'window.testSettings = { validEntry, gatherState }; })(window);');
const settingsWindow = { dispatchEvent() {} };
vm.runInNewContext(fs.readFileSync('core/js/progress.js','utf8'), {window:settingsWindow, Date, CustomEvent:class {}, localStorage:{}});
const settingsStorage = new Map([['pega_theme', 'light']]);
vm.runInNewContext(settings, {
  window: settingsWindow,
  localStorage: {
    get length() { return settingsStorage.size; },
    key: index => [...settingsStorage.keys()][index],
    getItem: key => settingsStorage.get(key) ?? null
  }, Date
});
assert.equal(settingsWindow.testSettings.gatherState().state.pega_theme, 'light');
assert.equal(settingsWindow.testSettings.validEntry('pq_state_#PBA/BA-M01', {}), true);
assert.equal(settingsWindow.testSettings.validEntry('unknown_origin_key', {}), false);
console.log('Core regressions verified: quiz completion, offline cache keys, timer, and progress backup validation.');
