export function showToast(message: string, type: 'success' | 'error' = 'success'): void {
  const event = new CustomEvent('showToast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
}