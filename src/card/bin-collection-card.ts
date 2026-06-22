import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CardConfig, HomeAssistant, RawCardConfig, ResolvedBin } from '../types';
import { CARD_TYPE, getStubConfig, normalizeConfig } from '../models/config';
import { resolveBins, stateHash } from '../services/parser';
import { fetchPastCollections } from '../services/history';
import { filterForDisplay } from '../services/sorting';
import { renderSmartSummary } from '../renderers/smart-summary';
import { renderImageGrid, renderRow } from '../renderers/image-grid';
import { renderTimeline } from '../renderers/timeline';
import { renderCompact } from '../renderers/compact';
import { renderBinDetailBody, renderPlannerBody } from '../renderers/popup';
import type { RenderContext } from '../renderers/shared';
import { cardStyles } from '../styles/card';
import './popup-element';
import type { BinCollectionPopup } from './popup-element';
import './editor';

@customElement(CARD_TYPE)
export class BinCollectionCard extends LitElement {
  static styles = cardStyles;

  static getConfigElement(): HTMLElement {
    return document.createElement('bin-collection-card-editor');
  }

  static getStubConfig(): RawCardConfig {
    return getStubConfig();
  }

  @state() private _config?: CardConfig;
  private _hass?: HomeAssistant;
  private _stateHash: string | null = null;
  private _popupEl: BinCollectionPopup | null = null;

  // Anti-flicker: hass ticks constantly for unrelated entities. Only
  // request a re-render when something we actually read has changed.
  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._config) return;
    const hash = stateHash(hass, this._config.bins);
    if (hash === this._stateHash) return;
    this._stateHash = hash;
    this.requestUpdate();
  }
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(raw: RawCardConfig): void {
    this._config = normalizeConfig(raw);
    this._stateHash = null;
  }

  getCardSize(): number {
    switch (this._config?.mode) {
      case 'compact': return 1;
      case 'row': return 2;
      case undefined:
      case 'smart-summary': return 4;
      default: return 3;
    }
  }

  private _resolved(): ResolvedBin[] {
    return this._config ? resolveBins(this._hass, this._config) : [];
  }

  render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const resolved = this._resolved();
    const ctx: RenderContext = {
      onBinTap: (bin) => this._openBinDetail(bin),
      onHeaderTap: () => this._openPlanner(resolved),
    };

    let body: TemplateResult;
    switch (this._config.mode) {
      case 'image-grid':
        body = renderImageGrid(filterForDisplay(resolved, this._config), this._config, ctx);
        break;
      case 'row':
        body = renderRow(filterForDisplay(resolved, this._config), this._config, ctx);
        break;
      case 'timeline':
        body = renderTimeline(filterForDisplay(resolved, this._config), this._config, ctx);
        break;
      case 'compact':
        body = renderCompact(filterForDisplay(resolved, this._config), this._config, ctx);
        break;
      default:
        body = renderSmartSummary(resolved, this._config, ctx);
    }

    return html`<ha-card>${body}</ha-card>`;
  }

  private _openPopup(heading: string, body: TemplateResult): BinCollectionPopup {
    this._closePopup();
    const el = document.createElement('bin-collection-popup');
    el.heading = heading;
    el.body = body;
    el.addEventListener('popup-closed', () => {
      if (this._popupEl === el) this._popupEl = null;
    });
    document.body.appendChild(el);
    this._popupEl = el;
    return el;
  }

  private _closePopup(): void {
    this._popupEl?.close();
    this._popupEl = null;
  }

  private _openPlanner(resolved: ResolvedBin[]): void {
    if (!this._config?.popup) return;
    this._openPopup(this._config.title, renderPlannerBody(resolved, this._config));
  }

  private _openBinDetail(bin: ResolvedBin): void {
    if (!this._config) return;
    const popup = this._openPopup(bin.name, renderBinDetailBody(bin, this._config, null));
    fetchPastCollections(this._hass, bin.entity, 4).then((dates) => {
      if (this._popupEl !== popup || !this._config) return; // closed/replaced before resolving
      popup.body = renderBinDetailBody(bin, this._config, dates);
    });
  }

  disconnectedCallback(): void {
    this._closePopup();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bin-collection-card': BinCollectionCard;
  }
}
