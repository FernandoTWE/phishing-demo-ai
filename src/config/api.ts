import { z } from 'zod';

// API Endpoints Schema
const endpointsSchema = z.object({
  WEBHOOK: z.string().url(),
  ANALYSIS_HISTORY: z.string().url(),
  ANALYSIS_RESULT_BASE: z.string().url()
});

// API Headers Schema
const headersSchema = z.object({
  'Content-Type': z.string()
});

// API Config Schema
const apiConfigSchema = z.object({
  ENDPOINTS: endpointsSchema,
  HEADERS: headersSchema,
  TIMEOUT: z.number()
});

// API Configuration
export const API_CONFIG = {
  ENDPOINTS: {
    WEBHOOK: 'https://n8n.devonlineassist.me/webhook/c632fddb-eb30-4c03-ab1d-2795850bcb9d',
    ANALYSIS_HISTORY: 'https://4bda4.twidget.io/pishingdemo',
    ANALYSIS_RESULT_BASE: 'https://4bda4.twidget.io/pishingdemo'
  },
  HEADERS: {
    'Content-Type': 'application/json'
  },
  TIMEOUT: 30000 // 30 seconds
} as const;

// Type for the API configuration
export type ApiConfig = z.infer<typeof apiConfigSchema>;

// Validate configuration
apiConfigSchema.parse(API_CONFIG);

// API Response Types
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS];

// API Error Codes
export const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED'
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];

// Helper function to get individual analysis result URL
export function getAnalysisResultUrl(requestId: string): string {
  return `${API_CONFIG.ENDPOINTS.ANALYSIS_RESULT_BASE}/${requestId}`;
}

// Helper function to build API URLs
export function buildApiUrl(endpoint: keyof ApiConfig['ENDPOINTS'], params?: Record<string, string>): string {
  const baseUrl = API_CONFIG.ENDPOINTS[endpoint];
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value);
  });

  return `${baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
}