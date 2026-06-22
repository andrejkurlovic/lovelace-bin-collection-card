# Bin Collection Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/v/release/andrejkurlovic/lovelace-bin-collection-card)](https://github.com/andrejkurlovic/lovelace-bin-collection-card/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A situational-awareness [Home Assistant](https://www.home-assistant.io/) Lovelace
card for UK bin/waste collection schedules. It answers one question:

> **What do I need to do today, and what's next?**

Dark glassy design, five display modes, a native visual editor built on HA's
own form components, and a popup that doubles as a quick planner.

This is **not** a bin management system — there's no completion tracking,
no manual task engine, no weather or council-prediction logic. It's a calm,
glanceable display, by design.

## Features

- **Five modes**: `smart-summary` (default), `image-grid`, `row`, `timeline`, `compact`
- **smart-summary** has six states: Collection Day, Missed Collection, Prepare
  Tonight, Next Collection, No Collections This Week, No Data
- Real bin images as the primary visual, with an icon fallback
- Dark glassy per-bin backgrounds, tinted by bin colour
- Subtle or strong urgency indicators for Today/Tomorrow
- Native visual editor — `ha-form` for global settings, `ha-entity-picker` /
  `ha-icon-picker` / `ha-selector` for per-bin fields, colour swatches, and
  drag-free bin reordering
- Popup planner (Today + Upcoming) and a per-bin detail view showing the next
  confirmed collection plus real recorder history — never projected or
  invented data
- Optional Delayed/Changed badges, shown only if your integration actually
  exposes that data
- Sorts by soonest collection automatically
- Fade or hide future bins, independently configurable, working identically
  across every mode
