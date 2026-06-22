import type { CardConfig, ResolvedBin, SmartSummaryState } from '../types';
import { daysLabel, densityFutureCap, firstActionText, listNames } from './formatting';

export interface SmartSummaryResult {
  state: SmartSummaryState;
  headerTitle: string;
  headerSub: string;
  actionHint: string | null;
  mainBins: ResolvedBin[];
  nextLine: string | null;
  extraBins: ResolvedBin[];
}

// Pure state machine — given the full resolved bin list (unfiltered by
// days_ahead, since the Quiet/Unknown fallback needs to see beyond it),
// decides which of the six smart-summary states applies and what to show.
// Deliberately framework-free so it can be unit tested without any DOM.
export function computeSmartSummaryState(resolved: ResolvedBin[], config: CardConfig): SmartSummaryResult {
  const todayBins = resolved.filter((b) => b.days === 0);
  const missedBins = resolved.filter((b) => b.days != null && b.days < 0);
  const tomorrowBins = resolved.filter((b) => b.days === 1);
  const restSorted = resolved.filter((b) => b.days != null && b.days > 1); // already sorted by caller
  const nextOverall = restSorted[0] ?? null;

  // Group every bin sharing the soonest "next" day, not just the first one —
  // a tie between e.g. Garden and Plastic both due in 9 days should show
  // both, not just Garden.
  const nextGroup = nextOverall ? restSorted.filter((b) => b.days === nextOverall.days) : [];
  const furtherBins = nextOverall ? restSorted.filter((b) => b.days !== nextOverall.days) : [];

  let state: SmartSummaryState;
  let headerTitle: string;
  let headerSub: string;
  let actionHint: string | null;
  let mainBins: ResolvedBin[];

  if (todayBins.length) {
    state = 'today';
    headerTitle = 'Collection Day';
    headerSub = `${listNames(todayBins)} ${todayBins.length > 1 ? 'are' : 'is'} being collected today`;
    actionHint = firstActionText(todayBins);
    mainBins = todayBins;
  } else if (missedBins.length) {
    state = 'missed';
    headerTitle = 'Missed Collection';
    headerSub = `${listNames(missedBins)} ${missedBins.length > 1 ? 'were' : 'was'} not collected — check with your council`;
    actionHint = firstActionText(missedBins);
    mainBins = missedBins;
  } else if (tomorrowBins.length) {
    state = 'tomorrow';
    headerTitle = 'Prepare Tonight';
    headerSub = `${listNames(tomorrowBins)} ${tomorrowBins.length > 1 ? 'are' : 'is'} collected tomorrow`;
    actionHint = firstActionText(tomorrowBins) || 'Put out tonight';
    mainBins = tomorrowBins;
  } else if (nextOverall && nextOverall.days! < 7) {
    state = 'upcoming';
    headerTitle = 'Next Collection';
    headerSub = `${listNames(nextGroup)} ${nextGroup.length > 1 ? 'are' : 'is'} due ${daysLabel(nextOverall.days, config)}`;
    actionHint = firstActionText(nextGroup);
    mainBins = nextGroup;
  } else if (nextOverall) {
    state = 'quiet';
    headerTitle = 'No Collections This Week';
    headerSub = `Next known: ${listNames(nextGroup)} ${nextGroup.length > 1 ? 'are' : 'is'} due ${daysLabel(nextOverall.days, config)}`;
    actionHint = null;
    mainBins = nextGroup;
  } else {
    state = 'unknown';
    headerTitle = 'No Data';
    headerSub = 'Check your bin sensors';
    actionHint = null;
    mainBins = [];
  }

  let nextLine: string | null = null;
  if ((state === 'today' || state === 'missed' || state === 'tomorrow') && nextOverall && config.show_future_bins) {
    nextLine = `Next: ${listNames(nextGroup)} ${daysLabel(nextOverall.days, config)}`;
  }

  let extraBins: ResolvedBin[] = [];
  if (state === 'upcoming' && config.show_future_bins) {
    extraBins = furtherBins.slice(0, densityFutureCap(config.display_density));
  }

  return { state, headerTitle, headerSub, actionHint, mainBins, nextLine, extraBins };
}
