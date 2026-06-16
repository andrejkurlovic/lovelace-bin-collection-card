/**
 * lovelace-bin-collection-card v2.0.0
 * Home Assistant custom card for UK bin / waste collection schedules
 * https://github.com/andrejkurlovic/lovelace-bin-collection-card
 */

// ── colour map ──────────────────────────────────────────────────────────────
const COLOR_MAP = {
  grey:    { bg: 'rgba(42,45,49,0.92)',  accent: '#9e9e9e' },
  gray:    { bg: 'rgba(42,45,49,0.92)',  accent: '#9e9e9e' },
  green:   { bg: 'rgba(30,50,33,0.92)',  accent: '#72e906' },
  garden:  { bg: 'rgba(30,50,33,0.92)',  accent: '#72e906' },
  burgundy:{ bg: 'rgba(54,28,40,0.92)',  accent: '#c04070' },
  plastic: { bg: 'rgba(54,28,40,0.92)',  accent: '#c04070' },
  beige:   { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843' },
  paper:   { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843' },
  recycling:{ bg: 'rgba(52,48,35,0.92)', accent: '#d4a843' },
  blue:    { bg: 'rgba(25,40,65,0.92)',  accent: '#4fc3f7' },
  brown:   { bg: 'rgba(50,33,20,0.92)',  accent: '#a1887f' },
  black:   { bg: 'rgba(20,20,20,0.92)',  accent: '#616161' },
  red:     { bg: 'rgba(60,20,20,0.92)',  accent: '#ef5350' },
  yellow:  { bg: 'rgba(55,50,15,0.92)',  accent: '#ffee58' },
  purple:  { bg: 'rgba(40,20,55,0.92)',  accent: '#ab47bc' },
  orange:  { bg: 'rgba(55,38,15,0.92)',  accent: '#ffa726' },
  pink:    { bg: 'rgba(60,25,45,0.92)',  accent: '#f48fb1' },
  silver:  { bg: 'rgba(50,52,55,0.92)',  accent: '#b0bec5' },
  amber:   { bg: 'rgba(55,44,10,0.92)',  accent: '#ffca28' },
  teal:    { bg: 'rgba(15,45,42,0.92)',  accent: '#26a69a' },
  navy:    { bg: 'rgba(10,20,50,0.92)',  accent: '#3949ab' },
  lime:    { bg: 'rgba(35,50,10,0.92)',  accent: '#d4e157' },
  white:   { bg: 'rgba(55,58,62,0.92)',  accent: '#eceff1' },
  default: { bg: 'rgba(38,40,44,0.92)',  accent: '#90caf9' },
};

function colorFor(c) {
  return COLOR_MAP[(c || '').toLowerCase()] || COLOR_MAP.default;
}

function daysLabel(d) {
  if (d == null || isNaN(d)) return '?';
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  return `${d} days`;
}

function urgencyClass(d) {
  if (d == null || isNaN(d)) return '';
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  if (d <= 3) return 'soon';
  return '';
}

function formatDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function groupByDate(bins) {
  const map = {};
  for (const b of bins) {
    const key = b.days;
    if (!map[key]) map[key] = [];
    map[key].push(b);
  }
  return Object.entries(map).sort((a, b) => a[0] - b[0]);
}

// ── Editor element ───────────────────────────────────────────────────────────
class BinCollectionCardEditor extends HTMLElement {
  set hass(h) { this._hass = h; this._renderEntityPickers(); }
  setConfig(c) { this._config = Object.assign({}, c); this.render(); }

  connectedCallback() { this.render(); }

  render() {
    if (!this._config) return;
    const c = this._config;
    this.innerHTML = `
<style>
  .editor { padding: 8px; font-family: var(--primary-font-family, sans-serif); color: var(--primary-text-color); }
  .section { margin-top: 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); margin-bottom: 6px; }
  .row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .row label { font-size: 13px; flex: 0 0 140px; }
  .row input[type=text], .row select { flex: 1; background: var(--input-fill-color, rgba(255,255,255,0.06)); border: 1px solid var(--divider-color, rgba(255,255,255,0.12)); border-radius: 6px; color: var(--primary-text-color); padding: 6px 8px; font-size: 13px; }
  .row input[type=checkbox] { width: 18px; height: 18px; accent-color: var(--primary-color); }
  .bins-header { display: flex; align-items: center; justify-content: space-between; margin: 16px 0 8px; }
  .bins-header span { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); }
  .add-btn { background: var(--primary-color); color: white; border: none; border-radius: 6px; padding: 4px 12px; font-size: 12px; cursor: pointer; }
  .bin-item { background: var(--input-fill-color, rgba(255,255,255,0.04)); border: 1px solid var(--divider-color, rgba(255,255,255,0.08)); border-radius: 8px; padding: 10px; margin-bottom: 8px; }
  .bin-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .bin-row label { font-size: 12px; flex: 0 0 90px; color: var(--secondary-text-color); }
  .bin-row input[type=text] { flex: 1; background: var(--input-fill-color, rgba(255,255,255,0.06)); border: 1px solid var(--divider-color, rgba(255,255,255,0.12)); border-radius: 5px; color: var(--primary-text-color); padding: 5px 7px; font-size: 12px; }
  .bin-row select { flex: 1; background: var(--input-fill-color, rgba(255,255,255,0.06)); border: 1px solid var(--divider-color, rgba(255,255,255,0.12)); border-radius: 5px; color: var(--primary-text-color); padding: 5px 7px; font-size: 12px; }
  .entity-row { margin-bottom: 6px; }
  .entity-row label { font-size: 12px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-actions { display: flex; justify-content: flex-end; gap: 6px; }
  .del-btn { background: rgba(239,83,80,0.2); color: #ef5350; border: 1px solid rgba(239,83,80,0.3); border-radius: 5px; padding: 3px 10px; font-size: 11px; cursor: pointer; }
  .del-btn:hover { background: rgba(239,83,80,0.35); }
</style>
<div class="editor">
  <div class="section">Card settings</div>
  <div class="row">
    <label>Title</label>
    <input type="text" data-key="title" value="${c.title || 'Bin Collection'}">
  </div>
  <div class="row">
    <label>Mode</label>
    <select data-key="mode">
      <option value="image-grid"${(c.mode||'image-grid')==='image-grid'?' selected':''}>Image Grid</option>
      <option value="timeline"${c.mode==='timeline'?' selected':''}>Timeline</option>
      <option value="compact"${c.mode==='compact'?' selected':''}>Compact Summary</option>
    </select>
  </div>
  <div class="row">
    <label>Days ahead</label>
    <input type="text" data-key="days_ahead" value="${c.days_ahead != null ? c.days_ahead : 14}">
  </div>
  <div class="row">
    <label>Show header</label>
    <input type="checkbox" data-key="show_header" ${c.show_header !== false ? 'checked' : ''}>
  </div>
  <div class="row">
    <label>Next collection line</label>
    <input type="checkbox" data-key="show_next_summary" ${c.show_next_summary !== false ? 'checked' : ''}>
  </div>
  <div class="row">
    <label>Popup on tap</label>
    <input type="checkbox" data-key="popup" ${c.popup !== false ? 'checked' : ''}>
  </div>
  <div class="row">
    <label>Sort by soonest</label>
    <input type="checkbox" data-key="sort" ${c.sort !== false ? 'checked' : ''}>
  </div>
  <div class="row">
    <label>Show faded (past)</label>
    <input type="checkbox" data-key="show_all_faded" ${c.show_all_faded ? 'checked' : ''}>
  </div>

  <div class="bins-header">
    <span>Bins</span>
    <button class="add-btn" id="add-bin">+ Add bin</button>
  </div>
  <div id="bins-list"></div>
</div>`;

    this._renderBins();
    this._attachListeners();
  }

  _renderBins() {
    const list = this.querySelector('#bins-list');
    if (!list) return;
    const bins = this._config.bins || [];
    list.innerHTML = bins.map((b, i) => `
<div class="bin-item" data-index="${i}">
  <div class="entity-row">
    <label>Entity</label>
    <input type="text" class="entity-input" data-index="${i}" data-field="entity" value="${b.entity || ''}" placeholder="sensor.my_bin_days">
  </div>
  <div class="bin-row">
    <label>Name</label>
    <input type="text" data-index="${i}" data-field="name" value="${b.name || ''}">
  </div>
  <div class="bin-row">
    <label>Image URL</label>
    <input type="text" data-index="${i}" data-field="image" value="${b.image || ''}" placeholder="/local/images/bin.png">
  </div>
  <div class="bin-row">
    <label>Icon fallback</label>
    <input type="text" data-index="${i}" data-field="icon" value="${b.icon || 'mdi:delete'}" placeholder="mdi:delete">
  </div>
  <div class="bin-row">
    <label>Colour</label>
    <select data-index="${i}" data-field="color">
      ${Object.keys(COLOR_MAP).filter(k => k!=='default').map(k =>
        `<option value="${k}"${(b.color||'').toLowerCase()===k?' selected':''}>${k}</option>`
      ).join('')}
    </select>
  </div>
  <div class="bin-row">
    <label>Notes</label>
    <input type="text" data-index="${i}" data-field="notes" value="${b.notes || ''}" placeholder="e.g. Pull to kerb">
  </div>
  <div class="bin-actions">
    <button class="del-btn" data-delete="${i}">Remove</button>
  </div>
</div>`).join('');
  }

  _renderEntityPickers() { /* entity inputs work as plain text in editor */ }

  _attachListeners() {
    // top-level inputs
    this.querySelectorAll('[data-key]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.key;
        const val = el.type === 'checkbox' ? el.checked : (key === 'days_ahead' ? parseInt(el.value) : el.value);
        this._config = { ...this._config, [key]: val };
        this._fire();
      });
    });

    // bin field inputs
    this.querySelectorAll('[data-index][data-field]').forEach(el => {
      el.addEventListener('change', () => {
        const idx = parseInt(el.dataset.index);
        const field = el.dataset.field;
        const bins = [...(this._config.bins || [])];
        bins[idx] = { ...bins[idx], [field]: el.value };
        this._config = { ...this._config, bins };
        this._fire();
      });
    });

    // delete buttons
    this.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.delete);
        const bins = [...(this._config.bins || [])];
        bins.splice(idx, 1);
        this._config = { ...this._config, bins };
        this._fire();
        this._renderBins();
        this._attachListeners();
      });
    });

    // add bin
    const addBtn = this.querySelector('#add-bin');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const bins = [...(this._config.bins || [])];
        bins.push({ name: 'New Bin', entity: '', color: 'grey', icon: 'mdi:delete' });
        this._config = { ...this._config, bins };
        this._fire();
        this._renderBins();
        this._attachListeners();
      });
    }
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}
customElements.define('bin-collection-card-editor', BinCollectionCardEditor);

