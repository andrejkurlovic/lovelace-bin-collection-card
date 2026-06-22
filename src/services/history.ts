import type { HistoryPoint, HomeAssistant } from '../types';

// Real recorder history only — finds the moments the sensor's state
// transitioned into "0" (a collection happened), most recent first. Never
// fabricates entries; returns whatever the recorder actually has, which may
// be fewer than `limit` or none at all.
export async function fetchPastCollections(
  hass: HomeAssistant | undefined,
  entity: string,
  limit = 4,
): Promise<string[]> {
  if (!hass || !entity || typeof hass.callApi !== 'function') return [];
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 180);
  try {
    const path =
      `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(entity)}` +
      `&end_time=${encodeURIComponent(end.toISOString())}&no_attributes`;
    const result = await hass.callApi<HistoryPoint[][]>('GET', path);
    const series = Array.isArray(result) && result[0] ? result[0] : [];
    const collectionDates: string[] = [];
    let wasZero = false;
    for (const point of series) {
      const isZero = point.state === '0';
      if (isZero && !wasZero) collectionDates.push(point.last_changed);
      wasZero = isZero;
    }
    return collectionDates.slice(-limit).reverse();
  } catch {
    return [];
  }
}
