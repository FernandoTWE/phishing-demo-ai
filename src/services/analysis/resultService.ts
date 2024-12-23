import { getAnalysisResultUrl } from '../../config/api';
import { logger } from '../../utils/logger';
import type { PollingResult } from '../polling/types';

export async function fetchAnalysisResult(requestId: string): Promise<PollingResult<any>> {
  try {
    const response = await fetch(getAnalysisResultUrl(requestId));
    
    // Si es 404, devolvemos error para continuar el polling
    if (response.status === 404) {
      return {
        status: 'error',
        message: 'Análisis en proceso'
      };
    }
    
    // Si no es 200, es un error que debería detener el polling
    if (response.status !== 200) {
      return {
        status: 'error',
        message: 'Error al obtener los resultados'
      };
    }
    
    const data = await response.json();
    return {
      status: 'success',
      data
    };
  } catch (error) {
    logger.log('error', 'Error al obtener resultado:', error);
    return {
      status: 'error',
      message: 'Error de conexión'
    };
  }
}