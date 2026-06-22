import { html, type TemplateResult } from 'lit';
import type { ResolvedBin } from '../types';

export interface RenderContext {
  onBinTap: (bin: ResolvedBin) => void;
  onHeaderTap: () => void;
}

// Renders a bin's image with an icon fallback on load error. Lit's @error
// binding replaces the manual onerror-string + sibling-toggle the old card
// used, with the same visual result (icon shown in place of a broken image).
export function binImage(bin: ResolvedBin, widthPx: number, heightPx: number, cls = ''): TemplateResult {
  const style = `width:${widthPx}px;height:${heightPx}px;object-fit:contain;`;
  const iconStyle = `--mdc-icon-size:${Math.round(heightPx * 0.65)}px;color:rgba(255,255,255,0.8)`;
  if (!bin.image) {
    return html`
      <div class="icon-fallback" style="width:${widthPx}px;height:${heightPx}px;display:flex;align-items:center;justify-content:center">
        <ha-icon icon=${bin.icon || 'mdi:delete'} style=${iconStyle}></ha-icon>
      </div>`;
  }
  return html`
    <img
      class=${cls}
      src=${bin.image}
      alt=${bin.name}
      loading="lazy"
      style=${style}
      @error=${(e: Event) => {
        const img = e.target as HTMLImageElement;
        img.style.display = 'none';
        const fallback = img.nextElementSibling as HTMLElement | null;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
    <div class="icon-fallback" style="display:none;width:${widthPx}px;height:${heightPx}px;align-items:center;justify-content:center">
      <ha-icon icon=${bin.icon || 'mdi:delete'} style=${iconStyle}></ha-icon>
    </div>`;
}

export function badges(bin: ResolvedBin): TemplateResult {
  return html`
    ${bin.delayed ? html`<span class="badge badge-delayed">Delayed</span>` : ''}
    ${bin.changed ? html`<span class="badge badge-changed">Changed</span>` : ''}
  `;
}
