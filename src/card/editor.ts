import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CardConfig, HomeAssistant, RawCardConfig } from '../types';
import type { HaFormSchema } from '../ha-types';
import { createBin, normalizeConfig } from '../models/config';
import { fireConfigChanged } from '../utils/actions';
import { PRIMARY_COLORS, colorFor } from '../utils/entities';
import { editorStyles } from '../styles/editor';

const MODE_OPTIONS = [
  { value: 'smart-summary', label: 'Smart summary' },
  { value: 'image-grid', label: 'Image grid' },
  { value: 'row', label: 'Row (single line)' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'compact', label: 'Compact' },
];

const HIGHLIGHT_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'subtle', label: 'Subtle (dot)' },
  { value: 'strong', label: 'Strong (pill)' },
];

const SECONDARY_OPTIONS = [
  { value: 'days', label: 'Days ("in 7 days")' },
  { value: 'date', label: 'Date ("Tue 30 Jun")' },
  { value: 'both', label: 'Both' },
];

const DENSITY_OPTIONS = [
  { value: 'calm', label: 'Calm' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'rich', label: 'Rich' },
];

const SCHEMA: HaFormSchema[] = [
  { name: 'title', selector: { text: {} } },
  { name: 'mode', selector: { select: { mode: 'dropdown', options: MODE_OPTIONS } } },
  { name: 'days_ahead', selector: { number: { min: 1, max: 60, mode: 'box' } } },
  { name: 'show_header', selector: { boolean: {} } },
  { name: 'show_next_summary', selector: { boolean: {} } },
  { name: 'popup', selector: { boolean: {} } },
  { name: 'sort', selector: { boolean: {} } },
  { name: 'show_all_bins', selector: { boolean: {} } },
  { name: 'show_future_bins', selector: { boolean: {} } },
  { name: 'fade_future_bins', selector: { boolean: {} } },
  { name: 'highlight_today', selector: { select: { mode: 'dropdown', options: HIGHLIGHT_OPTIONS } } },
  { name: 'secondary_info', selector: { select: { mode: 'dropdown', options: SECONDARY_OPTIONS } } },
  { name: 'display_density', selector: { select: { mode: 'dropdown', options: DENSITY_OPTIONS } } },
  { name: 'today_text', selector: { text: {} } },
  { name: 'tomorrow_text', selector: { text: {} } },
];

const LABELS: Record<string, string> = {
  title: 'Title',
  mode: 'Mode',
  days_ahead: 'Days ahead',
  show_header: 'Show header',
  show_next_summary: 'Show "Next: …" line',
  popup: 'Tap header to open popup',
  sort: 'Sort bins by soonest',
  show_all_bins: 'Show all bins (ignore days ahead)',
  show_future_bins: 'Show future bins',
  fade_future_bins: 'Fade future bins',
  highlight_today: 'Highlight today/tomorrow',
  secondary_info: 'Secondary info',
  display_density: 'Density',
  today_text: 'Today label',
  tomorrow_text: 'Tomorrow label',
};

@customElement('bin-collection-card-editor')
export class BinCollectionCardEditor extends LitElement {
  static styles = editorStyles;

