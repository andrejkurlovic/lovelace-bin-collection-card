/**
 * lovelace-bin-collection-card v4.0.1
 * Home Assistant custom card for UK bin / waste collection schedules
 * https://github.com/andrejkurlovic/lovelace-bin-collection-card
 *
 * Situational-awareness card: "what do I need to do today, and what's next."
 *
 * Render model: each mode builds DOM once and tags it with a structural
 * signature (data-struct). On the next hass update, if the signature is
 * unchanged (same bins in the same groups), only text/class are patched —
 * images and backdrop-filter tiles are never recreated. A full rebuild only
 * happens when the structure itself changes (a bin crosses into/out of a
 * group, or config changes).
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

// ─────────────────────────────────────────────────────────────────────────────
// Text / date helpers
// ─────────────────────────────────────────────────────────────────────────────
function daysLabel(d, cfg = {}) {
  if (d == null || isNaN(d)) return '—';
  if (d === 0) return cfg.today_text || 'Today';
  if (d === 1) return cfg.tomorrow_text || 'Tomorrow';
  if (d < 0) return 'Missed collection';
  return `in ${d} days`;
}

// Shorter phrase used inside chips/tiles when combined with a date ("7 days • Tue 30 Jun")
function daysPhrase(d, cfg = {}) {
  if (d == null || isNaN(d)) return '—';
  if (d === 0) return cfg.today_text || 'Today';
  if (d === 1) return cfg.tomorrow_text || 'Tomorrow';
  if (d < 0) return 'Missed';
  return `${d} days`;
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

// Parse an integration-supplied "YYYY-MM-DD" without UTC offset surprises
function parseISODate(str) {
  if (!str) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

function friendlyDate(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// secondary_info: 'days' | 'date' | 'both' — actually rendered everywhere now
function dateText(b, mode, cfg) {
  const phrase = daysPhrase(b.days, cfg);
  const parsed = parseISODate(b.nextDate);
  const dateStr = parsed ? friendlyDate(parsed) : (b.days != null ? formatDate(b.days) : '');
  if (mode === 'date') return dateStr || phrase;
  if (mode === 'both') return dateStr ? `${phrase} • ${dateStr}` : phrase;
  return phrase;
}

function listNames(bins) {
  if (!bins.length) return '';
  if (bins.length === 1) return bins[0].name;
  if (bins.length === 2) return `${bins[0].name} & ${bins[1].name}`;
  const last = bins[bins.length - 1].name;
  const rest = bins.slice(0, -1).map(b => b.name).join(', ');
  return `${rest} & ${last}`;
}

function firstActionText(bins) {
  const found = bins.find(b => b.action_text);
  return found ? found.action_text : null;
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

function densityFutureCap(density) {
  if (density === 'calm') return 0;
  if (density === 'rich') return 2;
  return 1; // balanced
}

// Optional badges — only shown if the integration actually exposes the attribute.
// Never inferred/invented.
function badgeInfo(b) {
  const badges = [];
  if (b.delayed) badges.push({ text: 'Delayed', cls: 'badge-delayed' });
  if (b.changed) badges.push({ text: 'Changed', cls: 'badge-changed' });
  return badges;
}
function badgesHtml(b) {
  return badgeInfo(b).map(bd => `<span class="badge ${bd.cls}">${bd.text}</span>`).join('');
}

// State hash for anti-flicker diffing — skips set hass() entirely when nothing
// we read has changed (state, next_collection, or the optional attributes below).
function stateHash(hass, bins) {
  if (!hass) return '';
  return (bins || []).map(b => {
    const s = b.entity ? hass.states[b.entity] : null;
    if (!s) return 'x';
    const a = s.attributes || {};
    return [s.state, a.next_collection || '', a.delayed ? '1' : '0', a.changed ? '1' : '0',
      a.collection_type || '', a.message || '', a.delay_note || ''].join('|');
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
// Visual Editor — uses HA's native ha-entity-picker / ha-icon-picker / ha-selector
// when the running frontend provides them; falls back to plain inputs otherwise.
// ─────────────────────────────────────────────────────────────────────────────
class BinCollectionCardEditor extends HTMLElement {
  set hass(h) {
    this._hass = h;
    this.querySelectorAll('ha-entity-picker, ha-icon-picker, ha-selector').forEach(el => { el.hass = h; });
  }

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
      show_future_bins: true,
      fade_future_bins: false,
      highlight_today: 'subtle',
      secondary_info: 'days',
      display_density: 'balanced',
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
    const DENSITY = ['calm', 'balanced', 'rich'];

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
  .hint { font-size: 10px; color: var(--secondary-text-color, rgba(255,255,255,0.45)); margin: -3px 0 9px; padding-left: 160px; }
  .bins-head { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 8px; }
  .bins-head span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); }
  .add-btn { background: var(--primary-color); color: white; border: none; border-radius: 6px;
             padding: 5px 12px; font-size: 12px; cursor: pointer; }
  .bin-item { background: var(--input-fill-color, rgba(255,255,255,0.03));
              border: 1px solid var(--divider-color, rgba(255,255,255,0.07));
              border-radius: 10px; padding: 12px; margin-bottom: 8px; }
  .bin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 4px; }
  .bin-field label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-field input[type=text] {
    width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box; }
  .bin-foot { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
  .del-btn { background: rgba(239,83,80,0.15); color: #ef5350;
             border: 1px solid rgba(239,83,80,0.25); border-radius: 5px;
             padding: 4px 12px; font-size: 11px; cursor: pointer; }
  .move-btn { background: var(--input-fill-color, rgba(255,255,255,0.05));
              border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
              color: var(--primary-text-color); width: 26px; height: 24px; font-size: 11px; cursor: pointer; }
  .move-btn:disabled { opacity: 0.3; cursor: default; }
  .bin-name-row { margin-bottom: 6px; }
  .bin-name-row label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-name-row input { width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box; }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
  .swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent;
            cursor: pointer; padding: 0; }
  .swatch.selected { border-color: var(--primary-text-color, #fff); box-shadow: 0 0 0 1px rgba(255,255,255,0.3); }
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
  <div class="row"><label>Density</label>
    <select data-key="display_density">
      ${DENSITY.map(v => `<option value="${v}"${(c.display_density || 'balanced') === v ? ' selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div class="hint">calm = fewer extras; rich = more upcoming bins shown faded in the Next Collection state</div>

  <div class="sect">Filtering &amp; Sorting</div>
  <div class="row"><label>Days ahead</label>
    <input type="number" data-key="days_ahead" value="${c.days_ahead != null ? c.days_ahead : 14}" min="1" max="60"></div>
  <div class="row"><label>Sort by soonest</label>
    <input type="checkbox" data-key="sort" ${c.sort !== false ? 'checked' : ''}></div>
  <div class="row"><label>Show all bins</label>
    <input type="checkbox" data-key="show_all_bins" ${c.show_all_bins ? 'checked' : ''}></div>
  <div class="row"><label>Show future bins</label>
    <input type="checkbox" data-key="show_future_bins" ${c.show_future_bins !== false ? 'checked' : ''}></div>
  <div class="hint">turns off the "Next: …" line and faded upcoming bins in smart-summary, timeline beyond tomorrow</div>
  <div class="row"><label>Fade future bins</label>
    <input type="checkbox" data-key="fade_future_bins" ${c.fade_future_bins ? 'checked' : ''}></div>

  <div class="sect">Visual</div>
  <div class="row"><label>Highlight today</label>
    <select data-key="highlight_today">
      ${HIGHLIGHTS.map(v => `<option value="${v}"${(c.highlight_today || 'subtle') === v ? ' selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div class="hint">off = none, subtle = small dot, strong = coloured TODAY/TOMORROW pill</div>
  <div class="row"><label>Secondary info</label>
    <select data-key="secondary_info">
      ${SECONDARY.map(v => `<option value="${v}"${(c.secondary_info || 'days') === v ? ' selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div class="hint">days = "in 7 days", date = "Tue 30 Jun", both = "7 days • Tue 30 Jun"</div>
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
    this._mountPickers();
  }

  _binsHtml(bins) {
    return bins.map((b, i) => `
<div class="bin-item" data-index="${i}">
  <div class="bin-name-row">
    <label>Name</label>
    <input type="text" data-index="${i}" data-field="name" value="${b.name || ''}">
  </div>
  <div class="bin-name-row">
    <label>Entity (sensor)</label>
    <div data-slot="entity" data-index="${i}"></div>
  </div>
  <div class="bin-grid">
    <div class="bin-field">
      <label>Image</label>
      <div data-slot="image" data-index="${i}"></div>
    </div>
    <div class="bin-field">
      <label>Fallback icon</label>
      <div data-slot="icon" data-index="${i}"></div>
    </div>
  </div>
  <div class="bin-field" style="margin-top:6px">
    <label>Colour</label>
    <div class="swatch-row" data-index="${i}">
      ${Object.keys(COLOR_MAP).filter(k => k !== 'default').map(k =>
        `<button type="button" class="swatch ${(b.color || '').toLowerCase() === k ? 'selected' : ''}"
          data-swatch="${k}" data-index="${i}" style="background:${COLOR_MAP[k].accent}" title="${k}"></button>`
      ).join('')}
    </div>
  </div>
  <div class="bin-name-row" style="margin-top:8px">
    <label>Action hint (e.g. "Put out after 7pm")</label>
    <input type="text" data-index="${i}" data-field="action_text" value="${b.action_text || ''}">
  </div>
  <div class="bin-name-row" style="margin-top:4px">
    <label>Notes / instructions</label>
    <input type="text" data-index="${i}" data-field="notes" value="${b.notes || ''}" placeholder="e.g. Kerb by 7am">
  </div>
  <div class="bin-foot">
    <button class="move-btn" data-move="up" data-index="${i}" ${i === 0 ? 'disabled' : ''}>▲</button>
    <button class="move-btn" data-move="down" data-index="${i}" ${i === bins.length - 1 ? 'disabled' : ''}>▼</button>
    <button class="del-btn" data-delete="${i}">Remove</button>
  </div>
</div>`).join('');
  }

  // Mount native HA pickers into the placeholder slots left by _binsHtml.
  // Falls back to a plain text input if the running frontend doesn't expose the picker.
  _mountPickers() {
    const bins = this._config.bins || [];
    const hasEntityPicker = !!customElements.get('ha-entity-picker');
    const hasIconPicker = !!customElements.get('ha-icon-picker');
    const hasSelector = !!customElements.get('ha-selector');

    this.querySelectorAll('[data-slot="entity"]').forEach(slot => {
      const idx = parseInt(slot.dataset.index, 10);
      const value = (bins[idx] || {}).entity || '';
      let el;
      if (hasEntityPicker) {
        el = document.createElement('ha-entity-picker');
        el.hass = this._hass;
        el.value = value;
        el.includeDomains = ['sensor'];
        el.addEventListener('value-changed', e => { e.stopPropagation(); this._updateBin(idx, 'entity', e.detail.value || ''); });
      } else {
        el = document.createElement('input');
        el.type = 'text';
        el.value = value;
        el.placeholder = 'sensor.my_bin_days';
        el.addEventListener('change', () => this._updateBin(idx, 'entity', el.value));
      }
      slot.innerHTML = '';
      slot.appendChild(el);
    });

    this.querySelectorAll('[data-slot="icon"]').forEach(slot => {
      const idx = parseInt(slot.dataset.index, 10);
      const value = (bins[idx] || {}).icon || 'mdi:delete';
      let el;
      if (hasIconPicker) {
        el = document.createElement('ha-icon-picker');
        el.hass = this._hass;
        el.value = value;
        el.addEventListener('value-changed', e => { e.stopPropagation(); this._updateBin(idx, 'icon', e.detail.value || 'mdi:delete'); });
      } else {
        el = document.createElement('input');
        el.type = 'text';
        el.value = value;
        el.addEventListener('change', () => this._updateBin(idx, 'icon', el.value));
      }
      slot.innerHTML = '';
      slot.appendChild(el);
    });

    this.querySelectorAll('[data-slot="image"]').forEach(slot => {
      const idx = parseInt(slot.dataset.index, 10);
      const value = (bins[idx] || {}).image || '';
      let el;
      if (hasSelector) {
        el = document.createElement('ha-selector');
        el.hass = this._hass;
        el.selector = { image: {} };
        el.value = value;
        el.addEventListener('value-changed', e => { e.stopPropagation(); this._updateBin(idx, 'image', e.detail.value || ''); });
      } else {
        el = document.createElement('input');
        el.type = 'text';
        el.value = value;
        el.placeholder = '/local/images/bin.png';
        el.addEventListener('change', () => this._updateBin(idx, 'image', el.value));
      }
      slot.innerHTML = '';
      slot.appendChild(el);
    });
  }

  _updateBin(idx, field, value) {
    const bins = [...(this._config.bins || [])];
    bins[idx] = { ...bins[idx], [field]: value };
    this._config = { ...this._config, bins };
    this._fire();
  }

  _refreshBinsList() {
    const bins = this._config.bins || [];
    this.querySelector('#bins-list').innerHTML = this._binsHtml(bins);
    this._listen();
    this._mountPickers();
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
        this._updateBin(parseInt(el.dataset.index, 10), el.dataset.field, el.value);
      });
    });

    this.querySelectorAll('[data-swatch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        this._updateBin(idx, 'color', btn.dataset.swatch);
        this._refreshBinsList();
      });
    });

    this.querySelectorAll('[data-move]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const dir = btn.dataset.move === 'up' ? -1 : 1;
        const bins = [...(this._config.bins || [])];
        const target = idx + dir;
        if (target < 0 || target >= bins.length) return;
        [bins[idx], bins[target]] = [bins[target], bins[idx]];
        this._config = { ...this._config, bins };
        this._fire();
        this._refreshBinsList();
      });
    });

    this.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.delete, 10);
        const bins = [...(this._config.bins || [])];
        bins.splice(idx, 1);
        this._config = { ...this._config, bins };
        this._fire();
        this._refreshBinsList();
      });
    });

    const addBtn = this.querySelector('#add-bin');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const bins = [...(this._config.bins || [])];
        bins.push({ name: 'New Bin', entity: '', color: 'grey', icon: 'mdi:delete' });
        this._config = { ...this._config, bins };
        this._fire();
        this._refreshBinsList();
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
      show_future_bins: true,
      display_density: 'balanced',
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
    this._lastMode = null;
    this._resolved = [];
  }

  // ── Anti-flicker: only re-render when our sensor states actually changed ──
  set hass(h) {
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
    this._stateHash = null;  // force re-render on next hass set
    this._lastMode = null;   // force a full structural rebuild (config may have changed shape)
    this._render();
  }

  getCardSize() {
    const mode = this._config?.mode || 'smart-summary';
    if (mode === 'compact') return 1;
    if (mode === 'smart-summary') return 4;
    return 3;
  }

  // ── Resolve bins from hass state — full set, sorted, unfiltered by days_ahead ──
  _resolveBins() {
    const h = this._hass;
    const c = this._config;
    let bins = (c.bins || []).map(b => {
      const s = h && b.entity ? h.states[b.entity] : null;
      const days = s ? parseInt(s.state, 10) : null;
      const isValid = days != null && !isNaN(days);
      const a = s?.attributes || {};
      return {
        ...b,
        days: isValid ? days : null,
        nextDate: a.next_collection || null,
        missing: !s,
        delayed: a.delayed === true,
        changed: a.changed === true,
        collectionType: a.collection_type || null,
        message: a.message || null,
        delayNote: a.delay_note || null,
      };
    });

    if (c.sort !== false) {
      bins = bins.sort((a, b) => {
        if (a.days == null) return 1;
        if (b.days == null) return -1;
        return a.days - b.days;
      });
    }
    return bins;
  }

  // Filtering applied for image-grid/timeline/compact (smart-summary works off the
  // full resolved list so its Quiet/Unknown fallback can see beyond days_ahead).
  _filterForDisplay(resolved) {
    const c = this._config;
    const daysAhead = c.days_ahead != null ? c.days_ahead : 14;
    if (c.show_all_bins) return resolved;
    return resolved.filter(b => b.days == null || b.days <= daysAhead);
  }

  _fadeThreshold() {
    const c = this._config;
    const daysAhead = c.days_ahead != null ? c.days_ahead : 14;
    return daysAhead / 2;
  }

  _isFaded(b) {
    return !!this._config.fade_future_bins && b.days != null && b.days > this._fadeThreshold();
  }

  _render() {
    if (!this._config) return;
    const resolved = this._resolveBins();
    this._resolved = resolved;
    const mode = this._config.mode || 'smart-summary';

    if (this._lastMode === mode && this.shadowRoot.querySelector('.card') && this._patch(mode, resolved)) {
      return;
    }
    this._lastMode = mode;
    this._fullRender(mode, resolved);
  }

  _fullRender(mode, resolved) {
    const { html, struct } = this._buildBody(mode, resolved);
    this.shadowRoot.innerHTML = `<style>${this._css()}</style><div class="card" data-struct="${struct}">${html}</div>`;
    this._attachListeners();
  }

  _buildBody(mode, resolved) {
    if (mode === 'timeline') return this._renderTimeline(this._filterForDisplay(resolved));
    if (mode === 'compact') return this._renderCompact(this._filterForDisplay(resolved));
    if (mode === 'image-grid') return this._renderImageGrid(this._filterForDisplay(resolved));
    return this._renderSmartSummary(resolved);
  }

  _patch(mode, resolved) {
    if (mode === 'timeline') return this._patchTimeline(this._filterForDisplay(resolved));
    if (mode === 'compact') return this._patchCompact(this._filterForDisplay(resolved));
    if (mode === 'image-grid') return this._patchImageGrid(this._filterForDisplay(resolved));
    return this._patchSmartSummary(resolved);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SMART SUMMARY MODE — today / missed / tomorrow / upcoming / quiet / unknown
  // ══════════════════════════════════════════════════════════════════════════
  _smartSummaryState(resolved) {
    const c = this._config;
    const todayBins = resolved.filter(b => b.days === 0);
    const missedBins = resolved.filter(b => b.days != null && b.days < 0);
    const tomorrowBins = resolved.filter(b => b.days === 1);
    const restSorted = resolved.filter(b => b.days != null && b.days > 1); // already sorted
    const nextOverall = restSorted[0] || null;
    const furtherBins = restSorted.slice(1);

    let state, headerTitle, headerSub, actionHint, mainBins;

    if (todayBins.length) {
      state = 'today';
      headerTitle = 'Collection Day';
      headerSub = `${listNames(todayBins)} ${todayBins.length > 1 ? 'are' : 'is'} being collected today`;
      actionHint = firstActionText(todayBins);
      mainBins = todayBins;
    } else if (missedBins.length) {
      state = 'missed';
      headerTitle = 'Missed Collection';
      headerSub = `${listNames(missedBins)} ${missedBins.length > 1 ? 'were' : 'was'} not collected — check with your council`;
      actionHint = firstActionText(missedBins);
      mainBins = missedBins;
    } else if (tomorrowBins.length) {
      state = 'tomorrow';
      headerTitle = 'Prepare Tonight';
      headerSub = `${listNames(tomorrowBins)} ${tomorrowBins.length > 1 ? 'are' : 'is'} collected tomorrow`;
      actionHint = firstActionText(tomorrowBins) || 'Put out tonight';
      mainBins = tomorrowBins;
    } else if (nextOverall && nextOverall.days < 7) {
      state = 'upcoming';
      headerTitle = 'Next Collection';
      headerSub = `${nextOverall.name} ${daysLabel(nextOverall.days, c)}`;
      actionHint = nextOverall.action_text || null;
      mainBins = [nextOverall];
    } else if (nextOverall) {
      state = 'quiet';
      headerTitle = 'No Collections This Week';
      headerSub = `Next known: ${nextOverall.name} ${daysLabel(nextOverall.days, c)}`;
      actionHint = null;
      mainBins = [nextOverall];
    } else {
      state = 'unknown';
      headerTitle = 'No Data';
      headerSub = 'Check your bin sensors';
      actionHint = null;
      mainBins = [];
    }

    let nextLine = null;
    if ((state === 'today' || state === 'missed' || state === 'tomorrow') && nextOverall && c.show_future_bins !== false) {
      nextLine = `Next: ${nextOverall.name} ${daysLabel(nextOverall.days, c)}`;
    }

    let extraBins = [];
    if (state === 'upcoming' && c.show_future_bins !== false) {
      extraBins = furtherBins.slice(0, densityFutureCap(c.display_density));
    }

    return { state, headerTitle, headerSub, actionHint, mainBins, nextLine, extraBins };
  }

  _ssSignature(s) {
    return `${s.state}|${s.mainBins.map(b => b.entity).join(',')}|${s.extraBins.map(b => b.entity).join(',')}`;
  }

  _renderSmartSummary(resolved) {
    const c = this._config;
    const s = this._smartSummaryState(resolved);

    const accent = s.mainBins.length ? colorFor(s.mainBins[0].color).accent : 'var(--primary-color)';
    const glow = s.mainBins.length ? colorFor(s.mainBins[0].color).glow : 'transparent';

    const mainHtml = s.mainBins.length ? `
      <div class="ss-main" style="background:linear-gradient(160deg,${glow} 0%,transparent 60%)">
        <div class="ss-bin-row">
          ${s.mainBins.map(b => this._ssBinHtml(b)).join('')}
        </div>
        ${s.actionHint ? `<div class="ss-action-hint" data-role="action-hint">${s.actionHint}</div>` : ''}
      </div>` : `
      <div class="ss-empty">
        <div class="ss-empty-icon"><ha-icon icon="mdi:check-circle-outline"></ha-icon></div>
        <div class="ss-empty-text" data-role="empty-text">${s.headerSub}</div>
      </div>`;

    const nextLineHtml = s.nextLine ? `<div class="ss-next-line" data-role="next-line">${s.nextLine}</div>` : '';

    const extraHtml = s.extraBins.length ? `
      <div class="ss-strip">
        ${s.extraBins.map(b => this._ssChipHtml(b)).join('')}
      </div>` : '';

    const headerBlock = c.show_header !== false ? `
      <div class="ss-header" id="header">
        <div class="ss-header-text">
          <div class="ss-title" data-role="title">${s.headerTitle}</div>
          <div class="ss-subtitle" data-role="subtitle">${s.mainBins.length ? s.headerSub : ''}</div>
        </div>
        ${c.popup !== false ? `<div class="tap-hint">▸</div>` : ''}
      </div>` : '';

    return { html: `${headerBlock}${mainHtml}${nextLineHtml}${extraHtml}`, struct: this._ssSignature(s) };
  }

  _ssBinHtml(b) {
    const cl = colorFor(b.color);
    return `<div class="ss-bin" data-entity="${b.entity}" data-key="${b.entity}">
      <div class="ss-bin-inner" style="background:${cl.bg}">
        ${imgHtml(b, 48, 66, 'ss-img')}
        ${this._highlightBadgeHtml(b)}
      </div>
      <div class="ss-bin-name">${b.name}</div>
      <div class="ss-bin-badges" data-role="badges">${badgesHtml(b)}</div>
    </div>`;
  }

  _ssChipHtml(b) {
    const c = this._config;
    const faded = this._isFaded(b);
    const label = dateText(b, c.secondary_info || 'days', c);
    return `<div class="ss-chip ${faded ? 'faded' : ''}" data-entity="${b.entity}" data-key="${b.entity}">
      ${imgHtml(b, 18, 24, 'chip-img')}
      <span class="chip-name">${b.name}</span>
      <span class="chip-label" data-role="label">${label}</span>
    </div>`;
  }

  // highlight_today: off | subtle (small dot) | strong (coloured pill with text)
  _highlightBadgeHtml(b) {
    const c = this._config;
    const hl = c.highlight_today || 'subtle';
    if (hl === 'off') return '';
    if (b.days !== 0 && b.days !== 1) return '';
    const label = b.days === 0 ? (c.today_text || 'Today') : (c.tomorrow_text || 'Tomorrow');
    const variant = b.days === 0 ? 'today' : 'tomorrow';
    if (hl === 'strong') return `<div class="hl-pill hl-pill-${variant}">${label}</div>`;
    return `<div class="hl-dot hl-dot-${variant}"></div>`;
  }

  _patchSmartSummary(resolved) {
    const sr = this.shadowRoot;
    const root = sr.querySelector('.card');
    if (!root) return false;
    const s = this._smartSummaryState(resolved);
    if (root.dataset.struct !== this._ssSignature(s)) return false;

    const titleEl = sr.querySelector('[data-role="title"]');
    if (titleEl) titleEl.textContent = s.headerTitle;
    const subEl = sr.querySelector('[data-role="subtitle"]');
    if (subEl) subEl.textContent = s.mainBins.length ? s.headerSub : '';
    const emptyTextEl = sr.querySelector('[data-role="empty-text"]');
    if (emptyTextEl) emptyTextEl.textContent = s.headerSub;
    const nextLineEl = sr.querySelector('[data-role="next-line"]');
    if (nextLineEl) nextLineEl.textContent = s.nextLine || '';

    s.mainBins.forEach(b => {
      const badgesEl = sr.querySelector(`.ss-bin[data-key="${b.entity}"] [data-role="badges"]`);
      if (badgesEl) badgesEl.innerHTML = badgesHtml(b);
    });

    s.extraBins.forEach(b => {
      const chip = sr.querySelector(`.ss-chip[data-key="${b.entity}"]`);
      if (!chip) return;
      chip.classList.toggle('faded', this._isFaded(b));
      const lbl = chip.querySelector('[data-role="label"]');
      if (lbl) lbl.textContent = dateText(b, this._config.secondary_info || 'days', this._config);
    });

    return true;
  }

  // ── shared header for image-grid / timeline ──────────────────────────────
  _headerHtml(bins) {
    const c = this._config;
    if (c.show_header === false) return '';
    const next = bins.find(b => b.days != null);
    let nextLine = '';
    if (c.show_next_summary !== false && next) {
      const label = dateText(next, c.secondary_info || 'days', c);
      const cls = next.days === 0 ? 'hl-today' : next.days === 1 ? 'hl-tomorrow' : '';
      nextLine = `<div class="header-sub" data-role="next-summary">Next: ${next.name} — <span class="${cls}">${label}</span></div>`;
    }
    return `<div class="header" id="header">
      <div class="header-left">
        <div class="header-title">${c.title || 'Bin Collection'}</div>
        ${nextLine}
      </div>
      ${c.popup !== false ? '<div class="tap-hint">▸</div>' : ''}
    </div>`;
  }

  _patchHeader(bins) {
    const c = this._config;
    if (c.show_header === false) return;
    const next = bins.find(b => b.days != null);
    const el = this.shadowRoot.querySelector('[data-role="next-summary"]');
    if (!el || !next) return;
    const label = dateText(next, c.secondary_info || 'days', c);
    const cls = next.days === 0 ? 'hl-today' : next.days === 1 ? 'hl-tomorrow' : '';
    el.innerHTML = `Next: ${next.name} — <span class="${cls}">${label}</span>`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // IMAGE GRID MODE
  // ══════════════════════════════════════════════════════════════════════════
  _renderImageGrid(bins) {
    const c = this._config;
    const header = this._headerHtml(bins);
    if (!bins.length) {
      return { html: `${header}<div class="empty-state">No collections due within ${c.days_ahead || 14} days</div>`, struct: 'empty' };
    }
    const cards = bins.map(b => this._gridTileHtml(b)).join('');
    const struct = bins.map(b => b.entity).join(',');
    return { html: `${header}<div class="grid">${cards}</div>`, struct };
  }

  _gridTileHtml(b) {
    const c = this._config;
    const hl = c.highlight_today || 'subtle';
    const cl = colorFor(b.color);
    const urg = b.days === 0 ? 'today' : b.days === 1 ? 'tomorrow' : (b.days != null && b.days > 1 && b.days <= 3) ? 'soon' : '';
    const faded = this._isFaded(b);
    const label = b.missing ? '—' : dateText(b, c.secondary_info || 'days', c);
    const dotOn = (urg === 'today' || urg === 'tomorrow') && hl !== 'off';

    return `<div class="bin-tile ${faded ? 'faded' : ''}" style="background:${cl.bg}" data-entity="${b.entity}" data-key="${b.entity}">
      <div class="urg-dot ${urg === 'today' ? 'today-dot' : urg === 'tomorrow' ? 'tomorrow-dot' : ''}" data-role="urg-dot" style="${dotOn ? '' : 'display:none;'}"></div>
      <div class="tile-img-wrap">${imgHtml(b, 38, 52, 'tile-img')}</div>
      <div class="tile-name">${b.name}</div>
      <div class="tile-label ${urg}" data-role="label">${label}</div>
      ${b.missing ? '<div class="tile-warn">no entity</div>' : ''}
      <div class="tile-badges" data-role="badges">${badgesHtml(b)}</div>
      <div class="tile-accent" style="background:${cl.accent}"></div>
    </div>`;
  }

  _patchImageGrid(bins) {
    const sr = this.shadowRoot;
    const root = sr.querySelector('.card');
    const struct = bins.length ? bins.map(b => b.entity).join(',') : 'empty';
    if (!root || root.dataset.struct !== struct || !bins.length) return false;

    this._patchHeader(bins);
    const c = this._config;
    const hl = c.highlight_today || 'subtle';
    bins.forEach(b => {
      const tile = sr.querySelector(`.bin-tile[data-key="${b.entity}"]`);
      if (!tile) return;
      const urg = b.days === 0 ? 'today' : b.days === 1 ? 'tomorrow' : (b.days != null && b.days > 1 && b.days <= 3) ? 'soon' : '';
      tile.classList.toggle('faded', this._isFaded(b));

      const lbl = tile.querySelector('[data-role="label"]');
      if (lbl) {
        lbl.textContent = b.missing ? '—' : dateText(b, c.secondary_info || 'days', c);
        lbl.className = `tile-label ${urg}`;
      }
      const dot = tile.querySelector('[data-role="urg-dot"]');
      if (dot) {
        dot.className = `urg-dot ${urg === 'today' ? 'today-dot' : urg === 'tomorrow' ? 'tomorrow-dot' : ''}`;
        dot.style.display = (urg === 'today' || urg === 'tomorrow') && hl !== 'off' ? '' : 'none';
      }
      const badgesEl = tile.querySelector('[data-role="badges"]');
      if (badgesEl) badgesEl.innerHTML = badgesHtml(b);
    });
    return true;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TIMELINE MODE
  // ══════════════════════════════════════════════════════════════════════════
  _timelineGroups(bins) {
    let groups = groupByDate(bins);
    if (this._config.show_future_bins === false) {
      groups = groups.filter(([days]) => Number(days) <= 1);
    }
    return groups;
  }

  _renderTimeline(bins) {
    const header = this._headerHtml(bins);
    const groups = this._timelineGroups(bins);
    if (!groups.length) {
      return { html: `${header}<div class="empty-state">No collections due soon</div>`, struct: 'empty' };
    }
    const threshold = this._fadeThreshold();
    const fade = this._config.fade_future_bins;
    const rows = groups.map(([days, group]) => {
      const d = parseInt(days, 10);
      const dayLabel = formatDay(d);
      const isToday = d === 0;
      const isTmrw = d === 1;
      const faded = fade && d > threshold;
      return `<div class="tl-row ${faded ? 'faded' : ''}">
        <div class="tl-date ${isToday ? 'tl-today' : isTmrw ? 'tl-tomorrow' : ''}">
          ${dayLabel}
        </div>
        <div class="tl-bins">
          ${group.map(b => this._tlChipHtml(b)).join('')}
        </div>
      </div>`;
    });
    const struct = groups.map(([days, group]) => `${days}:${group.map(b => b.entity).join(',')}`).join('|');
    return { html: `${header}<div class="timeline">${rows.join('')}</div>`, struct };
  }

  _tlChipHtml(b) {
    const cl = colorFor(b.color);
    return `<div class="tl-chip" style="background:${cl.bg}" data-entity="${b.entity}" data-key="${b.entity}">
      ${imgHtml(b, 20, 28, 'tl-img')}
      <span class="tl-chip-name">${b.name}</span>
      <span class="tl-badges" data-role="badges">${badgesHtml(b)}</span>
    </div>`;
  }

  _patchTimeline(bins) {
    const sr = this.shadowRoot;
    const root = sr.querySelector('.card');
    const groups = this._timelineGroups(bins);
    const struct = groups.length ? groups.map(([days, group]) => `${days}:${group.map(b => b.entity).join(',')}`).join('|') : 'empty';
    if (!root || root.dataset.struct !== struct || !groups.length) return false;

    this._patchHeader(bins);
    groups.forEach(([, group]) => {
      group.forEach(b => {
        const chip = sr.querySelector(`.tl-chip[data-key="${b.entity}"]`);
        if (!chip) return;
        const badgesEl = chip.querySelector('[data-role="badges"]');
        if (badgesEl) badgesEl.innerHTML = badgesHtml(b);
      });
    });
    return true;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // COMPACT MODE
  // ══════════════════════════════════════════════════════════════════════════
  _compactSummary(bins) {
    const c = this._config;
    const todayBins = bins.filter(b => b.days === 0);
    const next = bins.find(b => b.days != null);
    if (todayBins.length) return `${listNames(todayBins)} today`;
    if (next) return `${next.name} ${daysLabel(next.days, c)}`;
    return 'No collections due';
  }

  // "This week" (today included) stays bold; 7+ days (or unknown) out fades — keeps the
  // dot row scannable instead of every bin looking equally urgent regardless of timing.
  _isCompactFuture(b) {
    return b.days == null || b.days >= 7;
  }

  _renderCompact(bins) {
    const c = this._config;
    const summary = this._compactSummary(bins);
    const html = `<div class="compact" id="header">
      <div class="compact-dots">
        ${bins.map(b => `<div class="compact-dot ${b.days === 0 ? 'today' : ''} ${this._isCompactFuture(b) ? 'future' : ''}" data-key="${b.entity}"
          style="background:${colorFor(b.color).accent}" title="${b.name}: ${daysLabel(b.days, c)}"></div>`).join('')}
      </div>
      <div class="compact-text">
        <div class="compact-title">${c.title || 'Bin Collection'}</div>
        <div class="compact-summary" data-role="summary">${summary}</div>
      </div>
      ${bins.slice(0, 3).map(b => imgHtml(b, 22, 30, 'compact-img')).join('')}
    </div>`;
    const struct = bins.map(b => b.entity).join(',');
    return { html, struct };
  }

  _patchCompact(bins) {
    const sr = this.shadowRoot;
    const root = sr.querySelector('.card');
    const struct = bins.map(b => b.entity).join(',');
    if (!root || root.dataset.struct !== struct) return false;

    const c = this._config;
    const summaryEl = sr.querySelector('[data-role="summary"]');
    if (summaryEl) summaryEl.textContent = this._compactSummary(bins);
    bins.forEach(b => {
      const dot = sr.querySelector(`.compact-dot[data-key="${b.entity}"]`);
      if (dot) {
        dot.classList.toggle('today', b.days === 0);
        dot.classList.toggle('future', this._isCompactFuture(b));
        dot.title = `${b.name}: ${daysLabel(b.days, c)}`;
      }
    });
    return true;
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

/* ── BADGES (shared) ── */
.badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  padding: 2px 6px; border-radius: 5px; margin-right: 4px; display: inline-block; }
.badge-delayed { background: rgba(255,167,38,0.18); color: #ffa726; }
.badge-changed { background: rgba(79,195,247,0.18); color: #4fc3f7; }
.faded { opacity: 0.45; transition: opacity .2s; }

/* ── HEADER (image-grid / timeline / compact) ── */
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
.ss-title { font-size: 18px; font-weight: 700; letter-spacing: -.01em; line-height: 1.2; }
.ss-subtitle { font-size: 12px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); margin-top: 3px; line-height: 1.35; min-height: 15px; }
.ss-main { padding: 8px 16px 14px; }
.ss-bin-row { display: flex; gap: 10px; align-items: flex-end; }
.ss-bin { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ss-bin-inner {
  position: relative;
  border-radius: 14px;
  padding: 12px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.ss-bin-name { font-size: 12px; font-weight: 600; color: var(--primary-text-color, #fff); text-align: center; }
.ss-bin-badges { display: flex; gap: 3px; justify-content: center; min-height: 13px; }
.ss-action-hint { margin-top: 10px; font-size: 11px; color: rgba(255,255,255,0.45); letter-spacing: .02em; font-style: italic; }
.ss-empty { padding: 20px 18px 24px; display: flex; align-items: center; gap: 12px; }
.ss-empty-icon ha-icon { --mdc-icon-size: 28px; color: rgba(255,255,255,0.2); }
.ss-empty-text { font-size: 13px; color: var(--secondary-text-color, rgba(255,255,255,0.4)); }
.ss-next-line { padding: 0 18px 12px; font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.45)); }
.ss-strip { display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 16px 12px; border-top: 1px solid rgba(255,255,255,0.05); }
.ss-chip { display: flex; align-items: center; gap: 5px; padding: 4px 8px 4px 5px; border-radius: 8px;
  background: rgba(255,255,255,0.05); cursor: pointer; -webkit-tap-highlight-color: transparent; }
.chip-name { font-size: 11px; font-weight: 600; color: var(--primary-text-color, #fff); }
.chip-label { font-size: 10px; color: var(--secondary-text-color, rgba(255,255,255,0.5)); margin-left: 2px; }

/* highlight_today badges */
.hl-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; }
.hl-dot-today { background: #ff8a65; }
.hl-dot-tomorrow { background: #ffa726; }
.hl-pill { position: absolute; top: 4px; right: 4px; font-size: 9px; font-weight: 800; text-transform: uppercase;
  letter-spacing: .04em; padding: 3px 7px; border-radius: 6px; color: #1c1c1e; }
.hl-pill-today { background: #ff8a65; }
.hl-pill-tomorrow { background: #ffa726; }

/* ── IMAGE GRID ── */
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 0 10px 12px; }
.bin-tile {
  border-radius: 13px; padding: 12px 8px 10px; display: flex; flex-direction: column; align-items: center; gap: 5px;
  cursor: pointer; position: relative; overflow: hidden;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 5px rgba(0,0,0,0.25);
  -webkit-tap-highlight-color: transparent;
}
.tile-img-wrap { position: relative; }
.tile-name { font-size: 12px; font-weight: 700; color: #fff; text-align: center; line-height: 1.2; }
.tile-label { font-size: 11px; color: rgba(255,255,255,0.65); text-align: center; }
.tile-label.today { color: #ff8a65; font-weight: 600; }
.tile-label.tomorrow { color: #ffa726; font-weight: 600; }
.tile-label.soon { color: #fff176; }
.tile-warn { font-size: 9px; color: #ef5350; }
.tile-badges { display: flex; gap: 3px; flex-wrap: wrap; justify-content: center; min-height: 13px; }
.tile-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; opacity: 0.6; }
.urg-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; }
.today-dot { background: #ff8a65; }
.tomorrow-dot { background: #ffa726; }

/* ── TIMELINE ── */
.timeline { padding: 0 14px 14px; }
.tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.tl-row:last-child { border-bottom: none; }
.tl-date { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.5));
  min-width: 110px; flex-shrink: 0; padding-top: 5px; }
.tl-today { color: #ff8a65; }
.tl-tomorrow { color: #ffa726; }
.tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
.tl-chip { display: flex; align-items: center; gap: 6px; border-radius: 9px; padding: 5px 10px 5px 6px;
  cursor: pointer; -webkit-tap-highlight-color: transparent; }
.tl-chip-name { font-size: 12px; font-weight: 600; color: #fff; }
.tl-badges { display: inline-flex; gap: 3px; margin-left: 2px; }

/* ── COMPACT ── */
.compact { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.compact-dots { display: flex; gap: 4px; flex-shrink: 0; }
.compact-dot { width: 9px; height: 9px; border-radius: 50%; opacity: 1; transition: transform .15s, opacity .2s, width .15s, height .15s; }
.compact-dot.future { opacity: 0.35; width: 7px; height: 7px; }
.compact-dot.today { transform: scale(1.4); box-shadow: 0 0 5px currentColor; }
.compact-text { flex: 1; min-width: 0; }
.compact-title { font-size: 13px; font-weight: 700; }
.compact-summary { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
.compact-img { flex-shrink: 0; }

/* ── EMPTY ── */
.empty-state { padding: 22px 16px; text-align: center; font-size: 13px; color: var(--secondary-text-color, rgba(255,255,255,0.35)); }

${this._popupCss()}
`;
  }

  // Shared between the card's own stylesheet (for completeness) and the popup's
  // isolated shadow root, since the popup is appended to document.body directly.
  _popupCss() {
    return `
.popup-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  z-index: 9998; display: flex; align-items: flex-end; justify-content: center; animation: fade-in .16s ease; }
@media (min-width: 600px) { .popup-bg { align-items: center; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.popup-sheet { background: var(--ha-card-background, #1c1c1e); border-radius: 22px 22px 0 0; width: 100%; max-width: 500px;
  max-height: 82vh; overflow-y: auto; overflow-x: hidden; box-shadow: 0 -6px 40px rgba(0,0,0,0.55);
  animation: slide-up .22s cubic-bezier(.3,.7,.3,1); color: var(--primary-text-color, #fff); font-family: var(--primary-font-family, sans-serif); }
@media (min-width: 600px) { .popup-sheet { border-radius: 20px; max-height: 72vh; } }
@keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.popup-drag { width: 36px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin: 10px auto 0; }
.popup-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 10px; }
.popup-title { font-size: 17px; font-weight: 700; }
.popup-close { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.07); border: none; cursor: pointer;
  color: var(--secondary-text-color, rgba(255,255,255,0.6)); font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0; }
.popup-section { padding: 0 20px 14px; }
.popup-label { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
  color: var(--secondary-text-color, rgba(255,255,255,0.45)); margin-bottom: 10px; }
.popup-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 20px 14px; }
.popup-today-row { display: flex; gap: 8px; flex-wrap: wrap; }
.popup-bin-card { flex: 1; min-width: 140px; border-radius: 14px; padding: 12px 14px 12px 10px; display: flex; align-items: center; gap: 10px;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 1px 6px rgba(0,0,0,0.25); }
.popup-bin-info { flex: 1; min-width: 0; }
.popup-bin-name { font-size: 13px; font-weight: 700; }
.popup-bin-date { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }
.popup-bin-message { font-size: 10px; color: #4fc3f7; margin-top: 3px; }
.popup-bin-notes { font-size: 10px; color: rgba(255,255,255,0.38); margin-top: 4px; font-style: italic; }
.popup-bin-action { font-size: 10px; color: #ffa726; margin-top: 3px; font-weight: 600; }
.popup-tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.popup-tl-row:last-child { border-bottom: none; }
.popup-tl-date { font-size: 11px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.5));
  min-width: 90px; flex-shrink: 0; padding-top: 5px; }
.popup-tl-col { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.popup-tl-chip { display: flex; align-items: flex-start; gap: 6px; border-radius: 9px; padding: 6px 10px 6px 6px; }
.popup-tl-chip-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.popup-tl-chip-name { font-size: 11px; font-weight: 600; color: #fff; }
.popup-tl-chip-notes { font-size: 9px; color: rgba(255,255,255,0.4); font-style: italic; }
.popup-empty { padding: 20px; text-align: center; color: rgba(255,255,255,0.35); font-size: 13px; }
`;
  }

  // ── Event listeners ────────────────────────────────────────────────────────
  _attachListeners() {
    const c = this._config;
    const sr = this.shadowRoot;

    const header = sr.getElementById('header');
    if (header && c.popup !== false) {
      header.addEventListener('click', () => this._openPopup(this._resolved));
    }

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

  // ── Popup — planner + detail view ───────────────────────────────────────────
  _openPopup(resolved) {
    this._closePopup();
    const c = this._config;
    const bins = resolved || [];

    const todayBins = bins.filter(b => b.days === 0);
    const missedBins = bins.filter(b => b.days != null && b.days < 0);
    const upcoming = bins.filter(b => b.days != null && b.days > 0);
    const upGroups = groupByDate(upcoming);
    const secMode = c.secondary_info && c.secondary_info !== 'days' ? c.secondary_info : 'both';

    const binCardHtml = (b, dueLabel) => {
      const cl = colorFor(b.color);
      return `<div class="popup-bin-card" style="background:${cl.bg}">
        ${imgHtml(b, 32, 44, 'popup-img')}
        <div class="popup-bin-info">
          <div class="popup-bin-name">${b.name} ${badgesHtml(b)}</div>
          <div class="popup-bin-date">${dueLabel}</div>
          ${b.message ? `<div class="popup-bin-message">${b.message}</div>` : ''}
          ${b.delayNote ? `<div class="popup-bin-message">⚠ ${b.delayNote}</div>` : ''}
          ${b.collectionType ? `<div class="popup-bin-message">${b.collectionType}</div>` : ''}
          ${b.notes ? `<div class="popup-bin-notes">${b.notes}</div>` : ''}
          ${b.action_text ? `<div class="popup-bin-action">↗ ${b.action_text}</div>` : ''}
        </div>
      </div>`;
    };

    const todaySection = (todayBins.length || missedBins.length) ? `
      <div class="popup-section">
        <div class="popup-label">Today</div>
        <div class="popup-today-row">
          ${todayBins.map(b => binCardHtml(b, dateText(b, secMode, c))).join('')}
          ${missedBins.map(b => binCardHtml(b, 'Missed collection')).join('')}
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
            <div class="popup-tl-col">
              ${group.map(b => `<div class="popup-tl-chip" style="background:${colorFor(b.color).bg}">
                ${imgHtml(b, 16, 22, 'popup-chip-img')}
                <div class="popup-tl-chip-info">
                  <span class="popup-tl-chip-name">${b.name} ${badgesHtml(b)}</span>
                  ${b.notes ? `<span class="popup-tl-chip-notes">${b.notes}</span>` : ''}
                  ${b.message ? `<span class="popup-tl-chip-notes">${b.message}</span>` : ''}
                </div>
              </div>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    ` : '';

    const noneMsg = !todayBins.length && !missedBins.length && !upGroups.length
      ? '<div class="popup-empty">No upcoming collections</div>'
      : '';

    const host = document.createElement('div');
    host.setAttribute('tabindex', '-1');
    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
<style>* { box-sizing: border-box; } ${this._popupCss()}</style>
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
