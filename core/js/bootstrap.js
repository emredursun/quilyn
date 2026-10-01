
    var localDiagnostics = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('diagnostics') === '1';
    if (localDiagnostics) { var diagnosticsScript=document.createElement('script'); diagnosticsScript.src='tools/diagnostics.js'; document.head.appendChild(diagnosticsScript); }
    if (window.location.protocol === 'file:') {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.innerHTML = '<div style="padding:50px;text-align:center;font-family:sans-serif;background:#1e1e1e;color:#fff;position:fixed;inset:0;z-index:999999;display:flex;flex-direction:column;justify-content:center;align-items:center;">' +
          '<h1 style="color:#ff6b6b;font-size:32px;margin-bottom:16px;">⚠️ Local Server Required</h1>' +
          '<p style="font-size:18px;max-width:600px;line-height:1.5;">This application utilizes <strong>JSON content</strong> and <strong>Service Workers</strong> which are blocked by modern browsers under the <code>file://</code> protocol due to browser security policies.</p>' +
          '<div style="background:#000;padding:20px;border-radius:8px;margin-top:20px;text-align:left;font-family:monospace;font-size:16px;">' +
          '1. Open your terminal<br>2. Navigate to this folder<br>3. Run: <span style="color:#4ade80">python3 -m http.server</span><br>4. Open: <a href="http://localhost:8000" style="color:#60a5fa">http://localhost:8000</a>' +
          '</div></div>';
      });
    }
  
(function(){try{var t=localStorage.getItem("pega_theme")==="light"?"light":"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();

    (function () {
      function setStickyVars() {
        var t = document.querySelector('.pa-topbar');
        var tabs = document.querySelector('.pa-tabs');
        if (t) document.documentElement.style.setProperty('--pa-topbar-h', (getComputedStyle(t).position === 'sticky' ? t.offsetHeight : 0) + 'px');
        if (tabs) document.documentElement.style.setProperty('--pa-tabs-h', tabs.offsetHeight + 'px');
      }
      window.addEventListener('load', setStickyVars);
      document.addEventListener('DOMContentLoaded', function () {
        setStickyVars();
        var topbar = document.querySelector('.pa-topbar');
        if (topbar && 'ResizeObserver' in window) new ResizeObserver(setStickyVars).observe(topbar);
      });
      window.addEventListener('resize', setStickyVars);
      window.addEventListener('hashchange', function () { setTimeout(setStickyVars, 120); });
      setTimeout(setStickyVars, 300);
    })();
  

    if ('serviceWorker' in navigator && window.location.protocol !== 'file:' && !localDiagnostics) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
          function offerUpdate() {
            if (!registration.waiting || document.getElementById('quilyn-update')) return;
            var notice = document.createElement('div'); notice.id = 'quilyn-update'; notice.className='quilyn-update';
            notice.innerHTML='<span>An app update is ready. Finish your exam before updating.</span><button class="pa-btn" type="button">Update app</button>';
            document.querySelector('.pa-app').appendChild(notice);
            notice.querySelector('button').onclick=function() {
              var exam=document.getElementById('mv-exam');
              if (exam && !exam.classList.contains('v-hide')) { notice.querySelector('span').textContent='Return to the exam list before updating. Your answers are saved.'; return; }
              if(window.PegaStore) window.PegaStore.flush();
              if(window.MockView) window.MockView.flush();
              navigator.serviceWorker.addEventListener('controllerchange',function(){location.reload();},{once:true});
              registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});
            };
          }
          offerUpdate();
          registration.addEventListener('updatefound',function() {
            var worker=registration.installing;
            if(worker) worker.addEventListener('statechange',function(){ if(worker.state==='installed' && navigator.serviceWorker.controller) offerUpdate(); });
          });
        }, function(err) {
          console.log('PWA ServiceWorker registration failed: ', err);
        });
      });
    }
  