  @state() private _config?: CardConfig;
  private _hass?: HomeAssistant;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.requestUpdate();
  }
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(raw: RawCardConfig): void {
    this._config = normalizeConfig(raw);
  }

  private _computeLabel = (schema: HaFormSchema): string => LABELS[schema.name] ?? schema.name;

  private _formChanged(e: CustomEvent<{ value: Record<string, unknown> }>): void {
    e.stopPropagation();
    if (!this._config) return;
    this._config = { ...this._config, ...e.detail.value } as CardConfig;
    fireConfigChanged(this, this._config);
  }

  private _updateBin(index: number, field: string, value: string): void {
    if (!this._config) return;
    const bins = [...this._config.bins];
    bins[index] = { ...bins[index], [field]: value };
    this._config = { ...this._config, bins };
    fireConfigChanged(this, this._config);
  }

  private _moveBin(index: number, dir: -1 | 1): void {
    if (!this._config) return;
    const target = index + dir;
    if (target < 0 || target >= this._config.bins.length) return;
    const bins = [...this._config.bins];
    [bins[index], bins[target]] = [bins[target], bins[index]];
    this._config = { ...this._config, bins };
    fireConfigChanged(this, this._config);
  }

  private _deleteBin(index: number): void {
    if (!this._config) return;
    const bins = [...this._config.bins];
    bins.splice(index, 1);
    this._config = { ...this._config, bins };
    fireConfigChanged(this, this._config);
  }

  private _addBin(): void {
    if (!this._config) return;
    this._config = { ...this._config, bins: [...this._config.bins, createBin()] };
    fireConfigChanged(this, this._config);
  }

  private _renderBin(bin: CardConfig['bins'][number], index: number, total: number): TemplateResult {
    return html`
      <div class="bin-item">
        <div class="bin-name-row">
          <label>Name</label>
          <input type="text" .value=${bin.name || ''} @change=${(e: Event) => this._updateBin(index, 'name', (e.target as HTMLInputElement).value)} />
        </div>
        <div class="bin-name-row">
          <label>Entity (sensor)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${bin.entity || ''}
            .includeDomains=${['sensor']}
            @value-changed=${(e: CustomEvent<{ value: string }>) => { e.stopPropagation(); this._updateBin(index, 'entity', e.detail.value ?? ''); }}
          ></ha-entity-picker>
        </div>
        <div class="bin-grid">
          <div class="bin-field">
            <label>Image</label>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ image: {} }}
              .value=${bin.image || ''}
              @value-changed=${(e: CustomEvent<{ value: string }>) => { e.stopPropagation(); this._updateBin(index, 'image', e.detail.value ?? ''); }}
            ></ha-selector>
          </div>
          <div class="bin-field">
            <label>Fallback icon</label>
            <ha-icon-picker
              .hass=${this.hass}
              .value=${bin.icon || 'mdi:delete'}
              @value-changed=${(e: CustomEvent<{ value: string }>) => { e.stopPropagation(); this._updateBin(index, 'icon', e.detail.value ?? 'mdi:delete'); }}
            ></ha-icon-picker>
          </div>
        </div>
        <div class="bin-field" style="margin-top:6px">
          <label>Colour</label>
          <div class="swatch-row">
            ${PRIMARY_COLORS.map(
              (c) => html`
                <button
                  type="button"
                  class="swatch ${(bin.color || '').toLowerCase() === c ? 'selected' : ''}"
                  style="background:${colorFor(c).accent}"
                  title=${c}
                  @click=${() => this._updateBin(index, 'color', c)}
                ></button>`,
            )}
          </div>
        </div>
        <div class="bin-name-row" style="margin-top:8px">
          <label>Action hint (e.g. "Put out after 7pm")</label>
          <input type="text" .value=${bin.action_text || ''} @change=${(e: Event) => this._updateBin(index, 'action_text', (e.target as HTMLInputElement).value)} />
        </div>
        <div class="bin-name-row" style="margin-top:4px">
          <label>Notes / instructions</label>
          <input type="text" .value=${bin.notes || ''} placeholder="e.g. Kerb by 7am" @change=${(e: Event) => this._updateBin(index, 'notes', (e.target as HTMLInputElement).value)} />
        </div>
        <div class="bin-foot">
          <button class="move-btn" ?disabled=${index === 0} @click=${() => this._moveBin(index, -1)}>▲</button>
          <button class="move-btn" ?disabled=${index === total - 1} @click=${() => this._moveBin(index, 1)}>▼</button>
          <button class="del-btn" @click=${() => this._deleteBin(index)}>Remove</button>
        </div>
      </div>`;
  }

  render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    return html`
      <div class="sect">Display</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="bins-head">
        <span>Bins</span>
        <button class="add-btn" @click=${() => this._addBin()}>+ Add bin</button>
      </div>
      ${this._config.bins.map((bin, i) => this._renderBin(bin, i, this._config!.bins.length))}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bin-collection-card-editor': BinCollectionCardEditor;
  }
}
