import { css } from 'lit';

export const editorStyles = css`
  :host {
    display: block;
    padding: 8px 2px;
    font-family: var(--primary-font-family, sans-serif);
    color: var(--primary-text-color);
  }
  .sect {
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
    color: var(--secondary-text-color); margin: 18px 0 8px; padding-bottom: 4px;
    border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
  }
  .bins-head { display: flex; align-items: center; justify-content: space-between; margin: 4px 0 8px; }
  .bins-head span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); }
  .add-btn {
    background: var(--primary-color); color: white; border: none; border-radius: 6px;
    padding: 5px 12px; font-size: 12px; cursor: pointer;
  }
  .bin-item {
    background: var(--input-fill-color, rgba(255,255,255,0.03));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.07));
    border-radius: 10px; padding: 12px; margin-bottom: 8px;
  }
  .bin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 4px; }
  .bin-field label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-field input[type=text] {
    width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box;
  }
  .bin-foot { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
  .del-btn {
    background: rgba(239,83,80,0.15); color: #ef5350;
    border: 1px solid rgba(239,83,80,0.25); border-radius: 5px;
    padding: 4px 12px; font-size: 11px; cursor: pointer;
  }
  .move-btn {
    background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); width: 26px; height: 24px; font-size: 11px; cursor: pointer;
  }
  .move-btn:disabled { opacity: 0.3; cursor: default; }
  .bin-name-row { margin-bottom: 6px; }
  .bin-name-row label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-name-row input {
    width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box;
  }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
  .swatch {
    width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent;
    cursor: pointer; padding: 0;
  }
  .swatch.selected { border-color: var(--primary-text-color, #fff); box-shadow: 0 0 0 1px rgba(255,255,255,0.3); }
`;
