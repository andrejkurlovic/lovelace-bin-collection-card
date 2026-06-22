// Minimal ambient typings for HA frontend custom elements this card uses
// directly. We don't depend on the (unpublished-as-npm) home-assistant-frontend
// package; these are just enough surface for TypeScript to check our usage.
import type { HomeAssistant } from './types';

export interface HaFormSchema {
  name: string;
  selector: Record<string, unknown>;
  required?: boolean;
}

export interface HaFormElement extends HTMLElement {
  hass?: HomeAssistant;
  data?: Record<string, unknown>;
  schema?: HaFormSchema[];
  computeLabel?: (schema: HaFormSchema) => string;
}

export interface HaEntityPickerElement extends HTMLElement {
  hass?: HomeAssistant;
  value?: string;
  includeDomains?: string[];
}

export interface HaIconPickerElement extends HTMLElement {
  hass?: HomeAssistant;
  value?: string;
}

export interface HaSelectorElement extends HTMLElement {
  hass?: HomeAssistant;
  value?: unknown;
  selector?: Record<string, unknown>;
}

declare global {
  interface HTMLElementTagNameMap {
    'ha-form': HaFormElement;
    'ha-entity-picker': HaEntityPickerElement;
    'ha-icon-picker': HaIconPickerElement;
    'ha-selector': HaSelectorElement;
  }
}
