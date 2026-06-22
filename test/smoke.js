// Headless DOM smoke test — no live Home Assistant instance required.
// Run with: npm test
'use strict';
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.customElements = dom.window.customElements;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.Node = dom.window.Node;

const src = fs.readFileSync(path.join(__dirname, '..', 'lovelace-bin-collection-card.js'), 'utf8');
// eslint-disable-next-line no-new-func
new Function(src)();

let pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log(`  ok - ${msg}`); }
  else { fail++; console.error(`  FAIL - ${msg}`); }
}

function makeHass(overrides = {}) {
  const states = {
    'sensor.general_bin_days': { state: '0', attributes: {} },
    'sensor.garden_bin_days':  { state: '7', attributes: {} },
    'sensor.plastic_bin_days': { state: '3', attributes: {} },
    'sensor.paper_bin_days':   { state: '14', attributes: {} },
  };
  Object.assign(states, overrides);
  return { states };
}

function defaultBins(extra = {}) {
  return [
    { name: 'General', entity: 'sensor.general_bin_days', color: 'grey' },
    { name: 'Garden',  entity: 'sensor.garden_bin_days',  color: 'green', ...(extra.garden || {}) },
    { name: 'Plastic', entity: 'sensor.plastic_bin_days', color: 'burgundy' },
    { name: 'Paper',   entity: 'sensor.paper_bin_days',   color: 'beige' },
  ];
}

function makeCard(configOverrides = {}, bins) {
  const card = document.createElement('bin-collection-card');
  card.setConfig(Object.assign({
    title: 'Bin Collection',
    mode: 'smart-summary',
    bins: bins || defaultBins(),
  }, configOverrides));
  return card;
}

console.log('## Subtitle bug fix (smart-summary Today state)');
{
  const card = makeCard();
  card.hass = makeHass(); // General=0 -> today
  const html = card.shadowRoot.innerHTML;
  assert(html.includes('Collection Day'), 'shows Collection Day header');
  assert(/is being collected today/.test(html), 'subtitle sentence actually renders (was silently dropped in v3)');
}

console.log('## Tomorrow state + default action hint');
{
  const card = makeCard();
  card.hass = makeHass({ 'sensor.general_bin_days': { state: '1', attributes: {} } });
  const html = card.shadowRoot.innerHTML;
  assert(html.includes('Prepare Tonight'), 'shows Prepare Tonight header');
  assert(/collected tomorrow/.test(html), 'tomorrow subtitle rendered (was also dropped in v3)');
  assert(html.includes('Put out tonight'), 'default action hint shown when bin has no custom action_text');
}

console.log('## Missed collection state (new in v4)');
{
  const card = makeCard();
  card.hass = makeHass({
    'sensor.general_bin_days': { state: '-1', attributes: {} },
    'sensor.plastic_bin_days': { state: '10', attributes: {} },
  });
  const html = card.shadowRoot.innerHTML;
  assert(html.includes('Missed Collection'), 'shows Missed Collection header');
  assert(/not collected/.test(html), 'missed subtitle rendered');
}

console.log('## Quiet state (next collection >= 7 days away)');
{
  const card = makeCard();
  card.hass = makeHass({
    'sensor.general_bin_days': { state: '9', attributes: {} },
    'sensor.garden_bin_days':  { state: '12', attributes: {} },
    'sensor.plastic_bin_days': { state: '20', attributes: {} },
    'sensor.paper_bin_days':   { state: '25', attributes: {} },
  });
  const html = card.shadowRoot.innerHTML;
  assert(html.includes('No Collections This Week'), 'shows Quiet header');
  assert(/Next known:/.test(html), 'quiet subtitle uses "Next known:" framing');
}

