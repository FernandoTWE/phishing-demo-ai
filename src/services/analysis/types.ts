export interface AnalysisHistoryItem {
  requestId: string;
  created_at: string;
  status: string;
  alias?: string;
  riskPhishing?: {
    totalRiskScore: number;
    riskLevel: string;
  };
}