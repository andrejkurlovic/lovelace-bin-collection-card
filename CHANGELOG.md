# Changelog

## v5.1.0

### Changed
- **`fade_future_bins` threshold is now a fixed 7 days, not `days_ahead / 2`.**
  With a large `days_ahead` (commonly set just to make `show_all_bins`
  behave predictably, e.g. `days_ahead: 30`), the old relative threshold
  silently pushed the fade point out too — a bin due in 8 days ("next
  week") wouldn't fade at all, while one a couple of weeks further out
  would. Fading now always means "further out than next week," regardless
  of `days_ahead`.

## v5.0.2

### Fixed
- **`fade_future_bins` had no effect in timeline mode.** The v5.0.0 rewrite
  never ported the row-level fade the old implementation applied to
  `.tl-row` for groups beyond the fade threshold — timeline rows simply
  never faded regardless of the setting. Restored: the whole row (date
  label + chips) now fades together, same as before the rewrite.
- **Timeline's empty-state message** had drifted to match image-grid's
  ("No collections due within X days") instead of its own original, shorter
  message ("No collections due soon").
- The test suite had a coverage gap that let the fade bug ship unnoticed:
  the "fade works" assertion for timeline checked for the literal string
  `"faded"` anywhere in the card's full `innerHTML` — which always matched
  because the shared `.faded { opacity: ... }` CSS rule contains that exact
  text in the `<style>` block, regardless of whether any element actually
  used the class. Replaced with a real DOM query (`.tl-row.faded`), and
  added the negative case (`fade_future_bins:false` → no row fades) for
  every mode, plus dedicated coverage for `show_future_bins` hiding groups
  beyond tomorrow in timeline (never tested before this pass).
- Re-audited every other config option against the pre-rewrite
  implementation's exact per-mode scope (`highlight_today`, `show_header`,
  `show_next_summary`, `secondary_info`, `display_density`) — all confirmed
  to match; no further gaps found.

## v5.0.1

### Docs
- Added a "My Home Assistant" one-click badge to the README that opens the
  user's own HA instance with this repo pre-filled in HACS's "Add custom
  repository" dialog, so installing no longer requires manually typing the
  GitHub URL.

## v5.0.0 — full rewrite

A ground-up rewrite of the implementation. **No config changes required** —
every v4 YAML config works unmodified. The old vanilla-JS single file is
reference history only at this point; this release replaces it entirely.

