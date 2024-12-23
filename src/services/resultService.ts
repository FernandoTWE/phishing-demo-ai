import { API_CONFIG } from '../config/api';
import { logger } from '../utils/logger';
import { handleApiError } from '../utils/apiErrorHandler';
import type { AnalysisResult } from '../types/analysis';

const POLL_INTERVAL = 10000; // 10 seconds
const MAX_RETRIES = 30; // 5 minutes total

interface ApiResponse {
  status: 'success' | 'error' | 'pending';
  data?: AnalysisResult;
  message?: string;
}

export async function checkResults(requestId: string): Promise<ApiResponse | null> {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.ANALYSIS_RESULT}?requestId=${requestId}`);
    
    if (response.status === 404) {
      logger.log('info', 'Results pending', { requestId });
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result) {
      logger.log('info', 'No results yet', { requestId });
      return null;
    }

    return {
      status: result.status || 'pending',
      data: result.data,
      message: result.message
    };
  } catch (error) {
    logger.log('error', 'Results check failed', { error });
    return null;
  }
}

export async function pollResults(requestId: string, retryCount = 0): Promise<void> {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingMessage = document.getElementById('loadingMessage');
  
  if (retryCount >= MAX_RETRIES) {
    loadingOverlay?.classList.add('hidden');
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

    const result = await checkResults(requestId);
    
    if (!result) {
      // Schedule next poll
      setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
      return;
    }

    switch (result.status) {
      case 'success':
        if (result.data) {
          localStorage.setItem('analysisResult', JSON.stringify({
            ...result.data,
            alias: result.data.alias || 'Análisis de correo'
          }));
          loadingOverlay?.classList.add('hidden');
          window.location.href = '/results';
        }
        break;
        
      case 'error':
        loadingOverlay?.classList.add('hidden');
        window.showToast(result.message || 'Error al procesar el análisis', 'error');
        break;
        
      case 'pending':
        // Continue polling
        setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
        break;
        
      default:
        loadingOverlay?.classList.add('hidden');
        window.showToast('Estado de análisis desconocido', 'error');
    }
  } catch (error) {
    logger.log('error', 'Polling error', { error, retryCount });
    // On error, continue polling
    setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
  }
}