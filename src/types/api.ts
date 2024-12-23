export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}