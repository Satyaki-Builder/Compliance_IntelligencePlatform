export interface RegionalRiskMetric {
  id: string;
  policy_engine: string;
  policy_type: string;
  severity: string;
  region: string;
  provider: string;  
  failure_count: number;
  total_resources: number;
  last_updated: string; // ISO Timestamp string (e.g., "2026-05-21T08:30:00Z")
}

export interface RiskFilters {
  policy_engine?: string;
  policy_type?: string;
  severity?: string;
  provider?: string;
  time_range?: string;
}