import type { RegionalRiskMetric, RiskFilters } from '../interfaces/regionalRiskMetric';

// Simulated database pool reflecting realistic production audit logs
export const mockRiskData: RegionalRiskMetric[] = [
  {
    id: "log-001",
    policy_engine: "Sentinel",
    policy_type: "Security",
    severity: "Hard-M",
    region: "USA",
    provider: "AWS",
    failure_count: 45,
    total_resources: 120,
    last_updated: "2026-05-21T09:15:00Z" 
  },
  {
    id: "log-002",
    policy_engine: "OPA",
    policy_type: "Compute",
    severity: "Soft-M",
    region: "APAC",
    provider: "GCP",
    failure_count: 80,
    total_resources: 340,
    last_updated: "2026-05-21T02:00:00Z" 
  },
  {
    id: "log-003",
    policy_engine: "TFPolicy",
    policy_type: "Networking",
    severity: "Advisory",
    region: "EU",
    provider: "Azure",
    failure_count: 12,
    total_resources: 95,
    last_updated: "2026-05-20T18:45:00Z" 
  },
  {
    id: "log-004",
    policy_engine: "Sentinel",
    policy_type: "Cost",
    severity: "Hard-M",
    region: "USA",
    provider: "Azure",
    failure_count: 55,
    total_resources: 200,
    last_updated: "2026-05-18T14:20:00Z"
  },
  {
    id: "log-005",
    policy_engine: "OPA",
    policy_type: "Storage",
    severity: "Hard-M",
    region: "APAC",
    provider: "Alibaba",
    failure_count: 95,
    total_resources: 400,
    last_updated: "2026-05-15T11:00:00Z"
  },
  {
    id: "log-006",
    policy_engine: "TFPolicy",
    policy_type: "Identity",
    severity: "Soft-M",
    region: "LATAM",
    provider: "Oracle Cloud",
    failure_count: 25,
    total_resources: 110,
    last_updated: "2026-05-16T08:30:00Z"
  },
  {
    id: "log-007",
    policy_engine: "OPA",
    policy_type: "Security",
    severity: "Hard-M",
    region: "EU",
    provider: "AWS",
    failure_count: 40,
    total_resources: 500,
    last_updated: "2026-04-28T16:00:00Z"
  },
  {
    id: "log-008",
    policy_engine: "Sentinel",
    policy_type: "Best Practices",
    severity: "Advisory",
    region: "MENA",
    provider: "Red Hat",
    failure_count: 18,
    total_resources: 150,
    last_updated: "2026-05-02T10:15:00Z"
  },
  {
    id: "log-009",
    policy_engine: "TFPolicy",
    policy_type: "Compute",
    severity: "Hard-M",
    region: "USA",
    provider: "GCP",
    failure_count: 60,
    total_resources: 310,
    last_updated: "2026-03-15T13:00:00Z"
  },
  {
    id: "log-010",
    policy_engine: "OPA",
    policy_type: "Cost",
    severity: "Soft-M",
    region: "EU",
    provider: "AWS",
    failure_count: 30,
    total_resources: 220,
    last_updated: "2026-02-22T09:45:00Z"
  }
];

const isWithinTimeRange = (isoString: string, rangeFilter?: string): boolean => {
  if (!rangeFilter || rangeFilter === 'Custom') return true;

  const recordDate = new Date(isoString).getTime();
  const currentDate = new Date().getTime(); // Evaluated relative to system time (May 2026)
  const differenceInMs = currentDate - recordDate;

  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  switch (rangeFilter) {
    case 'Past 24 hours':
      return differenceInMs <= oneDay;
    case 'Last 7 days':
      return differenceInMs <= 7 * oneDay;
    case 'Last 30 days':
      return differenceInMs <= 30 * oneDay;
    case 'Last 90 days':
      return differenceInMs <= 90 * oneDay;
    default:
      return true;
  }
};

export const getFilteredRegionalRisk = (filters: any, dataPool: RegionalRiskMetric[]) => {
  const filteredData = dataPool.filter(item => {
    // 1. Policy Engine Multi-Select Match
    if (filters.engines && filters.engines.length > 0) {
      if (!filters.engines.includes(item.policy_engine)) return false;
    }
    
    // 2. Policy Type Multi-Select Match
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(item.policy_type)) return false;
    }
    
    // 3. Severity Multi-Select Match
    if (filters.severity && filters.severity.length > 0) {
      if (!filters.severity.includes(item.severity)) return false;
    }
    
    // 4. Provider Multi-Select Match
    if (filters.providers && filters.providers.length > 0) {
      if (!filters.providers.includes(item.provider)) return false;
    }
    
    // 5. Macro Region Multi-Select Match (Fixes your current bug)
    if (filters.region && filters.region.length > 0) {
      if (!filters.region.includes(item.region)) return false;
    }
    
    // 6. Compute Time Range from last_updated
    if (!isWithinTimeRange(item.last_updated, filters.timeRange)) return false;
    
    return true;
  });

  // --- Map Aggregation Engine stays exactly the same ---
  const regionalCoordinates: Record<string, [number, number]> = {
    USA: [-100, 40],
    EU: [15, 52],
    APAC: [105, 30],
    MENA: [35, 25],
    LATAM: [-60, -15]
  };

  const aggregation: Record<string, { region: string; coordinates: [number, number]; totalFailures: number }> = {
    USA: { region: "USA", coordinates: regionalCoordinates.USA, totalFailures: 0 },
    EU: { region: "EU", coordinates: regionalCoordinates.EU, totalFailures: 0 },
    APAC: { region: "APAC", coordinates: regionalCoordinates.APAC, totalFailures: 0 },
    MENA: { region: "MENA", coordinates: regionalCoordinates.MENA, totalFailures: 0 },
    LATAM: { region: "LATAM", coordinates: regionalCoordinates.LATAM, totalFailures: 0 }
  };

  filteredData.forEach(item => {
    if (aggregation[item.region]) {
      aggregation[item.region].totalFailures += item.failure_count;
    }
  });

  return Object.values(aggregation);
};