- Fully theme-aware (built on `<ha-card>` and HA's CSS variables)

## Installation

### HACS (recommended)

1. HACS → Frontend → ⋮ → Custom repositories → add
   `https://github.com/andrejkurlovic/lovelace-bin-collection-card`
2. Find **Bin Collection Card** in HACS and install it
3. Hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

### Manual

Copy `lovelace-bin-collection-card.js` to
`/config/www/community/lovelace-bin-collection-card/` and register it as a
Lovelace resource:

```yaml
url: /local/community/lovelace-bin-collection-card/lovelace-bin-collection-card.js
type: module
```

## Configuration

Add the card via the UI (search for "Bin Collection Card" in the card picker
— it has a full visual editor) or with YAML:

```yaml
type: custom:bin-collection-card
title: Bin Collection
mode: smart-summary       # smart-summary | image-grid | row | timeline | compact
days_ahead: 14
show_header: true
show_next_summary: true
popup: true
sort: true
show_all_bins: false
show_future_bins: true
fade_future_bins: false
highlight_today: subtle   # off | subtle | strong
secondary_info: days      # days | date | both
display_density: balanced # calm | balanced | rich
today_text: Today
tomorrow_text: Tomorrow

bins:
  - name: General
    entity: sensor.hollinshome_140l_grey_rubbish_bin_days_until_collection
    image: /local/images/bin_general.png
    color: grey
    icon: mdi:delete
    notes: "Collection from kerb"
    action_text: "Put out after 7pm"

  - name: Garden
    entity: sensor.hollinshome_240l_green_garden_bin_days_until_collection
    image: /local/images/bin_garden.png
    color: green
    icon: mdi:leaf

  - name: Plastic
    entity: sensor.hollinshome_240l_burgundy_plastic_bin_days_until_collection
    image: /local/images/bin_plastic.png
    color: burgundy
    icon: mdi:recycle

  - name: Paper
    entity: sensor.hollinshome_240l_beige_recycling_bin_days_until_collection
    image: /local/images/bin_paper.png
    color: beige
    icon: mdi:newspaper-variant
```

### Global config

| key | type | default | notes |
|---|---|---|---|
| `title` | string | `Bin Collection` | |
| `mode` | enum | `smart-summary` | `smart-summary` \| `image-grid` \| `row` \| `timeline` \| `compact` |
| `days_ahead` | number | `14` | bins beyond this are hidden unless `show_all_bins` |
| `show_header` | boolean | `true` | |
| `show_next_summary` | boolean | `true` | the "Next: …" line under the header in image-grid/row/timeline |
| `popup` | boolean | `true` | tap header to open the planner popup |
| `sort` | boolean | `true` | sort bins by soonest |
| `show_all_bins` | boolean | `false` | bypass `days_ahead` filtering entirely |
| `show_future_bins` | boolean | `true` | show the "Next: …" line / faded upcoming bins; hide groups beyond tomorrow in timeline |
| `fade_future_bins` | boolean | `false` | fade bins further than half of `days_ahead` away — works in every mode |
| `highlight_today` | enum | `subtle` | `off` \| `subtle` (dot) \| `strong` (coloured TODAY/TOMORROW pill) |
| `secondary_info` | enum | `days` | `days` ("in 7 days") \| `date` ("Tue 30 Jun") \| `both` |
| `display_density` | enum | `balanced` | `calm` (0) \| `balanced` (1) \| `rich` (2) — extra faded bins shown in the Next Collection state |
| `today_text` / `tomorrow_text` | string | `Today` / `Tomorrow` | |

### Per-bin config

| key | type | notes |
|---|---|---|
| `name` | string | required |
| `entity` | string | required — sensor whose state is days-until-collection |
| `image` | string | optional, falls back to `icon` |
| `icon` | string | mdi icon, default `mdi:delete` |
| `color` | enum | see Colours below |
| `notes` | string | shown in the popup |
| `action_text` | string | shown as the action hint when this bin is in the "main" group |

## Colours

`grey` `green` `burgundy` `beige` `blue` `brown` `black` `red` `yellow`
`purple` `orange` `pink` `silver` `amber` `teal` `navy` `lime` `white`

A few category aliases also work in YAML (not shown as separate swatches in
the editor): `gray`, `garden`, `plastic`, `paper`, `recycling`.

## Sensor requirements

Each `entity` must have state = number of days until collection (`0` = today,
negative = missed). Optional attributes are read if present and otherwise
skipped — never invented or inferred:

- `next_collection` (ISO date `YYYY-MM-DD`) — exact date for popup/secondary_info
- `delayed` (boolean) — shows a "Delayed" badge
- `changed` (boolean) — shows a "Changed" badge
- `collection_type` (string) — shown in the popup
- `message` (string) — council message, shown in the popup
- `delay_note` (string) — shown in the popup with a ⚠ prefix

Compatible with [UK Bin Collection](https://github.com/robbrad/UKBinCollectionData)
via HACS. That integration does not currently expose `delayed`/`changed`/
`collection_type`/`message`/`delay_note`, so those fields won't appear unless
you add them via a template sensor — this card never fabricates that data.

## Tap behaviour

- **Header tap** → opens the planner popup (Today + Upcoming), if `popup: true`.
- **Bin tap** (any mode, including compact) → opens that bin's detail view:
  its next confirmed collection plus up to 4 past collections from Home
  Assistant's recorder history. Depth depends entirely on your recorder's
  retention — short retention means fewer entries or none, never fabricated.

## Architecture

Rewritten in v5 as a proper TypeScript + [Lit](https://lit.dev) custom
element, bundled with [esbuild](https://esbuild.github.io) into the single
file HACS expects at the repo root. Source is modular:

```
src/
  index.ts                 # entry point — registers the card + window.customCards
  types.ts                 # shared type contracts
  models/                  # domain types + pure domain logic (config defaults, urgency/fade rules)
  services/                # framework-free business logic (parsing, sorting, formatting, history, smart-summary state machine)
  utils/                   # small pure helpers (dates, colours, event dispatch)
  renderers/                # one Lit template function per display mode + shared fragments
  card/                     # the LitElement card, editor, and popup web components
  styles/                   # css`` tagged templates
```

Rendering relies on Lit's own template diffing (plus keyed `repeat()` for bin
lists) instead of hand-rolled DOM patching, and the card still short-circuits
on `hass` updates that don't touch any of its entities — both for
performance and to avoid full dashboard re-renders that aren't needed.

## Development

```bash
npm install
npm run build      # bundles src/ into lovelace-bin-collection-card.js
npm run watch       # rebuilds on change
npm run typecheck   # tsc --noEmit
npm test            # build + headless DOM smoke tests (jsdom)
```

## Migration from v4

No config changes required — every v4 YAML config works unmodified in v5.
v5 is a from-scratch internal rewrite (TypeScript + Lit instead of vanilla
JS, a real build pipeline, a native `ha-form`-based editor); the on-screen
behaviour and config schema are unchanged except where noted in
[CHANGELOG.md](CHANGELOG.md).

## Contributing

Issues and PRs welcome. Please run `npm test` and `npm run typecheck` before
submitting — both must pass.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
