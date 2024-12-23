import { API_CONFIG } from '../config/api';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types/analysis';

const POLL_INTERVAL = 10000; // 10 seconds
const MAX_RETRIES = 30; // 5 minutes total

interface ApiResponse {
  status: 'success' | 'error' | 'pending';
  message?: string;
  data?: AnalysisResult;
}

export async function checkResults(requestId: string): Promise<ApiResponse | null> {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.ANALYSIS_RESULT}?requestId=${requestId}`);
    
    if (!response.ok) {
      logger.log('error', 'API error', { status: response.status });
      return null;
    }
    
    const result = await response.json();
    
    // If no result or empty object, consider it pending
    if (!result || Object.keys(result).length === 0) {
      return { status: 'pending' };
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
  
  if (retryCount >= MAX_RETRIES) {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    window.showToast('El análisis está tardando más de lo esperado', 'error');
    return;
  }

  try {
    const response = await checkResults(requestId);
    
    if (response) {
      switch (response.status) {
        case 'success':
          if (response.data) {
            // Store result and redirect on success
            localStorage.setItem('analysisResult', JSON.stringify({
              ...response.data,
              alias: response.data.alias || 'Análisis de correo'
            }));
            
            // Hide loading overlay and redirect
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            window.location.href = '/results';
            return;
          }
          break;

        case 'error':
          // Hide loading and show error message
          if (loadingOverlay) loadingOverlay.classList.add('hidden');
          window.showToast(response.message || 'Error en el análisis', 'error');
          return;

        case 'pending':
          // Continue polling
          setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
          break;
      }
    } else {
      // On null response (API error), continue polling
      setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
    }
  } catch (error) {
    logger.log('error', 'Polling error', { error, retryCount });
    // On error, continue polling
    setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
  }
}