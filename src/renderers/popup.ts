import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { CardConfig, ResolvedBin } from '../types';
import { dateText } from '../services/formatting';
import { groupByDate } from '../services/sorting';
import { friendlyDate, formatDay } from '../utils/dates';
import { colorFor } from '../utils/entities';
import { badges, binImage } from './shared';

// Shared "bin card" block used by both the planner popup's Today section and
// the bin detail popup's Next collection section. Optional fields only
// render if present — never invented.
function binCard(bin: ResolvedBin, dueLabel: string): TemplateResult {
  const cl = colorFor(bin.color);
  return html`
    <div class="popup-bin-card" style="background:${cl.bg}">
      ${binImage(bin, 32, 44, 'popup-img')}
      <div class="popup-bin-info">
        <div class="popup-bin-name">${bin.name} ${badges(bin)}</div>
        <div class="popup-bin-date">${dueLabel}</div>
        ${bin.message ? html`<div class="popup-bin-message">${bin.message}</div>` : ''}
        ${bin.delayNote ? html`<div class="popup-bin-message">⚠ ${bin.delayNote}</div>` : ''}
        ${bin.collectionType ? html`<div class="popup-bin-message">${bin.collectionType}</div>` : ''}
        ${bin.notes ? html`<div class="popup-bin-notes">${bin.notes}</div>` : ''}
        ${bin.action_text ? html`<div class="popup-bin-action">↗ ${bin.action_text}</div>` : ''}
      </div>
    </div>`;
}

// Planner view: Today + Upcoming, grouped by day.
export function renderPlannerBody(resolved: ResolvedBin[], config: CardConfig): TemplateResult {
  const todayBins = resolved.filter((b) => b.days === 0);
  const missedBins = resolved.filter((b) => b.days != null && b.days < 0);
  const upcoming = resolved.filter((b) => b.days != null && b.days > 0);
  const upGroups = groupByDate(upcoming);
  const secMode = config.secondary_info !== 'days' ? config.secondary_info : 'both';

  const hasToday = todayBins.length || missedBins.length;
  const hasAny = hasToday || upGroups.length;

  return html`
    ${hasToday
      ? html`
        <div class="popup-section">
          <div class="popup-label">Today</div>
          <div class="popup-today-row">
            ${repeat(todayBins, (b) => b.entity, (b) => binCard(b, dateText(b, secMode, config)))}
            ${repeat(missedBins, (b) => b.entity, (b) => binCard(b, 'Missed collection'))}
          </div>
        </div>
        ${upGroups.length ? html`<div class="popup-divider"></div>` : ''}`
      : ''}
    ${upGroups.length
      ? html`
        <div class="popup-section">
          <div class="popup-label">Upcoming</div>
          ${repeat(
            upGroups,
            (g) => g.days ?? 'null',
            (g) => html`
              <div class="popup-tl-row">
                <div class="popup-tl-date">${g.days != null ? formatDay(g.days) : 'Unknown'}</div>
                <div class="popup-tl-col">
                  ${repeat(
                    g.bins,
                    (b) => b.entity,
                    (b) => html`
                      <div class="popup-tl-chip" style="background:${colorFor(b.color).bg}">
                        ${binImage(b, 16, 22, 'popup-chip-img')}
                        <div class="popup-tl-chip-info">
                          <span class="popup-tl-chip-name">${b.name} ${badges(b)}</span>
                          ${b.notes ? html`<span class="popup-tl-chip-notes">${b.notes}</span>` : ''}
                          ${b.message ? html`<span class="popup-tl-chip-notes">${b.message}</span>` : ''}
                        </div>
                      </div>`,
                  )}
                </div>
              </div>`,
          )}
        </div>`
      : ''}
    ${!hasAny ? html`<div class="popup-empty">No upcoming collections</div>` : ''}
  `;
}

// Bin detail view: next confirmed date + real past history (null = loading).
export function renderBinDetailBody(bin: ResolvedBin, config: CardConfig, pastCollections: string[] | null): TemplateResult {
  const nextLabel = bin.days != null ? dateText(bin, 'both', config) : 'Unknown';
  return html`
    <div class="popup-section">
      <div class="popup-label">Next collection</div>
      ${binCard(bin, nextLabel)}
    </div>
    <div class="popup-divider"></div>
    <div class="popup-section">
      <div class="popup-label">Past collections</div>
      ${pastCollections === null
        ? html`<div class="popup-empty">Checking history…</div>`
        : pastCollections.length === 0
          ? html`<div class="popup-empty">No collection history available yet</div>`
          : html`
            <div class="popup-tl-col">
              ${repeat(
                pastCollections,
                (d) => d,
                (d) => html`<div class="popup-tl-chip" style="background:${colorFor(bin.color).bg}">${friendlyDate(new Date(d))}</div>`,
              )}
            </div>`}
    </div>`;
}
