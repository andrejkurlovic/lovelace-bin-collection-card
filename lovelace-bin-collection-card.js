/**
 * lovelace-bin-collection-card v3.0.0
 * Home Assistant custom card for UK bin / waste collection schedules
 * https://github.com/andrejkurlovic/lovelace-bin-collection-card
 *
 * Blinking fix: set hass() compares a state-hash of relevant sensors only.
 * Full re-render is skipped when nothing has changed.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Colour map — dark glassy per-bin backgrounds + accent colours
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  grey:     { bg: 'rgba(42,45,49,0.92)',  accent: '#9e9e9e', glow: 'rgba(158,158,158,0.15)' },
  gray:     { bg: 'rgba(42,45,49,0.92)',  accent: '#9e9e9e', glow: 'rgba(158,158,158,0.15)' },
  green:    { bg: 'rgba(30,50,33,0.92)',  accent: '#72e906', glow: 'rgba(114,233,6,0.12)'  },
  garden:   { bg: 'rgba(30,50,33,0.92)',  accent: '#72e906', glow: 'rgba(114,233,6,0.12)'  },
  burgundy: { bg: 'rgba(54,28,40,0.92)',  accent: '#c04070', glow: 'rgba(192,64,112,0.14)' },
  plastic:  { bg: 'rgba(54,28,40,0.92)',  accent: '#c04070', glow: 'rgba(192,64,112,0.14)' },
  beige:    { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843', glow: 'rgba(212,168,67,0.13)' },
  paper:    { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843', glow: 'rgba(212,168,67,0.13)' },
  recycling:{ bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843', glow: 'rgba(212,168,67,0.13)' },
  blue:     { bg: 'rgba(25,40,65,0.92)',  accent: '#4fc3f7', glow: 'rgba(79,195,247,0.13)' },
  brown:    { bg: 'rgba(50,33,20,0.92)',  accent: '#a1887f', glow: 'rgba(161,136,127,0.13)'},
  black:    { bg: 'rgba(20,20,20,0.92)',  accent: '#616161', glow: 'rgba(97,97,97,0.13)'   },
  red:      { bg: 'rgba(60,20,20,0.92)',  accent: '#ef5350', glow: 'rgba(239,83,80,0.13)'  },
  yellow:   { bg: 'rgba(55,50,15,0.92)',  accent: '#ffee58', glow: 'rgba(255,238,88,0.12)' },
  purple:   { bg: 'rgba(40,20,55,0.92)',  accent: '#ab47bc', glow: 'rgba(171,71,188,0.13)' },
  orange:   { bg: 'rgba(55,38,15,0.92)',  accent: '#ffa726', glow: 'rgba(255,167,38,0.13)' },
  pink:     { bg: 'rgba(60,25,45,0.92)',  accent: '#f48fb1', glow: 'rgba(244,143,177,0.12)'},
  silver:   { bg: 'rgba(50,52,55,0.92)',  accent: '#b0bec5', glow: 'rgba(176,190,197,0.12)'},
  amber:    { bg: 'rgba(55,44,10,0.92)',  accent: '#ffca28', glow: 'rgba(255,202,40,0.13)' },
  teal:     { bg: 'rgba(15,45,42,0.92)',  accent: '#26a69a', glow: 'rgba(38,166,154,0.13)' },
  navy:     { bg: 'rgba(10,20,50,0.92)',  accent: '#3949ab', glow: 'rgba(57,73,171,0.14)'  },
  lime:     { bg: 'rgba(35,50,10,0.92)',  accent: '#d4e157', glow: 'rgba(212,225,87,0.12)' },
  white:    { bg: 'rgba(55,58,62,0.92)',  accent: '#eceff1', glow: 'rgba(236,239,241,0.10)'},
  default:  { bg: 'rgba(38,40,44,0.92)',  accent: '#90caf9', glow: 'rgba(144,202,249,0.12)'},
};

function colorFor(c) {
  return COLOR_MAP[(c || '').toLowerCase()] || COLOR_MAP.default;
}

function daysLabel(d, cfg = {}) {
  if (d == null || isNaN(d)) return '—';
  if (d === 0) return cfg.today_text || 'Today';
  if (d === 1) return cfg.tomorrow_text || 'Tomorrow';
  return `in ${d} days`;
}

function daysBrief(d, cfg = {}) {
  if (d == null || isNaN(d)) return '—';
  if (d === 0) return cfg.today_text || 'Today';
  if (d === 1) return cfg.tomorrow_text || 'Tomorrow';
  return `${d}d`;
}

function formatDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatDay(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}

function listNames(bins) {
  if (!bins.length) return '';
  if (bins.length === 1) return bins[0].name;
  if (bins.length === 2) return `${bins[0].name} & ${bins[1].name}`;
  const last = bins[bins.length - 1].name;
  const rest = bins.slice(0, -1).map(b => b.name).join(', ');
  return `${rest} & ${last}`;
}

function groupByDate(bins) {
  const map = {};
  for (const b of bins) {
    const key = b.days;
    if (!map[key]) map[key] = [];
    map[key].push(b);
  }
  return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0]));
}

// State hash for anti-flicker diffing
function stateHash(hass, bins) {
  if (!hass) return '';
  return (bins || []).map(b => {
    const s = b.entity ? hass.states[b.entity] : null;
    return s ? `${s.state}|${s.attributes?.next_collection || ''}` : 'x';
  }).join(',');
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared image helper — handles load error fallback to ha-icon
// ─────────────────────────────────────────────────────────────────────────────
function imgHtml(b, wPx, hPx, cls = '') {
  const style = `width:${wPx}px;height:${hPx}px;object-fit:contain;`;
  if (b.image) {
    return `<img class="${cls}" src="${b.image}" alt="${b.name}" loading="lazy" style="${style}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="icon-fallback" style="display:none;width:${wPx}px;height:${hPx}px;align-items:center;justify-content:center">
        <ha-icon icon="${b.icon || 'mdi:delete'}" style="--mdc-icon-size:${Math.round(hPx * 0.65)}px;color:rgba(255,255,255,0.8)"></ha-icon>
      </div>`;
  }
  return `<div class="icon-fallback" style="width:${wPx}px;height:${hPx}px;display:flex;align-items:center;justify-content:center">
    <ha-icon icon="${b.icon || 'mdi:delete'}" style="--mdc-icon-size:${Math.round(hPx * 0.65)}px;color:rgba(255,255,255,0.8)"></ha-icon>
  </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual Editor
// ─────────────────────────────────────────────────────────────────────────────
class BinCollectionCardEditor extends HTMLElement {
  set hass(h) { this._hass = h; }

  setConfig(c) {
    this._config = Object.assign({
      title: 'Bin Collection',
      mode: 'smart-summary',
      days_ahead: 14,
      show_header: true,
      show_next_summary: true,
      popup: true,
      sort: true,
      show_all_bins: false,
      fade_future_bins: false,
      highlight_today: 'subtle',
      secondary_info: 'days',
      bins: [],
    }, c);
    this._render();
  }

  connectedCallback() { this._render(); }

  _render() {
    if (!this._config) return;
    const c = this._config;
    const MODES = ['smart-summary', 'image-grid', 'timeline', 'compact'];
    const HIGHLIGHTS = ['off', 'subtle', 'strong'];
    const SECONDARY = ['days', 'date', 'both'];

    this.innerHTML = `
<style>
  .ed { padding: 8px 2px; font-family: var(--primary-font-family, sans-serif); color: var(--primary-text-color); }
  .sect { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
          color: var(--secondary-text-color); margin: 18px 0 8px; padding-bottom: 4px;
          border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08)); }
  .row { display: flex; align-items: center; gap: 10px; margin-bottom: 7px; }
  .row label { font-size: 12px; flex: 0 0 150px; color: var(--secondary-text-color); }
  .row select, .row input[type=text], .row input[type=number] {
    flex: 1; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 6px;
    color: var(--primary-text-color); padding: 6px 8px; font-size: 12px; min-width: 0; }
  .row input[type=checkbox] { width: 18px; height: 18px; accent-color: var(--primary-color); flex: none; }
  .bins-head { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 8px; }
  .bins-head span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); }
  .add-btn { background: var(--primary-color); color: white; border: none; border-radius: 6px;
             padding: 5px 12px; font-size: 12px; cursor: pointer; }
  .bin-item { background: var(--input-fill-color, rgba(255,255,255,0.03));
              border: 1px solid var(--divider-color, rgba(255,255,255,0.07));
              border-radius: 10px; padding: 12px; margin-bottom: 8px; }
  .bin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 4px; }
  .bin-field label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-field input[type=text], .bin-field select {
    width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box; }
  .bin-foot { display: flex; justify-content: flex-end; margin-top: 8px; }
  .del-btn { background: rgba(239,83,80,0.15); color: #ef5350;
             border: 1px solid rgba(239,83,80,0.25); border-radius: 5px;
             padding: 4px 12px; font-size: 11px; cursor: pointer; }
  .bin-name-row { margin-bottom: 6px; }
  .bin-name-row label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-name-row input { width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box; }
</style>
<div class="ed">
  <div class="sect">Display</div>
  <div class="row">
    <label>Mode</label>
    <select data-key="mode">
      ${MODES.map(m => `<option value="${m}"${c.mode === m ? ' selected' : ''}>${m}</option>`).join('')}
    </select>
  </div>
  <div class="row"><label>Title</label>
    <input type="text" data-key="title" value="${c.title || ''}"></div>
  <div class="row"><label>Show header</label>
    <input type="checkbox" data-key="show_header" ${c.show_header !== false ? 'checked' : ''}></div>
  <div class="row"><label>Next summary line</label>
    <input type="checkbox" data-key="show_next_summary" ${c.show_next_summary !== false ? 'checked' : ''}></div>
  <div class="row"><label>Popup on tap</label>
    <input type="checkbox" data-key="popup" ${c.popup !== false ? 'checked' : ''}></div>

  <div class="sect">Filtering &amp; Sorting</div>
  <div class="row"><label>Days ahead</label>
    <input type="number" data-key="days_ahead" value="${c.days_ahead != null ? c.days_ahead : 14}" min="1" max="60"></div>
  <div class="row"><label>Sort by soonest</label>
    <input type="checkbox" data-key="sort" ${c.sort !== false ? 'checked' : ''}></div>
  <div class="row"><label>Show all bins</label>
    <input type="checkbox" data-key="show_all_bins" ${c.show_all_bins ? 'checked' : ''}></div>
  <div class="row"><label>Fade future bins</label>
    <input type="checkbox" data-key="fade_future_bins" ${c.fade_future_bins ? 'checked' : ''}></div>

  <div class="sect">Visual</div>
  <div class="row"><label>Highlight today</label>
    <select data-key="highlight_today">
      ${HIGHLIGHTS.map(v => `<option value="${v}"${(c.highlight_today || 'subtle') === v ? ' selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div class="row"><label>Secondary info</label>
    <select data-key="secondary_info">
      ${SECONDARY.map(v => `<option value="${v}"${(c.secondary_info || 'days') === v ? ' selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div class="row"><label>Today label</label>
    <input type="text" data-key="today_text" value="${c.today_text || 'Today'}"></div>
  <div class="row"><label>Tomorrow label</label>
    <input type="text" data-key="tomorrow_text" value="${c.tomorrow_text || 'Tomorrow'}"></div>

  <div class="bins-head">
    <span>Bins</span>
    <button class="add-btn" id="add-bin">+ Add bin</button>
  </div>
  <div id="bins-list">${this._binsHtml(c.bins || [])}</div>
</div>`;
    this._listen();
  }

  _binsHtml(bins) {
    return bins.map((b, i) => `
<div class="bin-item" data-index="${i}">
  <div class="bin-name-row">
    <label>Name</label>
    <input type="text" data-index="${i}" data-field="name" value="${b.name || ''}">
  </div>
  <div class="bin-name-row">
    <label>Entity (sensor ID)</label>
    <input type="text" data-index="${i}" data-field="entity" value="${b.entity || ''}" placeholder="sensor.my_bin_days">
  </div>
  <div class="bin-grid">
    <div class="bin-field">
      <label>Image URL</label>
      <input type="text" data-index="${i}" data-field="image" value="${b.image || ''}" placeholder="/local/images/bin.png">
    </div>
    <div class="bin-field">
      <label>Fallback icon</label>
      <input type="text" data-index="${i}" data-field="icon" value="${b.icon || 'mdi:delete'}">
    </div>
    <div class="bin-field">
      <label>Colour</label>
      <select data-index="${i}" data-field="color">
        ${Object.keys(COLOR_MAP).filter(k => k !== 'default').map(k =>
          `<option value="${k}"${(b.color || '').toLowerCase() === k ? ' selected' : ''}>${k}</option>`
        ).join('')}
      </select>
    </div>
    <div class="bin-field">
      <label>Action hint</label>
      <input type="text" data-index="${i}" data-field="action_text" value="${b.action_text || ''}" placeholder="Put out after 7pm">
    </div>
  </div>
  <div class="bin-name-row" style="margin-top:4px">
    <label>Notes / instructions</label>
    <input type="text" data-index="${i}" data-field="notes" value="${b.notes || ''}" placeholder="e.g. Kerb by 7am">
  </div>
  <div class="bin-foot">
    <button class="del-btn" data-delete="${i}">Remove</button>
  </div>
</div>`).join('');
  }

  _listen() {
    this.querySelectorAll('[data-key]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.key;
        let val;
        if (el.type === 'checkbox') val = el.checked;
        else if (el.type === 'number') val = parseInt(el.value, 10);
        else val = el.value;
        this._config = { ...this._config, [key]: val };
        this._fire();
      });
    });

    this.querySelectorAll('[data-index][data-field]').forEach(el => {
      el.addEventListener('change', () => {
        const idx = parseInt(el.dataset.index, 10);
        const field = el.dataset.field;
        const bins = [...(this._config.bins || [])];
        bins[idx] = { ...bins[idx], [field]: el.value };
        this._config = { ...this._config, bins };
        this._fire();
      });
    });

    this.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.delete, 10);
        const bins = [...(this._config.bins || [])];
        bins.splice(idx, 1);
        this._config = { ...this._config, bins };
        this._fire();
        this.querySelector('#bins-list').innerHTML = this._binsHtml(bins);
        this._listen();
      });
    });

    const addBtn = this.querySelector('#add-bin');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const bins = [...(this._config.bins || [])];
        bins.push({ name: 'New Bin', entity: '', color: 'grey', icon: 'mdi:delete' });
        this._config = { ...this._config, bins };
        this._fire();
        this.querySelector('#bins-list').innerHTML = this._binsHtml(bins);
        this._listen();
      });
    }
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }
}
customElements.define('bin-collection-card-editor', BinCollectionCardEditor);

// ─────────────────────────────────────────────────────────────────────────────
// Main Card
// ─────────────────────────────────────────────────────────────────────────────
class BinCollectionCard extends HTMLElement {
  static getConfigElement() { return document.createElement('bin-collection-card-editor'); }

  static getStubConfig() {
    return {
      title: 'Bin Collection',
      mode: 'smart-summary',
      days_ahead: 14,
      show_header: true,
      popup: true,
      sort: true,
      bins: [
        { name: 'General',  entity: 'sensor.general_bin_days',  image: '/local/images/bin_general.png',  color: 'grey',     icon: 'mdi:delete' },
        { name: 'Garden',   entity: 'sensor.garden_bin_days',   image: '/local/images/bin_garden.png',   color: 'green',    icon: 'mdi:leaf' },
        { name: 'Plastic',  entity: 'sensor.plastic_bin_days',  image: '/local/images/bin_plastic.png',  color: 'burgundy', icon: 'mdi:recycle' },
        { name: 'Paper',    entity: 'sensor.paper_bin_days',    image: '/local/images/bin_paper.png',    color: 'beige',    icon: 'mdi:newspaper-variant' },
      ],
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._popup = null;
    this._stateHash = null;
  }

  // ── Anti-flicker: only re-render when our sensor states actually changed ──
  set hass(h) {
    const prev = this._hass;
    this._hass = h;
    if (!this._config) return;

    const hash = stateHash(h, this._config.bins);
    if (hash === this._stateHash) return;   // nothing we care about changed
    this._stateHash = hash;
    this._render();
  }

  setConfig(c) {
    if (!c.bins || !c.bins.length) throw new Error('At least one bin required');
    this._config = c;
    this._stateHash = null; // force re-render on next hass set
    this._render();
  }

  getCardSize() {
    const mode = this._config?.mode || 'smart-summary';
    if (mode === 'compact') return 1;
    if (mode === 'smart-summary') return 4;
    return 3;
  }

  // ── Resolve bins from hass state ──
  _bins() {
    const h = this._hass;
    const c = this._config;
    const daysAhead = c.days_ahead != null ? c.days_ahead : 14;

    let bins = (c.bins || []).map(b => {
      const s = h && b.entity ? h.states[b.entity] : null;
      const days = s ? parseInt(s.state, 10) : null;
      const isValid = days != null && !isNaN(days);
      const nextDate = s?.attributes?.next_collection || null;
      return { ...b, days: isValid ? days : null, nextDate, missing: !s };
    });

    if (c.sort !== false) {
      bins = bins.sort((a, b) => {
        if (a.days == null) return 1;
        if (b.days == null) return -1;
        return a.days - b.days;
      });
    }

    if (!c.show_all_bins) {
      bins = bins.filter(b => b.days == null || b.days <= daysAhead);
    }

    return bins;
  }

  _render() {
    if (!this._config) return;
    const bins = this._bins();
    const mode = this._config.mode || 'smart-summary';

    let body;
    if (mode === 'timeline') body = this._renderTimeline(bins);
    else if (mode === 'compact') body = this._renderCompact(bins);
    else if (mode === 'image-grid') body = this._renderImageGrid(bins);
    else body = this._renderSmartSummary(bins);

    this.shadowRoot.innerHTML = `<style>${this._css()}</style><div class="card">${body}</div>`;
    this._attachListeners(bins);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SMART SUMMARY MODE
  // ══════════════════════════════════════════════════════════════════════════
  _renderSmartSummary(bins) {
    const c = this._config;
    const todayBins = bins.filter(b => b.days === 0);
    const tomorrowBins = bins.filter(b => b.days === 1);
    const upcoming = bins.filter(b => b.days != null && b.days > 1);
    const nextBin = bins.find(b => b.days != null && b.days >= 0);

    // Determine display state
    let headerTitle, headerSub, actionHint, mainBins, secondaryBins;

    if (todayBins.length) {
      headerTitle = 'Collection Day';
      headerSub = listNames(todayBins) + ' ' + (todayBins.length > 1 ? 'are' : 'is') + ' being collected today';
      actionHint = todayBins.some(b => b.action_text) ? todayBins.find(b => b.action_text).action_text : null;
      mainBins = todayBins;
      secondaryBins = [...tomorrowBins, ...upcoming].slice(0, 4);
    } else if (tomorrowBins.length) {
      headerTitle = 'Collection Tomorrow';
      headerSub = listNames(tomorrowBins) + ' — put out tonight';
      actionHint = tomorrowBins.some(b => b.action_text) ? tomorrowBins.find(b => b.action_text).action_text : null;
      mainBins = tomorrowBins;
      secondaryBins = upcoming.slice(0, 4);
    } else if (nextBin) {
      const label = nextBin.days === 1 ? 'Tomorrow' : formatDay(nextBin.days);
      headerTitle = 'Next Collection';
      headerSub = `${nextBin.name} · ${label}`;
      actionHint = null;
      mainBins = bins.filter(b => b.days === nextBin.days);
      secondaryBins = bins.filter(b => b.days !== nextBin.days && b.days != null).slice(0, 4);
    } else {
      headerTitle = 'No Collections Due';
      headerSub = c.days_ahead ? `Nothing within ${c.days_ahead} days` : 'All clear';
      actionHint = null;
      mainBins = [];
      secondaryBins = [];
    }

    const accentColor = mainBins.length ? colorFor(mainBins[0].color).accent : 'var(--primary-color)';
    const mainGlow = mainBins.length ? colorFor(mainBins[0].color).glow : 'transparent';

    // Main visual section
    const mainHtml = mainBins.length
      ? `<div class="ss-main" style="background:linear-gradient(160deg,${mainGlow} 0%,transparent 60%)">
          <div class="ss-bin-row">
            ${mainBins.map(b => {
              const cl = colorFor(b.color);
              return `<div class="ss-bin" data-entity="${b.entity}">
                <div class="ss-bin-inner" style="background:${cl.bg}">
                  ${imgHtml(b, 48, 66, 'ss-img')}
                </div>
                <div class="ss-bin-name">${b.name}</div>
              </div>`;
            }).join('')}
          </div>
          ${actionHint ? `<div class="ss-action-hint">${actionHint}</div>` : ''}
        </div>`
      : `<div class="ss-empty">
          <div class="ss-empty-icon"><ha-icon icon="mdi:check-circle-outline"></ha-icon></div>
          <div class="ss-empty-text">${headerSub}</div>
        </div>`;

    // Secondary strip
    const secHtml = secondaryBins.length
      ? `<div class="ss-strip">
          ${secondaryBins.map(b => {
            const cl = colorFor(b.color);
            const label = daysLabel(b.days, c);
            return `<div class="ss-chip" data-entity="${b.entity}">
              ${imgHtml(b, 18, 24, 'chip-img')}
              <span class="chip-name">${b.name}</span>
              <span class="chip-label">${label}</span>
            </div>`;
          }).join('')}
        </div>`
      : '';

    const headerBlock = c.show_header !== false ? `
      <div class="ss-header" id="header">
        <div class="ss-header-text">
          <div class="ss-title">${headerTitle}</div>
          <div class="ss-subtitle">${mainBins.length || !nextBin ? (mainBins.length ? '' : headerSub) : ''}</div>
        </div>
        ${c.popup !== false ? `<div class="tap-hint">▸</div>` : ''}
      </div>` : '';

    return `${headerBlock}${mainHtml}${secHtml}`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // IMAGE GRID MODE
  // ══════════════════════════════════════════════════════════════════════════
  _renderImageGrid(bins) {
    const c = this._config;
    const header = this._headerHtml(bins);

    if (!bins.length) {
      return `${header}<div class="empty-state">No collections due within ${c.days_ahead || 14} days</div>`;
    }

    const daysAhead = c.days_ahead != null ? c.days_ahead : 14;
    const hl = c.highlight_today || 'subtle';

    const cards = bins.map(b => {
      const cl = colorFor(b.color);
      const urg = b.days === 0 ? 'today' : b.days === 1 ? 'tomorrow' : b.days <= 3 ? 'soon' : '';
      const faded = c.fade_future_bins && b.days != null && b.days > daysAhead / 2;
      const secondaryText = this._secondaryText(b);

      let urgIndicator = '';
      if (urg === 'today' && hl !== 'off') {
        urgIndicator = `<div class="urg-dot today-dot" title="Today"></div>`;
      } else if (urg === 'tomorrow' && hl !== 'off') {
        urgIndicator = `<div class="urg-dot tomorrow-dot" title="Tomorrow"></div>`;
      }

      return `<div class="bin-tile ${faded ? 'faded' : ''}" style="background:${cl.bg}" data-entity="${b.entity}">
        ${urgIndicator}
        <div class="tile-img-wrap">${imgHtml(b, 38, 52, 'tile-img')}</div>
        <div class="tile-name">${b.name}</div>
        <div class="tile-label ${urg}">${b.missing ? '—' : daysLabel(b.days, c)}</div>
        ${b.missing ? '<div class="tile-warn">no entity</div>' : ''}
        <div class="tile-accent" style="background:${cl.accent}"></div>
      </div>`;
    });

    return `${header}<div class="grid">${cards.join('')}</div>`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TIMELINE MODE
  // ══════════════════════════════════════════════════════════════════════════
  _renderTimeline(bins) {
    const header = this._headerHtml(bins);
    const groups = groupByDate(bins);

    if (!groups.length) {
      return `${header}<div class="empty-state">No collections due soon</div>`;
    }

    const rows = groups.map(([days, group]) => {
      const d = parseInt(days, 10);
      const dayLabel = formatDay(d);
      const isToday = d === 0;
      const isTmrw = d === 1;

      return `<div class="tl-row">
        <div class="tl-date ${isToday ? 'tl-today' : isTmrw ? 'tl-tomorrow' : ''}">
          ${dayLabel}
        </div>
        <div class="tl-bins">
          ${group.map(b => {
            const cl = colorFor(b.color);
            return `<div class="tl-chip" style="background:${cl.bg}" data-entity="${b.entity}">
              ${imgHtml(b, 20, 28, 'tl-img')}
              <span class="tl-chip-name">${b.name}</span>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    });

    return `${header}<div class="timeline">${rows.join('')}</div>`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // COMPACT MODE
  // ══════════════════════════════════════════════════════════════════════════
  _renderCompact(bins) {
    const c = this._config;
    const next = bins.find(b => b.days != null);
    const todayBins = bins.filter(b => b.days === 0);

    let summary = 'No collections due';
    if (todayBins.length) summary = `${listNames(todayBins)} today`;
    else if (next) summary = `${next.name} ${daysLabel(next.days, c)}`;

    return `<div class="compact" id="header">
      <div class="compact-dots">
        ${bins.map(b => {
          const cl = colorFor(b.color);
          const urg = b.days === 0 ? 'today' : '';
          return `<div class="compact-dot ${urg}" style="background:${cl.accent}" title="${b.name}: ${daysLabel(b.days, c)}"></div>`;
        }).join('')}
      </div>
      <div class="compact-text">
        <div class="compact-title">${c.title || 'Bin Collection'}</div>
        <div class="compact-summary">${summary}</div>
      </div>
      ${bins.slice(0, 3).map(b => imgHtml(b, 22, 30, 'compact-img')).join('')}
    </div>`;
  }

  // ── shared header ──────────────────────────────────────────────────────────
  _headerHtml(bins) {
    const c = this._config;
    if (c.show_header === false) return '';
    const next = bins.find(b => b.days != null);
    let nextLine = '';
    if (c.show_next_summary !== false && next) {
      const label = daysLabel(next.days, c);
      const cls = next.days === 0 ? 'hl-today' : next.days === 1 ? 'hl-tomorrow' : '';
      nextLine = `<div class="header-sub">Next: ${next.name} — <span class="${cls}">${label}</span></div>`;
    }
    return `<div class="header" id="header">
      <div class="header-left">
        <div class="header-title">${c.title || 'Bin Collection'}</div>
        ${nextLine}
      </div>
      ${c.popup !== false ? '<div class="tap-hint">▸</div>' : ''}
    </div>`;
  }

  _secondaryText(b) {
    const c = this._config;
    const si = c.secondary_info || 'days';
    if (si === 'date') return b.nextDate || formatDate(b.days);
    if (si === 'both' && b.nextDate) return `${daysLabel(b.days, c)} · ${b.nextDate}`;
    return '';
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CSS
  // ══════════════════════════════════════════════════════════════════════════
  _css() {
    return `
:host { display: block; }
*, *::before, *::after { box-sizing: border-box; }

.card {
  background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
  border-radius: var(--ha-card-border-radius, 16px);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  font-family: var(--primary-font-family, sans-serif);
  color: var(--primary-text-color, #fff);
  box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0,0,0,0.4));
}

/* ── HEADER ── */
.header {
  padding: 14px 16px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.header-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.header-title { font-size: 15px; font-weight: 700; letter-spacing: .01em; }
.header-sub { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
.hl-today { color: #ff8a65; font-weight: 600; }
.hl-tomorrow { color: #ffa726; font-weight: 600; }
.tap-hint {
  font-size: 12px;
  color: var(--secondary-text-color, rgba(255,255,255,0.25));
  padding-left: 8px;
  flex-shrink: 0;
}

/* ── SMART SUMMARY ── */
.ss-header {
  padding: 16px 18px 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.ss-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -.01em;
  line-height: 1.2;
}
.ss-subtitle {
  font-size: 12px;
  color: var(--secondary-text-color, rgba(255,255,255,0.55));
  margin-top: 3px;
  line-height: 1.35;
}
.ss-main {
  padding: 8px 16px 14px;
  transition: background .4s;
}
.ss-bin-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.ss-bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.ss-bin-inner {
  border-radius: 14px;
  padding: 12px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: transform .15s;
}
.ss-bin-inner:hover { transform: translateY(-2px); }
.ss-bin-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-text-color, #fff);
  text-align: center;
}
.ss-action-hint {
  margin-top: 10px;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  letter-spacing: .02em;
  font-style: italic;
}
.ss-empty {
  padding: 20px 18px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ss-empty-icon ha-icon {
  --mdc-icon-size: 28px;
  color: rgba(255,255,255,0.2);
}
.ss-empty-text {
  font-size: 13px;
  color: var(--secondary-text-color, rgba(255,255,255,0.4));
}
.ss-strip {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 16px 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.ss-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px 4px 5px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.chip-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-text-color, #fff);
}
.chip-label {
  font-size: 10px;
  color: var(--secondary-text-color, rgba(255,255,255,0.5));
  margin-left: 2px;
}

/* ── IMAGE GRID ── */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  padding: 0 10px 12px;
}
.bin-tile {
  border-radius: 13px;
  padding: 12px 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 5px rgba(0,0,0,0.25);
  transition: transform .15s, box-shadow .15s;
  -webkit-tap-highlight-color: transparent;
}
.bin-tile:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.4); }
.bin-tile:active { transform: scale(.97); }
.bin-tile.faded { opacity: 0.45; }
.tile-img-wrap { position: relative; }
.tile-name { font-size: 12px; font-weight: 700; color: #fff; text-align: center; line-height: 1.2; }
.tile-label { font-size: 11px; color: rgba(255,255,255,0.65); text-align: center; }
.tile-label.today { color: #ff8a65; font-weight: 600; }
.tile-label.tomorrow { color: #ffa726; font-weight: 600; }
.tile-label.soon { color: #fff176; }
.tile-warn { font-size: 9px; color: #ef5350; }
.tile-accent {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  opacity: 0.6;
}
.urg-dot {
  position: absolute;
  top: 8px; right: 8px;
  width: 7px; height: 7px;
  border-radius: 50%;
}
.today-dot { background: #ff8a65; }
.tomorrow-dot { background: #ffa726; }

/* ── TIMELINE ── */
.timeline { padding: 0 14px 14px; }
.tl-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.tl-row:last-child { border-bottom: none; }
.tl-date {
  font-size: 12px;
  font-weight: 600;
  color: var(--secondary-text-color, rgba(255,255,255,0.5));
  min-width: 110px;
  flex-shrink: 0;
  padding-top: 5px;
}
.tl-today { color: #ff8a65; }
.tl-tomorrow { color: #ffa726; }
.tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
.tl-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9px;
  padding: 5px 10px 5px 6px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform .12s;
}
.tl-chip:hover { transform: translateY(-1px); }
.tl-chip-name { font-size: 12px; font-weight: 600; color: #fff; }

/* ── COMPACT ── */
.compact {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.compact-dots { display: flex; gap: 4px; flex-shrink: 0; }
.compact-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  transition: transform .15s;
}
.compact-dot.today { transform: scale(1.4); box-shadow: 0 0 5px currentColor; }
.compact-text { flex: 1; min-width: 0; }
.compact-title { font-size: 13px; font-weight: 700; }
.compact-summary { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
.compact-img { flex-shrink: 0; }

/* ── EMPTY ── */
.empty-state {
  padding: 22px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--secondary-text-color, rgba(255,255,255,0.35));
}

/* ── POPUP ── */
.popup-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9998;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fade-in .16s ease;
}
@media (min-width: 600px) { .popup-bg { align-items: center; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.popup-sheet {
  background: var(--ha-card-background, #1c1c1e);
  border-radius: 22px 22px 0 0;
  width: 100%;
  max-width: 500px;
  max-height: 82vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 -6px 40px rgba(0,0,0,0.55);
  animation: slide-up .22s cubic-bezier(.3,.7,.3,1);
  color: var(--primary-text-color, #fff);
  font-family: var(--primary-font-family, sans-serif);
}
@media (min-width: 600px) {
  .popup-sheet { border-radius: 20px; max-height: 72vh; }
}
@keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.popup-drag { width: 36px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin: 10px auto 0; }

.popup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 10px;
}
.popup-title { font-size: 17px; font-weight: 700; }
.popup-close {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,0.07);
  border: none; cursor: pointer;
  color: var(--secondary-text-color, rgba(255,255,255,0.6));
  font-size: 14px; display: flex; align-items: center; justify-content: center;
  padding: 0;
}

.popup-section { padding: 0 20px 14px; }
.popup-label {
  font-size: 10px; font-weight: 700; letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--secondary-text-color, rgba(255,255,255,0.45));
  margin-bottom: 10px;
}
.popup-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 20px 14px; }

.popup-today-row { display: flex; gap: 8px; flex-wrap: wrap; }
.popup-bin-card {
  flex: 1; min-width: 130px;
  border-radius: 14px;
  padding: 12px 14px 12px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 6px rgba(0,0,0,0.25);
}
.popup-bin-info { flex: 1; min-width: 0; }
.popup-bin-name { font-size: 13px; font-weight: 700; }
.popup-bin-date { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }
.popup-bin-notes { font-size: 10px; color: rgba(255,255,255,0.38); margin-top: 4px; font-style: italic; }
.popup-bin-action { font-size: 10px; color: #ffa726; margin-top: 3px; font-weight: 600; }

.popup-tl-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.popup-tl-row:last-child { border-bottom: none; }
.popup-tl-date {
  font-size: 11px; font-weight: 600;
  color: var(--secondary-text-color, rgba(255,255,255,0.5));
  min-width: 90px; flex-shrink: 0; padding-top: 5px;
}
.popup-tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
.popup-tl-chip {
  display: flex; align-items: center; gap: 5px;
  border-radius: 8px; padding: 4px 9px 4px 5px;
  font-size: 11px; font-weight: 600; color: #fff;
}
.popup-empty { padding: 20px; text-align: center; color: rgba(255,255,255,0.35); font-size: 13px; }
`;
  }

  // ── Event listeners ────────────────────────────────────────────────────────
  _attachListeners(bins) {
    const c = this._config;
    const sr = this.shadowRoot;

    // Header / card tap → popup
    const header = sr.getElementById('header');
    if (header && c.popup !== false) {
      header.addEventListener('click', () => this._openPopup(bins));
    }

    // Bin tap → more-info
    sr.querySelectorAll('[data-entity]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const eid = el.dataset.entity;
        if (eid) {
          this.dispatchEvent(new CustomEvent('hass-more-info', {
            detail: { entityId: eid }, bubbles: true, composed: true,
          }));
        }
      });
    });
  }

  // ── Popup ──────────────────────────────────────────────────────────────────
  _openPopup(bins) {
    this._closePopup();
    const c = this._config;

    const todayBins = bins.filter(b => b.days === 0);
    const upcoming = bins.filter(b => b.days != null && b.days > 0);
    const upGroups = groupByDate(upcoming);

    // Popup rendered in a host element with its own shadow DOM for style isolation
    const host = document.createElement('div');
    host.setAttribute('tabindex', '-1');
    const shadow = host.attachShadow({ mode: 'open' });

    const todaySection = todayBins.length ? `
      <div class="popup-section">
        <div class="popup-label">Today</div>
        <div class="popup-today-row">
          ${todayBins.map(b => {
            const cl = colorFor(b.color);
            return `<div class="popup-bin-card" style="background:${cl.bg}">
              ${imgHtml(b, 32, 44, 'popup-img')}
              <div class="popup-bin-info">
                <div class="popup-bin-name">${b.name}</div>
                <div class="popup-bin-date">${b.nextDate || 'Today'}</div>
                ${b.notes ? `<div class="popup-bin-notes">${b.notes}</div>` : ''}
                ${b.action_text ? `<div class="popup-bin-action">↗ ${b.action_text}</div>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      ${upGroups.length ? '<div class="popup-divider"></div>' : ''}
    ` : '';

    const upcomingSection = upGroups.length ? `
      <div class="popup-section">
        <div class="popup-label">Upcoming</div>
        ${upGroups.map(([days, group]) => {
          const d = parseInt(days, 10);
          const label = formatDay(d);
          return `<div class="popup-tl-row">
            <div class="popup-tl-date">${label}</div>
            <div class="popup-tl-bins">
              ${group.map(b => {
                const cl = colorFor(b.color);
                return `<div class="popup-tl-chip" style="background:${cl.bg}">
                  ${imgHtml(b, 16, 22, 'popup-chip-img')}
                  ${b.name}
                </div>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    ` : '';

    const noneMsg = !todayBins.length && !upGroups.length
      ? '<div class="popup-empty">No upcoming collections</div>'
      : '';

    shadow.innerHTML = `
<style>
  * { box-sizing: border-box; }
  .popup-bg {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 9998;
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadein .16s ease;
  }
  @media (min-width: 600px) { .popup-bg { align-items: center; } }
  @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
  .popup-sheet {
    background: var(--ha-card-background, #1c1c1e);
    border-radius: 22px 22px 0 0;
    width: 100%; max-width: 500px; max-height: 82vh;
    overflow-y: auto; overflow-x: hidden;
    box-shadow: 0 -6px 40px rgba(0,0,0,0.55);
    animation: slideup .22s cubic-bezier(.3,.7,.3,1);
    color: var(--primary-text-color, #fff);
    font-family: var(--primary-font-family, sans-serif);
  }
  @media (min-width: 600px) { .popup-sheet { border-radius: 20px; max-height: 72vh; } }
  @keyframes slideup { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .popup-drag { width: 36px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin: 10px auto 0; }
  .popup-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 10px; }
  .popup-title { font-size: 17px; font-weight: 700; }
  .popup-close { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.07);
    border: none; cursor: pointer; color: rgba(255,255,255,0.6); font-size: 14px;
    display: flex; align-items: center; justify-content: center; padding: 0; }
  .popup-section { padding: 0 20px 14px; }
  .popup-label { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
    color: rgba(255,255,255,0.45); margin-bottom: 10px; }
  .popup-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 20px 14px; }
  .popup-today-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .popup-bin-card { flex: 1; min-width: 130px; border-radius: 14px; padding: 12px 14px 12px 10px;
    display: flex; align-items: center; gap: 10px;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 1px 6px rgba(0,0,0,0.25); }
  .popup-bin-info { flex: 1; min-width: 0; }
  .popup-bin-name { font-size: 13px; font-weight: 700; }
  .popup-bin-date { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }
  .popup-bin-notes { font-size: 10px; color: rgba(255,255,255,0.38); margin-top: 4px; font-style: italic; }
  .popup-bin-action { font-size: 10px; color: #ffa726; margin-top: 3px; font-weight: 600; }
  .popup-tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05); }
  .popup-tl-row:last-child { border-bottom: none; }
  .popup-tl-date { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5);
    min-width: 90px; flex-shrink: 0; padding-top: 5px; }
  .popup-tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
  .popup-tl-chip { display: flex; align-items: center; gap: 5px; border-radius: 8px;
    padding: 4px 9px 4px 5px; font-size: 11px; font-weight: 600; color: #fff; }
  .popup-empty { padding: 20px; text-align: center; color: rgba(255,255,255,0.35); font-size: 13px; }
</style>
<div class="popup-bg" id="bg">
  <div class="popup-sheet">
    <div class="popup-drag"></div>
    <div class="popup-head">
      <div class="popup-title">${c.title || 'Bin Collection'}</div>
      <button class="popup-close" id="close-btn">✕</button>
    </div>
    ${todaySection}${upcomingSection}${noneMsg}
  </div>
</div>`;

    document.body.appendChild(host);
    this._popup = host;

    shadow.getElementById('close-btn').addEventListener('click', () => this._closePopup());
    shadow.getElementById('bg').addEventListener('click', e => {
      if (e.target === shadow.getElementById('bg')) this._closePopup();
    });

    const onEsc = e => {
      if (e.key === 'Escape') { this._closePopup(); document.removeEventListener('keydown', onEsc); }
    };
    document.addEventListener('keydown', onEsc);
    this._escHandler = onEsc;
  }

  _closePopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = null;
    }
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  }

  disconnectedCallback() { this._closePopup(); }
}

customElements.define('bin-collection-card', BinCollectionCard);

window.customCards = window.customCards || [];
const _existingCard = window.customCards.find(c => c.type === 'bin-collection-card');
if (!_existingCard) {
  window.customCards.push({
    type: 'bin-collection-card',
    name: 'Bin Collection Card',
    description: 'UK bin/waste collection schedule — smart-summary, image-grid, timeline, compact modes',
    preview: true,
    documentationURL: 'https://github.com/andrejkurlovic/lovelace-bin-collection-card',
  });
}
