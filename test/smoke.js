// Headless DOM smoke test for the LitElement rewrite. Run via `npm test`
// (builds the bundle first, then loads the built ESM module under jsdom).
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.customElements = dom.window.customElements;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.Event = dom.window.Event;
globalThis.Node = dom.window.Node;
globalThis.ShadowRoot = dom.window.ShadowRoot;
globalThis.CSSStyleSheet = dom.window.CSSStyleSheet || class {};
globalThis.Document = dom.window.Document;

await import('../lovelace-bin-collection-card.js');

let pass = 0;
let fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log('  ok -', msg); }
  else { fail++; console.log('  FAIL -', msg); }
}

function makeHass(overrides = {}) {
  const states = {
    'sensor.general_bin_days': { state: '0', attributes: {} },
    'sensor.garden_bin_days': { state: '7', attributes: {} },
    'sensor.plastic_bin_days': { state: '3', attributes: {} },
    'sensor.paper_bin_days': { state: '14', attributes: {} },
  };
  Object.assign(states, overrides);
  return { states };
}

function defaultBins(extra = {}) {
  return [
    { name: 'General', entity: 'sensor.general_bin_days', color: 'grey' },
    { name: 'Garden', entity: 'sensor.garden_bin_days', color: 'green', ...(extra.garden || {}) },
    { name: 'Plastic', entity: 'sensor.plastic_bin_days', color: 'burgundy' },
    { name: 'Paper', entity: 'sensor.paper_bin_days', color: 'beige' },
  ];
}

async function makeCard(configOverrides = {}, bins) {
  const card = document.createElement('bin-collection-card');
  document.body.appendChild(card);
  card.setConfig(Object.assign({ title: 'Bin Collection', mode: 'smart-summary', bins: bins || defaultBins() }, configOverrides));
  await card.updateComplete;
  return card;
}

async function setHass(card, hass) {
  card.hass = hass;
  await card.updateComplete;
}

function withHistory(hass, series) {
  hass.callApi = async () => [series];
  return hass;
}

const html = (card) => card.shadowRoot.innerHTML;

console.log('## Smart summary states');
{
  const card = await makeCard();
  await setHass(card, makeHass()); // General=0 -> today
  assert(html(card).includes('Collection Day'), 'shows Collection Day header');
  assert(/is being collected today/.test(html(card)), 'subtitle sentence renders');
}
{
  const card = await makeCard();
  await setHass(card, makeHass({ 'sensor.general_bin_days': { state: '1', attributes: {} } }));
  assert(html(card).includes('Prepare Tonight'), 'shows Prepare Tonight header');
  assert(/collected tomorrow/.test(html(card)), 'tomorrow subtitle renders');
  assert(/Put out tonight/.test(html(card)), 'default action hint shown when bin has no custom action_text');
}
{
  const card = await makeCard();
  await setHass(card, makeHass({ 'sensor.general_bin_days': { state: '-2', attributes: {} } }));
  assert(html(card).includes('Missed Collection'), 'shows Missed Collection header');
  assert(/was not collected/.test(html(card)), 'missed subtitle renders');
}
{
  const card = await makeCard();
  await setHass(card, makeHass({
    'sensor.general_bin_days': { state: '3', attributes: {} },
    'sensor.garden_bin_days': { state: '3', attributes: {} },
    'sensor.plastic_bin_days': { state: '15', attributes: {} },
    'sensor.paper_bin_days': { state: '20', attributes: {} },
  }));
  assert(html(card).includes('Next Collection'), 'upcoming state shows Next Collection header');
  const mainBins = card.shadowRoot.querySelectorAll('.ss-bin-name');
  assert(mainBins.length === 2, `upcoming state shows both tied bins as main (got ${mainBins.length})`);
  assert(/General.*&.*Garden|Garden.*&.*General/.test(html(card)), 'subtitle names both tied bins');
}
{
  const card = await makeCard();
  await setHass(card, makeHass({
    'sensor.general_bin_days': { state: '12', attributes: {} },
    'sensor.garden_bin_days': { state: '12', attributes: {} },
    'sensor.plastic_bin_days': { state: '15', attributes: {} },
    'sensor.paper_bin_days': { state: '20', attributes: {} },
  }));
  assert(html(card).includes('No Collections This Week'), 'quiet state shows correct header');
  const mainBins = card.shadowRoot.querySelectorAll('.ss-bin-name');
  assert(mainBins.length === 2, `quiet state shows both tied bins as main (got ${mainBins.length})`);
}
{
  const card = await makeCard();
  await setHass(card, makeHass({
    'sensor.general_bin_days': { state: 'unknown', attributes: {} },
    'sensor.garden_bin_days': { state: 'unavailable', attributes: {} },
    'sensor.plastic_bin_days': { state: 'unknown', attributes: {} },
    'sensor.paper_bin_days': { state: 'unknown', attributes: {} },
  }));
  assert(html(card).includes('No Data'), 'unknown state (all non-numeric) shows No Data header');
}

