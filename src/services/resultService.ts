import { API_CONFIG } from '../config/api';
import type { AnalysisResult } from '../types/analysis';

const POLL_INTERVAL = 10000; // 10 seconds
const MAX_RETRIES = 30; // 5 minutes total

export async function checkResults(requestId: string): Promise<AnalysisResult | null> {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.ANALYSIS_RESULT}?requestId=${requestId}`);
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    if (!result || Object.keys(result).length === 0) {
      return null;
    }
    
    return result;
  } catch (error) {
    return null;
  }
}

export async function pollResults(requestId: string, retryCount = 0): Promise<void> {
  if (retryCount >= MAX_RETRIES) {
    document.getElementById('loadingOverlay')?.classList.add('hidden');
    throw new Error('Tiempo de espera agotado');
  }

  try {
    const result = await checkResults(requestId);
    
    if (result) {
      localStorage.setItem('analysisResult', JSON.stringify({
        ...result,
        alias: result.alias || 'Análisis de correo'
      }));
      window.location.href = '/results';
      return;
    }
    
    // If no result yet, continue polling
    setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
  } catch (error) {
    // Silent fail and continue polling
    setTimeout(() => pollResults(requestId, retryCount + 1), POLL_INTERVAL);
  }
}