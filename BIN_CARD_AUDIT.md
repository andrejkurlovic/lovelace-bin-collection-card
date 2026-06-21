# Bin Collection Card — v3 Audit

Audited file: `lovelace-bin-collection-card.js` (1212 lines, single file, no bundler). `src/`, `dist/`, `examples/`, `docs/screenshots/` are empty placeholder directories — there is nothing else to audit. `package.json` still says `2.0.0`; the actual shipped code is `v3.0.0` per the file header comment and git log (`4938ed0 v3.0.0: smart-summary mode, anti-flicker state diffing, premium visual design, full editor`).

No code was modified to produce this document.

---

## 1. Inventory of current capabilities

### Card modes

| Mode | Default? | Renders | Problem it solves |
|---|---|---|---|
| `smart-summary` | **Yes** (`getStubConfig` and the `mode || 'smart-summary'` fallback in `_render`) | Header title/subtitle that switches between "Collection Day" / "Collection Tomorrow" / "Next Collection" / "No Collections Due", a row of large bin images for the "main" bins for that state, an optional action hint line, and a secondary chip strip (max 4) for everything else | Directly targets "what do I need to do today, and what's next" — the single most opinionated, prioritized view |
| `image-grid` | No | 2-column grid of tiles: image, name, days label, urgency dot (today/tomorrow), accent colour bar, "no entity" warning | At-a-glance status for every configured bin, dashboard-tile style |
| `timeline` | No | Rows grouped by date (`groupByDate`), each row = date label + chips for bins collected that day | Full near-term schedule across multiple days |
| `compact` | No | One line: coloured dots (one per bin) + title/summary text + up to 3 mini bin images | Minimal footprint widget for tight dashboard space |

### Config schema

**Global config**

| key | type | default | required | UI editor support |
|---|---|---|---|---|
| `title` | string | `'Bin Collection'` | no | yes |
| `mode` | enum (`smart-summary`,`image-grid`,`timeline`,`compact`) | `smart-summary` | no | yes |
| `days_ahead` | number | `14` | no | yes |
| `show_header` | boolean | `true` | no | yes |
| `show_next_summary` | boolean | `true` | no | yes |
| `popup` | boolean | `true` | no | yes |
| `sort` | boolean | `true` | no | yes |
| `bins` | array | `[]` (but ≥1 required, enforced in `setConfig` by throwing) | **yes** | yes (add/remove/edit) |

**Behaviour config**

| key | type | default | required | UI |
|---|---|---|---|---|
| `show_all_bins` | boolean | `false` | no | yes |
| `fade_future_bins` | boolean | `false` | no | yes (only affects `image-grid`) |

**Styling config**

| key | type | default | required | UI |
|---|---|---|---|---|
| `highlight_today` | enum (`off`,`subtle`,`strong`) | `subtle` | no | yes — **but `subtle` and `strong` are coded identically** (`hl !== 'off'` is the only check); `strong` is a no-op |
| `secondary_info` | enum (`days`,`date`,`both`) | `days` | no | yes — **but `_secondaryText()` is computed in `_renderImageGrid` and then never inserted into the template; this option currently has zero visible effect** |
| `today_text` | string | `'Today'` | no | yes |
| `tomorrow_text` | string | `'Tomorrow'` | no | yes |

**Per-bin config** (inside `bins[]`)

| key | type | default | required | UI |
|---|---|---|---|---|
| `name` | string | `''` | effectively yes | yes |
| `entity` | string (sensor id) | `''` | effectively yes | yes — plain text input, no entity picker |
| `image` | string (URL) | none (falls back to icon) | no | yes — plain text, no media picker |
| `icon` | string (mdi icon) | `'mdi:delete'` | no | yes — plain text, no icon picker |
| `color` | enum (18 named colours + default) | `'grey'`/unset | no | yes — real `<select>` |
| `notes` | string | none | no | yes |
| `action_text` | string | none | no | yes |

**Popup config**: none. Popup content (Today section + Upcoming groups) is fully hardcoded; the only lever is the global `popup: true/false` switch.