console.log('## Upcoming/Quiet states show every bin tied for the soonest day, not just one');
{
  // Upcoming: Garden and Plastic both due in 5 days (within "this week") -> both should be main bins
  const upcoming = makeCard();
  upcoming.hass = makeHass({
    'sensor.general_bin_days': { state: '5', attributes: {} },
    'sensor.garden_bin_days':  { state: '5', attributes: {} },
    'sensor.plastic_bin_days': { state: '10', attributes: {} },
    'sensor.paper_bin_days':   { state: '20', attributes: {} },
  });
  const mainCount = upcoming.shadowRoot.querySelectorAll('.ss-bin').length;
  assert(mainCount === 2, `upcoming state shows both tied bins as main (got ${mainCount})`);
  assert(/General.*&.*Garden|Garden.*&.*General/.test(upcoming.shadowRoot.innerHTML), 'subtitle names both tied bins');

  // Quiet: General and Garden both due in 9 days (the >=7 day "quiet" threshold), Plastic/Paper further out
  const quiet = makeCard();
  quiet.hass = makeHass({
    'sensor.general_bin_days': { state: '9', attributes: {} },
    'sensor.garden_bin_days':  { state: '9', attributes: {} },
    'sensor.plastic_bin_days': { state: '15', attributes: {} },
    'sensor.paper_bin_days':   { state: '23', attributes: {} },
  });
  assert(quiet.shadowRoot.innerHTML.includes('No Collections This Week'), 'quiet header shows');
  const quietMainCount = quiet.shadowRoot.querySelectorAll('.ss-bin').length;
  assert(quietMainCount === 2, `quiet state also shows both tied bins as main (got ${quietMainCount})`);
}

console.log('## secondary_info modes actually render (dead in v3, wired in v4)');
{
  const card = makeCard({ mode: 'image-grid', secondary_info: 'both' });
  card.hass = makeHass();
  const html = card.shadowRoot.innerHTML;
  assert(/Today/.test(html), 'today label present');
  assert(/•/.test(html), 'combined days+date label rendered');
  assert(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/.test(html), 'a friendly weekday-formatted date is present');
}

console.log('## highlight_today: subtle vs strong are now visually distinct (identical no-op in v3)');
{
  const subtleCard = makeCard({ highlight_today: 'subtle' });
  subtleCard.hass = makeHass();
  const strongCard = makeCard({ highlight_today: 'strong' });
  strongCard.hass = makeHass();
  assert(!!subtleCard.shadowRoot.querySelector('.hl-dot'), 'subtle renders a dot element');
  assert(!!strongCard.shadowRoot.querySelector('.hl-pill'), 'strong renders a labeled pill element');
  assert(!subtleCard.shadowRoot.querySelector('.hl-pill'), 'subtle does not also render a pill element');
}

console.log('## fade_future_bins now works across all four modes, gated per-card (not just image-grid, not unconditional)');
{
  for (const mode of ['image-grid', 'timeline', 'smart-summary']) {
    const card = makeCard({ mode, fade_future_bins: true, days_ahead: 10 });
    card.hass = makeHass();
    assert(card.shadowRoot.innerHTML.includes('faded'), `${mode}: faded class present on far-future bin when fade_future_bins:true`);
  }

  const compactOn = makeCard({ mode: 'compact', fade_future_bins: true, days_ahead: 10 });
  compactOn.hass = makeHass();
  assert(!!compactOn.shadowRoot.querySelector('.compact-dot.future'), 'compact: far-future dot fades when fade_future_bins:true');

  const compactOff = makeCard({ mode: 'compact', fade_future_bins: false, days_ahead: 10 });
  compactOff.hass = makeHass();
  assert(!compactOff.shadowRoot.querySelector('.compact-dot.future'), 'compact: no dot fades when fade_future_bins:false, even 14 days out');
}

console.log('## show_future_bins:false hides the "Next:" line in smart-summary');
{
  const onCard = makeCard({ show_future_bins: true });
  onCard.hass = makeHass();
  const offCard = makeCard({ show_future_bins: false });
  offCard.hass = makeHass();
  assert(onCard.shadowRoot.innerHTML.includes('Next:'), 'shows Next: line by default');
  assert(!offCard.shadowRoot.innerHTML.includes('Next:'), 'hides Next: line when show_future_bins is false');
}

