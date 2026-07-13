/* =====================================================================
   Quilyn — store.js
   Tier-1 Reactive State Manager using ES6 Proxies.
   Automatically persists to localStorage and notifies subscribed
   components of state mutations.
   ===================================================================== */
(function(global) {
  'use strict';

  var STORAGE_KEY = 'pega_universal_state';

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && !parsed.tracks) {
        // Migration or fresh start: Ensure the new structure exists
        parsed.tracks = {};
        parsed.activeTrack = 'PSA'; // Default track
      }
      return parsed || {
        lms: { userProgress: {} },
        activeTrack: 'PSA',
        tracks: {
          'PSA': { mock: {}, srs: { cards: {}, streak: 0, lastStudyDate: null, surpriseIds: [] } },
          'PBA': { mock: {}, srs: { cards: {}, streak: 0, lastStudyDate: null, surpriseIds: [] } }
        },
        quiz: {}
      };
    } catch (e) {
      return {
        lms: { userProgress: {} },
        activeTrack: 'PSA',
        tracks: {
          'PSA': { mock: {}, srs: { cards: {}, streak: 0, lastStudyDate: null, surpriseIds: [] } },
          'PBA': { mock: {}, srs: { cards: {}, streak: 0, lastStudyDate: null, surpriseIds: [] } }
        },
        quiz: {}
      };
    }
  }

  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var listeners = [];
  var rawState = loadState();

  /* ── Batched persistence + notification ───────────────────────────────
     A naive Proxy fires saveState() + every listener on EACH mutation.
     Hot paths (SRS grading loops, exam answer writes) do many writes in a
     single task, which would re-serialize the whole state tree N times.
     Instead we coalesce: mark dirty, then flush once on the microtask /
     next frame. Reads stay synchronous and always see live `rawState`. */
  var flushScheduled = false;
  var schedule = (typeof Promise !== 'undefined')
    ? function(fn) { Promise.resolve().then(fn); }
    : function(fn) { setTimeout(fn, 0); };

  function flush() {
    flushScheduled = false;
    saveState(rawState);
    listeners.forEach(function(fn) { fn(rawState); });
  }

  function scheduleFlush() {
    if (flushScheduled) return;
    flushScheduled = true;
    schedule(flush);
  }

  /* Safety net: if the tab is hidden/closed with a write still pending,
     persist synchronously so no progress is lost. */
  function flushIfPending() { if (flushScheduled) flush(); }
  window.addEventListener('pagehide', flushIfPending);
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') flushIfPending();
  });

  /* NOTE: the `get` trap returns a NEW Proxy per object read, so reference
     identity does not hold (state.x !== state.x). Writes always land on the
     shared underlying `rawState`, so persistence is correct — but never rely
     on `===` / Object.is between two reads of the same nested object. */
  var handler = {
    get: function(target, prop, receiver) {
      var value = Reflect.get(target, prop, receiver);
      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, handler);
      }
      return value;
    },
    set: function(target, prop, value, receiver) {
      var result = Reflect.set(target, prop, value, receiver);
      scheduleFlush();
      return result;
    },
    deleteProperty: function(target, prop) {
      var result = Reflect.deleteProperty(target, prop);
      scheduleFlush();
      return result;
    }
  };

  var proxyState = new Proxy(rawState, handler);

  global.PegaStore = {
    state: proxyState,
    watch: function(callback) {
      listeners.push(callback);
      // Immediately invoke with current state
      callback(proxyState);
    }
  };
})(window);
