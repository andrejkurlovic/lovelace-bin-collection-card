import type { BinConfig, CardConfig, HomeAssistant, ResolvedBin } from '../types';
import { sortBins } from './sorting';

function resolveOne(bin: BinConfig, hass: HomeAssistant | undefined): ResolvedBin {
  const state = hass && bin.entity ? hass.states[bin.entity] : undefined;
  const parsedDays = state ? parseInt(state.state, 10) : NaN;
  const days = state && !isNaN(parsedDays) ? parsedDays : null;
  const attrs = state?.attributes ?? {};
  return {
    ...bin,
    days,
    nextDate: (attrs.next_collection as string) || null,
    missing: !state,
    delayed: attrs.delayed === true,
    changed: attrs.changed === true,
    collectionType: (attrs.collection_type as string) || null,
    message: (attrs.message as string) || null,
    delayNote: (attrs.delay_note as string) || null,
  };
}

// Resolves the full configured bin list against live hass state. Unfiltered
// by days_ahead — callers that need the display-filtered subset should run
// the result through filterForDisplay().
export function resolveBins(hass: HomeAssistant | undefined, config: CardConfig): ResolvedBin[] {
  const resolved = config.bins.map((b) => resolveOne(b, hass));
  return config.sort ? sortBins(resolved) : resolved;
}

// Cheap fingerprint of everything this card actually reads from hass, used to
// skip re-rendering entirely when an unrelated entity update ticks `hass`.
export function stateHash(hass: HomeAssistant | undefined, bins: BinConfig[]): string {
  if (!hass) return '';
  return bins
    .map((b) => {
      const s = b.entity ? hass.states[b.entity] : undefined;
      if (!s) return 'x';
      const a = s.attributes ?? {};
      return [
        s.state,
        (a.next_collection as string) || '',
        a.delayed ? '1' : '0',
        a.changed ? '1' : '0',
        (a.collection_type as string) || '',
        (a.message as string) || '',
        (a.delay_note as string) || '',
      ].join('|');
    })
    .join(',');
}