console.log('## Popup shows notes for upcoming bins, not just today (v3 only showed today)');
{
  const card = makeCard({}, defaultBins({ garden: { notes: 'Kerb by 7am' } }));
  card.hass = makeHass({ 'sensor.garden_bin_days': { state: '5', attributes: {} } });
  card._openPopup(card._resolved);
  const popupHtml = card._popup.shadowRoot.innerHTML;
  assert(popupHtml.includes('Kerb by 7am'), 'note for an upcoming (non-today) bin appears in the popup');
  card._closePopup();
}

console.log('## Optional delayed/changed badges only appear when the integration exposes them');
{
  const plain = makeCard();
  plain.hass = makeHass();
  assert(!plain.shadowRoot.querySelector('.badge-delayed'), 'no Delayed badge element when attribute absent');

  const delayed = makeCard();
  delayed.hass = makeHass({ 'sensor.general_bin_days': { state: '0', attributes: { delayed: true } } });
  assert(!!delayed.shadowRoot.querySelector('.badge-delayed'), 'Delayed badge element appears when sensor exposes delayed:true');
}

console.log('## No DOM rebuild on a same-structure update (the flicker fix)');
{
  const card = makeCard({ mode: 'image-grid' });
  card.hass = makeHass();
  const gardenTileBefore = card.shadowRoot.querySelector('.bin-tile[data-key="sensor.garden_bin_days"]');
  const gardenImgBefore = gardenTileBefore.querySelector('img, .icon-fallback');

  // Legitimate data change that doesn't cross a group/order boundary
  card.hass = makeHass({ 'sensor.plastic_bin_days': { state: '2', attributes: {} } });

  const gardenTileAfter = card.shadowRoot.querySelector('.bin-tile[data-key="sensor.garden_bin_days"]');
  const gardenImgAfter = gardenTileAfter.querySelector('img, .icon-fallback');
  assert(gardenTileBefore === gardenTileAfter, 'unrelated tile element identity preserved (not recreated)');
  assert(gardenImgBefore === gardenImgAfter, 'unrelated image/blur element identity preserved (not recreated)');

  const plasticLabel = card.shadowRoot.querySelector('.bin-tile[data-key="sensor.plastic_bin_days"] [data-role="label"]');
  assert(plasticLabel.textContent.length > 0, 'the bin that actually changed still gets its label patched');
}

console.log('## Same identity check in smart-summary mode (the flagship mode)');
{
  const card = makeCard({ mode: 'smart-summary' });
  card.hass = makeHass(); // General=0 -> today, mainBins=[General]
  const mainImgBefore = card.shadowRoot.querySelector('.ss-bin[data-key="sensor.general_bin_days"] img, .ss-bin[data-key="sensor.general_bin_days"] .icon-fallback');
  card.hass = makeHass({ 'sensor.plastic_bin_days': { state: '2', attributes: {} } }); // still today state, unrelated bin changes
  const mainImgAfter = card.shadowRoot.querySelector('.ss-bin[data-key="sensor.general_bin_days"] img, .ss-bin[data-key="sensor.general_bin_days"] .icon-fallback');
  assert(mainImgBefore === mainImgAfter, 'main bin image identity preserved across an unrelated update in smart-summary');
}

console.log('## A bin entering the display window still triggers a correct structural rebuild');
{
  const card = makeCard({ mode: 'image-grid', days_ahead: 5 });
  card.hass = makeHass({ 'sensor.paper_bin_days': { state: '14', attributes: {} } }); // filtered out, beyond days_ahead
  const tilesBefore = card.shadowRoot.querySelectorAll('.bin-tile').length;
  card.hass = makeHass({ 'sensor.paper_bin_days': { state: '4', attributes: {} } }); // now within window
  const tilesAfter = card.shadowRoot.querySelectorAll('.bin-tile').length;
  assert(tilesAfter === tilesBefore + 1, 'new bin appears once it enters the days_ahead window');
}

