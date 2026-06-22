import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { popupStyles } from '../styles/popup';

// A standalone popup, appended to document.body (not the card's own shadow
// root) so it can't be clipped by an ancestor with overflow:hidden — the
// same reason HA's own more-info dialog does this. Content is supplied by
// the card via the `body` property and re-rendered reactively whenever the
// card updates it (e.g. once async history resolves), with no manual DOM
// surgery required.
@customElement('bin-collection-popup')
export class BinCollectionPopup extends LitElement {
  static styles = popupStyles;

  @property({ attribute: false }) heading = '';
  @property({ attribute: false }) body: TemplateResult = html``;

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this._onKeydown);
    super.disconnectedCallback();
  }

  close(): void {
    this.dispatchEvent(new CustomEvent('popup-closed'));
    this.remove();
  }

  private _onBgClick(e: Event): void {
    if (e.target === e.currentTarget) this.close();
  }

  render(): TemplateResult {
    return html`
      <div class="popup-bg" @click=${this._onBgClick}>
        <div class="popup-sheet">
          <div class="popup-drag"></div>
          <div class="popup-head">
            <div class="popup-title">${this.heading}</div>
            <button class="popup-close" @click=${() => this.close()}>✕</button>
          </div>
          ${this.body}
        </div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bin-collection-popup': BinCollectionPopup;
  }
}
