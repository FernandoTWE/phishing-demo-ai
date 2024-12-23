import { API_CONFIG } from '../config/api';
import { logger } from '../utils/logger';
import { ApiError, handleApiError } from '../utils/apiErrorHandler';
import { validateApiResponse } from '../utils/apiValidator';

export async function sendAnalysis(payload: FormData): Promise<Response> {
  try {
    logger.log('info', 'Sending analysis request');
    
    const response = await fetch(API_CONFIG.ENDPOINTS.WEBHOOK, {
      method: 'POST',
      body: payload,
      headers: {
        'Accept': 'application/json',
        // Remove Content-Type header to let browser set it with boundary for FormData
      },
      mode: 'cors', // Explicitly enable CORS
      credentials: 'same-origin'
    });

    // Check if response is ok before validation
    if (!response.ok) {
      throw new ApiError(
        'Error en el envío del análisis',
        response.status,
        'API_ERROR'
      );
    }

    // Validate response
    const validationError = validateApiResponse(response);
    if (validationError instanceof ApiError) {
      throw validationError;
    }

    logger.log('info', 'Analysis request successful');
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiError(
        'Error de conexión con el servidor',
        0,
        'NETWORK_ERROR'
      );
    }

    throw handleApiError(error);
  }
}