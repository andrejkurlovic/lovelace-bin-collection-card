export function fireConfigChanged(host: EventTarget, config: unknown): void {
  host.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}
