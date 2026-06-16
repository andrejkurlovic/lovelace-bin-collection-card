# Bin Collection Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

A clean, modern Home Assistant Lovelace card for UK bin/waste collection schedules. Dark glassy design matching your existing dashboard. Three display modes, visual config editor, and a smooth timeline popup.

## Features

- **Three modes**: `image-grid` (default), `timeline`, `compact-summary`
- **Real bin images** as the primary visual — with icon fallback
- **Dark glassy per-bin backgrounds** (tinted by bin colour)
- **Subtle urgency indicators** — small badge for Today/Tomorrow/Soon, no loud red blocks
- **Visual config editor** — add/remove bins, set entity, image, colour, notes
- **Popup timeline** — tap the header to see all upcoming collections
- **Sorts by soonest** collection automatically
- **Hides bins** beyond `days_ahead` threshold
- **Notes per bin** — shown in popup (e.g. "Pull to kerb by 7am")
- **Missing entity warning** shown in-card
- **HA theme aware** — uses CSS variables throughout

## Installation via HACS

1. Go to **HACS → Frontend → Custom Repositories**
2. Add `https://github.com/andrejkurlovic/lovelace-bin-collection-card`  as type **Lovelace**
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
mode: image-grid       # image-grid | timeline | compact
days_ahead: 14
show_header: true
show_next_summary: true
popup: true
sort: true

bins:
  - name: General
    entity: sensor.hollinshome_140l_grey_rubbish_bin_days_until_collection
    image: /local/images/bin_general.png
    color: grey
    icon: mdi:delete
    notes: "Collection from kerb"

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

## Colours

`grey` `green` `burgundy` `beige` `blue` `brown` `black` `red` `yellow` `purple` `orange` `pink` `silver` `amber` `teal` `navy` `lime` `white`

## Sensor Requirements

Each `entity` must have state = number of days until collection (`0` = today).  
Optional attribute `next_collection` (ISO date `YYYY-MM-DD`) for accurate popup dates.

Compatible with [UK Bin Collection](https://github.com/robbrad/UKBinCollectionData) via HACS.

## Migration from ak-bin-collection-card

Change `type: custom:ak-bin-collection-card` → `type: custom:bin-collection-card`.  
All other config keys are the same.

## Changelog

### v2.0.0
- Complete rewrite — dark glassy per-bin backgrounds
- Real bin images as primary visual (icon fallback)
- Three display modes: image-grid, timeline, compact
- Visual config editor (`getConfigElement`)
- Subtle urgency badges instead of full-card red backgrounds
- Popup: Today section + upcoming timeline + per-bin notes
- Proper HACS deployment via GitHub releases
- Sort by soonest, hide beyond days_ahead, missing entity warning
