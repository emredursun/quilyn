(function (global) {
  'use strict';
  var requests = new Map();
  function json(path) {
    var key = path.split('?')[0];
    if (!requests.has(key)) requests.set(key, fetch(key, {cache:'no-cache'}).then(function (r) {
      if (!r.ok) throw new Error('Content unavailable (' + r.status + ')');
      return r.json();
    }).then(cleanContent).catch(function (e) { requests.delete(key); throw e; }));
    return requests.get(key);
  }
  function safeUrl(value) {
    try {
      var url = new URL(value, document.baseURI);
      return url.protocol === 'https:' || (url.origin === location.origin && ['http:', 'https:'].includes(url.protocol)) ? url.href : '';
    } catch (_) { return ''; }
  }
  function cleanContent(value) {
    if (value && typeof value === 'object') Object.keys(value).forEach(function (key) {
      if (['url', 'src', 'sourceUrl', 'moduleUrl', 'moduleQuizUrl', 'missionUrl'].includes(key) && typeof value[key] === 'string') value[key] = safeUrl(value[key]);
      else cleanContent(value[key]);
    });
    return value;
  }
  async function interactive(html, theme) {
    var index = await json('data/interactive-manifest.json');
    var digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(html)))].map(function(b) { return b.toString(16).padStart(2,'0'); }).join('');
    if (!index[digest]) throw new Error('Exercise script is unavailable.');
    var count = 0;
    var body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/__THEME__/g,theme).replace(/\s(on[a-z]+)\s*=\s*("([^"]*)"|'([^']*)')/gi,function() {
      return ' data-quilyn-event-' + (count++) + '=""';
    }).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
    var script = '<script src="' + new URL(index[digest][theme],document.baseURI).href + '"></script>';
    return body.includes('</body>') ? body.replace('</body>',script+'</body>') : body+script;
  }
  var features = new Map();
  function feature(name, exportName, stylesheet) {
    if (!features.has(name)) {
      var assets=[];
      function load(tag,attr,path) {
        return new Promise(function(resolve,reject) {
          var el=document.createElement(tag);assets.push(el);
          if(tag==='link')el.rel='stylesheet';
          el[attr]=path+'?v=20261002p';el.onload=resolve;
          el.onerror=function(){reject(new Error('Unable to load '+name+'. Reopen this page to retry.'));};
          document.head.appendChild(el);
        });
      }
      features.set(name,Promise.all([load('script','src','core/js/'+name+'.js'),stylesheet?load('link','href',stylesheet):Promise.resolve()]).then(function(){return global[exportName];}).catch(function(err){assets.forEach(function(el){el.remove();});features.delete(name);throw err;}));
    }
    return features.get(name);
  }
  function learning(){return feature('learning-history','QuilynJournal','core/css/learning-history.css');}
  function review(){return feature('review-view','ReviewView');}
  function personalization(){return Promise.all([learning(),feature('study-plan','QuilynStudy')]).then(function(values){return values[1];});}
  var dialogs = new Map();
  function closeDialog(el) {
    var entry = dialogs.get(el);
    if (!entry) return;
    dialogs.delete(el);
    document.removeEventListener('keydown', entry.key);
    document.querySelector('.pa-app').inert = dialogs.size > 0;
    if (entry.focus && entry.focus.isConnected) entry.focus.focus();
  }
  function dialog(el, onEscape, label) {
    if (dialogs.has(el)) return;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', label || 'Quilyn dialog'); el.tabIndex = -1;
    var entry = { focus: document.activeElement };
    entry.key = function (e) {
      if ([...dialogs.keys()].at(-1) !== el) return;
      if (e.key === 'Escape') { e.preventDefault(); if (onEscape) onEscape(); }
      if (e.key === 'Tab') {
        var controls = [...el.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select,[tabindex="0"]')].filter(function (n) { return n.getClientRects().length; });
        var first = controls[0] || el, last = controls.at(-1) || el;
        if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || document.activeElement === el)) { e.preventDefault(); first.focus(); }
      }
    };
    dialogs.set(el, entry); document.querySelector('.pa-app').inert = true;
    document.addEventListener('keydown', entry.key);
    (el.querySelector('button:not(:disabled),input:not(:disabled)') || el).focus();
  }
  var enhanceId = 0;
  var choiceObservers = new Map();
  function enhance(root) {
    choiceObservers.forEach(function(obs, group) { if (!group.isConnected) { obs.disconnect(); choiceObservers.delete(group); } });
    root.querySelectorAll('.pa-q .opts,.q .opts,.opts-wrap').forEach(function (group) {
      if (group.dataset.native) return;
      group.dataset.native = 'true';
      var card = group.closest('.pa-q,.q,.qcard');
      var stem = card.querySelector('.scenario,.stem,.qstem');
      var name = 'quilyn-choice-' + (++enhanceId);
      if (stem) { stem.id = name + '-question'; group.setAttribute('aria-labelledby', stem.id); }
      group.setAttribute('role', group.querySelector('.multi') ? 'group' : 'radiogroup');
      group.querySelectorAll('.pa-opt,.opt').forEach(function (row, idx) {
        var input = document.createElement('input');
        input.type = row.classList.contains('multi') ? 'checkbox' : 'radio'; input.name = name;
        input.setAttribute('aria-label', row.textContent.trim()); input.className = 'quilyn-choice-input';
        row.prepend(input);
        input.addEventListener('click', function (e) { e.stopPropagation(); row.click(); });
        row.addEventListener('click', function () { queueMicrotask(function () { syncChoices(group); }); });
        input.addEventListener('focus', function () { row.classList.add('focus'); });
        input.addEventListener('blur', function () { row.classList.remove('focus'); });
      });
      syncChoices(group);
      var observer = new MutationObserver(function () { syncChoices(group); });
      observer.observe(group, { subtree: true, attributes: true, attributeFilter: ['class'] });
      choiceObservers.set(group, observer);
    });
    root.querySelectorAll('.verdict,.pa-result').forEach(function (el) { el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); });
  }
  function syncChoices(group) {
    group.querySelectorAll('.pa-opt,.opt').forEach(function (row) {
      var input = row.querySelector('input');
      input.checked = row.classList.contains('selected') || row.classList.contains('sel');
      input.disabled = row.classList.contains('disabled') || row.classList.contains('locked') || row.classList.contains('dis') || !!row.closest('.reviewed');
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    var content = document.getElementById('paContent');
    new MutationObserver(function () { enhance(content); }).observe(content, { childList: true, subtree: true });
    new MutationObserver(function () { dialogs.forEach(function (_, el) { if (!el.isConnected) closeDialog(el); }); }).observe(document.body, { childList: true });
    global.addEventListener('quilyn-storage-error', function (e) {
      var notice = document.getElementById('quilyn-storage-error');
      if (!notice) { notice = document.createElement('div'); notice.id = 'quilyn-storage-error'; notice.className = 'quilyn-storage-error'; notice.setAttribute('role', 'alert'); document.body.appendChild(notice); }
      notice.textContent = e.detail;
    });
    if (global.QuilynStorageNotice) global.dispatchEvent(new CustomEvent('quilyn-storage-error', {detail:global.QuilynStorageNotice}));
  });
  global.QuilynRuntime = { json: json, learning:learning, personalization:personalization, library:function(){return feature('library','QuilynLibrary','core/css/library.css');}, review:review, safeUrl: safeUrl, cleanContent: cleanContent, interactive: interactive, dialog: dialog, closeDialog: closeDialog, enhance: enhance };
})(window);
