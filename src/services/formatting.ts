import type { CardConfig, DisplayDensity, ResolvedBin, SecondaryInfoMode } from '../types';
import { formatDate, friendlyDate, parseISODate } from '../utils/dates';

export function daysLabel(days: number | null, config: Pick<CardConfig, 'today_text' | 'tomorrow_text'>): string {
  if (days == null || isNaN(days)) return '—';
  if (days === 0) return config.today_text;
  if (days === 1) return config.tomorrow_text;
  if (days < 0) return 'Missed collection';
  return `in ${days} days`;
}

// Shorter phrase for chips/tiles combined with a date ("7 days • Tue 30 Jun").
export function daysPhrase(days: number | null, config: Pick<CardConfig, 'today_text' | 'tomorrow_text'>): string {
  if (days == null || isNaN(days)) return '—';
  if (days === 0) return config.today_text;
  if (days === 1) return config.tomorrow_text;
  if (days < 0) return 'Missed';
  return `${days} days`;
}

// secondary_info: 'days' | 'date' | 'both'.
export function dateText(bin: ResolvedBin, mode: SecondaryInfoMode, config: Pick<CardConfig, 'today_text' | 'tomorrow_text'>): string {
  const phrase = daysPhrase(bin.days, config);
  const parsed = parseISODate(bin.nextDate);
  const dateStr = parsed ? friendlyDate(parsed) : bin.days != null ? formatDate(bin.days) : '';
  if (mode === 'date') return dateStr || phrase;
  if (mode === 'both') return dateStr ? `${phrase} • ${dateStr}` : phrase;
  return phrase;
}

export function listNames(bins: ResolvedBin[]): string {
  if (!bins.length) return '';
  if (bins.length === 1) return bins[0].name;
  if (bins.length === 2) return `${bins[0].name} & ${bins[1].name}`;
  const last = bins[bins.length - 1].name;
  const rest = bins.slice(0, -1).map((b) => b.name).join(', ');
  return `${rest} & ${last}`;
}

export function firstActionText(bins: ResolvedBin[]): string | null {
  return bins.find((b) => b.action_text)?.action_text ?? null;
}

export function densityFutureCap(density: DisplayDensity): number {
  if (density === 'calm') return 0;
  if (density === 'rich') return 2;
  return 1; // balanced
}
