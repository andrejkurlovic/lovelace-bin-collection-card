import { html, type TemplateResult } from 'lit';
import type { CardConfig, ResolvedBin } from '../types';
import { hasBadges, isFaded } from '../models/bin';
import { dateText } from '../services/formatting';
import { computeSmartSummaryState } from '../services/smart-summary-state';
import { colorFor } from '../utils/entities';
import { badges, binImage, type RenderContext } from './shared';

function highlightBadge(bin: ResolvedBin, config: CardConfig): TemplateResult | '' {
  const hl = config.highlight_today;
  if (hl === 'off') return '';
  if (bin.days !== 0 && bin.days !== 1) return '';
  const label = bin.days === 0 ? config.today_text : config.tomorrow_text;
  const variant = bin.days === 0 ? 'today' : 'tomorrow';
  if (hl === 'strong') return html`<div class="hl-pill hl-pill-${variant}">${label}</div>`;
  return html`<div class="hl-dot hl-dot-${variant}"></div>`;
}

function binCard(bin: ResolvedBin, config: CardConfig, ctx: RenderContext): TemplateResult {
  const cl = colorFor(bin.color);
  return html`
    <div class="ss-bin" @click=${() => ctx.onBinTap(bin)}>
      <div class="ss-bin-inner" style="background:${cl.bg}">
        ${binImage(bin, 48, 66, 'ss-img')}
        ${highlightBadge(bin, config)}
      </div>
      <div class="ss-bin-name">${bin.name}</div>
      ${hasBadges(bin) ? html`<div class="ss-bin-badges">${badges(bin)}</div>` : ''}
    </div>`;
}

function extraChip(bin: ResolvedBin, config: CardConfig, ctx: RenderContext): TemplateResult {
  const faded = isFaded(bin, config);
  const label = dateText(bin, config.secondary_info, config);
  return html`
    <div class="ss-chip ${faded ? 'faded' : ''}" @click=${() => ctx.onBinTap(bin)}>
      ${binImage(bin, 18, 24, 'chip-img')}
      <span class="chip-name">${bin.name}</span>
      <span class="chip-label">${label}</span>
    </div>`;
}

export function renderSmartSummary(resolved: ResolvedBin[], config: CardConfig, ctx: RenderContext): TemplateResult {
  const s = computeSmartSummaryState(resolved, config);
  const glow = s.mainBins.length ? colorFor(s.mainBins[0].color).glow : 'transparent';

  const mainHtml = s.mainBins.length
    ? html`
      <div class="ss-main" style="background:linear-gradient(160deg,${glow} 0%,transparent 60%)">
        <div class="ss-bin-row">${s.mainBins.map((b) => binCard(b, config, ctx))}</div>
        ${s.actionHint ? html`<div class="ss-action-hint">${s.actionHint}</div>` : ''}
      </div>`
    : html`
      <div class="ss-empty">
        <div class="ss-empty-icon"><ha-icon icon="mdi:check-circle-outline"></ha-icon></div>
        <div class="ss-empty-text">${s.headerSub}</div>
      </div>`;

  return html`
    ${config.show_header
      ? html`
        <div class="ss-header" @click=${ctx.onHeaderTap}>
          <div>
            <div class="ss-title">${s.headerTitle}</div>
            <div class="ss-subtitle">${s.mainBins.length ? s.headerSub : ''}</div>
          </div>
          ${config.popup ? html`<div class="tap-hint">▸</div>` : ''}
        </div>`
      : ''}
    ${mainHtml}
    ${s.nextLine ? html`<div class="ss-next-line">${s.nextLine}</div>` : ''}
    ${s.extraBins.length
      ? html`<div class="ss-strip">${s.extraBins.map((b) => extraChip(b, config, ctx))}</div>`
      : ''}
  `;
}