### What changed (architecture)
- Rewritten in TypeScript on top of [Lit](https://lit.dev), with a real build
  pipeline (`esbuild`) producing the single bundled file HACS expects at the
  repo root. Source is split into `types`/`models`/`services`/`utils`/
  `renderers`/`card`/`styles` — see the Architecture section in README.md.
- The old hand-rolled "structural signature + manual DOM patch" anti-flicker
  system is gone, replaced by Lit's own template diffing plus keyed
  `repeat()` for bin lists. This isn't just a style change: it closes an
  entire bug class the old system was prone to (e.g. the v4.2.0 "stale 'no
  entity' warning" bug was a direct consequence of that manual patching
  model and can't recur under Lit, since every render re-evaluates the full
  template fresh).
- The popup is now a real Web Component (`<bin-collection-popup>`), appended
  to `document.body` like before (to escape any clipping ancestor), but
  reactive — async history loading just updates a property instead of
  manually replacing DOM nodes.
- The card now renders inside `<ha-card>` instead of a hand-styled `.card`
  div, picking up theme-aware background/border/shadow for free instead of
  re-implementing it via CSS variables.
- The visual editor's global settings now use HA's own `ha-form` (schema +
  selectors) instead of ~150 lines of hand-built `<div>`/`<select>` markup.
  Per-bin fields still use `ha-entity-picker`/`ha-icon-picker`/`ha-selector`
  directly (no plain-`<input>` fallback anymore — see "Dropped" below).
- `npm test` now builds the bundle and runs 60 headless-DOM assertions
  against the built artifact (jsdom), covering all five modes, the
  smart-summary state machine, tied-bin naming, fade/highlight/secondary_info
  config, badges, the planner and bin-detail popups (including real recorder
  history fetching), the missing-entity lifecycle, and the editor.

### Preserved (feature parity)
All five modes (`smart-summary`, `image-grid`, `row`, `timeline`, `compact`),
real bin images with icon fallback, `days_ahead` filtering, `show_all_bins`,
`show_future_bins`, `fade_future_bins`, header/title, the "Next: …" summary
line, the planner popup, the bin detail popup with real recorder history,
per-bin notes and action text, sorting, `secondary_info` (days/date/both),
`highlight_today` (off/subtle/strong), `display_density`, optional
delayed/changed badges, and HACS installation (same filename, same
`content_in_root` contract — existing installs update in place).

### Dropped (deliberately, and why)
- **Plain-`<input>` fallback in the editor** if `ha-entity-picker`/
  `ha-icon-picker`/`ha-selector`/`ha-form` aren't defined yet. The old card
  defended against this because it wasn't sure these lazy-loaded frontend
  components would be ready. In practice, by the time a user opens *any*
  Lovelace card editor, the surrounding dashboard-edit UI has already loaded
  these same components for its own "add card" flow — every other
  professional custom card relies on this. Dropping the fallback removes
  ~80 lines of defensive DOM-mounting code for a scenario that doesn't
  occur on any supported HA version.
- **`hass-more-info` fallback dispatch** on bin tap. It existed to handle an
  entity-lookup miss that could only happen with the old DOM-attribute-based
  tap handling; the new architecture binds click handlers directly to
  resolved bin objects via closures, so that failure mode no longer exists
  structurally.
- The shipped file is now a minified bundle (includes a vendored copy of
  Lit, to avoid any version conflict with HA's own internal Lit copy) rather
  than hand-written readable JS. Source remains fully readable in `src/`.

## v4.2.1

### Internal cleanup (no behaviour change for normal use)
- Config defaults (`show_header`, `popup`, `sort`, `show_future_bins`,
  `days_ahead`, `highlight_today`, `secondary_info`, `today_text`,
  `tomorrow_text`, etc.) are now applied once in `setConfig()` instead of
  being re-derived with `c.x !== false` / `c.x || default` in 20+ separate
  places across render/patch methods.
- The two popups (planner popup and bin detail popup) shared ~80% identical
  scaffolding — backdrop, sheet, drag handle, close button, Escape-key
  handling. Extracted into one `_popupShell()` builder so both can't drift
  out of sync with each other.
- The "next collection" bin card markup, previously written twice with
  slightly different optional fields, is now one `_popupBinCardHtml()` used
  by both popups. Side effect: the bin detail popup now also shows
  `collection_type`/`delay_note` if your integration exposes them, matching
  the planner popup (previously only `message`/`notes`/`action_text` showed
  there).
- The today/tomorrow/soon urgency classification for image-grid/row tiles
  was duplicated verbatim between the render and patch code paths; both now
  call one `_urgencyClass()` helper.
- No config keys, modes, or visible behaviour changed. Same 69-assertion
  test suite passes unmodified.

## v4.2.0

### Added
- **New `row` mode**: all displayed bins laid out in a single horizontal row
  (one column per bin), instead of image-grid's 2-column layout. Same tile
  content (image, name, days/date label, urgency dot, badges) — just a
  different arrangement, for dashboards with enough width to show every bin
  side by side.

### Fixed
- **Stale "no entity" warning after hass loads**: Home Assistant calls
  `setConfig()` on a card before `hass` is available. That first render
  marked every bin as missing (no data yet) and baked a "no entity" warning
  into each image-grid/compact tile's HTML. When `hass` arrived moments
  later, if the bin set hadn't changed shape, the renderer patched
  text/classes in place instead of rebuilding — and the patch path never
  removed that stale warning. This mostly surfaced when `days_ahead` was
  generous enough (or `show_all_bins` was set) that no bin ever got filtered
  out once real data loaded, since filtering being the only other thing that
  could force a rebuild was what hid the bug the rest of the time. The
  structural signature used to decide patch-vs-rebuild now also encodes
  whether each bin resolved to real data, so a bin flipping from
  missing→resolved always triggers a correct rebuild.

## v4.1.1

### Fixed
- v4.0.3 fixed smart-summary's main visual to show every bin tied for the
  soonest day, but three sibling spots were missed and still only named the
  first one: smart-summary's own "Next: …" line (shown under the Today/
  Missed/Tomorrow states), the shared "Next: …" header line used by
  image-grid/timeline, and compact mode's one-line summary. All four now
  consistently name every tied bin (e.g. "Next: Garden & Plastic in 8 days"
  instead of just "Next: Garden in 8 days").

## v4.1.0

### Added
- **Bin detail view**: tapping a bin's icon/image (in any mode, including
  compact — previously not individually tappable at all) now opens a detail
  popup instead of HA's native more-info dialog. It shows:
  - **Next collection**: the one confirmed date the integration gives us, plus
    notes/action hint/badges — no projection beyond it.
  - **Past collections**: up to the 4 most recent, found from real recorder
    history (detecting when the sensor's state actually transitioned to `0`).
    If your recorder doesn't retain history that far back, it says so plainly
    ("No collection history available yet") rather than fabricating dates.
    Deliberately does **not** project future dates from the historical
    pattern — only what's actually confirmed is shown.

## v4.0.3

### Fixed
- **compact mode**: the small bin images shown next to the dots didn't fade
  along with their dot — the dot would correctly dim for a far-future bin but
  its image stayed at full brightness. Both now fade together.
- **smart-summary Next Collection / No Collections This Week states**: when
  two or more bins were tied for the soonest day (e.g. Garden and Plastic both
  due in 9 days), only the first one was shown as the "main" bin and named in
  the subtitle. All bins sharing that soonest day now show together.

## v4.0.2

### Fixed
- v4.0.1's compact-mode dot fade was unconditional (always applied past a
  fixed 7-day cutoff), inconsistent with the other three modes where fading
  is opt-in per card via `fade_future_bins`. It's now gated the same way
  everywhere: `fade_future_bins:false` (the default) means no compact dot
  ever fades, and when enabled it uses the same `days_ahead/2` threshold as
  smart-summary/image-grid/timeline — configured per card, not globally.