**Action config**: none. Tap behaviour is hardcoded (header tap → custom popup, bin tap → `hass-more-info`). There is no `tap_action`/`hold_action`/`double_tap_action`, which is the standard HA card convention.

---

## 2. Visual editor audit (`getConfigElement`)

The editor (`BinCollectionCardEditor`) is a hand-rolled `HTMLElement` that renders raw `<select>`/`<input>` controls via `innerHTML`, manually re-binding listeners after every mutation. It does **not** use any of HA's native editor primitives (`ha-entity-picker`, `ha-icon-picker`, `ha-selector`, `ha-form`).

**What can be configured**: every key in the schema above is exposed somewhere in the UI — display mode, title, header/summary/popup toggles, filtering (`days_ahead`, `sort`, `show_all_bins`, `fade_future_bins`), styling (`highlight_today`, `secondary_info`, today/tomorrow text), and full per-bin CRUD (add/edit/remove).

**What cannot be configured / is missing**:
- No `tap_action`/`hold_action`/`double_tap_action` — doesn't exist in the schema at all, so there's nothing to expose.
- No bin reordering (no drag handles, no up/down buttons) — order matters (first bin with `action_text` wins in smart-summary, pre-sort tile order) but can only be changed by deleting and re-adding bins in the desired sequence.
- No validation: entity field is plain text with no autocomplete or existence check, so a typo silently produces a permanently "missing entity" bin with no editor-side warning.
- No icon picker preview — icon field is plain text, you must already know the exact `mdi:` name.
- No image/media browser — image field is a raw URL text box, no thumbnail preview, no `/local/` browse.
- No colour swatches — the colour `<select>` lists colour names as text only, not a coloured preview chip.
- No tooltips/help text on any field (e.g. what `fade_future_bins` or `highlight_today` actually do).

**What feels clunky**: `secondary_info` and the `strong` value of `highlight_today` are fully wired into the UI and look functional, but have no effect on rendering — this is the worst kind of editor bug because it actively misleads the user into thinking they changed something.

**What is still YAML-only**: nothing in the current schema is YAML-only — coverage of *existing* options is complete. The gap is entirely in options that don't exist yet (actions, popup content config).

**Score: 6/10** — broad, complete coverage of the existing schema, but built from raw HTML inputs instead of HA's native pickers, with two non-functional options exposed as if real and no reordering/validation.

---

## 3. Layout audit (per mode)

### smart-summary — 6/10
- **Good**: the today/tomorrow/next/none state machine is exactly the right shape for the product vision; action hint and a capped secondary strip keep it from becoming a wall of text.
- **Weak**: the subtitle line has a real bug (see below) that silently drops the most important sentence in the card. The secondary strip is an unconditional `.slice(0, 4)` with no "show more" — bins 5+ are simply invisible with no indicator that more exist.
- **Bug found**: `headerSub` (e.g. `"General is being collected today"` or `"General — put out tonight"`) is computed for every state but the subtitle render expression — `` mainBins.length || !nextBin ? (mainBins.length ? '' : headerSub) : '' `` — evaluates to an **empty string whenever `mainBins.length > 0`**, which is precisely the Today and Tomorrow cases. So on the two states that matter most ("it's collection day" and "put it out tonight"), the explanatory subtitle is computed and then discarded. Only the bare "Collection Day"/"Collection Tomorrow" title renders; the supporting sentence never reaches the screen.
- **Missing**: no missed-collection state, no completion/acknowledgement, no fading for the secondary strip's farther-out bins.

### image-grid — 6/10
- **Good**: clean 2-col tile grid, today/tomorrow urgency dots, accent colour bar, explicit "no entity" warning for missing sensors, optional fade for far-future bins.
- **Weak**: `secondary_info` is dead (see schema audit) so the "show date" option silently does nothing; it's a flat grid with no grouping, so "what's next" requires visually scanning all tiles rather than being told.
- **Missing**: notes/action_text are never rendered in this mode (only in smart-summary and popup); negative `days` (missed collection) renders as `"in -1 days"` with no special treatment.

