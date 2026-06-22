import { css } from 'lit';

export const popupStyles = css`
  :host {
    position: fixed;
    inset: 0;
    z-index: 9998;
  }
  * { box-sizing: border-box; }
  .popup-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fade-in .16s ease;
  }
  @media (min-width: 600px) { .popup-bg { align-items: center; } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .popup-sheet {
    background: var(--ha-card-background, #1c1c1e); border-radius: 22px 22px 0 0; width: 100%; max-width: 500px;
    max-height: 82vh; overflow-y: auto; overflow-x: hidden; box-shadow: 0 -6px 40px rgba(0,0,0,0.55);
    animation: slide-up .22s cubic-bezier(.3,.7,.3,1); color: var(--primary-text-color, #fff);
    font-family: var(--primary-font-family, sans-serif);
  }
  @media (min-width: 600px) { .popup-sheet { border-radius: 20px; max-height: 72vh; } }
  @keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .popup-drag { width: 36px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin: 10px auto 0; }
  .popup-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 10px; }
  .popup-title { font-size: 17px; font-weight: 700; }
  .popup-close {
    width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.07); border: none; cursor: pointer;
    color: var(--secondary-text-color, rgba(255,255,255,0.6)); font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0;
  }
  .popup-section { padding: 0 20px 14px; }
  .popup-label {
    font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
    color: var(--secondary-text-color, rgba(255,255,255,0.45)); margin-bottom: 10px;
  }
  .popup-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 20px 14px; }
  .popup-today-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .popup-bin-card {
    flex: 1; min-width: 140px; border-radius: 14px; padding: 12px 14px 12px 10px; display: flex; align-items: center; gap: 10px;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 1px 6px rgba(0,0,0,0.25);
  }
  .popup-bin-info { flex: 1; min-width: 0; }
  .popup-bin-name { font-size: 13px; font-weight: 700; }
  .popup-bin-date { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }
  .popup-bin-message { font-size: 10px; color: #4fc3f7; margin-top: 3px; }
  .popup-bin-notes { font-size: 10px; color: rgba(255,255,255,0.38); margin-top: 4px; font-style: italic; }
  .popup-bin-action { font-size: 10px; color: #ffa726; margin-top: 3px; font-weight: 600; }
  .popup-tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .popup-tl-row:last-child { border-bottom: none; }
  .popup-tl-date {
    font-size: 11px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.5));
    min-width: 90px; flex-shrink: 0; padding-top: 5px;
  }
  .popup-tl-col { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .popup-tl-chip { display: flex; align-items: flex-start; gap: 6px; border-radius: 9px; padding: 6px 10px 6px 6px; }
  .popup-tl-chip-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .popup-tl-chip-name { font-size: 11px; font-weight: 600; color: #fff; }
  .popup-tl-chip-notes { font-size: 9px; color: rgba(255,255,255,0.4); font-style: italic; }
  .popup-empty { padding: 20px; text-align: center; color: rgba(255,255,255,0.35); font-size: 13px; }
`;
