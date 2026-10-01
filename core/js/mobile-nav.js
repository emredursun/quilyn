/* Mobile drawer: backdrop, scroll lock and focus across shadow DOM. */
(function(w) {
  'use strict';
  var drawer, main, toggle, backdrop, close, scrollY = null;
  var media = w.matchMedia('(max-width: 860px)');
  function setOpen(open, restore) {
    if (!drawer) return;
    open = open && media.matches;
    drawer.classList.toggle('open', open);
    drawer.inert = media.matches && !open;
    main.inert = open;
    backdrop.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      if (scrollY === null) {
        scrollY = w.scrollY;
        document.body.style.setProperty('--drawer-scroll', -scrollY + 'px');
        document.body.classList.add('quilyn-menu-open');
      }
      close.focus();
    } else {
      drawer.removeAttribute('role');
      drawer.removeAttribute('aria-modal');
      if (scrollY !== null) {
        document.body.classList.remove('quilyn-menu-open');
        document.body.style.removeProperty('--drawer-scroll');
        w.scrollTo(0, scrollY);
        scrollY = null;
      }
      if (media.matches && (restore || drawer.contains(document.activeElement))) toggle.focus();
    }
  }
  function focusables(root) {
    var items = [];
    Array.from(root.children).forEach(function(el) {
      if (el.matches('button,a[href],input,select,[tabindex="0"]') && !el.disabled &&
          el.getClientRects().length && w.getComputedStyle(el).visibility !== 'hidden') items.push(el);
      items.push.apply(items, focusables(el.shadowRoot || el));
    });
    return items;
  }
  w.QuilynMobileNav = {
    close: function() { setOpen(false, false); },
    init: function() {
      drawer = document.getElementById('paSidebar');
      main = document.querySelector('.pa-main');
      toggle = document.getElementById('paMenuToggle');
      close = document.createElement('button');
      close.id = 'quilyn-sidebar-close'; close.className = 'pa-btn quilyn-sidebar-close';
      close.textContent = 'Close menu'; close.type = 'button'; drawer.prepend(close);
      drawer.setAttribute('aria-label', 'Learning navigation');
      backdrop = document.createElement('button'); backdrop.className = 'quilyn-menu-backdrop';
      backdrop.type = 'button'; backdrop.tabIndex = -1;
      backdrop.setAttribute('aria-label', 'Close navigation menu');
      document.querySelector('.pa-app').appendChild(backdrop);
      toggle.setAttribute('aria-controls', 'paSidebar');
      toggle.onclick = function() { setOpen(!drawer.classList.contains('open')); };
      close.onclick = backdrop.onclick = function() { setOpen(false, true); };
      drawer.addEventListener('click', function(e) {
        if (e.composedPath().some(function(el) { return el.tagName === 'A' && el.hasAttribute('href'); })) setOpen(false, true);
      });
      drawer.addEventListener('keydown', function(e) {
        if (!media.matches || !drawer.classList.contains('open') || e.defaultPrevented) return;
        if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); }
        if (e.key === 'Tab') {
          var items = focusables(drawer), active = e.composedPath()[0];
          if (e.shiftKey && active === items[0]) { e.preventDefault(); items[items.length-1].focus(); }
          else if (!e.shiftKey && active === items[items.length-1]) { e.preventDefault(); items[0].focus(); }
        }
      });
      w.addEventListener('resize', function() {
        if (!media.matches) setOpen(false, false);
        else drawer.inert = !drawer.classList.contains('open');
      });
      setOpen(false, false);
    }
  };
})(window);
