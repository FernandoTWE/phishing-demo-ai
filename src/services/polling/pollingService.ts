import { POLLING_CONFIG } from './config';
import type { PollingConfig, PollingState, PollingResult } from './types';
import { logger } from '../../utils/logger';

export class PollingService<T> {
  private state: PollingState = {
    retryCount: 0,
    startTime: Date.now()
  };

  constructor(
    private readonly checkFn: () => Promise<PollingResult<T>>,
    private readonly config: typeof POLLING_CONFIG = POLLING_CONFIG
  ) {}

  async start(): Promise<PollingResult<T>> {
    try {
      await this.wait(this.config.initialDelay);
      
      while (this.canContinuePolling()) {
        const result = await this.checkFn();

        if (result.status === 'success') {
          logger.log('info', 'Respuesta 200 recibida', { result });
          
          if (result.data && 'status' in result.data) {
            const data = result.data as { status: string; message?: string };
            
            if (data.status === 'success') {
              return { status: 'success', data: result.data as T };
            } else {
              // Preservar el mensaje de error exacto recibido
              return { 
                status: 'error', 
                message: data.message // Usar el mensaje personalizado directamente
              };
            }
          }
          
          return result;
        }

        logger.log('info', 'Continuando polling después de error', {
          intento: this.state.retryCount + 1,
          tiempoTranscurrido: Date.now() - this.state.startTime
        });

        await this.wait(this.config.interval);
        this.state.retryCount++;
      }

      return {
        status: 'timeout',
        message: 'El análisis ha excedido el tiempo máximo de espera (3 minutos)'
      };
    } catch (error) {
      logger.log('error', 'Error en el proceso de polling', { error });
      return {
        status: 'error',
        message: 'Error al verificar el estado del análisis'
      };
    }
  }

  private canContinuePolling(): boolean {
    const timeElapsed = Date.now() - this.state.startTime;
    return timeElapsed < this.config.maxDuration;
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}