## v4.0.1

### Fixed
- **compact mode**: every dot used the bin's full accent colour regardless of
  how far away the collection was, so a bin due today looked identical to one
  due in three weeks. Dots for bins due within the next 7 days ("this week",
  including today) now stay at full size/opacity; bins 7+ days out (or with no
  known date) are now smaller and faded (35% opacity) so the row reads as
  "what's close" at a glance instead of a flat row of equally-loud dots.

## v4.0.0 — Refinement pass

This is a refinement and maturation release, not a redesign. No breaking config
changes — a v3 config file works unmodified in v4 (see Migration below).

### Fixed (mandatory)
- **smart-summary subtitle bug**: the explanatory sentence ("Garden, Plastic and
  Paper are being collected today" / "General — put out tonight") was computed
  but a buggy conditional always rendered it as an empty string on exactly the
  Today and Tomorrow states. It now renders correctly.
- **Flicker**: every render used to do a full `shadowRoot.innerHTML` rebuild,
  recreating every image and `backdrop-filter` tile on each state change. The
  render pipeline now builds DOM once per structural shape (same bins in the
  same groups) and only patches text/classes on subsequent updates — images and
  blurred tiles are no longer recreated unless the bin grouping itself changes.
- **`secondary_info` was dead code** (computed, never rendered) — now actually
  renders `days` / `date` / `both` everywhere: smart-summary, image-grid,
  timeline, and the popup.
- **`highlight_today: strong` was identical to `subtle`** — `strong` now renders
  a coloured TODAY/TOMORROW pill instead of a small dot.

### Improved
- smart-summary now has six states instead of four: **Today**, **Missed**
  (new — negative `days_until_collection`), **Tomorrow**, **Next Collection**
  (2–6 days out), **No Collections This Week** (7+ days out, was "Next
  Collection" in v3 with no distinction), and **No Data** (no bin has a valid
  state at all).
- New `show_future_bins` config — toggles the "Next: …" line and the optional
  faded upcoming bins, independent of `fade_future_bins`.
- `fade_future_bins` now works in **smart-summary** and **timeline**, not just
  image-grid.
- Notes are now shown in the popup for **every** upcoming bin, not just today's.
- Popup gained optional fields that only appear if your integration exposes
  them: `collection_type`, `message` (council message), `delay_note`. If your
  integration doesn't expose these, nothing is shown — they are never invented.
- New optional `delayed` / `changed` boolean attributes, if exposed by your
  sensor, surface a small badge. UK Bin Collection does not currently expose
  these, so no badge will appear unless your integration (or a template
  sensor) adds them.
- Visual editor: entity field uses `ha-entity-picker`, icon field uses
  `ha-icon-picker`, image field uses `ha-selector` (image), colours are
  clickable swatches instead of a text dropdown, and bins can be reordered
  with ▲▼ buttons — all with a plain-input fallback if your frontend build
  doesn't expose those pickers.
- New optional `display_density` (`calm` / `balanced` / `rich`) controls how
  many additional faded upcoming bins are shown in the Next Collection state.

### Non-goals (explicitly out of scope for v4)
Collected/missed completion tracking, a manual task engine, helper-entity
persistence, weather logic, and council prediction logic were all intentionally
left out — they don't belong in a situational-awareness display.

## v3.0.0
- Added `smart-summary` mode (became default), anti-flicker state diffing,
  fuller visual editor.

## v2.0.0
- Complete rewrite from v1 (`ak-bin-collection-card`) — dark glassy per-bin
  backgrounds, real bin images, three display modes, visual config editor,
  proper HACS deployment.
