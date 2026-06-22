# Changelog

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
