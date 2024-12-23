import { API_CONFIG } from '../config/api';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types/analysis';

const POLL_INTERVAL = 10000; // 10 seconds
const MAX_RETRIES = 30; // 5 minutes total

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: AnalysisResult;
}

export async function checkResults(requestId: string): Promise<ApiResponse | null> {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.ANALYSIS_RESULT}?requestId=${requestId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        logger.log('info', 'Results pending', { requestId });
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // If no result or empty object, consider it pending
    if (!result || Object.keys(result).length === 0) {
      logger.log('info', 'No results yet', { requestId });
      return null;
    }

    logger.log('info', 'Results received', { result });
    return result;
  } catch (error) {
    logger.log('error', 'Results check failed', { error });
    return null;
  }
}

export async function pollResults(requestId: string, retryCount = 0): Promise<void> {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingMessage = document.getElementById('loadingMessage');
  
  if (retryCount >= MAX_RETRIES) {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    window.showToast('El análisis está tardando más de lo esperado', 'error');
    return;
  }

  try {
    // Update loading message with retry count
    if (loadingMessage) {
      const minutes = Math.floor((retryCount * POLL_INTERVAL) / 60000);
      const seconds = ((retryCount * POLL_INTERVAL) % 60000) / 1000;
      loadingMessage.textContent = `Analizando correo (${minutes}:${seconds.toString().padStart(2, '0')})...`;
    }

    const response = await checkResults(requestId);
    
    if (response) {
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }

      if (response.status === 'error') {
        // Handle error status
        window.showToast(response.message || 'Error en el análisis', 'error');
        return;
      }

      if (response.status === 'success' && response.data) {
        // Store result and redirect on success
        localStorage.setItem('analysisResult', JSON.stringify({
          ...response.data,
          alias: response.data.alias || 'Análisis de correo'
        }));
        window.location.href = '/results';
        return;
      }
    }

    // Continue polling if no result or invalid response
    setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
  } catch (error) {
    logger.log('error', 'Polling error', { error, retryCount });
    // On error, continue polling
    setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
  }
}