console.log('## "Next: …" line names every tied bin (smart-summary + shared header + compact)');
{
  const card = await makeCard();
  await setHass(card, makeHass({
    'sensor.general_bin_days': { state: '0', attributes: {} },
    'sensor.garden_bin_days': { state: '8', attributes: {} },
    'sensor.plastic_bin_days': { state: '8', attributes: {} },
    'sensor.paper_bin_days': { state: '20', attributes: {} },
  }));
  const nextLine = card.shadowRoot.querySelector('.ss-next-line')?.textContent || '';
  assert(/Garden\s*&\s*Plastic|Plastic\s*&\s*Garden/.test(nextLine), `smart-summary "Next:" line names both tied bins (got: "${nextLine}")`);
}
{
  const card = await makeCard({ mode: 'image-grid' });
  await setHass(card, makeHass({
    'sensor.general_bin_days': { state: '8', attributes: {} },
    'sensor.garden_bin_days': { state: '8', attributes: {} },
    'sensor.plastic_bin_days': { state: '15', attributes: {} },
    'sensor.paper_bin_days': { state: '20', attributes: {} },
  }));
  const headerSub = card.shadowRoot.querySelector('.header-sub')?.textContent || '';
  assert(/General\s*&\s*Garden|Garden\s*&\s*General/.test(headerSub), `image-grid header "Next:" line names both tied bins (got: "${headerSub}")`);
}
{
  const card = await makeCard({ mode: 'compact' });
  await setHass(card, makeHass({
    'sensor.general_bin_days': { state: '8', attributes: {} },
    'sensor.garden_bin_days': { state: '8', attributes: {} },
    'sensor.plastic_bin_days': { state: '15', attributes: {} },
    'sensor.paper_bin_days': { state: '20', attributes: {} },
  }));
  const summary = card.shadowRoot.querySelector('.compact-summary')?.textContent || '';
  assert(/General\s*&\s*Garden|Garden\s*&\s*General/.test(summary), `compact summary names both tied bins (got: "${summary}")`);
}

console.log('## All 5 modes render without throwing');
for (const mode of ['smart-summary', 'image-grid', 'row', 'timeline', 'compact']) {
  const card = await makeCard({ mode });
  await setHass(card, makeHass());
  assert(card.shadowRoot.querySelector('ha-card') !== null, `${mode} mode renders inside ha-card`);
}

console.log('## row mode: single row, one column per bin');
{
  const card = await makeCard({ mode: 'row' });
  await setHass(card, makeHass());
  const container = card.shadowRoot.querySelector('.row');
  assert(!!container, 'row container renders');
  assert(/grid-template-columns:\s*repeat\(4,\s*1fr\)/.test(container.getAttribute('style') || ''), 'row container has one column per displayed bin');
  assert(card.shadowRoot.querySelectorAll('.row .bin-tile').length === 4, 'all 4 bins render as tiles inside the row');
}