console.log('## compact mode dot fading is gated by fade_future_bins + days_ahead, same as every other mode (not a hardcoded 7-day rule)');
{
  // days_ahead:10 -> threshold (days_ahead/2) = 5; show_all_bins so Paper (14d) isn't filtered out of display entirely
  const card = makeCard({ mode: 'compact', fade_future_bins: true, days_ahead: 10, show_all_bins: true });
  card.hass = makeHass(); // General=0 (today), Plastic=3 (within threshold), Garden=7, Paper=14 (beyond threshold)
  const generalDot = card.shadowRoot.querySelector('.compact-dot[data-key="sensor.general_bin_days"]');
  const plasticDot = card.shadowRoot.querySelector('.compact-dot[data-key="sensor.plastic_bin_days"]');
  const gardenDot = card.shadowRoot.querySelector('.compact-dot[data-key="sensor.garden_bin_days"]');
  const paperDot = card.shadowRoot.querySelector('.compact-dot[data-key="sensor.paper_bin_days"]');
  assert(!generalDot.classList.contains('future'), 'today dot is not faded');
  assert(!plasticDot.classList.contains('future'), 'dot within the fade threshold is not faded');
  assert(gardenDot.classList.contains('future'), 'dot beyond the fade threshold is faded');
  assert(paperDot.classList.contains('future'), 'far-future dot is faded');

  // patch path: plastic crosses the threshold without changing entity order/struct
  card.hass = makeHass({ 'sensor.plastic_bin_days': { state: '9', attributes: {} } });
  const plasticDotAfter = card.shadowRoot.querySelector('.compact-dot[data-key="sensor.plastic_bin_days"]');
  assert(plasticDotAfter.classList.contains('future'), 'patch path also applies the future class once a bin crosses the threshold');

  // and turning fade_future_bins off on the same data leaves every dot bold
  const noFade = makeCard({ mode: 'compact', fade_future_bins: false, days_ahead: 10, show_all_bins: true });
  noFade.hass = makeHass();
  assert(noFade.shadowRoot.querySelectorAll('.compact-dot.future').length === 0, 'fade_future_bins:false means no compact dot fades regardless of days_ahead');

  // the small bin images shown alongside the dots must fade in lockstep with their own dot,
  // not just the dot itself (this was the gap: dots faded, images stayed at full brightness)
  const generalImgWrap = card.shadowRoot.querySelector('.compact-img-wrap[data-img-key="sensor.general_bin_days"]');
  const gardenImgWrap = card.shadowRoot.querySelector('.compact-img-wrap[data-img-key="sensor.garden_bin_days"]');
  assert(!!generalImgWrap && !generalImgWrap.classList.contains('faded'), 'today bin image is not faded');
  assert(!!gardenImgWrap && gardenImgWrap.classList.contains('faded'), 'beyond-threshold bin image is faded, matching its dot');
}

console.log('## Visual editor mounts, renders bins, supports reordering and colour swatches');
{
  const editor = document.createElement('bin-collection-card-editor');
  editor.setConfig({ mode: 'smart-summary', bins: defaultBins().slice(0, 2) });
  assert(editor.querySelectorAll('.bin-item').length === 2, 'editor renders 2 bin items');
  assert(editor.querySelectorAll('[data-slot="entity"]').length === 2, 'entity field slots mounted (picker or fallback input)');
  assert(editor.querySelectorAll('[data-slot="entity"] input, [data-slot="entity"] ha-entity-picker').length === 2, 'entity field has a usable control');
  assert(!!editor.querySelector('[data-move="up"][data-index="1"]'), 'reorder-up button present on second bin');
  assert(editor.querySelectorAll('.swatch').length > 0, 'colour swatches render instead of a plain select');
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
