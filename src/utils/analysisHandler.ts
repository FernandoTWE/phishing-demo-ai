import { sendAnalysis } from '../services/apiService';
import { pollResults } from '../services/resultService';
import { buildFormDataPayload } from './payloadBuilder';
import { showError } from './notifications';
import type { AnalysisFormData } from '../types/analysis';

export async function handleAnalysisSubmission(formData: AnalysisFormData): Promise<void> {
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay?.classList.remove('hidden');
  
  try {
    const requestId = Date.now().toString();
    const payload = buildFormDataPayload(formData, requestId);
    
    await sendAnalysis(payload);
    await pollResults(requestId);
  } catch (error) {
    console.error('Error en el envío del análisis:', error);
    showError(error instanceof Error ? error.message : 'Error al procesar el análisis. Por favor, inténtalo de nuevo.');
    loadingOverlay?.classList.add('hidden');
  }
}