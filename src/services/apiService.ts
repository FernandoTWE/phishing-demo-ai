import { API_CONFIG } from '../config/api';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function sendAnalysis(payload: FormData): Promise<Response> {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEBHOOK, {
      method: 'POST',
      body: payload // Send FormData directly
    });

    if (!response.ok) {
      throw new ApiError(`Error al enviar el análisis: ${response.statusText}`, response.status);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error de conexión al enviar el análisis');
  }
}