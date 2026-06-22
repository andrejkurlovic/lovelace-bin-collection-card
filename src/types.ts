// Shared type contracts used across the card. Kept dependency-free so every
// other module (models, services, renderers) can import from here without
// pulling in Lit or any rendering concern.

export type CardMode = 'smart-summary' | 'image-grid' | 'row' | 'timeline' | 'compact';
export type HighlightMode = 'off' | 'subtle' | 'strong';
export type SecondaryInfoMode = 'days' | 'date' | 'both';
export type DisplayDensity = 'calm' | 'balanced' | 'rich';
export type UrgencyClass = 'today' | 'tomorrow' | 'soon' | '';
export type SmartSummaryState = 'today' | 'missed' | 'tomorrow' | 'upcoming' | 'quiet' | 'unknown';

export interface BinConfig {
  name: string;
  entity: string;
  image?: string;
  icon?: string;
  color?: string;
  notes?: string;
  action_text?: string;
}

export interface CardConfig {
  type: string;
  title: string;
  mode: CardMode;
  days_ahead: number;
  show_header: boolean;
  show_next_summary: boolean;
  popup: boolean;
  sort: boolean;
  show_all_bins: boolean;
  show_future_bins: boolean;
  fade_future_bins: boolean;
  highlight_today: HighlightMode;
  secondary_info: SecondaryInfoMode;
  display_density: DisplayDensity;
  today_text: string;
  tomorrow_text: string;
  bins: BinConfig[];
}

// A config as authored by the user — every field but `bins` is optional;
// normalizeConfig() fills the rest in from CONFIG_DEFAULTS.
export type RawCardConfig = Partial<Omit<CardConfig, 'bins'>> & {
  type?: string;
  bins: BinConfig[];
};

// A bin merged with live hass state. `days` is the integer "days until
// collection" parsed from the entity's state (0 = today, negative = missed,
// null = state missing/unavailable/unknown/non-numeric).
export interface ResolvedBin extends BinConfig {
  days: number | null;
  nextDate: string | null;
  missing: boolean;
  delayed: boolean;
  changed: boolean;
  collectionType: string | null;
  message: string | null;
  delayNote: string | null;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

// Minimal slice of the HA frontend's `hass` object this card actually reads.
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callApi?<T>(method: string, path: string): Promise<T>;
  language?: string;
  themes?: unknown;
  [key: string]: unknown;
}

export interface HistoryPoint {
  state: string;
  last_changed: string;
}

export interface ColorTokens {
  bg: string;
  accent: string;
  glow: string;
}
