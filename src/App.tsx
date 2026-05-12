import { useState } from 'react'
import { Card, Typography } from '@mui/material'
import './App.css'
import '@hashicorp/design-system-tokens/dist/products/css/tokens.css';
import GlobalFilters from "./components/globalfilters";


function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      
      {/* 1. SIDEBAR AREA */}
      {/*<aside 
        style={{ 
          width: "240px",         // Fixed width for your sidebar
          borderRight: "1px solid #e5e7eb", 
          backgroundColor: "#f9fafb",
          padding: "20px"
        }}
      >       
        <div style={{ color: "#6b7280", fontWeight: "bold", marginBottom: "20px" }}>Manage</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
           <div>Projects</div>
           <div>Stacks</div>
        </nav>
      </aside>*/}
      

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, backgroundColor: "white" }}>
        <GlobalFilters />
        
        {/* This padding prevents the dashboard widgets from touching the sidebar border */}
        <div style={{ padding: "24px" }}>
             {/* Your widgets like activePolicies.tsx will go here */}
        </div>
      </main>

    </div>
  );
}

export default App
