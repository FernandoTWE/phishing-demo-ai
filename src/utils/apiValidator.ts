import { ApiError } from './apiErrorHandler';
import { logger } from './logger';

export function validateApiResponse(response: Response): ApiError | null {
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

  return null;
}