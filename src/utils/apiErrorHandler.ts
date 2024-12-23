import { logger } from './logger';
import type { ApiErrorResponse } from '../types/api';

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

export function handleApiError(error: unknown): ApiErrorResponse {
  logger.log('error', 'API error occurred', { error });

  if (error instanceof ApiError) {
    return {
      status: 'error',
      message: error.message,
      code: error.code
    };
  }

  if (error instanceof Response) {
    return {
      status: 'error',
      message: `Error en el servidor (${error.status})`,
      code: 'SERVER_ERROR'
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return {
      status: 'error',
      message: 'Error de conexión con el servidor',
      code: 'NETWORK_ERROR'
    };
  }

  return {
    status: 'error',
    message: 'Error inesperado en la comunicación',
    code: 'UNKNOWN_ERROR'
  };
}