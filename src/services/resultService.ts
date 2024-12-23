import { PollingService } from './polling/pollingService';
import { fetchAnalysisResult } from './analysisService';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types/analysis';

export async function pollResults(requestId: string): Promise<void> {
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  const pollingService = new PollingService(async () => {
    try {
      const response = await fetchAnalysisResult(requestId);
      return response;
    } catch (error) {
      logger.log('error', 'Error in polling check', { error });
      return {
        status: 'error',
        message: 'Error al verificar el estado del análisis'
      };
    }
  });

  try {
    const result = await pollingService.start();

    if (result.status === 'success' && result.data) {
      localStorage.setItem('analysisResult', JSON.stringify(result.data));
      if (loadingOverlay) loadingOverlay.classList.add('hidden');
      window.location.href = '/results';
      return;
    }

    // Mostrar el mensaje de error exacto recibido
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    window.showToast(result.message || 'Error al obtener los resultados', 'error');
  } catch (error) {
    logger.log('error', 'Polling failed', { error });
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    window.showToast('Error al obtener los resultados', 'error');
  }
}