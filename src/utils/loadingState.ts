export function startLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }
}

export function stopLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}