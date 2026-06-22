import { html, type TemplateResult } from 'lit';
import type { CardConfig, ResolvedBin } from '../types';
import { dateText, listNames } from '../services/formatting';
import type { RenderContext } from './shared';

// Shared by image-grid / row / timeline — compact has its own, deliberately
// smaller header baked into its single-line layout.
export function renderHeader(bins: ResolvedBin[], config: CardConfig, ctx: RenderContext): TemplateResult | '' {
  if (!config.show_header) return '';
  const next = bins.find((b) => b.days != null) ?? null;
  let nextLine: TemplateResult | '' = '';
  if (config.show_next_summary && next) {
    const nextGroup = bins.filter((b) => b.days === next.days);
    const label = dateText(next, config.secondary_info, config);
    const cls = next.days === 0 ? 'hl-today' : next.days === 1 ? 'hl-tomorrow' : '';
    nextLine = html`<div class="header-sub">Next: ${listNames(nextGroup)} — <span class=${cls}>${label}</span></div>`;
  }
  return html`
    <div class="header" @click=${ctx.onHeaderTap}>
      <div class="header-left">
        <div class="header-title">${config.title}</div>
        ${nextLine}
      </div>
      ${config.popup ? html`<div class="tap-hint">▸</div>` : ''}
    </div>`;
}
