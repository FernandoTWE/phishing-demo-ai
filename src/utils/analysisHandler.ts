import { sendAnalysis } from '../services/apiService';
import { pollResults } from '../services/resultService';
import { getContentType } from './contentType';
import type { AnalysisFormData, AnalysisPayload } from '../types/analysis';

async function createAnalysisPayload(formData: AnalysisFormData, requestId: string): Promise<FormData> {
  const payload = new FormData();
  const contentType = formData.file ? getContentType(formData.file) : { type: 'message', mimeType: 'text/plain' };

  payload.append('requestId', requestId);
  payload.append('language', formData.language);
  payload.append('segment', formData.segment);
  payload.append('contentType', contentType.type);
  payload.append('mimeType', contentType.mimeType);
  payload.append('contextType', '');

  if (formData.file) {
    payload.append('file', formData.file);
  } else if (formData.text) {
    payload.append('text', formData.text);
  }

  return payload;
}

export async function handleAnalysisSubmission(formData: AnalysisFormData): Promise<void> {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }
  
  try {
    const requestId = Date.now().toString();
    const payload = await createAnalysisPayload(formData, requestId);
    
    await sendAnalysis(payload);
    await pollResults(requestId);
  } catch (error) {
    console.error('Error in analysis submission:', error);
    loadingOverlay?.classList.add('hidden');
  }
}