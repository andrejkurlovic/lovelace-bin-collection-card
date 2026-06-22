import { css } from 'lit';

// Visual background/border/shadow now comes from <ha-card> itself (theme
// aware out of the box) instead of being hand-rolled, as it was pre-rewrite.
export const cardStyles = css`
  :host {
    display: block;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  ha-card {
    overflow: hidden;
    font-family: var(--primary-font-family, sans-serif);
    color: var(--primary-text-color, #fff);
  }

  /* ── BADGES (shared) ── */
  .badge {
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    padding: 2px 6px; border-radius: 5px; margin-right: 4px; display: inline-block;
  }
  .badge-delayed { background: rgba(255,167,38,0.18); color: #ffa726; }
  .badge-changed { background: rgba(79,195,247,0.18); color: #4fc3f7; }
  .faded { opacity: 0.45; transition: opacity .2s; }

  /* ── HEADER (image-grid / row / timeline / compact) ── */
  .header {
    padding: 14px 16px 10px; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  .header-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .header-title { font-size: 15px; font-weight: 700; letter-spacing: .01em; }
  .header-sub { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
  .hl-today { color: #ff8a65; font-weight: 600; }
  .hl-tomorrow { color: #ffa726; font-weight: 600; }
  .tap-hint { font-size: 12px; color: var(--secondary-text-color, rgba(255,255,255,0.25)); padding-left: 8px; flex-shrink: 0; }

  /* ── SMART SUMMARY ── */
  .ss-header {
    padding: 16px 18px 10px; display: flex; align-items: flex-start; justify-content: space-between;
    cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  .ss-title { font-size: 18px; font-weight: 700; letter-spacing: -.01em; line-height: 1.2; }
  .ss-subtitle { font-size: 12px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); margin-top: 3px; line-height: 1.35; min-height: 15px; }
  .ss-main { padding: 8px 16px 14px; }
  .ss-bin-row { display: flex; gap: 10px; align-items: flex-end; }
  .ss-bin { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .ss-bin-inner {
    position: relative; border-radius: 14px; padding: 12px 14px 10px; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .ss-bin-name { font-size: 12px; font-weight: 600; color: var(--primary-text-color, #fff); text-align: center; }
  .ss-bin-badges { display: flex; gap: 3px; justify-content: center; min-height: 13px; }
  .ss-action-hint { margin-top: 10px; font-size: 11px; color: rgba(255,255,255,0.45); letter-spacing: .02em; font-style: italic; }
  .ss-empty { padding: 20px 18px 24px; display: flex; align-items: center; gap: 12px; }
  .ss-empty-icon ha-icon { --mdc-icon-size: 28px; color: rgba(255,255,255,0.2); }
  .ss-empty-text { font-size: 13px; color: var(--secondary-text-color, rgba(255,255,255,0.4)); }
  .ss-next-line { padding: 0 18px 12px; font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.45)); }
  .ss-strip { display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 16px 12px; border-top: 1px solid rgba(255,255,255,0.05); }
  .ss-chip {
    display: flex; align-items: center; gap: 5px; padding: 4px 8px 4px 5px; border-radius: 8px;
    background: rgba(255,255,255,0.05); cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .chip-name { font-size: 11px; font-weight: 600; color: var(--primary-text-color, #fff); }
  .chip-label { font-size: 10px; color: var(--secondary-text-color, rgba(255,255,255,0.5)); margin-left: 2px; }

  /* highlight_today badges */
  .hl-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; }
  .hl-dot-today { background: #ff8a65; }
  .hl-dot-tomorrow { background: #ffa726; }
  .hl-pill {
    position: absolute; top: 4px; right: 4px; font-size: 9px; font-weight: 800; text-transform: uppercase;
    letter-spacing: .04em; padding: 3px 7px; border-radius: 6px; color: #1c1c1e;
  }
  .hl-pill-today { background: #ff8a65; }
  .hl-pill-tomorrow { background: #ffa726; }

  /* ── IMAGE GRID / ROW (shared tile) ── */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 0 10px 12px; }
  .row { display: grid; gap: 6px; padding: 0 10px 12px; }
  .row .bin-tile { padding: 8px 4px 8px; }
  .row .tile-name { font-size: 11px; }
  .row .tile-label { font-size: 10px; }
  .bin-tile {
    border-radius: 13px; padding: 12px 8px 10px; display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer; position: relative; overflow: hidden;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 1px 5px rgba(0,0,0,0.25);
    -webkit-tap-highlight-color: transparent;
  }
  .tile-img-wrap { position: relative; }
  .tile-name { font-size: 12px; font-weight: 700; color: #fff; text-align: center; line-height: 1.2; }
  .tile-label { font-size: 11px; color: rgba(255,255,255,0.65); text-align: center; }
  .tile-label.today { color: #ff8a65; font-weight: 600; }
  .tile-label.tomorrow { color: #ffa726; font-weight: 600; }
  .tile-label.soon { color: #fff176; }
  .tile-warn { font-size: 9px; color: #ef5350; }
  .tile-badges { display: flex; gap: 3px; flex-wrap: wrap; justify-content: center; min-height: 13px; }
  .tile-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; opacity: 0.6; }
  .urg-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; }
  .today-dot { background: #ff8a65; }
  .tomorrow-dot { background: #ffa726; }

  /* ── TIMELINE ── */
  .timeline { padding: 0 14px 14px; }
  .tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .tl-row:last-child { border-bottom: none; }
  .tl-date {
    font-size: 12px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.5));
    min-width: 110px; flex-shrink: 0; padding-top: 5px;
  }
  .tl-today { color: #ff8a65; }
  .tl-tomorrow { color: #ffa726; }
  .tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
  .tl-chip {
    display: flex; align-items: center; gap: 6px; border-radius: 9px; padding: 5px 10px 5px 6px;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .tl-chip-name { font-size: 12px; font-weight: 600; color: #fff; }
  .tl-badges { display: inline-flex; gap: 3px; margin-left: 2px; }

  /* ── COMPACT ── */
  .compact { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .compact-dots { display: flex; gap: 4px; flex-shrink: 0; }
  .compact-dot { width: 9px; height: 9px; border-radius: 50%; opacity: 1; transition: transform .15s, opacity .2s, width .15s, height .15s; cursor: pointer; }
  .compact-dot.future { opacity: 0.35; width: 7px; height: 7px; }
  .compact-dot.today { transform: scale(1.4); box-shadow: 0 0 5px currentColor; }
  .compact-text { flex: 1; min-width: 0; }
  .compact-title { font-size: 13px; font-weight: 700; }
  .compact-summary { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
  .compact-img { flex-shrink: 0; }
  .compact-img-wrap { display: inline-flex; flex-shrink: 0; cursor: pointer; }

  /* ── EMPTY ── */
  .empty-state { padding: 22px 16px; text-align: center; font-size: 13px; color: var(--secondary-text-color, rgba(255,255,255,0.35)); }
`;
