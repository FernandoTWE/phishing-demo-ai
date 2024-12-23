export const POLLING_CONFIG = {
  initialDelay: 10000,  // 10 segundos antes del primer intento
  interval: 10000,      // 10 segundos entre intentos
  maxDuration: 180000,  // 3 minutos máximo
  maxRetries: 18        // 18 intentos en 3 minutos
} as const;