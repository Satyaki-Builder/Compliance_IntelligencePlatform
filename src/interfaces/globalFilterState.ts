import type { SelectionState } from "./hierrarchy";

export interface GlobalFilterState {
  hierarchy: SelectionState;
  engines: string[];
  types: string[];
  severity: string[];
  region: string[];
  providers: string[];
  timeRange: string;
}

export interface GlobalFiltersProps {
  currentFilters: GlobalFilterState;
  onFilterChange: (key: keyof GlobalFilterState, value: any) => void;
}