import { useState, useEffect } from "react";
import { Drawer, TextField, Box, Typography } from "@mui/material";
import "../styles/globalfilters.css";
import { fetchHierarchy } from "../services/orgHierrarchyService";
import type { HierarchyNode, SelectionState } from "../interfaces/hierrarchy";

const policyEngines = ["Sentinel", "OPA", "TFPolicy"];
const policyTypes = ["Cost", "Security", "Networking", "Storage", "Compute", "Identity", "Best Practices"];
const severityLevels = ["Hard-M", "Soft-M", "Advisory"];
const regions = ["USA", "EU", "APAC", "MENA", "LATAM"];
const providers = ["Azure", "AWS", "GCP", "Alibaba", "Oracle Cloud", "Red Hat", "Others"];
const timeOptions = ["Past 24 hours", "Last 7 days", "Last 30 days", "Last 90 days", "Custom"];

export default function GlobalFilters() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<SelectionState>({ org: "", proj: "", entity: "" });
  const [selectedTime, setSelectedTime] = useState("Last 30 days");

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

  const handleTimeSelect = (option: string) => {
    if (option === "Custom") {
      setIsDrawerOpen(true);
      setOpenDropdown(null);
    } else {
      setSelectedTime(option);
      setOpenDropdown(null);
    }
  };

  const applyCustomRange = () => {
    const start = startDate.split("T")[0];
    const end = endDate.split("T")[0];
    setSelectedTime(`${start} to ${end}`);
    setIsDrawerOpen(false);
  };

  const getHierarchyLabel = () => {
    if (selection.entity) {
      return hierarchyData.flatMap(o => o.children || []).flatMap(p => p.children || []).find(e => e.id === selection.entity)?.name || "Explorer";
    }
    if (selection.proj) return hierarchyData.flatMap(o => o.children || []).find(p => p.id === selection.proj)?.name;
    if (selection.org) return hierarchyData.find(o => o.id === selection.org)?.name;
    return "Explore Organization";
  };

  const renderTree = (nodes: HierarchyNode[], level = 0) => {
    return (
      <>
        {/* ADD THIS: A "Reset" option only at the top level */}
        {level === 0 && (
          <div 
            className="dropdown-item" 
            style={{ color: '#0ea5e9', fontWeight: 'bold', borderBottom: '1px solid #f3f4f6' }}
            onClick={() => {
              setSelection({ org: "", proj: "", entity: "" });
              setOpenDropdown(null);
            }}
          >
            <span>🔄</span>
            <span>All Organizations</span>
          </div>
        )}

        {nodes.map((node) => (
          <div key={node.id}>
            <div 
              className="dropdown-item"
              style={{ paddingLeft: `${level * 16 + 12}px` }}
              onClick={() => {
                if (node.type === 'organization') setSelection({ org: node.id, proj: "", entity: "" });
                if (node.type === 'project') setSelection({ ...selection, proj: node.id, entity: "" });
                if (node.type === 'workspace' || node.type === 'stack') {
                    setSelection({ ...selection, entity: node.id });
                    setOpenDropdown(null);
                }
              }}
            >
              <span>{node.type === 'workspace' || node.type === 'stack' ? "📄" : "📁"}</span>
              <span style={{ fontWeight: selection.org === node.id || selection.proj === node.id || selection.entity === node.id ? 'bold' : 'normal' }}>
                {node.name}
              </span>
            </div>
            {node.children && renderTree(node.children, level + 1)}
          </div>
        ))}
      </>
    );
  };

  const FilterItem = ({ label, options, id }: { label: string; options: string[]; id: string }) => (
    <div className="filter-wrapper">
      <button className="filter-button" onClick={() => toggleDropdown(id)}>
        <span>{label}</span>
        <span>{openDropdown === id ? "▲" : "▼"}</span>
      </button>
      {openDropdown === id && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <label key={opt} className="dropdown-item">
              <input type="checkbox" />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="filter-container">
      {/* 1. HIERARCHY */}
      <div className="filter-wrapper">
        <button className="hierarchy-button" onClick={() => toggleDropdown("hierarchy")}>
          <span>{getHierarchyLabel()}</span>
          <span>{openDropdown === "hierarchy" ? "▲" : "▼"}</span>
        </button>
        {openDropdown === "hierarchy" && (
          <div className="dropdown-menu" style={{ minWidth: "250px", maxHeight: "400px", overflowY: "auto" }}>
            {loading ? <div className="dropdown-item">Loading...</div> : renderTree(hierarchyData)}
          </div>
        )}
      </div>

      {/* 2. CORE FILTERS */}
      <FilterItem label="Policy Engine" options={policyEngines} id="engine" />
      <FilterItem label="Policy Type" options={policyTypes} id="type" />
      <FilterItem label="Severity" options={severityLevels} id="severity" />
      <FilterItem label="Region" options={regions} id="region" />
      <FilterItem label="Provider" options={providers} id="provider" />

      {/* 3. TIME RANGE */}
      <div className="filter-wrapper">
        <button className="filter-button time-filter-button" onClick={() => toggleDropdown("time")}>
          <span>{selectedTime}</span>
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

      {/* 4. EXPORT */}
      <div className="spacer">
      <button className="export-button">
        Export Data (Beta)
      </button>
      </div>
      {/* CUSTOM DATE DRAWER */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box className="drawer-content-box">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Custom Time Range</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Start Date & Time</Typography>
            <TextField type="datetime-local" fullWidth size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>End Date & Time</Typography>
            <TextField type="datetime-local" fullWidth size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Box>
          <button className="filter-button" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }} onClick={applyCustomRange}>
            Apply Range
          </button>
        </Box>
      </Drawer>
    </div>
  );
}