// ── Main card ────────────────────────────────────────────────────────────────
class BinCollectionCard extends HTMLElement {
  static getConfigElement() { return document.createElement('bin-collection-card-editor'); }
  static getStubConfig() {
    return {
      title: 'Bin Collection',
      mode: 'image-grid',
      days_ahead: 14,
      show_header: true,
      show_next_summary: true,
      popup: true,
      sort: true,
      bins: [
        { name: 'General',  entity: 'sensor.general_bin_days',  image: '/local/images/bin_general.png',  color: 'grey',    icon: 'mdi:delete' },
        { name: 'Garden',   entity: 'sensor.garden_bin_days',   image: '/local/images/bin_garden.png',   color: 'green',   icon: 'mdi:leaf' },
        { name: 'Plastic',  entity: 'sensor.plastic_bin_days',  image: '/local/images/bin_plastic.png',  color: 'burgundy',icon: 'mdi:recycle' },
        { name: 'Paper',    entity: 'sensor.paper_bin_days',    image: '/local/images/bin_paper.png',    color: 'beige',   icon: 'mdi:newspaper-variant' },
      ]
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._popup = null;
  }

  set hass(h) {
    this._hass = h;
    this._update();
  }

  setConfig(c) {
    if (!c.bins || !c.bins.length) throw new Error('bins list required');
    this._config = c;
    this._update();
  }

  getCardSize() { return 3; }

  _resolveBins() {
    const h = this._hass;
    const c = this._config;
    const daysAhead = c.days_ahead != null ? c.days_ahead : 14;
    let bins = (c.bins || []).map(b => {
      const state = h && b.entity ? h.states[b.entity] : null;
      const days = state ? parseInt(state.state, 10) : null;
      const nextDate = state && state.attributes && state.attributes.next_collection
        ? state.attributes.next_collection : null;
      return { ...b, days, nextDate, missing: !state };
    });

    if (c.sort !== false) bins = bins.sort((a, b) => {
      if (a.days == null) return 1;
      if (b.days == null) return -1;
      return a.days - b.days;
    });

    if (!c.show_all_faded) {
      bins = bins.filter(b => b.days == null || b.days <= daysAhead);
    }
    return bins;
  }

  _nextBin(bins) {
    return bins.find(b => b.days != null && !isNaN(b.days));
  }

  _styles() {
    return `
:host { display: block; }
* { box-sizing: border-box; }
.card {
  background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
  border-radius: var(--ha-card-border-radius, 14px);
  border: 1px solid var(--divider-color, rgba(255,255,255,0.07));
  overflow: hidden;
  font-family: var(--primary-font-family, sans-serif);
  color: var(--primary-text-color, #fff);
  box-shadow: var(--ha-card-box-shadow, 0 2px 10px rgba(0,0,0,0.35));
}
.header {
  padding: 12px 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}
.header-left { display: flex; flex-direction: column; gap: 2px; }
.title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .02em;
  color: var(--primary-text-color, #fff);
}
.next-line {
  font-size: 11px;
  color: var(--secondary-text-color, rgba(255,255,255,0.6));
}
.next-line .urg-today { color: #ff7043; font-weight: 700; }
.next-line .urg-tomorrow { color: #ffa726; font-weight: 600; }
.popup-hint {
  font-size: 10px;
  color: var(--secondary-text-color, rgba(255,255,255,0.35));
  letter-spacing: .05em;
}

/* ── IMAGE GRID ── */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 0 8px 10px;
}
.bin-card {
  border-radius: 12px;
  padding: 10px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  position: relative;
  transition: transform .15s, box-shadow .15s;
}
.bin-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
.bin-card:active { transform: scale(.97); }
.bin-img {
  width: 40px;
  height: 56px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));
}
.bin-icon {
  width: 40px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bin-icon ha-icon { --mdc-icon-size: 34px; color: white; opacity: 0.85; }
.bin-name {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  line-height: 1.2;
}
.bin-label {
  font-size: 11px;
  color: rgba(255,255,255,0.72);
  text-align: center;
}
.urgency-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .06em;
  border-radius: 4px;
  padding: 2px 5px;
  text-transform: uppercase;
  line-height: 1;
}
.urgency-badge.today { background: rgba(255,112,67,0.25); color: #ff7043; border: 1px solid rgba(255,112,67,0.4); }
.urgency-badge.tomorrow { background: rgba(255,167,38,0.20); color: #ffa726; border: 1px solid rgba(255,167,38,0.35); }
.urgency-badge.soon { background: rgba(255,238,88,0.15); color: #ffee58; border: 1px solid rgba(255,238,88,0.3); }
.accent-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 0 0 12px 12px;
  opacity: 0;
  transition: opacity .2s;
}
.bin-card.today .accent-bar,
.bin-card.tomorrow .accent-bar,
.bin-card.soon .accent-bar { opacity: 1; }
.bin-card.today .accent-bar { background: linear-gradient(90deg,transparent,#ff7043,transparent); }
.bin-card.tomorrow .accent-bar { background: linear-gradient(90deg,transparent,#ffa726,transparent); }
.bin-card.soon .accent-bar { background: linear-gradient(90deg,transparent,#ffee58,transparent); }
.bin-card.faded { opacity: 0.4; }
.missing-warn {
  font-size: 9px;
  color: #ef5350;
  text-align: center;
  margin-top: 2px;
}

/* ── TIMELINE ── */
.timeline { padding: 0 12px 12px; }
.date-group { margin-bottom: 12px; }
.date-chip {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--secondary-text-color, rgba(255,255,255,0.55));
  letter-spacing: .04em;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
  padding-bottom: 3px;
  width: 100%;
}
.date-chip.today-chip { color: #ff7043; }
.date-chip.tomorrow-chip { color: #ffa726; }
.tl-bins { display: flex; gap: 8px; flex-wrap: wrap; }
.tl-bin {
  display: flex;
  align-items: center;
  gap: 7px;
  border-radius: 10px;
  padding: 7px 10px 7px 8px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform .12s;
}
.tl-bin:hover { transform: translateY(-1px); }
.tl-img { width: 24px; height: 34px; object-fit: contain; }
.tl-icon { width: 24px; height: 34px; display: flex; align-items: center; justify-content: center; }
.tl-icon ha-icon { --mdc-icon-size: 20px; color: white; opacity: .8; }
.tl-name { font-size: 12px; font-weight: 700; color: #fff; }

/* ── COMPACT ── */
.compact { padding: 8px 14px 12px; }
.compact-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.compact-dots { display: flex; gap: 5px; flex-wrap: wrap; }
.compact-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.compact-line {
  font-size: 12px;
  color: var(--secondary-text-color, rgba(255,255,255,0.6));
}

/* ── POPUP ── */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadein .18s ease;
}
@media (min-width: 600px) {
  .popup-overlay { align-items: center; }
}
@keyframes fadein { from { opacity: 0; } }
.popup-sheet {
  background: var(--ha-card-background, #1c1c1e);
  border-radius: 20px 20px 0 0;
  padding: 0 0 env(safe-area-inset-bottom, 16px);
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 -4px 30px rgba(0,0,0,0.5);
  animation: slideup .22s cubic-bezier(.32,.72,0,1);
}
@media (min-width: 600px) {
  .popup-sheet {
    border-radius: 20px;
    max-height: 75vh;
  }
}
@keyframes slideup { from { transform: translateY(40px); opacity: 0; } }
.popup-handle {
  width: 36px;
  height: 4px;
  background: rgba(255,255,255,0.18);
  border-radius: 2px;
  margin: 10px auto 0;
}
.popup-header {
  padding: 16px 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.popup-title { font-size: 17px; font-weight: 700; }
.popup-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-text-color, rgba(255,255,255,0.6));
  font-size: 16px;
  padding: 0;
}
.popup-section {
  padding: 0 20px 12px;
}
.popup-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--secondary-text-color, rgba(255,255,255,0.5));
  margin-bottom: 8px;
}
.popup-today { display: flex; gap: 10px; flex-wrap: wrap; }
.popup-bin-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  padding: 10px 14px 10px 10px;
  flex: 1;
  min-width: 130px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 6px rgba(0,0,0,0.25);
}
.popup-bin-img { width: 32px; height: 45px; object-fit: contain; }
.popup-bin-icon { width: 32px; height: 45px; display: flex; align-items: center; justify-content: center; }
.popup-bin-icon ha-icon { --mdc-icon-size: 26px; color: white; opacity: .85; }
.popup-bin-info { flex: 1; }
.popup-bin-name { font-size: 13px; font-weight: 700; color: #fff; }
.popup-bin-date { font-size: 11px; color: rgba(255,255,255,0.65); margin-top: 1px; }
.popup-bin-notes { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 3px; font-style: italic; }
.popup-divider { height: 1px; background: var(--divider-color, rgba(255,255,255,0.07)); margin: 0 20px 12px; }
.popup-timeline-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.05));
}
.popup-timeline-row:last-child { border-bottom: none; }
.popup-tl-date { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.5)); width: 90px; flex-shrink: 0; }
.popup-tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
.popup-tl-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  padding: 4px 8px 4px 5px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}
.popup-tl-chip img { width: 14px; height: 20px; object-fit: contain; }
.popup-tl-chip ha-icon { --mdc-icon-size: 14px; }
.empty-state {
  padding: 24px 16px;
  text-align: center;
  color: var(--secondary-text-color, rgba(255,255,255,0.4));
  font-size: 13px;
}
`;
  }

  _binImage(b) {
    if (b.image) return `<img class="bin-img" src="${b.image}" alt="${b.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="bin-icon" style="display:none"><ha-icon icon="${b.icon || 'mdi:delete'}"></ha-icon></div>`;
    return `<div class="bin-icon"><ha-icon icon="${b.icon || 'mdi:delete'}"></ha-icon></div>`;
  }

  _tlBinImage(b, imgClass, iconClass) {
    if (b.image) return `<img class="${imgClass}" src="${b.image}" alt="${b.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="${iconClass}" style="display:none"><ha-icon icon="${b.icon || 'mdi:delete'}"></ha-icon></div>`;
    return `<div class="${iconClass}"><ha-icon icon="${b.icon || 'mdi:delete'}"></ha-icon></div>`;
  }

  _renderImageGrid(bins) {
    if (!bins.length) return `<div class="empty-state">No collections due within ${this._config.days_ahead || 14} days</div>`;
    return `<div class="grid">${bins.map(b => {
      const cl = colorFor(b.color);
      const urg = b.days != null ? urgencyClass(b.days) : '';
      const faded = b.days != null && b.days > (this._config.days_ahead || 14) ? ' faded' : '';
      return `<div class="bin-card ${urg}${faded}" style="background:${cl.bg}" data-entity="${b.entity}" data-name="${b.name}">
        ${this._binImage(b)}
        <div class="bin-name">${b.name}</div>
        <div class="bin-label">${b.missing ? '—' : daysLabel(b.days)}</div>
        ${b.missing ? '<div class="missing-warn">No entity</div>' : ''}
        ${urg ? `<div class="urgency-badge ${urg}">${urg === 'today' ? 'Today' : urg === 'tomorrow' ? 'Tmrw' : 'Soon'}</div>` : ''}
        <div class="accent-bar" style="background:linear-gradient(90deg,transparent,${cl.accent},transparent)"></div>
      </div>`;
    }).join('')}</div>`;
  }

  _renderTimeline(bins) {
    const groups = groupByDate(bins);
    if (!groups.length) return `<div class="empty-state">No collections due soon</div>`;
    return `<div class="timeline">${groups.map(([days, group]) => {
      const d = parseInt(days);
      const chipClass = d === 0 ? 'today-chip' : d === 1 ? 'tomorrow-chip' : '';
      const label = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : formatDate(d);
      return `<div class="date-group">
        <div class="date-chip ${chipClass}">${label}</div>
        <div class="tl-bins">${group.map(b => {
          const cl = colorFor(b.color);
          return `<div class="tl-bin" style="background:${cl.bg}" data-entity="${b.entity}">
            ${this._tlBinImage(b, 'tl-img', 'tl-icon')}
            <div class="tl-name">${b.name}</div>
          </div>`;
        }).join('')}</div>
      </div>`;
    }).join('')}</div>`;
  }

  _renderCompact(bins) {
    const next = this._nextBin(bins);
    const todayBins = bins.filter(b => b.days === 0);
    const summary = next
      ? (next.days === 0 ? `${todayBins.length} bin${todayBins.length > 1 ? 's' : ''} today`
        : next.days === 1 ? `${next.name} tomorrow`
        : `${next.name} in ${next.days} days`)
      : 'No collections due';
    return `<div class="compact">
      <div class="compact-row">
        <div class="compact-dots">${bins.map(b => {
          const cl = colorFor(b.color);
          return `<div class="compact-dot" style="background:${cl.accent}" title="${b.name}: ${daysLabel(b.days)}"></div>`;
        }).join('')}</div>
        <div class="compact-line">${summary}</div>
      </div>
    </div>`;
  }

  _renderHeader(bins) {
    const c = this._config;
    if (c.show_header === false) return '';
    const next = this._nextBin(bins);
    let nextLine = '';
    if (c.show_next_summary !== false && next) {
      const urg = urgencyClass(next.days);
      const label = daysLabel(next.days);
      const cls = urg === 'today' ? 'urg-today' : urg === 'tomorrow' ? 'urg-tomorrow' : '';
      nextLine = `<div class="next-line">Next: ${next.name} — <span class="${cls}">${label}</span></div>`;
    }
    return `<div class="header" id="header">
      <div class="header-left">
        <div class="title">${c.title || 'Bin Collection'}</div>
        ${nextLine}
      </div>
      ${c.popup !== false ? '<div class="popup-hint">tap for timeline</div>' : ''}
    </div>`;
  }

  _update() {
    if (!this._config) return;
    const bins = this._resolveBins();
    const mode = this._config.mode || 'image-grid';
    let body = '';
    if (mode === 'timeline') body = this._renderTimeline(bins);
    else if (mode === 'compact') body = this._renderCompact(bins);
    else body = this._renderImageGrid(bins);

    this.shadowRoot.innerHTML = `
<style>${this._styles()}</style>
<div class="card">
  ${this._renderHeader(bins)}
  ${body}
</div>`;
    this._attachCardListeners(bins);
  }

  _attachCardListeners(bins) {
    const c = this._config;
    const header = this.shadowRoot.getElementById('header');
    if (header && c.popup !== false) {
      header.addEventListener('click', () => this._openPopup(bins));
    }
    this.shadowRoot.querySelectorAll('.bin-card, .tl-bin').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const entity = el.dataset.entity;
        if (entity) {
          this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entity }, bubbles: true, composed: true }));
        }
      });
    });
  }

  _openPopup(bins) {
    this._closePopup();
    const c = this._config;
    const todayBins = bins.filter(b => b.days === 0);
    const upcoming = bins.filter(b => b.days != null && b.days > 0);
    const upGroups = groupByDate(upcoming);

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
<style>${this._styles()}</style>
<div class="popup-sheet" role="dialog" aria-modal="true">
  <div class="popup-handle"></div>
  <div class="popup-header">
    <div class="popup-title">${c.title || 'Bin Collection'}</div>
    <button class="popup-close" aria-label="Close">✕</button>
  </div>
  ${todayBins.length ? `
  <div class="popup-section">
    <div class="popup-section-label">Today</div>
    <div class="popup-today">${todayBins.map(b => {
      const cl = colorFor(b.color);
      return `<div class="popup-bin-card" style="background:${cl.bg}">
        ${this._tlBinImage(b, 'popup-bin-img', 'popup-bin-icon')}
        <div class="popup-bin-info">
          <div class="popup-bin-name">${b.name}</div>
          <div class="popup-bin-date">${b.nextDate || 'Today'}</div>
          ${b.notes ? `<div class="popup-bin-notes">${b.notes}</div>` : ''}
        </div>
      </div>`;
    }).join('')}</div>
  </div>
  <div class="popup-divider"></div>` : ''}
  ${upGroups.length ? `
  <div class="popup-section">
    <div class="popup-section-label">Upcoming</div>
    ${upGroups.map(([days, group]) => {
      const d = parseInt(days);
      const label = d === 1 ? 'Tomorrow' : formatDate(d);
      return `<div class="popup-timeline-row">
        <div class="popup-tl-date">${label}</div>
        <div class="popup-tl-bins">${group.map(b => {
          const cl = colorFor(b.color);
          const imgHtml = b.image
            ? `<img src="${b.image}" style="width:14px;height:20px;object-fit:contain" alt="">`
            : `<ha-icon icon="${b.icon||'mdi:delete'}" style="--mdc-icon-size:14px"></ha-icon>`;
          return `<div class="popup-tl-chip" style="background:${cl.bg}">${imgHtml}${b.name}</div>`;
        }).join('')}</div>
      </div>`;
    }).join('')}
  </div>` : (!todayBins.length ? `<div class="empty-state">No collections due soon</div>` : '')}
</div>`;

    document.body.appendChild(overlay);
    this._popup = overlay;

    // close handlers
    overlay.querySelector('.popup-close').addEventListener('click', () => this._closePopup());
    overlay.addEventListener('click', e => { if (e.target === overlay) this._closePopup(); });
    const esc = e => { if (e.key === 'Escape') { this._closePopup(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);
    overlay.querySelector('.popup-sheet').focus?.();
  }

  _closePopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = null;
    }
  }

  disconnectedCallback() { this._closePopup(); }
}

customElements.define('bin-collection-card', BinCollectionCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'bin-collection-card',
  name: 'Bin Collection Card',
  description: 'UK bin/waste collection schedule with image grid, timeline, and popup',
  preview: true,
  documentationURL: 'https://github.com/andrejkurlovic/lovelace-bin-collection-card',
});
