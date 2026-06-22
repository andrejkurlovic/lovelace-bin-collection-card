import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { CardConfig, ResolvedBin } from '../types';
import { isFaded } from '../models/bin';
import { daysLabel, listNames } from '../services/formatting';
import { colorFor } from '../utils/entities';
import { binImage, type RenderContext } from './shared';

function summaryText(bins: ResolvedBin[], config: CardConfig): string {
  const todayBins = bins.filter((b) => b.days === 0);
  const next = bins.find((b) => b.days != null) ?? null;
  if (todayBins.length) return `${listNames(todayBins)} today`;
  if (next) {
    const nextGroup = bins.filter((b) => b.days === next.days);
    return `${listNames(nextGroup)} ${daysLabel(next.days, config)}`;
  }
  return 'No collections due';
}

export function renderCompact(bins: ResolvedBin[], config: CardConfig, ctx: RenderContext): TemplateResult {
  const summary = summaryText(bins, config);
  return html`
    <div class="compact" @click=${ctx.onHeaderTap}>
      <div class="compact-dots">
        ${repeat(
          bins,
          (b) => b.entity,
          (b) => html`
            <div
              class="compact-dot ${b.days === 0 ? 'today' : ''} ${isFaded(b, config) ? 'future' : ''}"
              style="background:${colorFor(b.color).accent}"
              title="${b.name}: ${daysLabel(b.days, config)}"
              @click=${(e: Event) => { e.stopPropagation(); ctx.onBinTap(b); }}
            ></div>`,
        )}
      </div>
      <div class="compact-text">
        <div class="compact-title">${config.title}</div>
        <div class="compact-summary">${summary}</div>
      </div>
      ${repeat(
        bins.slice(0, 3),
        (b) => b.entity,
        (b) => html`
          <div
            class="compact-img-wrap ${isFaded(b, config) ? 'faded' : ''}"
            @click=${(e: Event) => { e.stopPropagation(); ctx.onBinTap(b); }}
          >${binImage(b, 22, 30, 'compact-img')}</div>`,
      )}
    </div>`;
}
