export interface AnalysisFormData {
  text: string;
  language: string;
  segment: string;
  file: File | null;
}

export interface AnalysisPayload {
  text: string;
  requestId: string;
  language: string;
  segment: string;
  contentType: string;
  mimeType: string;
  contextType: string;
}

export interface AnalysisResult {
  riskPhishing: {
    totalRiskScore: number;
    riskLevel: string;
  };
  emailSummary: string;
  overallAnalysis: string;
  negative_signals: string[];
  recomendation: Array<{
    recommendation_title: string;
    recommendation_detail: string;
  }>;
  alias?: string;
}