console.log('## secondary_info modes render');
{
  const card = await makeCard({ mode: 'image-grid', secondary_info: 'both' });
  await setHass(card, makeHass());
  assert(/•/.test(html(card)), 'combined days+date label rendered for "both" mode');
}

console.log('## highlight_today: subtle vs strong are visually distinct');
{
  const card = await makeCard({ mode: 'smart-summary', highlight_today: 'subtle' });
  await setHass(card, makeHass());
  assert(!!card.shadowRoot.querySelector('.hl-dot'), 'subtle renders a dot element');
  assert(!card.shadowRoot.querySelector('.hl-pill'), 'subtle does not also render a pill element');
}
{
  const card = await makeCard({ mode: 'smart-summary', highlight_today: 'strong' });
  await setHass(card, makeHass());
  assert(!!card.shadowRoot.querySelector('.hl-pill'), 'strong renders a labeled pill element');
}

console.log('## fade_future_bins works across modes, gated per-card');
for (const mode of ['image-grid', 'row', 'timeline']) {
  const card = await makeCard({ mode, fade_future_bins: true, days_ahead: 14, show_all_bins: true });
  await setHass(card, makeHass({ 'sensor.paper_bin_days': { state: '14', attributes: {} } }));
  const hasFaded = mode === 'timeline' ? html(card).includes('faded') : !!card.shadowRoot.querySelector('.faded');
  assert(hasFaded, `${mode}: faded class present on far-future bin when fade_future_bins:true`);
}
{
  const card = await makeCard({ mode: 'compact', fade_future_bins: true, days_ahead: 14, show_all_bins: true });
  await setHass(card, makeHass({ 'sensor.paper_bin_days': { state: '14', attributes: {} } }));
  assert(!!card.shadowRoot.querySelector('.compact-dot.future'), 'compact: far-future dot fades when fade_future_bins:true');
}
{
  const card = await makeCard({ mode: 'compact', fade_future_bins: false, days_ahead: 14, show_all_bins: true });
  await setHass(card, makeHass({ 'sensor.paper_bin_days': { state: '14', attributes: {} } }));
  assert(!card.shadowRoot.querySelector('.compact-dot.future'), 'compact: no dot fades when fade_future_bins:false');
}

console.log('## show_future_bins:false hides the "Next:" line in smart-summary');
{
  const card = await makeCard({ show_future_bins: true });
  await setHass(card, makeHass());
  assert(!!card.shadowRoot.querySelector('.ss-next-line'), 'shows Next: line by default');
}
{
  const card = await makeCard({ show_future_bins: false });
  await setHass(card, makeHass());
  assert(!card.shadowRoot.querySelector('.ss-next-line'), 'hides Next: line when show_future_bins is false');
}

console.log('## Optional delayed/changed badges only appear when exposed');
{
  const card = await makeCard({ mode: 'image-grid', show_all_bins: true });
  await setHass(card, makeHass());
  assert(!card.shadowRoot.querySelector('.badge-delayed'), 'no Delayed badge when attribute absent');
}
{
  const card = await makeCard({ mode: 'image-grid', show_all_bins: true });
  await setHass(card, makeHass({ 'sensor.general_bin_days': { state: '0', attributes: { delayed: true } } }));
  assert(!!card.shadowRoot.querySelector('.badge-delayed'), 'Delayed badge appears when sensor exposes delayed:true');
}

console.log('## A bin missing entity is shown honestly, never invented');
{
  const card = await makeCard({ mode: 'image-grid', show_all_bins: true }, [
    { name: 'Ghost', entity: 'sensor.does_not_exist', color: 'grey' },
  ]);
  await setHass(card, makeHass());
  assert(html(card).includes('no entity'), 'missing-entity bin shows "no entity" warning');
}

