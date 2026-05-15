import { useState } from "react";
import GlobalFilters from "./components/globalfilters";
import RecommendationPanel from "./components/recommendationPanel";
import type { GlobalFilterState } from "./interfaces/globalFilterState";
import MetricsDashboard from "./components/metricsDashboard";
import { Typography } from "@mui/material";

function App() {
  // Initialize the global filter state
  const [filterState, setFilterState] = useState<GlobalFilterState>({
    hierarchy: { org: "", proj: "", entity: "" },
    engines: [],
    types: [],
    severity: [],
    region: [],
    providers: [],
    timeRange: "Last 30 days",
  });

  // Centralized handler to update state from child components
  const handleFilterChange = (key: keyof GlobalFilterState, value: any) => {
    setFilterState((prev:any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* SIDEBAR */}
      <aside style={{ width: "240px", borderRight: "1px solid #e5e7eb", backgroundColor: "#f9fafb", padding: "20px" }}>
        <div style={{ color: "#6b7280", fontWeight: "bold", marginBottom: "20px" }}>Manage</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
           <div>Projects</div>
           <div>Stacks</div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, backgroundColor: "white" }}>
        {/* Pass state and handler as props */}
        
          {/* Recommendation Panel */}  
      <RecommendationPanel />

        <GlobalFilters 
          currentFilters={filterState} 
          onFilterChange={handleFilterChange} 
        />
        

      {/* Placeholder for Metrics Dashboard */}
      <MetricsDashboard filters={filterState} />
      </main>
    </div>
  );
}

export default App;
