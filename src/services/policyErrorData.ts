import type { PolicyErrorItem } from '../interfaces/policyErrorDetails';
import type { GlobalFilterState } from '../interfaces/globalFilterState';

// 1. Corrected Database Pool: Fully populated with mandatory filtering keys
export const mockPolicyErrors: PolicyErrorItem[] = [
  {
    policy_name: "restrict-s3-buckets",
    policy_set: "Sentinel-AWS-1",
    error_message: "Undefined Variable",
    frequency: 6,
    policy_engine: "Sentinel",
    policy_type: "Security",
    severity: "Hard-M",
    region: "USA",
    provider: "AWS",
    run_details: [
      {
        run_id: "8fa21683-1bda-45e3-99b3-059ad453ba6a",
        organization: "hashicorp-internal",
        project: "finance-ledger-infra",
        environment: "production",
        workspace: "prod-east-vessels",
        stack: null,
        run_time: "2026-05-21T09:45:30Z"
      },
      {
        run_id: "4b971e44-d830-4e37-bc6d-628d09f7b11c",
        organization: "hashicorp-internal",
        project: "finance-ledger-infra",
        environment: "production",
        workspace: "prod-east-vessels",
        stack: null,
        run_time: "2026-05-20T14:22:05Z"
      },
      {
        run_id: "c1a9bc3d-5bb7-4581-998f-431f90e8a712",
        organization: "hashicorp-internal",
        project: "marketing-web-app",
        environment: "staging",
        workspace: "stage-us-assets",
        stack: null,
        run_time: "2026-05-15T11:10:00Z"
      },
      {
        run_id: "e5c70912-32b4-4c4c-9a4f-56bbcfde2144",
        organization: "hashicorp-internal",
        project: "finance-ledger-infra",
        environment: "development",
        workspace: "dev-east-test",
        stack: null,
        run_time: "2026-05-02T16:40:12Z"
      },
      {
        run_id: "239bca45-982d-4114-ba36-8c90fe329bbb",
        organization: "hashicorp-internal",
        project: "core-auth-service",
        environment: "production",
        workspace: "prod-global-auth",
        stack: null,
        run_time: "2026-04-25T08:15:22Z"
      },
      {
        run_id: "f47101de-74b8-4c11-9fa1-01cdbf89c1d3",
        organization: "hashicorp-internal",
        project: "marketing-web-app",
        environment: "production",
        workspace: "prod-us-assets",
        stack: null,
        run_time: "2026-03-10T13:02:00Z"
      }
    ]
  },
  {
    policy_name: "check-iam-roles",
    policy_set: "OPA-1",
    error_message: "Regex Line 2",
    frequency: 5,
    policy_engine: "OPA",
    policy_type: "Security",
    severity: "Soft-M",
    region: "EU",
    provider: "AWS",
    run_details: [
      {
        run_id: "01efca23-bb45-42d3-82ff-3bcf6e12a456",
        organization: "hashicorp-internal",
        project: "data-lake-pipelines",
        environment: "production",
        workspace: null,
        stack: "spc-prod-datalake",
        run_time: "2026-05-21T13:00:00Z"
      },
      {
        run_id: "19cdba8a-de56-4c4f-bd32-5e6fa90de012",
        organization: "hashicorp-internal",
        project: "data-lake-pipelines",
        environment: "production",
        workspace: null,
        stack: "spc-prod-datalake",
        run_time: "2026-05-19T04:12:45Z"
      },
      {
        run_id: "88bcfa9e-214e-412f-90ab-cd1ea2b4c567",
        organization: "hashicorp-internal",
        project: "data-lake-pipelines",
        environment: "staging",
        workspace: null,
        stack: "spc-stage-datalake",
        run_time: "2026-05-10T22:31:10Z"
      },
      {
        run_id: "55dfba21-119c-4ab3-bd21-0aef894cd213",
        organization: "hashicorp-internal",
        project: "sec-ops-hardening",
        environment: "production",
        workspace: null,
        stack: "spc-prod-iam-audit",
        run_time: "2026-04-28T17:19:00Z"
      },
      {
        run_id: "a44efd12-bb23-411a-8cca-c90dfbe55142",
        organization: "hashicorp-internal",
        project: "sec-ops-hardening",
        environment: "development",
        workspace: null,
        stack: "spc-dev-iam-audit",
        run_time: "2026-03-22T06:45:00Z"
      }
    ]
  },
  {
    policy_name: "restrict-transit-gateways",
    policy_set: "TFPolicy-1",
    error_message: "Invalid CIDR Format",
    frequency: 4,
    policy_engine: "TFPolicy",
    policy_type: "Networking",
    severity: "Advisory",
    region: "APAC",
    provider: "GCP",
    run_details: [
      {
        run_id: "aa123b45-cc56-4dd7-88ee-ff9900aabbcc",
        organization: "hashicorp-internal",
        project: "global-transit-net",
        environment: "production",
        workspace: "prod-tgw-backbone",
        stack: null,
        run_time: "2026-05-21T06:15:00Z"
      },
      {
        run_id: "bb234c56-dd67-4ee8-99ff-00bbaacc11dd",
        organization: "hashicorp-internal",
        project: "global-transit-net",
        environment: "staging",
        workspace: "stage-tgw-backbone",
        stack: null,
        run_time: "2026-05-18T10:00:22Z"
      },
      {
        run_id: "cc345d67-ee78-4ff9-00aa-11bbccdd22ee",
        organization: "hashicorp-internal",
        project: "global-transit-net",
        environment: "development",
        workspace: "dev-tgw-branch",
        stack: null,
        run_time: "2026-04-12T14:55:00Z"
      },
      {
        run_id: "dd456e78-ff89-40fa-11bb-22ccddee33ff",
        organization: "hashicorp-internal",
        project: "hybrid-cloud-mesh",
        environment: "production",
        workspace: "prod-mesh-gateway",
        stack: null,
        run_time: "2026-02-25T11:20:10Z"
      }
    ]
  }
];

