import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): ApiError {
  logger.log('error', 'API error occurred', { error });

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Response) {
    return new ApiError(
      'Error en la comunicación con el servidor',
      error.status
    );
  }

  return new ApiError('Error inesperado en la comunicación');
}