import { API_CONFIG } from '../config/api';
import { logger } from '../utils/logger';
import { ApiError, handleApiError } from '../utils/apiErrorHandler';
import { validateApiResponse } from '../utils/apiValidator';

export async function sendAnalysis(payload: FormData): Promise<Response> {
  try {
    logger.log('info', 'Sending analysis request');
    
    const response = await fetch(API_CONFIG.ENDPOINTS.WEBHOOK, {
      method: 'POST',
      body: payload
    });

    // Validate response
    const validationError = validateApiResponse(response);
    if (validationError) {
      throw validationError;
    }

    logger.log('info', 'Analysis request successful');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}