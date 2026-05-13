import { useState, useEffect } from "react";
import { Drawer, TextField, Box, Typography } from "@mui/material";
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

  // Date States for the Drawer
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(`${today}T00:00`);
  const [endDate, setEndDate] = useState(`${today}T23:59`);

  useEffect(() => {
    fetchHierarchy().then((data) => {
      setHierarchyData(data);
      setLoading(false);
    });
  }, []);

  const toggleDropdown = (name: string) => setOpenDropdown(openDropdown === name ? null : name);

  // --- LOGIC HANDLERS ---

  const handleToggleOption = (key: keyof GlobalFilterState, option: string) => {
    const currentList = currentFilters[key] as string[];
    const newList = currentList.includes(option)
      ? currentList.filter(item => item !== option)
      : [...currentList, option];
    
    onFilterChange(key, newList);
  };

  const handleTimeSelect = (option: string) => {
    if (option === "Custom") {
      setIsDrawerOpen(true);
      setOpenDropdown(null);
    } else {
      onFilterChange("timeRange", option);
      setOpenDropdown(null);
    }
  };

  const applyCustomRange = () => {
    const rangeString = `${startDate.split("T")[0]} to ${endDate.split("T")[0]}`;
    onFilterChange("timeRange", rangeString);
    setIsDrawerOpen(false);
  };

  // Helper for dynamic labels (e.g., "Sentinel" or "Policy Engine (2)")
  const getFilterLabel = (defaultLabel: string, selectedValues: string[]) => {
    if (selectedValues.length === 0) return defaultLabel;
    if (selectedValues.length === 1) return selectedValues[0];
    return `${defaultLabel} (${selectedValues.length})`;
  };

  const getHierarchyLabel = () => {
    const { org, proj, entity } = currentFilters.hierarchy;
    if (entity) return hierarchyData.flatMap(o => o.children || []).flatMap(p => p.children || []).find(e => e.id === entity)?.name || "Explorer";
    if (proj) return hierarchyData.flatMap(o => o.children || []).find(p => p.id === proj)?.name;
    if (org) return hierarchyData.find(o => o.id === org)?.name;
    return "Explore Organization";
  };

  // --- RENDERERS ---

  const renderTree = (nodes: HierarchyNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div 
          className="dropdown-item"
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            let newHierarchy = { ...currentFilters.hierarchy };
            if (node.type === 'organization') newHierarchy = { org: node.id, proj: "", entity: "" };
            if (node.type === 'project') newHierarchy = { ...newHierarchy, proj: node.id, entity: "" };
            if (node.type === 'workspace' || node.type === 'stack') {
                newHierarchy = { ...newHierarchy, entity: node.id };
                setOpenDropdown(null);
            }
            onFilterChange("hierarchy", newHierarchy);
          }}
        >
          <span>{node.type === 'workspace' || node.type === 'stack' ? "📄" : "📁"}</span>
          <span style={{ fontWeight: Object.values(currentFilters.hierarchy).includes(node.id) ? 'bold' : 'normal' }}>
            {node.name}
          </span>
        </div>
        {node.children && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  // Reusable Multi-select Dropdown with Dynamic Label and Flipping Arrow
  const FilterItem = ({ label, options, filterKey }: { label: string; options: string[]; filterKey: keyof GlobalFilterState }) => {
    const selectedValues = currentFilters[filterKey] as string[];
    const isOpen = openDropdown === filterKey;

    return (
      <div className="filter-wrapper">
        <button className="filter-button" onClick={() => toggleDropdown(filterKey)}>
          <span>{getFilterLabel(label, selectedValues)}</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            {options.map((opt) => (
              <label key={opt} className="dropdown-item">
                <input 
                  type="checkbox" 
                  checked={selectedValues.includes(opt)}
                  onChange={() => handleToggleOption(filterKey, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-container">
      {/* 1. HIERARCHY */}
      <div className="filter-wrapper">
        <button className="hierarchy-button" onClick={() => toggleDropdown("hierarchy")}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{getHierarchyLabel()}</span>
            {/* RESET BUTTON */}
            {(currentFilters.hierarchy.org) && (
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterChange("hierarchy", { org: "", proj: "", entity: "" });
                }}
                style={{ cursor: 'pointer', opacity: 0.5, fontSize: '10px' }}
              >
                ✕
              </span>
            )}
          </div>
          <span>{openDropdown === "hierarchy" ? "▲" : "▼"}</span>
        </button>
        {openDropdown === "hierarchy" && (
          <div className="dropdown-menu" style={{ minWidth: "250px", maxHeight: "400px", overflowY: "auto" }}>
            {loading ? <div className="dropdown-item">Loading...</div> : renderTree(hierarchyData)}
          </div>
        )}
      </div>

      {/* 2. CORE FILTERS (Now Dynamic) */}
      <FilterItem label="Policy Engine" options={policyEngines} filterKey="engines" />
      <FilterItem label="Policy Type" options={policyTypes} filterKey="types" />
      <FilterItem label="Severity" options={severityLevels} filterKey="severity" />
      <FilterItem label="Region" options={regions} filterKey="region" />
      <FilterItem label="Provider" options={providers} filterKey="providers" />

      {/* 3. TIME RANGE */}
      <div className="filter-wrapper">
        <button className="filter-button time-filter-button" onClick={() => toggleDropdown("time")}>
          <span>{currentFilters.timeRange}</span>
          <span>{openDropdown === "time" ? "▲" : "▼"}</span>
        </button>
        {openDropdown === "time" && (
          <div className="dropdown-menu">
            {timeOptions.map((opt) => (
              <div key={opt} className="dropdown-item" onClick={() => handleTimeSelect(opt)}>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="spacer" />

      {/* 4. EXPORT */}
      <button className="export-button">Export Data (Beta)</button>

      {/* DRAWER */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box className="drawer-content-box">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Custom Time Range</Typography>
          <TextField type="datetime-local" fullWidth value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ mt: 2 }} />
          <TextField type="datetime-local" fullWidth value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ mt: 2 }} />
          <button className="filter-button" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }} onClick={applyCustomRange}>
            Apply Range
          </button>
        </Box>
      </Drawer>
    </div>
  );
}