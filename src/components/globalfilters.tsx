import { useState, useEffect } from "react";
import { Drawer, TextField, Box, Typography, Button } from "@mui/material";
import "../styles/globalfilters.css";
import { fetchHierarchy } from "../services/orgHierrarchyService";
import type { HierarchyNode } from "../interfaces/hierrarchy";
import type { GlobalFiltersProps, GlobalFilterState } from "../interfaces/globalFilterState";

const policyEngines = ["Sentinel", "OPA", "TFPolicy"];
const policyTypes = ["Cost", "Security", "Networking", "Storage", "Compute", "Identity", "Best Practices"];
const severityLevels = ["Hard-M", "Soft-M", "Advisory"];
const regions = ["USA", "EU", "APAC", "MENA", "LATAM"];
const providers = ["Azure", "AWS", "GCP", "Alibaba", "Oracle Cloud", "Red Hat", "Others"];
const timeOptions = ["Past 24 hours", "Last 7 days", "Last 30 days", "Last 90 days", "Custom"];

export default function GlobalFilters({ currentFilters, onFilterChange }: GlobalFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [localFilters, setLocalFilters] = useState<GlobalFilterState>(currentFilters);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(`${today}T00:00`);
  const [endDate, setEndDate] = useState(`${today}T23:59`);

  useEffect(() => {
    // PRE-TICK LOGIC: Initialize with all options if current state is empty
    const initial = { ...currentFilters };
    if (initial.engines.length === 0) initial.engines = [...policyEngines];
    if (initial.types.length === 0) initial.types = [...policyTypes];
    if (initial.severity.length === 0) initial.severity = [...severityLevels];
    if (initial.region.length === 0) initial.region = [...regions];
    if (initial.providers.length === 0) initial.providers = [...providers];
    
    setLocalFilters(initial);
    fetchHierarchy().then((data) => { setHierarchyData(data); setLoading(false); });
  }, []);

  const toggleDropdown = (name: string) => setOpenDropdown(openDropdown === name ? null : name);

  const handleToggleOption = (key: keyof GlobalFilterState, option: string) => {
    const currentList = localFilters[key] as string[];
    const newList = currentList.includes(option) ? currentList.filter(i => i !== option) : [...currentList, option];
    setLocalFilters({ ...localFilters, [key]: newList });
  };

  const handleApplyAll = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
        onFilterChange(key as keyof GlobalFilterState, value);
    });
    setOpenDropdown(null);
  };

const getFilterLabel = (defaultLabel: string, selectedValues: string[], totalOptions: number) => {
  if (selectedValues.length === 0) return defaultLabel; // e.g. "Policy Engine"
  if (selectedValues.length === totalOptions) return `${defaultLabel}s`;
  if (selectedValues.length === 1) return selectedValues[0];
  return `${defaultLabel} (${selectedValues.length})`;
};

  const getHierarchyLabel = () => {
    const { org, proj, entity } = localFilters.hierarchy;
    if (entity) return hierarchyData.flatMap(o => o.children || []).flatMap(p => p.children || []).find(e => e.id === entity)?.name || "Explorer";
    if (proj) return hierarchyData.flatMap(o => o.children || []).find(p => p.id === proj)?.name || "Project";
    if (org) return hierarchyData.find(o => o.id === org)?.name || "Org";
    return "Organization";
  };

  const renderTree = (nodes: HierarchyNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div className="dropdown-item" style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            let newH = { ...localFilters.hierarchy };
            if (node.type === 'organization') newH = { org: node.id, proj: "", entity: "" };
            else if (node.type === 'project') newH = { ...newH, proj: node.id, entity: "" };
            else { newH = { ...newH, entity: node.id }; setOpenDropdown(null); }
            setLocalFilters({ ...localFilters, hierarchy: newH });
          }}
        >
          <span>{node.type === 'workspace' || node.type === 'stack' ? "📄" : "📁"}</span>
          <span style={{ fontWeight: Object.values(localFilters.hierarchy).includes(node.id) ? 'bold' : 'normal' }}>{node.name}</span>
        </div>
        {node.children && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  const FilterItem = ({ label, options, filterKey }: { label: string; options: string[]; filterKey: keyof GlobalFilterState }) => {
    const selectedValues = localFilters[filterKey] as string[];
    return (
      <div className="filter-wrapper">
        <button className="input-style" onClick={() => toggleDropdown(filterKey)}>
          <span>{getFilterLabel(label, selectedValues, options.length)}</span>
          <span>{openDropdown === filterKey ? "▲" : "▼"}</span>
        </button>
        {openDropdown === filterKey && (
          <div className="dropdown-menu">
            {options.map((opt) => (
              <label key={opt} className="dropdown-item">
                <input type="checkbox" checked={selectedValues.includes(opt)} onChange={() => handleToggleOption(filterKey, opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-parent-container">
      <div className="filter-header-single-line">
        <span className="header-title">Apply Filters:</span>
        <span className="header-desc">Refine dashboard metrics by selecting specific infrastructure and policy parameters.</span>
      </div>

      <div className="filter-row">
        <div className="filter-wrapper">
          <button className="input-style hierarchy-btn" onClick={() => toggleDropdown("hierarchy")}>
            <span>{getHierarchyLabel()}</span>
            <span>{openDropdown === "hierarchy" ? "▲" : "▼"}</span>
          </button>
          {openDropdown === "hierarchy" && (
            <div className="dropdown-menu tree-menu">
              {loading ? <div className="dropdown-item">Loading...</div> : renderTree(hierarchyData)}
            </div>
          )}
        </div>

        <FilterItem label="Policy Engine" options={policyEngines} filterKey="engines" />
        <FilterItem label="Policy Type" options={policyTypes} filterKey="types" />
        <FilterItem label="Severity" options={severityLevels} filterKey="severity" />
        <FilterItem label="Region" options={regions} filterKey="region" />
        <FilterItem label="Provider" options={providers} filterKey="providers" />

        <div className="filter-wrapper">
          <button className="input-style time-btn" onClick={() => toggleDropdown("time")}>
            <span>{localFilters.timeRange}</span>
            <span>{openDropdown === "time" ? "▲" : "▼"}</span>
          </button>
          {openDropdown === "time" && (
            <div className="dropdown-menu">
              {timeOptions.map((opt) => (
                <div key={opt} className="dropdown-item" onClick={() => {
                  if (opt === "Custom") setIsDrawerOpen(true);
                  else setLocalFilters({...localFilters, timeRange: opt});
                  setOpenDropdown(null);
                }}>{opt}</div>
              ))}
            </div>
          )}
        </div>

        <Button variant="contained" className="apply-btn" onClick={handleApplyAll}>Apply Filters</Button>
        <button className="export-button-outlined">Export Data (Beta)</button>
      </div>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ p: 3, width: 320 }}>
          <Typography variant="h6" gutterBottom>Custom Range</Typography>
          <TextField type="datetime-local" fullWidth value={startDate} onChange={(e)=>setStartDate(e.target.value)} sx={{mb:2}} />
          <TextField type="datetime-local" fullWidth value={endDate} onChange={(e)=>setEndDate(e.target.value)} sx={{mb:3}} />
          <Button variant="contained" fullWidth onClick={() => {
            setLocalFilters({...localFilters, timeRange: `${startDate.split("T")[0]} - ${endDate.split("T")[0]}`});
            setIsDrawerOpen(false);
          }}>Set Range</Button>
        </Box>
      </Drawer>
    </div>
  );
}