console.log('## Lifecycle: missing-at-setConfig-time bin resolves cleanly once hass arrives (no stale state possible with Lit)');
{
  const card = await makeCard({ mode: 'image-grid', show_all_bins: true }); // no hass set yet
  assert(card.shadowRoot.querySelectorAll('.tile-warn').length === 4, 'all 4 tiles show "no entity" before hass is available');
  await setHass(card, makeHass());
  assert(card.shadowRoot.querySelectorAll('.tile-warn').length === 0, 'warning clears once hass resolves real bin data');
  assert(card.shadowRoot.querySelectorAll('.bin-tile').length === 4, 'all 4 tiles render with real data');
}

console.log('## Anti-flicker: unrelated entity changes do not trigger a re-render at all');
{
  const card = await makeCard({ mode: 'image-grid' });
  await setHass(card, makeHass());
  const imgBefore = card.shadowRoot.querySelector('.bin-tile img, .bin-tile ha-icon');
  // Same exact state for every bin — nothing relevant changed.
  await setHass(card, makeHass());
  const imgAfter = card.shadowRoot.querySelector('.bin-tile img, .bin-tile ha-icon');
  assert(imgBefore === imgAfter, 'identical hass tick does not recreate DOM (stateHash short-circuit)');
}
{
  const card = await makeCard({ mode: 'image-grid', show_all_bins: true });
  await setHass(card, makeHass());
  const paperTileBefore = card.shadowRoot.querySelector('.bin-tile[style*="paper"], .bin-tile');
  const imgBefore = [...card.shadowRoot.querySelectorAll('.bin-tile')].pop().querySelector('img, ha-icon');
  await setHass(card, makeHass({ 'sensor.general_bin_days': { state: '1', attributes: {} } })); // unrelated bin changes
  const imgAfter = [...card.shadowRoot.querySelectorAll('.bin-tile')].pop().querySelector('img, ha-icon');
  assert(imgBefore === imgAfter, 'unrelated tile image identity preserved across an update (Lit keyed repeat)');
}

console.log('## Popup planner shows Today + Upcoming, with notes/action text');
{
  const card = await makeCard({}, [
    { name: 'General', entity: 'sensor.general_bin_days', color: 'grey', notes: 'Kerb by 7am', action_text: 'Put out after 7pm' },
    { name: 'Garden', entity: 'sensor.garden_bin_days', color: 'green', notes: 'Garden waste only' },
    { name: 'Plastic', entity: 'sensor.plastic_bin_days', color: 'burgundy' },
    { name: 'Paper', entity: 'sensor.paper_bin_days', color: 'beige' },
  ]);
  await setHass(card, makeHass());
  const header = card.shadowRoot.querySelector('.ss-header');
  header.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  await card.updateComplete;
  const popup = document.querySelector('bin-collection-popup');
  assert(!!popup, 'header tap opens the planner popup');
  await popup.updateComplete;
  assert(popup.shadowRoot.innerHTML.includes('Put out after 7pm'), 'planner shows action text for today bin');
  assert(popup.shadowRoot.innerHTML.includes('Garden waste only'), 'planner shows notes for an upcoming (non-today) bin');
  popup.close();
}

