import type { CardConfig, ResolvedBin } from '../types';

export function sortBins(bins: ResolvedBin[]): ResolvedBin[] {
  return [...bins].sort((a, b) => {
    if (a.days == null) return 1;
    if (b.days == null) return -1;
    return a.days - b.days;
  });
}

// Filtering applied for image-grid/row/timeline/compact — smart-summary works
// off the full resolved list so its Quiet/Unknown fallback can see beyond
// days_ahead.
export function filterForDisplay(bins: ResolvedBin[], config: CardConfig): ResolvedBin[] {
  if (config.show_all_bins) return bins;
  return bins.filter((b) => b.days == null || b.days <= config.days_ahead);
}

export type DateGroup = { days: number | null; bins: ResolvedBin[] };

export function groupByDate(bins: ResolvedBin[]): DateGroup[] {
  const map = new Map<number | null, ResolvedBin[]>();
  for (const bin of bins) {
    const list = map.get(bin.days);
    if (list) list.push(bin);
    else map.set(bin.days, [bin]);
  }
  return [...map.entries()]
    .map(([days, group]) => ({ days, bins: group }))
    .sort((a, b) => Number(a.days) - Number(b.days));
}
