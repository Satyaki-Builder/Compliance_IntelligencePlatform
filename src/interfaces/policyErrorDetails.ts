import type { GlobalFilterState } from './globalFilterState';

export interface RunDetail {
  run_id: string;
  organization: string;
  project: string;
  environment: string;
  workspace: string | null;
  stack: string | null;
  run_time: string;
}

export interface PolicyErrorItem {
  policy_name: string;
  policy_set: string;
  error_message: string;
  frequency: number;
  
  // Explicit parent-level classification metadata keys for filtering mapping
  policy_engine: string;
  policy_type: string;
  severity: string;
  region: string;
  provider: string;
  
  run_details: RunDetail[];
}

export interface PolicyDashboardPayload {
  policy_errors: PolicyErrorItem[];
}

// Props contract for your component
export interface PolicyHealthDashboardProps {
  filters: GlobalFilterState;
}