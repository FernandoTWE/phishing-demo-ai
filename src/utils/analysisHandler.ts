import { convertFileToBase64 } from './fileHandlers';
import { sendAnalysis } from '../services/apiService';
import { pollResults } from '../services/resultService';
import { getContentType } from './contentType';
import type { AnalysisFormData, AnalysisPayload } from '../types/analysis';

async function createAnalysisPayload(formData: AnalysisFormData, requestId: string): Promise<AnalysisPayload> {
  let content = '';
  let contentType = formData.file ? getContentType(formData.file) : 'message';

  if (formData.file) {
    content = await convertFileToBase64(formData.file);
  } else if (formData.text) {
    content = btoa(formData.text);
  }

  return {
    text: content,
    requestId,
    language: formData.language,
    segment: formData.segment,
    contentType,
    contextType: ''
  };
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