// 2. Reliable Time Range Checker Utility
const isWithinTimeRange = (isoString: string, rangeFilter?: string): boolean => {
  if (!rangeFilter || rangeFilter === 'Custom') return true;

  const recordDate = new Date(isoString).getTime();
  const currentDate = new Date().getTime(); 
  const differenceInMs = currentDate - recordDate;

  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  switch (rangeFilter) {
    case 'Past 24 hours': return differenceInMs <= oneDay;
    case 'Last 7 days':    return differenceInMs <= 7 * oneDay;
    case 'Last 30 days':   return differenceInMs <= 30 * oneDay;
    case 'Last 90 days':   return differenceInMs <= 90 * oneDay;
    default: return true;
  }
};

// 3. Exact Multi-Select Filtering Engine utilizing the structural explicit keys
export const getFilteredPolicyHealth = (
  filters: GlobalFilterState, 
  dataPool: PolicyErrorItem[] = mockPolicyErrors
): PolicyErrorItem[] => {
  return dataPool
    .filter((item) => {
      // Direct exact match checking against multi-select arrays
      if (filters.engines && filters.engines.length > 0) {
        if (!filters.engines.includes(item.policy_engine)) return false;
      }
      
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(item.policy_type)) return false;
      }
      
      if (filters.severity && filters.severity.length > 0) {
        if (!filters.severity.includes(item.severity)) return false;
      }
      
      if (filters.providers && filters.providers.length > 0) {
        if (!filters.providers.includes(item.provider)) return false;
      }
      
      if (filters.region && filters.region.length > 0) {
        if (!filters.region.includes(item.region)) return false;
      }

      return true;
    })
    .map((policy) => {
      // Deep filter sub-run details based on dynamic context rules
      const processedRuns = policy.run_details.filter((run) => {
        if (!isWithinTimeRange(run.run_time, filters.timeRange)) return false;

        if (filters.hierarchy?.org && run.organization !== filters.hierarchy.org) return false;
        if (filters.hierarchy?.proj && run.project !== filters.hierarchy.proj) return false;

        return true;
      });

      // Synchronize calculated frequencies instantly and return complete type shape
      return {
        policy_name: policy.policy_name,
        policy_set: policy.policy_set,
        error_message: policy.error_message,
        frequency: processedRuns.length,
        policy_engine: policy.policy_engine,
        policy_type: policy.policy_type,
        severity: policy.severity,
        region: policy.region,
        provider: policy.provider,
        run_details: processedRuns,
      };
    })
    // Filter out rows that have no matching error occurrences within selected time/hierarchy windows
    .filter((policy) => policy.frequency > 0);
};