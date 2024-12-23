import { ApiError } from './apiErrorHandler';
import { logger } from './logger';
import type { ApiResponse } from '../types/api';

export function validateApiResponse<T>(response: Response): ApiResponse<T> | ApiError {
  logger.log('info', 'Validating API response', { 
    status: response.status 
  });

  if (response.status === 404) {
    return new ApiError(
      'El servicio no está disponible en este momento',
      404,
      'SERVICE_UNAVAILABLE'
    );
  }

  if (!response.ok) {
    return new ApiError(
      'Error en la comunicación con el servidor',
      response.status,
      'REQUEST_FAILED'
    );
  }

  return {
    status: 'success',
    data: response as unknown as T
  };
}