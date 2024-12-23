import { sendAnalysis } from '../services/apiService';
import { pollResults } from '../services/resultService';
import { getContentType } from './contentType';
import { getLanguageCode } from './languageUtils';
import type { AnalysisFormData } from '../types/analysis';
import { logger } from './logger';

async function createAnalysisPayload(formData: AnalysisFormData, requestId: string): Promise<FormData> {
  const payload = new FormData();
  const contentInfo = formData.file ? getContentType(formData.file) : { type: 'message', mimeType: 'text/plain' };

  // Add metadata fields
  payload.append('requestId', requestId);
  payload.append('language', getLanguageCode(formData.language));
  payload.append('segment', formData.segment);
  payload.append('contentType', contentInfo.type);
  payload.append('mimeType', contentInfo.mimeType);
  payload.append('contextType', '');

  // Add content
  if (formData.file) {
    payload.append('file', formData.file);
    logger.log('info', 'File added to payload', { 
      name: formData.file.name,
      type: contentInfo.type,
      mimeType: contentInfo.mimeType
    });
  } else if (formData.text) {
    payload.append('text', formData.text);
    logger.log('info', 'Text added to payload');
  }

  return payload;
}

export async function handleAnalysisSubmission(formData: AnalysisFormData): Promise<void> {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (!loadingOverlay) return;

  try {
    loadingOverlay.classList.remove('hidden');
    const requestId = Date.now().toString();
    
    // Create and send payload
    const payload = await createAnalysisPayload(formData, requestId);
    const response = await sendAnalysis(payload);
    
    if (!response.ok) {
      throw new Error('Error en el envío del análisis');
    }

    // Start polling for results
    await pollResults(requestId);
  } catch (error) {
    logger.log('error', 'Analysis submission failed', { error });
    loadingOverlay.classList.add('hidden');
    window.showToast(error instanceof Error ? error.message : 'Error en el análisis', 'error');
  }
}