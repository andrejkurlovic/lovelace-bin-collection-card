import type { CardConfig, ResolvedBin, UrgencyClass } from '../types';

// today / tomorrow / soon (2-3 days) / none. Shared by every renderer that
// needs an urgency class so they can never compute it differently from
// one another.
export function urgencyClass(bin: ResolvedBin): UrgencyClass {
  if (bin.days === 0) return 'today';
  if (bin.days === 1) return 'tomorrow';
  if (bin.days != null && bin.days > 1 && bin.days <= 3) return 'soon';
  return '';
}

export function fadeThreshold(config: CardConfig): number {
  return config.days_ahead / 2;
}

export function isFaded(bin: ResolvedBin, config: CardConfig): boolean {
  return config.fade_future_bins && bin.days != null && bin.days > fadeThreshold(config);
}

export function isToday(bin: ResolvedBin): boolean {
  return bin.days === 0;
}

export function isMissed(bin: ResolvedBin): boolean {
  return bin.days != null && bin.days < 0;
}

export function isTomorrow(bin: ResolvedBin): boolean {
  return bin.days === 1;
}

export function hasBadges(bin: ResolvedBin): boolean {
  return bin.delayed || bin.changed;
}
