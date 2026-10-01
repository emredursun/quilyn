(function(global) {
  'use strict';
  var META_CACHE = 'quilyn-package-index';
  var INDEX_URL = new URL('data/offline-packages', document.baseURI).href;
  var busy = false;
  async function readIndex() {
    var cache = await caches.open(META_CACHE), saved = await cache.match(INDEX_URL);
    var index = saved ? await saved.json() : {};
    for (var id of Object.keys(index)) {
      if (!index[id].files) continue;
      var packageCache = await caches.open(index[id].cache);
      for (var path of index[id].files) if (!await packageCache.match(new URL(path,document.baseURI).href)) { delete index[id]; break; }
    }
    return index;
  }
  async function commit(index) {
    var cache = await caches.open(META_CACHE);
    await cache.put(INDEX_URL, new Response(JSON.stringify(index), {headers: {'Content-Type':'application/json'}}));
  }
  async function removePackage(id) {
    async function removeLocked() {
      var latest = await readIndex(), previous = latest[id];
      if (!previous) return;
      delete latest[id]; await commit(latest); await caches.delete(previous.cache);
    }
    if (navigator.locks) return navigator.locks.request('quilyn-offline-packages',removeLocked);
    return removeLocked();
  }
  function download(track, report, signal) {
    if (typeof navigator !== 'undefined' && navigator.locks) return navigator.locks.request('quilyn-offline-packages', function() { return downloadLocked(track,report,signal); });
    return downloadLocked(track,report,signal);
  }
  async function downloadLocked(track, report, signal) {
    var name = 'quilyn-package-' + track.id + '-' + track.version;
    var index = await readIndex(), previous = index[track.id];
    if (previous && previous.version === track.version) { report('Already up to date.'); return; }
    var cache = await caches.open(name);
    var committed = false;
    try {
      for (var i = 0; i < track.files.length; i++) {
        var f = track.files[i];
        report('Downloading ' + (i+1) + ' / ' + track.files.length);
        var response = await fetch(f.path, {cache:'no-store', signal:signal});
        if (!response.ok) throw new Error('Download unavailable. Connect and try again.');
        var bytes = await response.arrayBuffer();
        var digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(function(b) {return b.toString(16).padStart(2,'0');}).join('');
        if (digest !== f.sha256) throw new Error('Content changed during download. Reload the app and try again.');
        if (f.path.endsWith('.json')) JSON.parse(new TextDecoder().decode(bytes));
        await cache.put(new URL(f.path,document.baseURI).href, new Response(bytes,{headers:{'Content-Type':f.path.endsWith('.js')?'text/javascript':'application/json'}}));
      }
      if (signal.aborted) throw new Error('Download cancelled.');
      index = await readIndex();
      index[track.id] = {cache:name, version:track.version, bytes:track.bytes, modules:track.modules, files:track.files.map(function(f) { return f.path; })};
      await commit(index);
      committed = true;
      if (previous && previous.cache !== name) await caches.delete(previous.cache).catch(function() {});
      report('Offline ready: ' + track.modules + ' modules, mock bank and review questions.');
    } catch(e) { if (!committed && (!previous || previous.cache !== name)) await caches.delete(name); throw e; }
  }
  async function render(panel) {
    if (!('caches' in global) || !navigator.serviceWorker || !global.isSecureContext) { panel.textContent = 'Offline downloads require HTTPS or localhost and service worker support.'; return; }
    panel.textContent = 'Checking offline content…';
    try {
      var manifest = await global.QuilynRuntime.json('data/content-manifest.json');
      var index = await readIndex();
      panel.innerHTML = '<label for="quilyn-offline-track">Learning track</label><select id="quilyn-offline-track"></select><p id="quilyn-offline-info"></p><p id="quilyn-offline-storage"></p>' +
        '<button class="pa-settings-btn primary" id="quilyn-offline-download">Download track</button><button class="pa-settings-btn" id="quilyn-offline-remove">Remove download</button><button class="pa-settings-btn" id="quilyn-offline-cancel" hidden>Cancel</button><p role="status" aria-live="polite" id="quilyn-offline-status"></p>';
      var select = panel.querySelector('select'), info=panel.querySelector('#quilyn-offline-info'), status=panel.querySelector('#quilyn-offline-status');
      manifest.tracks.forEach(function(t) { var option=document.createElement('option'); option.value=t.id; option.textContent=t.name; select.appendChild(option); });
      select.value = global.PegaStore.state.activeTrack;
      var dl=panel.querySelector('#quilyn-offline-download'), remove=panel.querySelector('#quilyn-offline-remove'), cancel=panel.querySelector('#quilyn-offline-cancel');
      function update() {
        var track=manifest.tracks.find(function(t){return t.id===select.value;}), saved=index[track.id];
        info.textContent = track.modules + ' modules · ' + (track.bytes/1000000).toFixed(2) + ' MB content · ' +
          (!saved ? 'Not downloaded' : saved.version===track.version ? 'Offline ready' : 'Update available');
        remove.disabled=!saved || busy; dl.disabled=busy; select.disabled=busy;
      }
      select.onchange=update; update();
      if (navigator.storage && navigator.storage.estimate) {
        var space=await navigator.storage.estimate();
        panel.querySelector('#quilyn-offline-storage').textContent='Browser storage: ' + (space.usage/1000000).toFixed(1) + ' MB used of approximately ' + (space.quota/1000000).toFixed(0) + ' MB. Your browser may evict offline content.';
      }
      dl.onclick=async function() {
        if(busy)return; busy=true; update(); cancel.hidden=false;
        var controller=new AbortController(); cancel.onclick=function(){controller.abort();};
        try { await navigator.serviceWorker.ready; await download(manifest.tracks.find(function(t){return t.id===select.value;}),function(msg){status.textContent=msg;},controller.signal); }
        catch(e) { status.textContent = e.name==='AbortError'?'Download cancelled.':e.message; }
        finally { index=await readIndex(); busy=false; cancel.hidden=true; update(); }
      };
      remove.onclick=async function() {
        if(busy)return;
        try {
          await removePackage(select.value); index=await readIndex();
          status.textContent='Downloaded package removed. Learning progress is kept. Previously visited pages may remain cached.'; update();
        } catch(e) { status.textContent='The download could not be removed. Try again.'; }
      };
    } catch(e) { panel.textContent='Offline settings unavailable. Connect and reopen Settings. ' + e.message; }
  }
  global.QuilynOffline={render:render,download:download,readIndex:readIndex};
})(window);
