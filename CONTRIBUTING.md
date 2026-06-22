# Contributing

## Setup

```bash
git clone https://github.com/andrejkurlovic/lovelace-bin-collection-card
cd lovelace-bin-collection-card
npm install
```

## Workflow

- `npm run watch` while developing — rebuilds `lovelace-bin-collection-card.js` on change.
- `npm run typecheck` — must pass with zero errors.
- `npm test` — builds and runs the headless DOM smoke suite; must pass with zero failures.

## Guidelines

- Keep modules single-purpose: `services/` has no Lit/DOM dependency, `renderers/`
  has no business logic, `card/` wires the two together.
- No dead config — every option in `types.ts`/`CardConfig` must be read by at
  least one renderer or service.
- Don't invent or project data from an integration that doesn't expose it.
  Optional fields render only if present.
- Add a test alongside any behavioural change. `test/smoke.js` is the only
  test suite — there's no separate unit/integration split.

## Pull requests

Please describe what changed and why, and confirm `npm run typecheck && npm test`
passes locally.
