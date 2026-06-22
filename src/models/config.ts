import type { BinConfig, CardConfig, RawCardConfig } from '../types';

export const CARD_TYPE = 'bin-collection-card';

export const CONFIG_DEFAULTS: Omit<CardConfig, 'type' | 'bins'> = {
  title: 'Bin Collection',
  mode: 'smart-summary',
  days_ahead: 14,
  show_header: true,
  show_next_summary: true,
  popup: true,
  sort: true,
  show_all_bins: false,
  show_future_bins: true,
  fade_future_bins: false,
  highlight_today: 'subtle',
  secondary_info: 'days',
  display_density: 'balanced',
  today_text: 'Today',
  tomorrow_text: 'Tomorrow',
};

export function normalizeConfig(raw: RawCardConfig): CardConfig {
  if (!raw.bins || !raw.bins.length) {
    throw new Error('bin-collection-card: at least one bin is required');
  }
  return {
    type: raw.type ?? `custom:${CARD_TYPE}`,
    ...CONFIG_DEFAULTS,
    ...raw,
    bins: raw.bins,
  };
}

export function createBin(): BinConfig {
  return { name: 'New Bin', entity: '', color: 'grey', icon: 'mdi:delete' };
}

export function getStubConfig(): RawCardConfig {
  return {
    title: 'Bin Collection',
    mode: 'smart-summary',
    days_ahead: 14,
    bins: [
      { name: 'General', entity: 'sensor.general_bin_days', image: '/local/images/bin_general.png', color: 'grey', icon: 'mdi:delete' },
      { name: 'Garden', entity: 'sensor.garden_bin_days', image: '/local/images/bin_garden.png', color: 'green', icon: 'mdi:leaf' },
      { name: 'Plastic', entity: 'sensor.plastic_bin_days', image: '/local/images/bin_plastic.png', color: 'burgundy', icon: 'mdi:recycle' },
      { name: 'Paper', entity: 'sensor.paper_bin_days', image: '/local/images/bin_paper.png', color: 'beige', icon: 'mdi:newspaper-variant' },
    ],
  };
}
