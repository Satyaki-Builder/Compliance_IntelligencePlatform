import React, { useState } from 'react';
import { mockUngovernedResources } from '../services/ungovernedResources';
import type { GlobalFilterState } from '../interfaces/globalFilterState'; // 1. Import your filter type
import '../styles/ungovernedResourcesTable.css';

// Import your platform assets
import slackIcon from '../assets/slack.png';
import teamsIcon from '../assets/teams.png';
import outlookIcon from '../assets/outlook.png';

export interface PopUpMetadata {
  workspaceName: string;
  runId: string;
  triggeredBy: string;
  lastRun: string;
}

// 2. Define the explicit Props interface to match what App.tsx is passing down
export interface UngovernedResourcesTablesProps {
  filters: GlobalFilterState;
}

// 3. Update React.FC to accept your new interface definition
export const UngovernedResourcesTables: React.FC<UngovernedResourcesTablesProps> = ({ filters }) => {
  const [modalContext, setModalContext] = useState<PopUpMetadata | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Note: You can now use the `filters` prop inside this component to run matching 
  // operations against `mockUngovernedResources` similar to your Policy Dashboard!

  const handleEnvironmentClick = (e: React.MouseEvent, resource: typeof mockUngovernedResources[0]) => {
    e.stopPropagation();
    setSelectedRowId(resource.id);
    
    const rawPrefix = resource.name.split('-')[0] || 'sandbox';
    const formattedTime = new Date(resource.last_run).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    setModalContext({
      workspaceName: `${rawPrefix}-platform`,
      runId: resource.run_id,
      triggeredBy: resource.triggered_by,
      lastRun: formattedTime
    });
  };

  const getResourceHeatmapClass = (count: number) => {
    if (count >= 15) return 'risk-critical'; 
    if (count >= 8) return 'risk-high';      
    return 'risk-nominal';                   
  };

  return (
    <div className="table-split-wrapper-right">
      <div className="enterprise-dashboard-container">
        
        {/* Balanced Level-Aligned Header Ribbon */}
        <header className="table-dashboard-header-ribbon">
          <h2 className="main-section-title">Ungoverned Resources Deployed</h2>
          
          <div className="collaboration-tray">
            <button className="icon-btn-asset" title="Share via Slack">
              <img src={slackIcon} alt="Slack" className="brand-logo-img" />
              Slack
            </button>
            <button className="icon-btn-asset" title="Share via Teams">
              <img src={teamsIcon} alt="Teams" className="brand-logo-img" />
              Teams
            </button>
            <button className="icon-btn-asset" title="Share via Outlook">
              <img src={outlookIcon} alt="Outlook" className="brand-logo-img" />
              Outlook
            </button>
          </div>
        </header>

        {/* Scrollable Grid Canvas */}
        <div className="table-scroll-viewport persistent-scroll">
          <table className="compliance-data-table">
            <thead>
              <tr>
                <th>Workspace Name</th>
                <th>Source</th>
                <th>Environment</th>
                <th>Resources Impacted</th>
              </tr>
            </thead>
            <tbody>
              {mockUngovernedResources.map((resource) => {
                const rawPrefix = resource.name.split('-')[0] || 'sandbox';
                const workspaceDisplay = `${rawPrefix}-platform`;
                const envDisplay = resource.environment?.toLowerCase() || 'production';
                const count = resource.resources_attached || 10;

                return (
                  <tr key={resource.id} className={`data-row-target ${selectedRowId === resource.id ? 'row-selected' : ''}`}>
                    <td className="workspace-cell">{workspaceDisplay}</td>
                    <td className="source-cell">{resource.source}</td>
                    <td className="env-cell">
                      <span 
                        className="interactive-env-link"
                        onClick={(e) => handleEnvironmentClick(e, resource)}
                      >
                        {envDisplay}
                      </span>
                    </td>
                    <td className="resources-cell">
                      <span className={`status-indicator-dot ${getResourceHeatmapClass(count)}`}></span>
                      <span className="count-value">{count}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Localized Modal Overlay */}
        {modalContext && (
          <div className="modal-overlay-backdrop" onClick={() => setModalContext(null)}>
            <div className="modal-content-window" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header-bar">
                <h3>Run Execution Audit Trail</h3>
                <button className="close-modal-icon-btn" onClick={() => setModalContext(null)}>×</button>
              </header>
              <div className="modal-body-grid">
                <div className="modal-field">
                  <label>Workspace Name</label>
                  <p>{modalContext.workspaceName}</p>
                </div>
                <div className="modal-field">
                  <label>Run Id</label>
                  <p><code>{modalContext.runId}</code></p>
                </div>
                <div className="modal-field">
                  <label>Triggered By</label>
                  <p className="modal-email-text">{modalContext.triggeredBy}</p>
                </div>
                <div className="modal-field">
                  <label>Run Time</label>
                  <p>{modalContext.lastRun}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};