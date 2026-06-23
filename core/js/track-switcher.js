/* core/js/track-switcher.js */
(function(global) {
  'use strict';

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
      fetch('data/registry.json?_t=' + Date.now())
        .then(res => res.json())
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
      
      // Listen to PegaStore changes in case track changes elsewhere
      if (global.PegaStore) {
        global.PegaStore.watch((state) => {
          if (state.activeTrack && state.activeTrack !== this.activeTrackId) {
            this.activeTrackId = state.activeTrack;
            this.render();
          }
        });
      }
    }

    disconnectedCallback() {
      if (this._outsideClickListener) {
        document.removeEventListener('click', this._outsideClickListener);
      }
    }

    selectTrack(id) {
      if (this.activeTrackId === id) return;
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
            margin: 16px 20px;
            user-select: none;
            z-index: 100;
          }
          .trigger {
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
            overflow: hidden;
          }
          .dropdown-menu.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          .track-option {
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
          .track-icon {
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
            background: var(--pa-brand);
            color: #fff;
            border-color: transparent;
          }
        </style>

        <div class="dropdown-menu">
          ${this.tracks.map(t => `
            <div class="track-option ${t.trackId === this.activeTrackId ? 'active' : ''}" data-id="${t.trackId}">
              <div class="track-icon">${t.trackId === 'PSA' ? '🏛️' : '📊'}</div>
              <div>
                <div style="font-size: 14px">${t.trackName}</div>
                <div style="font-size: 11px; color: var(--pa-muted); margin-top: 2px">${t.trackId} Track</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="trigger">
          <div class="info">
            <span class="label">Learning Track</span>
            <span class="name">
              ${activeTrack.trackName}
            </span>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
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
