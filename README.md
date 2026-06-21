# Bin Collection Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

A situational-awareness Home Assistant Lovelace card for UK bin/waste collection
schedules. It answers one question: **what do I need to do today, and what's
next?** Dark glassy design, four display modes, a full visual editor, and a
popup that doubles as a quick planner.

## Features

- **Four modes**: `smart-summary` (default), `image-grid`, `timeline`, `compact`
- **smart-summary** has six states: Collection Day, Missed Collection, Prepare
  Tonight, Next Collection, No Collections This Week, No Data
- **Real bin images** as the primary visual — with icon fallback
- **Dark glassy per-bin backgrounds** (tinted by bin colour)
- **Subtle or strong urgency indicators** for Today/Tomorrow
- **Visual config editor** — native entity/icon/image pickers, colour swatches,
  drag-free up/down bin reordering
- **Popup** — Today + Upcoming sections, acts as a lightweight planner/detail
  view, shows notes for every bin (not just today's)
- **Optional badges** (Delayed/Changed) — only shown if your integration
  actually exposes that data; never invented
- **Sorts by soonest** collection automatically
- **Fade/hide future bins** — `fade_future_bins` and `show_future_bins`, now
  working in every mode
- **HA theme aware** — uses CSS variables throughout

## Installation via HACS

1. Go to **HACS → Frontend → Custom Repositories**
2. Add `https://github.com/andrejkurlovic/lovelace-bin-collection-card` as type **Lovelace**
3. Find **Bin Collection Card** and install
4. Hard refresh your browser (Ctrl+Shift+R)

## Manual Installation

Copy `lovelace-bin-collection-card.js` to `/config/www/community/lovelace-bin-collection-card/` and register the Lovelace resource:

```yaml
url: /local/community/lovelace-bin-collection-card/lovelace-bin-collection-card.js
type: module
```

## Configuration

```yaml
type: custom:bin-collection-card
title: Bin Collection
mode: smart-summary       # smart-summary | image-grid | timeline | compact
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
| `mode` | enum | `smart-summary` | `smart-summary` \| `image-grid` \| `timeline` \| `compact` |
| `days_ahead` | number | `14` | bins beyond this are hidden unless `show_all_bins` |
| `show_header` | boolean | `true` | |
| `show_next_summary` | boolean | `true` | the "Next: …" line under the header in image-grid/timeline |
| `popup` | boolean | `true` | tap header to open the popup |
| `sort` | boolean | `true` | sort bins by soonest |
| `show_all_bins` | boolean | `false` | bypass `days_ahead` filtering entirely |
| `show_future_bins` | boolean | `true` | show the "Next: …" line and optional faded upcoming bins; hide groups beyond tomorrow in timeline |
| `fade_future_bins` | boolean | `false` | fade bins further than half of `days_ahead` away — works in smart-summary, image-grid, timeline |
| `highlight_today` | enum | `subtle` | `off` \| `subtle` (dot) \| `strong` (coloured TODAY/TOMORROW pill) |
| `secondary_info` | enum | `days` | `days` ("in 7 days") \| `date` ("Tue 30 Jun") \| `both` ("7 days • Tue 30 Jun") |
| `display_density` | enum | `balanced` | `calm` (0) \| `balanced` (1) \| `rich` (2) — how many extra faded bins show in the Next Collection state |
| `today_text` / `tomorrow_text` | string | `Today` / `Tomorrow` | |

### Per-bin config

| key | type | notes |
|---|---|---|
| `name` | string | required |
| `entity` | string | required — sensor whose state is days-until-collection |
| `image` | string | optional, falls back to `icon` |
| `icon` | string | mdi icon, default `mdi:delete` |
| `color` | enum | see Colours below |
| `notes` | string | shown in the popup for every state this bin appears in |
| `action_text` | string | shown as the action hint when this bin is in the "main" group |

## Colours

`grey` `green` `burgundy` `beige` `blue` `brown` `black` `red` `yellow` `purple` `orange` `pink` `silver` `amber` `teal` `navy` `lime` `white`

## Sensor Requirements

Each `entity` must have state = number of days until collection (`0` = today,
negative = missed). Optional attributes, read if present and otherwise
skipped — never invented or inferred:

- `next_collection` (ISO date `YYYY-MM-DD`) — exact date for popup/secondary_info
- `delayed` (boolean) — shows a "Delayed" badge
- `changed` (boolean) — shows a "Changed" badge
- `collection_type` (string) — shown in the popup
- `message` (string) — council message, shown in the popup
- `delay_note` (string) — shown in the popup with a ⚠ prefix

Compatible with [UK Bin Collection](https://github.com/robbrad/UKBinCollectionData)
via HACS. That integration does not currently expose `delayed`/`changed`/
`collection_type`/`message`/`delay_note`, so those fields simply won't appear
unless you add them via a template sensor wrapper — the card never fabricates
this data.

## Migration from v3

No breaking changes. Existing v3 configs work unmodified — `mode: smart-summary`
behaves the same in the states it already had (Today/Tomorrow/Next/Quiet), plus:

- the smart-summary subtitle now actually renders (it was silently dropped in v3)
- `secondary_info` and `highlight_today: strong` now do something (they were
  dead/no-op in v3) — if you had them set, you'll see a visible change
- a new "Missed Collection" state appears automatically if a sensor ever
  reports a negative days-until value
- new optional keys (`show_future_bins`, `display_density`) default to values
  that preserve v3's behaviour

## Migration from ak-bin-collection-card (v1)

Change `type: custom:ak-bin-collection-card` → `type: custom:bin-collection-card`.
All other config keys are the same.

## Testing

`npm test` runs a headless DOM smoke test (jsdom) covering the subtitle fix,
all six smart-summary states, secondary_info rendering, badge gating, popup
notes, the visual editor, and — most importantly — element-identity checks
proving that unrelated bins' images/tiles are not recreated on a same-structure
update (the flicker fix).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
