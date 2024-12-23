import type { AnalysisFormData } from '../types/analysis';

export function buildFormDataPayload(
  formData: AnalysisFormData,
  requestId: string
): FormData {
  const payload = new FormData();
  
  // Datos comunes
  payload.append('requestId', requestId);
  payload.append('language', formData.language);
  payload.append('segment', formData.segment);
  payload.append('contextType', '');

  if (formData.file) {
    payload.append('contentType', formData.file.type.startsWith('image/') ? 'image' : 'message');
    payload.append('mimeType', formData.file.type || 'application/octet-stream');
    payload.append('file', formData.file);
  } else if (formData.text) {
    payload.append('contentType', 'text');
    payload.append('mimeType', 'text/plain');
    payload.append('text', formData.text);
  }

  return payload;
}