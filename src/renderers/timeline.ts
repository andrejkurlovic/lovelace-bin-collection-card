import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { CardConfig, ResolvedBin } from '../types';
import { fadeThreshold } from '../models/bin';
import { groupByDate } from '../services/sorting';
import { formatDay } from '../utils/dates';
import { colorFor } from '../utils/entities';
import { renderHeader } from './header';
import { badges, binImage, type RenderContext } from './shared';

function chip(bin: ResolvedBin, ctx: RenderContext): TemplateResult {
  const cl = colorFor(bin.color);
  return html`
    <div class="tl-chip" style="background:${cl.bg}" @click=${() => ctx.onBinTap(bin)}>
      ${binImage(bin, 20, 28, 'tl-img')}
      <span class="tl-chip-name">${bin.name}</span>
      <span class="tl-badges">${badges(bin)}</span>
    </div>`;
}

export function renderTimeline(bins: ResolvedBin[], config: CardConfig, ctx: RenderContext): TemplateResult {
  const header = renderHeader(bins, config, ctx);
  let groups = groupByDate(bins);
  if (!config.show_future_bins) {
    groups = groups.filter((g) => g.days != null && g.days <= 1);
  }

  if (!groups.length) {
    return html`${header}<div class="empty-state">No collections due soon</div>`;
  }

  const threshold = fadeThreshold(config);

  return html`
    ${header}
    <div class="timeline">
      ${repeat(
        groups,
        (g) => g.days ?? 'null',
        (g) => {
          const d = g.days;
          const dayLabel = d != null ? formatDay(d) : 'Unknown';
          const cls = d === 0 ? 'tl-today' : d === 1 ? 'tl-tomorrow' : '';
          const faded = config.fade_future_bins && d != null && d > threshold;
          return html`
            <div class="tl-row ${faded ? 'faded' : ''}">
              <div class="tl-date ${cls}">${dayLabel}</div>
              <div class="tl-bins">${repeat(g.bins, (b) => b.entity, (b) => chip(b, ctx))}</div>
            </div>`;
        },
      )}
    </div>`;
}
