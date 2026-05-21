import React, { useState, useMemo } from 'react';
import { getFilteredPolicyHealth } from '../services/policyErrorData';
import type { PolicyHealthDashboardProps, RunDetail } from '../interfaces/policyErrorDetails';
import '../styles/policyErrorTable.css';

export const PolicyHealthDashboard: React.FC<PolicyHealthDashboardProps> = ({ filters }) => {
  const [activeDrilldown, setActiveDrilldown] = useState<{ policyName: string; runs: RunDetail[] } | null>(null);

  const processedErrors = useMemo(() => {
    return getFilteredPolicyHealth(filters);
  }, [filters]);

  return (
    <div className="enterprise-dashboard-container-half">
      <div className="table-dashboard-header-ribbon">
        <h2 className="main-section-title">Policy Health Log</h2>
        <div className="collaboration-tray">
        </div>
      </div>

      <div className="table-scroll-viewport persistent-scroll">
        <table className="compliance-data-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Policy Name</th>
              <th style={{ textAlign: 'left' }}>Policy Set</th>
              <th style={{ textAlign: 'left' }}>Error Message</th>
              <th style={{ textAlign: 'center' }}>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {processedErrors.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>
                  No error entries match applied filters.
                </td>
              </tr>
            ) : (
              processedErrors.map((row, index) => (
                <tr key={`${row.policy_name}-${index}`} className="data-row-target">
                  <td style={{ textAlign: 'left' }}>{row.policy_name}</td>
                  <td style={{ textAlign: 'left' }}>{row.policy_set}</td>
                  <td style={{ textAlign: 'left' }}>
                    <span 
                      className="interactive-env-link"
                      onClick={() => setActiveDrilldown({ policyName: row.policy_name, runs: row.run_details })}
                    >
                      {row.error_message}
                    </span>
                  </td>
                  <td>
                    <div className="resources-cell">
                      <span className={`status-indicator-dot ${
                        row.frequency > 5 ? 'risk-critical' : row.frequency >= 3 ? 'risk-high' : 'risk-nominal'
                      }`}></span>
                      <span className="count-value">{row.frequency}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeDrilldown && (
        <div className="modal-overlay-backdrop" onClick={() => setActiveDrilldown(null)}>
          <div className="modal-content-window" onClick={(e) => e.stopPropagation()}>
            {/* BUG FIX 1: Flex header wrapper forces the 'X' button strictly to the right side */}
            <div className="modal-custom-header">
              <h3>Run Details Log</h3>
              <button className="modal-close-x" onClick={() => setActiveDrilldown(null)}>×</button>
            </div>
            
            <div className="persistent-scroll" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {activeDrilldown.runs.map((run) => (
                <div key={run.run_id} className="modal-log-row">
                  <div className="modal-field-block">
                    <span className="modal-field-label">Run ID</span>
                    {/* BUG FIX 2: Full raw UUID string rendered with text selection safety enabled */}
                    <code className="modal-full-uuid">{run.run_id}</code>
                  </div>
                  <div className="modal-field-block">
                    <span className="modal-field-label">Scope Context</span>
                    <p className="modal-field-text">
                      {run.workspace ? `Workspace: ${run.workspace}` : `Stack: ${run.stack}`}
                    </p>
                  </div>
                  <div className="modal-field-block">
                    <span className="modal-field-label">Environment</span>
                    <span className="env-badge">{run.environment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};