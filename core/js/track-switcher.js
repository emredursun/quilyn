/* core/js/track-switcher.js */
(function(global) {
  'use strict';
  const escapeHtml = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  function trackIcon(id) {
    const paths = id === 'PBA' ? '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>'
      : id === 'PSA' ? '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6h8v8M6 10v8h8"/>'
      : id === 'PSSA' ? '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>'
      : id === 'TESTIM' ? '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16"/>'
      : '<path d="M9 3h6m-5 0v6l-6 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M8 14h8"/>';
    return '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+paths+'</svg>';
  }

  class PegaTrackSwitcher extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.tracks = [];
      this.activeTrackId = 'PSA';
      this.isOpen = false;
    }

    connectedCallback() {
      // Sync initial state from PegaStore
      if (global.PegaStore && global.PegaStore.state.activeTrack) {
        this.activeTrackId = global.PegaStore.state.activeTrack;
      }
      
      // Load registry
      global.QuilynRuntime.json('data/registry.json')
        .then(data => {
          this.tracks = data.tracks || [];
          this.render();
        })
        .catch(err => console.error("Track Switcher failed to load registry:", err));

      // Close dropdown on outside click
      this._outsideClickListener = (e) => {
        const path = e.composedPath();
        if (!path.includes(this)) {
          this.isOpen = false;
          this.updateDropdown();
        }
      };
      document.addEventListener('click', this._outsideClickListener);
      this._escapeListener = event => {
        if (event.key === 'Escape' && this.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          this.isOpen = false;
          this.updateDropdown();
          this.shadowRoot.querySelector('.trigger')?.focus();
        }
      };
      this.shadowRoot.addEventListener('keydown', this._escapeListener);
      
      // Listen to PegaStore changes in case track changes elsewhere
      if (global.PegaStore) {
        this._unsubscribe = global.PegaStore.watch((state) => {
          if (state.activeTrack && state.activeTrack !== this.activeTrackId) {
            this.activeTrackId = state.activeTrack;
            this.render();
          }
        });
      }
    }

    disconnectedCallback() {
      if (this._unsubscribe) this._unsubscribe();
      if (this._outsideClickListener) {
        document.removeEventListener('click', this._outsideClickListener);
      }
      if (this._escapeListener) this.shadowRoot.removeEventListener('keydown', this._escapeListener);
    }

    selectTrack(id) {
      if (this.activeTrackId === id) {
        this.isOpen = false;
        this.updateDropdown();
        this.shadowRoot.querySelector('.trigger')?.focus();
        return;
      }
      this.activeTrackId = id;
      this.isOpen = false;
      if (global.PegaStore) {
        global.PegaStore.state.activeTrack = id;
      }
      // If we are in lms mode (hash has track id or is home), change hash to the new track
      const mode = location.hash.replace('#', '').split('/')[0];
      if (mode !== 'mock' && mode !== 'review') {
        location.hash = "#" + id;
      } else {
        // We are in mock/review view. Since mock-view reads on mount, fire a custom event
        window.dispatchEvent(new CustomEvent('pega-track-changed', { detail: id }));
      }
      this.render();
      this.shadowRoot.querySelector('.trigger')?.focus();
    }

    toggleDropdown() {
      this.isOpen = !this.isOpen;
      this.updateDropdown();
    }

    updateDropdown() {
      const dropdown = this.shadowRoot.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.classList.toggle('open', this.isOpen);
      }
      const trigger = this.shadowRoot.querySelector('.trigger');
      if (trigger) trigger.setAttribute('aria-expanded', String(this.isOpen));
    }

    render() {
      const activeTrack = this.tracks.find(t => t.trackId === this.activeTrackId) || this.tracks[0];
      if (!activeTrack) return;

      this.shadowRoot.innerHTML = `
        <style>
:host {
display: block;
position: relative;
font-family: var(--pa-font-primary, system-ui, sans-serif);
margin: 16px 0;
user-select: none;
z-index: 100;
}
.trigger {
width: 100%;
font: inherit;
text-align: left;
color: inherit;
display: flex;
align-items: center;
justify-content: space-between;
background: var(--pa-surface-1);
padding: 12px 16px;
border-radius: 12px;
cursor: pointer;
border: 1px solid var(--pa-line);
transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, background 0.2s;
box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.trigger:hover {
border-color: var(--pa-brand);
background: var(--pa-surface-2);
transform: translateY(-1px);
box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
.trigger:active {
transform: scale(0.98);
box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.info {
display: flex;
flex-direction: column;
gap: 4px;
}
.label {
font-size: 11px;
text-transform: uppercase;
letter-spacing: 0.5px;
color: var(--pa-muted);
font-weight: 600;
}
.name {
font-size: 15px;
font-weight: 600;
color: var(--pa-ink);
display: flex;
align-items: center;
gap: 8px;
}
.chevron {
width: 16px;
height: 16px;
color: var(--pa-muted);
transition: transform 0.2s ease;
}
.dropdown-menu.open + .trigger .chevron {
transform: rotate(180deg);
}
.dropdown-menu {
position: absolute;
top: calc(100% + 8px);
left: 0;
right: 0;
background: var(--pa-surface-1);
border: 1px solid var(--pa-line);
border-radius: 12px;
box-shadow: 0 10px 30px rgba(0,0,0,0.3);
opacity: 0;
visibility: hidden;
transform: translateY(-10px);
transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease, visibility 0.2s ease;
max-height: min(65vh, 560px);
overflow-y: auto;
}
.dropdown-menu.open {
opacity: 1;
visibility: visible;
transform: translateY(0);
}
.track-option {
width: 100%;
border: 0;
background: transparent;
text-align: left;
font: inherit;
padding: 12px 16px;
cursor: pointer;
transition: background 0.2s;
display: flex;
align-items: center;
gap: 12px;
color: var(--pa-ink-soft);
}
.track-option:hover {
background: var(--pa-surface-2);
color: var(--pa-ink);
}
.track-option.active {
background: var(--pa-grad-soft);
color: var(--pa-ink);
font-weight: 500;
}
.trigger:focus-visible, .track-option:focus-visible {
outline: 2px solid var(--pa-brand);
outline-offset: 2px;
}
.track-icon {
flex-shrink: 0;
display: flex;
align-items: center;
justify-content: center;
width: 32px;
height: 32px;
background: var(--pa-surface-2);
border: 1px solid var(--pa-line);
border-radius: 8px;
font-size: 14px;
transition: background 0.2s;
}
.track-option.active .track-icon {
background: var(--pa-surface-2);
color: var(--pa-brand);
border-color: var(--pa-brand);
}
@media (max-width:860px) {
:host { margin:16px 0; }
.trigger,.track-option { min-height:48px; }
.track-icon { flex-shrink:0; }
.dropdown-menu { max-height:min(55dvh,400px); overscroll-behavior:contain; }
}
</style>

        <div class="dropdown-menu" id="track-options">
          ${this.tracks.map(t => `
            <button type="button" class="track-option ${t.trackId === this.activeTrackId ? 'active' : ''}" data-id="${escapeHtml(t.trackId)}" ${t.trackId === this.activeTrackId ? 'aria-current="true"' : ''}>
              <span class="track-icon">${trackIcon(t.trackId)}</span>
              <span>
                <span style="display:block;font-size: 14px">${escapeHtml(t.trackName)}</span>
                <span style="display:block;font-size: 11px; color: var(--pa-muted); margin-top: 2px">${escapeHtml(t.trackId)} Track</span>
              </span>
            </button>
          `).join('')}
        </div>

        <button type="button" class="trigger" aria-label="Learning track: ${escapeHtml(activeTrack.trackName)}" aria-controls="track-options" aria-expanded="${this.isOpen}">
          <span class="info">
            <span class="label">Learning Track</span>
            <span class="name">
              ${escapeHtml(activeTrack.trackName)}
            </span>
          </span>
          <svg class="chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      `;

      this.shadowRoot.querySelector('.trigger').addEventListener('click', () => this.toggleDropdown());
      this.shadowRoot.querySelectorAll('.track-option').forEach(el => {
        el.addEventListener('click', () => this.selectTrack(el.getAttribute('data-id')));
      });
      this.updateDropdown();
    }
  }

  customElements.define('pega-track-switcher', PegaTrackSwitcher);

})(window);
