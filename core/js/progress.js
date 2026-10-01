/* Versioned progress boundary. Existing storage IDs are intentionally stable. */
(function (global) {
  'use strict';
  var ACTIVITY_KEY = 'quilyn_activity';
  var record = function (v) { return v !== null && typeof v === 'object' && !Array.isArray(v); };
  var strings = function (v) { return Array.isArray(v) && v.every(function (x) { return typeof x === 'string'; }); };
  var number = function (v, min, max) { return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max; };
  var integer = function (v, min, max) { return number(v, min, max) && Number.isInteger(v); };
  var date = function (v) { return typeof v === 'string' && Number.isFinite(Date.parse(v)); };
  function safeTree(v, depth) {
    if (depth > 30) return false;
    if (v === null || typeof v !== 'object') return true;
    return Object.keys(v).every(function (k) {
      return !['__proto__', 'prototype', 'constructor'].includes(k) && safeTree(v[k], depth + 1);
    });
  }
  function everyObject(v, fn) { return record(v) && Object.keys(v).every(function (k) { return fn(v[k], k); }); }
  function quizRecords(v) {
    return everyObject(v, function (r) {
      return record(r) && number(r.highScore, 0, 100) && integer(r.attempts, 0, 1000000) &&
        (r.lastAttempted == null || date(r.lastAttempted)) && Array.isArray(r.scoreHistory) &&
        r.scoreHistory.every(function (s) { return number(s, 0, 100); });
    });
  }
  function lms(v) {
    return record(v) && everyObject(v.userProgress, function (t) {
      return record(t) && strings(t.completedModules) && quizRecords(t.quizRecords);
    });
  }
  function srs(v) {
    return record(v) && (v.cards === undefined || everyObject(v.cards, function (c) {
      return record(c) && integer(c.box, 1, 5) && date(c.dueDate) &&
        integer(c.totalSeen, 0, 1000000) && integer(c.totalCorrect, 0, c.totalSeen) &&
        (c.surpriseCount === undefined || integer(c.surpriseCount, 0, c.totalSeen));
    })) && (v.streak === undefined || integer(v.streak, 0, 1000000)) &&
      (v.lastStudyDate == null || date(v.lastStudyDate)) && (v.surpriseIds === undefined || strings(v.surpriseIds));
  }
  function validEntry(key, v) {
    if (!safeTree(v, 0)) return false;
    if (key === 'pega_theme') return v === 'light' || v === 'dark';
    if (key === 'pega_lms_state') return lms(v);
    if (key === 'pega_universal_state') return record(v) && typeof v.activeTrack === 'string' &&
      (v.lms === undefined || lms(v.lms)) && everyObject(v.tracks, function (t) {
        return record(t) && (t.mock === undefined || everyObject(t.mock, function (score) { return number(score, 0, 100); })) &&
          (t.srs === undefined || srs(t.srs));
      }) && (v.quiz === undefined || record(v.quiz));
    if (/^pq_state_(?:default|#[A-Za-z0-9-]+\/[A-Za-z0-9-]+)$/.test(key)) return everyObject(v, function (q, id) {
      return /^\d+$/.test(id) && record(q) && strings(q.selected) && typeof q.graded === 'boolean' &&
        (q.correct === undefined || typeof q.correct === 'boolean');
    });
    if (/^pegaMock_[A-Za-z0-9-]+_.{1,120}$/.test(key)) return record(v) && typeof v.name === 'string' &&
      number(v.remaining, 0, 86400) && Array.isArray(v.answers) && v.answers.every(function (a) {
        return Array.isArray(a) && new Set(a).size === a.length && a.every(function (i) { return integer(i, 0, 99); });
      }) && Array.isArray(v.checked) && v.checked.length === v.answers.length && v.checked.every(function (b) { return typeof b === 'boolean'; });
    if (key === ACTIVITY_KEY) return record(v) && v.version === 1 && Array.isArray(v.events) && v.events.length <= 10000 &&
      v.events.every(function (e) { return record(e) && typeof e.id === 'string' && date(e.at) && /^\d{4}-\d{2}-\d{2}$/.test(e.day) &&
        typeof e.track === 'string' && ['quiz', 'mock', 'review', 'visit'].includes(e.kind) && typeof e.subject === 'string'; });
    return false;
  }
  function notify(message) {
    global.QuilynStorageNotice = message;
    global.dispatchEvent(new CustomEvent('quilyn-storage-error', { detail: message }));
  }
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      var value = key === 'pega_theme' ? raw : JSON.parse(raw);
      if (!validEntry(key, value)) throw new Error('invalid saved data');
      return value;
    } catch (e) { notify('Saved progress could not be read. Export a backup before resetting your data.'); return fallback; }
  }
  function write(key, value) {
    if (!validEntry(key, value)) { notify('Progress was not saved because its format is invalid.'); return false; }
    try {
      var current = localStorage.getItem(key), valid = true;
      if (current !== null) {
        try { valid = validEntry(key, key === 'pega_theme' ? current : JSON.parse(current)); } catch (_) { valid = false; }
        if (!valid) {
          // Keep the original raw value available for recovery before replacing it.
          localStorage.setItem('quilyn_recovery_' + key, current);
          notify('Invalid saved data was preserved in your export as a recovery entry. New progress will be saved separately from that copy.');
        }
      }
      localStorage.setItem(key, key === 'pega_theme' ? value : JSON.stringify(value)); return true;
    }
    catch (e) { notify('Progress could not be saved. Browser storage may be full or unavailable. Export a backup.'); return false; }
  }
  function remove(key) {
    try { localStorage.removeItem(key); return true; }
    catch (_) { notify('Saved progress could not be removed. Browser storage is unavailable.'); return false; }
  }
  function validateBundle(b) {
    if (!record(b) || b.version !== 2 || !record(b.state) || !safeTree(b, 0)) throw new Error('Unsupported or invalid backup.');
    var keys = Object.keys(b.state);
    if (!keys.length || !keys.every(function (k) { return validEntry(k, b.state[k]); })) throw new Error('Invalid progress values or unsupported storage entries. No changes were made.');
    return keys;
  }
  function applyBundle(b) {
    var keys = validateBundle(b), previous = {};
    keys.forEach(function (k) { previous[k] = localStorage.getItem(k); });
    try {
      keys.forEach(function (k) { localStorage.setItem(k, k === 'pega_theme' ? b.state[k] : JSON.stringify(b.state[k])); });
    } catch (e) {
      var recovered = true;
      keys.forEach(function (k) {
        try { if (previous[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, previous[k]); }
        catch (_) { recovered = false; }
      });
      throw new Error(recovered ? 'Storage write failed. Previous values were restored.' : 'Storage write and recovery failed. Keep your backup; some entries may have changed.');
    }
  }
  async function validateReferences(bundle) {
    validateBundle(bundle);
    var registry = await global.QuilynRuntime.json('data/registry.json');
    var bank = null, unknown = [];
    for (var key of Object.keys(bundle.state)) {
      var value = bundle.state[key], match;
      if ((match = /^pq_state_#([^/]+)\/(.+)$/.exec(key))) {
        var track = registry.tracks.find(function(t) { return t.trackId === match[1]; });
        var module = track && track.modules.find(function(m) { return m.id === match[2] && m.ready !== false; });
        if (!module) { unknown.push(key); continue; }
        var data = await global.QuilynRuntime.json(module.file);
        for (var idx of Object.keys(value)) {
          var question = data.practiceQuiz[Number(idx)];
          if (!question || !value[idx].selected.every(function(id) { return question.options.some(function(o) { return o.id === id; }); }))
            throw new Error('Quiz answers do not match available content: ' + key);
          if (question.type === 'single-select' && value[idx].selected.length > 1) throw new Error('Single-select quiz has multiple answers: ' + key);
        }
      } else if ((match = /^pegaMock_([^_]+)_(.+)$/.exec(key))) {
        bank = bank || await global.QuilynRuntime.json('data/mock-exams.json');
        var exam = bank[match[1]] && bank[match[1]][match[2]];
        if (!exam) { unknown.push(key); continue; }
        var examTrack = registry.tracks.find(function(t) { return t.trackId === match[1]; });
        var maxTime = ((examTrack && examTrack.exam && examTrack.exam.timeMinutes) || 90) * 60;
        if (value.remaining > maxTime || value.name !== match[2] || exam.length !== value.answers.length || value.answers.some(function(answers, i) {
          return answers.some(function(a) { return a >= exam[i].o.length; }) || (exam[i].t === 'single' && answers.length > 1);
        })) throw new Error('Saved exam answers do not match available content: ' + key);
      }
      var progress = key === 'pega_lms_state' ? value.userProgress : key === 'pega_universal_state' ? value.lms && value.lms.userProgress : null;
      if (progress) Object.keys(progress).forEach(function(trackId) {
        var trackMeta = registry.tracks.find(function(t) { return t.trackId === trackId; });
        var ids = new Set(trackMeta ? trackMeta.modules.map(function(m) { return m.id; }) : []);
        progress[trackId].completedModules.concat(Object.keys(progress[trackId].quizRecords)).forEach(function(id) {
          if (!ids.has(id)) unknown.push(trackId + '/' + id);
        });
      });
    }
    return [...new Set(unknown)];
  }
  function localDay(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function activity(kind, track, subject, id) {
    var state = read(ACTIVITY_KEY, { version: 1, events: [] });
    id = id || (global.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random());
    if (state.events.some(function (e) { return e.id === id; })) return;
    var now = new Date();
    state.events.push({ id: id, at: now.toISOString(), day: localDay(now), kind: kind, track: track, subject: subject });
    state.events = state.events.slice(-10000);
    write(ACTIVITY_KEY, state);
  }
  global.QuilynProgress = { validEntry: validEntry, read: read, write: write, remove: remove, validateBundle: validateBundle,
    applyBundle: applyBundle, validateReferences: validateReferences, activity: activity, localDay: localDay, activityKey: ACTIVITY_KEY };
})(window);