console.log('## Bin tap opens a detail view with next + real past history');
{
  const card = await makeCard();
  await setHass(card, withHistory(makeHass(), [
    { state: '3', last_changed: '2026-01-01T00:00:00.000Z' },
    { state: '0', last_changed: '2026-01-05T00:00:00.000Z' },
    { state: '5', last_changed: '2026-01-06T00:00:00.000Z' },
    { state: '0', last_changed: '2026-01-12T00:00:00.000Z' },
    { state: '0', last_changed: '2026-01-12T08:00:00.000Z' }, // same day, must not double-count
    { state: '6', last_changed: '2026-01-13T00:00:00.000Z' },
    { state: '0', last_changed: '2026-01-26T00:00:00.000Z' },
  ]));
  const tile = card.shadowRoot.querySelector('.ss-bin');
  tile.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  await card.updateComplete;
  const popup = document.querySelector('bin-collection-popup');
  assert(!!popup, 'bin tap opens a detail popup');
  await popup.updateComplete;
  assert(popup.shadowRoot.innerHTML.includes('Checking history'), 'shows a loading state before history resolves');
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
  await popup.updateComplete;
  const chips = popup.shadowRoot.querySelectorAll('.popup-tl-chip');
  assert(chips.length === 3, `shows the 3 distinct rising-edge-into-zero dates found, deduped (got ${chips.length})`);
  popup.close();
}
{
  const card = await makeCard();
  await setHass(card, withHistory(makeHass(), []));
  const tile = card.shadowRoot.querySelector('.ss-bin');
  tile.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  await card.updateComplete;
  const popup = document.querySelector('bin-collection-popup');
  await new Promise((r) => setTimeout(r, 0));
  await popup.updateComplete;
  assert(popup.shadowRoot.innerHTML.includes('No collection history available yet'), 'empty recorder history shows an honest message');
  popup.close();
}
{
  const card = await makeCard();
  await setHass(card, makeHass()); // no callApi at all
  const tile = card.shadowRoot.querySelector('.ss-bin');
  tile.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  await card.updateComplete;
  const popup = document.querySelector('bin-collection-popup');
  await new Promise((r) => setTimeout(r, 0));
  await popup.updateComplete;
  assert(popup.shadowRoot.innerHTML.includes('No collection history available yet'), 'missing callApi falls back to the same honest message, never throws');
  popup.close();
}

console.log('## compact mode bins are individually tappable');
{
  const card = await makeCard({ mode: 'compact' });
  await setHass(card, withHistory(makeHass(), []));
  const dot = card.shadowRoot.querySelector('.compact-dot');
  assert(!!dot, 'compact dots render');
  dot.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  await card.updateComplete;
  const popup = document.querySelector('bin-collection-popup');
  assert(!!popup, 'tapping a compact dot opens the bin detail popup');
  popup.close();
}

console.log('## Visual editor mounts, renders bins, supports reordering and colour swatches');
{
  const editor = document.createElement('bin-collection-card-editor');
  document.body.appendChild(editor);
  editor.hass = makeHass();
  editor.setConfig({ bins: defaultBins() });
  await editor.updateComplete;
  assert(!!editor.shadowRoot.querySelector('ha-form'), 'global config renders via ha-form');
  const binItems = editor.shadowRoot.querySelectorAll('.bin-item');
  assert(binItems.length === 4, `editor renders 4 bin items (got ${binItems.length})`);
  assert(!!editor.shadowRoot.querySelector('ha-entity-picker'), 'entity picker mounted for each bin');
  assert(!!editor.shadowRoot.querySelector('.swatch'), 'colour swatches render');

  let lastConfig = null;
  editor.addEventListener('config-changed', (e) => { lastConfig = e.detail.config; });

  const moveUpBtns = editor.shadowRoot.querySelectorAll('.move-btn');
  // second bin's "move up" button (index 0 = first bin's up button, disabled)
  const secondBinUp = [...binItems[1].querySelectorAll('.move-btn')][0];
  secondBinUp.click();
  await editor.updateComplete;
  assert(lastConfig.bins[0].name === 'Garden', 'reorder-up moves the second bin into first place');

  const swatch = binItems[0].querySelector('.swatch');
  swatch.click();
  await editor.updateComplete;
  assert(lastConfig.bins[0].color === swatch.title, 'clicking a swatch updates that bin\'s colour');

  const addBtn = editor.shadowRoot.querySelector('.add-btn');
  addBtn.click();
  await editor.updateComplete;
  assert(lastConfig.bins.length === 5, 'add bin button appends a new bin');
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
