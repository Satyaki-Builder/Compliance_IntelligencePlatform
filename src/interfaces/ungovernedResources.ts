
export interface UngovernedResources {
    id: string;
    name: string;
    type: string;
    policy_engine: string;
    severity: string;
    region: string;
    provider: string;
    status: string;
    last_run: string;
    environment: string;
    run_id: string;
    triggered_by: string;
    source: string;
    resources_attached: number;
    policies_attached: string[];
}


