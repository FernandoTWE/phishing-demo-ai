import { API_CONFIG } from '../../config/api';
import { logger } from '../../utils/logger';
import type { AnalysisHistoryItem } from './types';

export async function fetchAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.ANALYSIS_HISTORY);
    if (!response.ok) {
      throw new Error('Error al obtener el historial');
    }
    const data = await response.json();
    
    // Filtrar solo los análisis exitosos
    return data.filter((item: AnalysisHistoryItem) => item.status === 'success');
  } catch (error) {
    logger.log('error', 'Error fetching history:', error);
    return [];
  }
}