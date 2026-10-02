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
      var parsed = global.QuilynProgress ? global.QuilynProgress.read(STORAGE_KEY, null) : (raw ? JSON.parse(raw) : null);
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
    if (global.QuilynProgress) return global.QuilynProgress.write(STORAGE_KEY, state);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var listeners = [];
  var rawState = loadState();
  var baseline=JSON.parse(JSON.stringify(rawState));
  function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
  function object(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function copy(v){return v===undefined?undefined:JSON.parse(JSON.stringify(v));}
  // Apply this tab's changed fields to the latest persisted record. Arrays are
  // atomic; unrelated tracks/cards survive a stale tab's next write.
  function merge(base,local,remote){
    if(same(base,local))return copy(remote);
    if(object(base)&&object(local)&&object(remote)){
      var result=copy(remote);
      new Set(Object.keys(base).concat(Object.keys(local))).forEach(function(key){
        if(same(base[key],local[key]))return;
        if(!Object.prototype.hasOwnProperty.call(local,key))delete result[key];
        else result[key]=merge(base[key],local[key],remote[key]);
      });return result;
    }
    return copy(local);
  }
  function replace(target,next){
    Object.keys(target).forEach(function(k){if(!Object.prototype.hasOwnProperty.call(next,k))delete target[k];});
    Object.keys(next).forEach(function(k){if(object(target[k])&&object(next[k]))replace(target[k],next[k]);else target[k]=copy(next[k]);});
  }
  function notify(){listeners.slice().forEach(function(fn){try{fn(proxyState);}catch(e){console.error(e);}});}


  /* ── Batched persistence + notification ───────────────────────────────
     A naive Proxy fires saveState() + every listener on EACH mutation.
     Hot paths (SRS grading loops, exam answer writes) do many writes in a
     single task, which would re-serialize the whole state tree N times.
     Instead we coalesce: mark dirty, then flush once on the microtask /
     next frame. Reads stay synchronous and always see live `rawState`. */
  var flushScheduled = false, discarded=false;
  var schedule = (typeof Promise !== 'undefined')
    ? function(fn) { Promise.resolve().then(fn); }
    : function(fn) { setTimeout(fn, 0); };

  function flush() {
    flushScheduled = false;
    if(discarded)return;
    var next=merge(baseline,rawState,loadState());
    if(saveState(next)!==false){replace(rawState,next);baseline=copy(next);}
    notify();
  }

  function scheduleFlush() {
    if (discarded || flushScheduled) return;
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

  /* Nested proxy identity is stable until an object is replaced. */
  var proxies = new WeakMap();
  var handler = {
    get: function(target, prop, receiver) {
      var value = Reflect.get(target, prop, receiver);
      if (typeof value === 'object' && value !== null) {
        if (!proxies.has(value)) proxies.set(value, new Proxy(value, handler));
        return proxies.get(value);
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

  window.addEventListener('quilyn-progress-external',function(update){
    var event={key:update.detail.key,newValue:localStorage.getItem(STORAGE_KEY)};
    if(event.storageArea&&event.storageArea!==localStorage)return;
    if(event.key!==STORAGE_KEY&&event.key!==null)return;
    if(event.key===STORAGE_KEY&&event.newValue!==null){try{if(global.QuilynProgress&&!global.QuilynProgress.validEntry(STORAGE_KEY,JSON.parse(event.newValue)))return;}catch(_){return;}}
    var remote=loadState(),track=rawState.activeTrack;
    var next=merge(baseline,rawState,remote);
    // A second tab changing tracks must not navigate an active exam here.
    next.activeTrack=track;replace(rawState,next);baseline=copy(remote);notify();
  });
  global.PegaStore = {
    state: proxyState,
    flush: flushIfPending,
    discard: function(){discarded=true;flushScheduled=false;},
    watch: function(callback) {
      listeners.push(callback);
      // Immediately invoke with current state
      callback(proxyState);
      return function() { listeners = listeners.filter(function(fn) { return fn !== callback; }); };
    }
  };
})(window);
