export interface PollingConfig {
  interval: number;
  maxRetries: number;
  timeout: number;
}

export interface PollingState {
  retryCount: number;
  startTime: number;
}

export interface PollingResult<T> {
  status: 'success' | 'error' | 'timeout';
  data?: T;
  message?: string;
}