import { CARD_TYPE } from './models/config';
import './card/bin-collection-card';

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
  documentationURL: string;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.find((c) => c.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: 'Bin Collection Card',
    description: 'UK bin/waste collection schedule — smart-summary, image-grid, row, timeline, compact modes',
    preview: true,
    documentationURL: 'https://github.com/andrejkurlovic/lovelace-bin-collection-card',
  });
}