### timeline — 6/10
- **Good**: clear date-grouped schedule, correct chronological ordering, good for seeing the whole `days_ahead` window at once.
- **Weak**: today's row is visually distinguished only by text colour (`.tl-today`) — it does not stand out as "you have something to do" the way smart-summary's whole-section treatment does. Notes/action_text are not shown at all in this mode.
- **Missing**: no past/previous-collection context, no completion tracking.
- This mode is the weakest fit for the stated vision ("what do I need to do today") since it deliberately treats every day equally — that's appropriate for a schedule view but not for an action view.

### compact — 5/10
- **Good**: genuinely minimal, good for a tight dashboard slot, today dot scales up for emphasis.
- **Weak**: information density is very low — no action hints possible, and the per-bin `title="..."` tooltip (the only way to learn anything about an individual dot) **does not work on touch devices**, so mobile users — who are most of the HA companion-app audience — lose that information entirely.
- **Missing**: no path to surface `action_text` short of opening the full popup.

---

## 4. Popup audit

- **How it opens**: clicking the element with `id="header"` (only that element — in `smart-summary`/`image-grid`/`timeline` this is the header text/title block, *not* the whole card body; in `compact` mode it happens to be the entire row since the whole row carries `id="header"`).
- **What it shows**: a "Today" section (image, name, date, notes, action_text per bin) and an "Upcoming" section grouped by day (name + image chips only — **no notes or action_text for upcoming bins**, only for today's).
- **browser_mod**: not used at all. The popup is hand-built: a `<div>` appended directly to `document.body` with its own shadow root, fully independent of HA's `ha-dialog`/`more-info-dialog` and independent of browser_mod.
- **Fallback behaviour**: clean — when `popup: false`, no click listener is attached to the header at all, and the `▸` tap-hint affordance is also conditionally hidden, so there's no dead UI.
- **Mobile behaviour**: bottom-sheet on screens <600px, centered modal ≥600px — a reasonable, native-feeling responsive split. However, because it's appended straight to `document.body` rather than going through HA's dialog stack, it doesn't participate in HA's history-state handling — **the Android hardware/gesture back button will not close it**, which will surprise anyone used to how every other HA dialog behaves.
- **Misleading affordance**: there is a `.popup-drag` handle rendered at the top of the sheet (visually implying swipe-to-dismiss) but **no swipe/drag gesture is actually wired up** — it's pure decoration that promises an interaction the card doesn't deliver.
- **Weaknesses**: no native dialog integration, no back-button support, fake drag handle, asymmetric data (today gets notes+actions, upcoming doesn't), no actionable controls beyond the close button.
- **Opportunities**: real swipe-to-dismiss, native `ha-dialog` (gets back-button/stacking for free), surface notes/actions for every group, add actual action buttons (not just italic text).

**Does it act like a planner / detail view / action center?** Primarily a **detail view** — read-only, no forward planning beyond a flat list of dates, no real "actions" (the `action_text` field is informational copy, not a button that does anything). It is not a planner and not yet an action center.

**What it should become**: a genuine action center — buttons to acknowledge/snooze a bin, notes and hints surfaced consistently across both sections, real swipe-to-dismiss matching the handle that's already drawn.

**Score: 6/10**

---

## 5. Interaction model audit

| Gesture | Current behaviour |
|---|---|
| Card tap (body, outside header) | **Nothing**, in every mode except `compact` — only the `#header` element has a click listener, and in `smart-summary`/`image-grid`/`timeline` the header is a small region at the top, not the full card |
| Header tap | Opens the custom popup (if `popup !== false`) |
| Bin tap | `stopPropagation()` + dispatches `hass-more-info` for that entity → HA's native more-info dialog. Does not open the custom popup. |
| Bin hold | **Not implemented.** No long-press handling anywhere in the file — a hold behaves exactly like a tap (fires `hass-more-info`) |
| Double tap | **Not implemented.** No debouncing/special handling — two rapid taps just fire two independent single-tap actions (e.g. could open `hass-more-info` twice, or toggle the popup open/closed twice) |

**Is this intuitive?** Partially, and it's the weakest part of the whole card. The header-vs-bin split (schedule view vs. single-entity detail) is sensible once you know it exists, but nothing teaches it — the only affordance is a tiny `▸` glyph next to the header text, and individual bin tiles give only a hover-state cue that doesn't exist on touch. **`compact` mode is the most confusing**: the entire row carries `id="header"`, but the bin images inside that same row have their own click handlers with `stopPropagation()` — so tapping an image opens more-info while tapping the text next to it opens the popup, two different outcomes from one visually uniform row.

**What should improve**:
- Make the whole card body (not just the header text) open the popup — "I want to see everything" is the more common gesture than "I want to tap this 40px header strip."
- Adopt HA's standard `tap_action`/`hold_action`/`double_tap_action` config so the mapping is configurable and matches user expectations from every other HA card, instead of a hardcoded, inverted-feeling default (tap → custom popup, when most cards reserve hold for secondary actions and tap for primary).
- Implement at least basic `hold_action` support — right now it's entirely absent.

---

## 6. Data model audit

- **`days_until_collection`**: read as `parseInt(s.state, 10)`. Works for any sensor whose state is a plain integer string — this is the documented contract and matches the UK Bin Collection (HACS) integration.
- **`next_collection`**: read from `s.attributes?.next_collection` (expects an ISO `YYYY-MM-DD` string). This is a card-invented attribute name, not an HA convention — it only works if the upstream integration or a template sensor happens to expose exactly that attribute name.
- **Other optional attributes**: none are read. Bin display name always comes from config, never from `friendly_name` — predictable, but means renaming a sensor's friendly name has no effect (you must edit config too).
- **Missing/unavailable sensors**: both produce `days: null` (no distinction between "entity doesn't exist" and "entity exists but state is `unknown`/`unavailable`"). The `_bins()` filter — `b.days == null || b.days <= daysAhead` — **always keeps null-days bins regardless of `show_all_bins`**, but `smart-summary`'s `nextBin`/`mainBins` logic requires `b.days != null`, so a missing-entity bin is **visible in `image-grid`/`timeline` (with a "no entity" warning) but silently invisible in `smart-summary`/`compact`** — an inconsistency across modes for the exact same misconfiguration.
- **Negative days (missed collection)**: not handled. `nextBin` explicitly requires `b.days >= 0`, so a negative value can never become the "main" bin in smart-summary, but it *can* still surface in `image-grid`/`timeline` sorted first with a literal `"in -1 days"` label — no missed-collection UX exists anywhere.
- **Generality**:
  - ✅ UK Bin Collection integration — confirmed compatible (numeric days-until state).
  - ✅ Custom template sensors — trivially compatible if they output an integer state.
  - ⚠️ Other council integrations — only those that normalize to a single numeric "days until" state; integrations that expose the collection date as the primary state, or expose multiple upcoming events per entity, are not supported.
  - ❌ Generic `calendar.*` entities — **not supported at all**. Calendar entities expose event start/end, not a numeric days-until state; the card cannot consume them without a template-sensor bridge in front of them. Given `calendar.*` is HA's most generic primitive for "next thing happening," this is a real compatibility gap.

**Compatibility score: 6/10** — strong for its built-for case, weak for anything calendar-based or multi-event.

---

## 7. Rendering performance audit (flicker investigation)

This is the section that matters most, since the user reports real flickering/blinking.

**What's already done well**: there is a deliberate anti-flicker mechanism — `stateHash(hass, bins)` builds a string from only the `state` and `next_collection` attribute of each *configured* bin entity, and `set hass(h)` skips `_render()` entirely if that hash hasn't changed. This correctly prevents spurious re-renders caused by unrelated entities changing elsewhere in the system, which is the #1 cause of flicker in naive HA custom cards. **There are no `setInterval`/`requestAnimationFrame`/polling loops anywhere in the file** — confirmed by reading all 1212 lines — so this is not a self-inflicted timer bug.

**Where the real flicker comes from**: every render method ends in `this.shadowRoot.innerHTML = ...` — a full teardown and rebuild of the entire card DOM, every time, even for a one-bin state change (e.g. days ticking from `2` to `1`). Two structural consequences:

1. **`backdrop-filter: blur()` recompute on element creation.** This property is used on `.ss-bin-inner`, `.bin-tile`, `.popup-sheet`, and `.popup-bin-card` — i.e. exactly the visually prominent tiles in every mode. Browsers (and especially WebViews on lower-powered tablets/kiosks, which is a common HA wall-mount setup) frequently recompute the backdrop blur compositing layer from scratch when such an element is newly inserted, rather than when it's merely restyled in place. Destroying and recreating these elements on *every* legitimate state change — instead of patching just the text/class that actually changed — produces a visible one-frame repaint "blink," most pronounced on weaker hardware.
2. **`<img>` recreation.** `imgHtml()` is re-stringified and re-parsed into a brand-new `<img>` node on every render, even when `src` hasn't changed. Browsers don't reliably reuse the previously-decoded bitmap for a freshly-inserted `<img>` element, so each legitimate re-render can force a re-decode/re-paint of every bin image on the card — not just the bin whose data changed.

A secondary, cosmetic note: `.ss-main { transition: background .4s; }` has no visible effect either way, since `innerHTML` replacement creates a brand-new element with no prior frame to transition from — the transition never actually animates; it's dead styling, not a bug, just noise.

**Is the flicker real?** Yes — it's structurally guaranteed on every genuine data change (e.g. once a day when a bin's day-count decrements), because the full-element-replace strategy recreates exactly the elements (blurred tiles, images) that are most expensive/visible to repaint. The anti-flicker hash successfully prevents *spurious* re-renders; it does nothing for the *legitimate* ones, which is where the actual flicker reports are coming from.

**Where it's worst**: `image-grid` and `smart-summary` (heaviest use of `backdrop-filter` tiles + images). `timeline` is lighter (chips, smaller blur surface). `compact` has no `backdrop-filter` at all and would show the least flicker.

**How to fix** (no code changes made, per scope — recommendations only):
- Replace `innerHTML`-replace-everything with targeted DOM patching: keep one persistent element per bin (keyed by entity id) and only update its text content/class/style when that specific bin's data changed, leaving untouched bins' DOM nodes (and their composited blur layers) alone.
- Alternatively, adopt a small diffing renderer (e.g. `lit-html`) so the framework handles node reuse instead of hand-written innerHTML strings.
- If a full adapter rewrite is out of scope short-term, removing `backdrop-filter` (or replacing it with a precomputed translucent solid colour) would remove the most expensive recompute even with the current full-replace strategy.

---

## 8. Product gap analysis

Vision: *"What do I need to do today, and what's next?"*

| Feature | Status | Notes |
|---|---|---|
| Collection Day mode | **Partial** | State exists in smart-summary, but the explanatory subtitle is dropped by the bug in §3 |
| Next Collection mode | Exists | Smart-summary "Next Collection" state works as intended |
| No Collection mode | Exists | Smart-summary "No Collections Due" state works as intended |
| Future faded bins | Partial | Only in `image-grid` via `fade_future_bins`; not in smart-summary's secondary strip or timeline |
| Previous collection | Missing | No history of last collection date is tracked or shown anywhere |
| Action required hints | Partial | `action_text` exists and renders in smart-summary's main section + popup Today section only; absent from image-grid, timeline, compact, and popup's Upcoming section |
| Put out tonight reminders | **Partial/broken** | The "Tomorrow" subtitle (`"X — put out tonight"`) is computed but never rendered, due to the same bug as Collection Day |
| Weekly strip | Missing | No week-at-a-glance view in any mode |
| Seasonal pause | Missing | No concept of a suspended schedule (e.g. holiday gaps) — a large day-gap just renders as a big number with no explanation |
| Missed collection | Missing | Negative `days` values are not specially handled or labeled anywhere |
| Completion tracking | Missing | No way to mark a bin as "done"/handled — no persistence of any kind; this is a purely read-only display |
| Notes per bin | Exists | Rendered only in popup's Today section, not upcoming, not in any card-body mode |

---

## 9. Design improvement proposals

### Quick wins (low effort / high value)
1. **Fix the smart-summary subtitle bug.** Impact: high — this is the headline message of the card's flagship, default mode, currently silently dropped. Complexity: trivial.
2. **Wire up or remove `secondary_info`.** Either insert `_secondaryText()`'s output into the image-grid tile template, or drop the dead option from both the schema and editor. Impact: medium (currently a misleading config option). Complexity: low.
3. **Resolve `highlight_today: strong`.** Either implement a visually distinct treatment or collapse the option to a boolean. Impact: low-medium. Complexity: low.
4. **Show `notes`/`action_text` consistently** across image-grid, timeline, and popup's Upcoming section, not just smart-summary/popup-Today. Impact: medium (action hints are core to the vision). Complexity: low.
5. **Add a missed-collection label** for negative `days` instead of `"in -1 days"`. Impact: medium. Complexity: low.

### Medium improvements
1. **Adopt HA's native editor pickers** (`ha-entity-picker`, `ha-icon-picker`, image/media picker) in place of plain text inputs. Impact: high (prevents typos, native look/feel). Complexity: medium.
2. **Add bin reordering** in the editor (drag handles or up/down buttons). Impact: medium. Complexity: medium.
3. **Add standard `tap_action`/`hold_action`/`double_tap_action`** config, replacing the hardcoded header/bin split. Impact: high (native, configurable, matches user expectations). Complexity: medium.
4. **Targeted DOM patching instead of full innerHTML replace**, to address the flicker at its structural source (§7). Impact: high. Complexity: medium-high — touches every render method.

### Product-level upgrades
1. **Generic data adapter layer** supporting `calendar.*` entities and multi-event sensors, not just single days-until numeric state. Impact: high — significantly broadens addressable integrations beyond UK Bin Collection-style sensors. Complexity: high.
2. **Popup → real action center**: native dialog integration (back-button support), genuine swipe-to-dismiss (the handle already implies this), and actual action buttons (acknowledge/snooze), not just italic hint text. Impact: high. Complexity: high.
3. **Weekly strip + seasonal-pause awareness**: a true week-at-a-glance view, plus detection of unusually large day-gaps labeled as "schedule paused" rather than a confusing big number. Impact: medium-high. Complexity: high.
4. **Completion/acknowledgment tracking** backed by an HA helper entity (e.g. `input_boolean`/`counter`) so the card becomes a closed-loop task system ("I put this out") rather than a pure read-only display. Impact: high — this is the single biggest gap between the current card and the stated product vision. Complexity: high.

---

## 10. Final scorecard

| Dimension | Score /10 | Why |
|---|---|---|
| Visual quality | 8 | Genuinely polished dark glassy aesthetic, consistent across all 4 modes + popup |
| Usefulness | 6 | Informative but read-only; flagship mode has a bug suppressing its key message |
| Configurability | 7 | Broad schema coverage in the UI editor; missing action config; two dead options |
| Popup usefulness | 6 | Good detail view; fake swipe affordance; no native dialog integration; no real actions |
| Home Assistant nativeness | 5 | Reinvents pickers, dialog, and tap-action config instead of using HA's own primitives |
| Performance | 6 | No timer/polling bugs and correct dedup against irrelevant updates, but full DOM rebuild on every real change drives the reported flicker |
| Reusability | 5 | Strong for "days-until" numeric sensors; not usable with `calendar.*` or multi-event sources without a bridge |
| Maintainability | 6 | Single well-organized 1200-line file, no build step, no tests; some accumulating dead code |
| Product maturity | 5 | Strong visual foundation but still a read-only status display, not the task-oriented product the vision implies |

**Is v3 ready?** Yes as a polished visual upgrade over v2 — it's a legitimate improvement and safe to keep using as a status display. It is **not yet** a full realization of "what do I need to do today, and what's next," due to (a) the header-subtitle/put-out-tonight rendering bug undercutting its own flagship mode, (b) no completion/acknowledgment loop, and (c) two configuration options that silently do nothing.

**What should v4 focus on?**
1. Fix the smart-summary subtitle bug — the headline feature is currently silently broken.
2. Move from full-DOM-replace rendering to targeted patching to eliminate flicker at its structural source, not just suppress spurious re-renders.
3. Adopt native HA editor primitives and a standard tap/hold/double-tap action model.
4. Add a real completion-tracking/"handled" state — the change that would actually turn this from an informational card into the task system the product vision describes.
