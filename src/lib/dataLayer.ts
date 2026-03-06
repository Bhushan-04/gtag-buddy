declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export interface DataLayerEvent {
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

// In-memory log for the monitor panel
const eventLog: DataLayerEvent[] = [];
const listeners: Array<() => void> = [];

export function pushEvent(event: string, data: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  const payload = { event, ...data };
  window.dataLayer.push(payload);

  const logEntry: DataLayerEvent = {
    event,
    timestamp: new Date().toLocaleTimeString(),
    ...data,
  };
  eventLog.unshift(logEntry);
  if (eventLog.length > 50) eventLog.pop();
  listeners.forEach((fn) => fn());

  console.log(`%c[dataLayer] ${event}`, "color: #f97316; font-weight: bold;", data);
}

export function getEventLog() {
  return eventLog;
}

export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function mapItemToGA4(product: { id: string; name: string; brand: string; category: string; price: number }, quantity = 1, index?: number, variant?: string) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: product.brand,
    item_category: product.category,
    price: product.price,
    quantity,
    ...(index !== undefined ? { index } : {}),
    ...(variant ? { item_variant: variant } : {}),
  };
}
