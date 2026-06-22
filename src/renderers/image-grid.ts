import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { CardConfig, ResolvedBin } from '../types';
import { isFaded, urgencyClass } from '../models/bin';
import { dateText } from '../services/formatting';
import { colorFor } from '../utils/entities';
import { renderHeader } from './header';
import { badges, binImage, type RenderContext } from './shared';

function tile(bin: ResolvedBin, config: CardConfig, ctx: RenderContext): TemplateResult {
  const cl = colorFor(bin.color);
  const urg = urgencyClass(bin);
  const faded = isFaded(bin, config);
  const label = bin.missing ? '—' : dateText(bin, config.secondary_info, config);
  const dotOn = (urg === 'today' || urg === 'tomorrow') && config.highlight_today !== 'off';

  return html`
    <div class="bin-tile ${faded ? 'faded' : ''}" style="background:${cl.bg}" @click=${() => ctx.onBinTap(bin)}>
      ${dotOn ? html`<div class="urg-dot ${urg === 'today' ? 'today-dot' : 'tomorrow-dot'}"></div>` : ''}
      <div class="tile-img-wrap">${binImage(bin, 38, 52, 'tile-img')}</div>
      <div class="tile-name">${bin.name}</div>
      <div class="tile-label ${urg}">${label}</div>
      ${bin.missing ? html`<div class="tile-warn">no entity</div>` : ''}
      <div class="tile-badges">${badges(bin)}</div>
      <div class="tile-accent" style="background:${cl.accent}"></div>
    </div>`;
}

function tileLayout(bins: ResolvedBin[], config: CardConfig, ctx: RenderContext, containerClass: string, containerStyle?: string): TemplateResult {
  const header = renderHeader(bins, config, ctx);
  if (!bins.length) {
    return html`${header}<div class="empty-state">No collections due within ${config.days_ahead} days</div>`;
  }
  return html`
    ${header}
    <div class=${containerClass} style=${containerStyle ?? ''}>
      ${repeat(bins, (b) => b.entity, (b) => tile(b, config, ctx))}
    </div>`;
}

export function renderImageGrid(bins: ResolvedBin[], config: CardConfig, ctx: RenderContext): TemplateResult {
  return tileLayout(bins, config, ctx, 'grid');
}

// Single horizontal row of all displayed bins — one column per bin, matching
// the "all bins in one line" layout some users build by hand with a grid
// card + button-cards.
export function renderRow(bins: ResolvedBin[], config: CardConfig, ctx: RenderContext): TemplateResult {
  return tileLayout(bins, config, ctx, 'row', bins.length ? `grid-template-columns: repeat(${bins.length}, 1fr)` : undefined);
}
