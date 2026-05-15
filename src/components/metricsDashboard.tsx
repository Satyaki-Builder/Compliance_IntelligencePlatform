import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MockPolicies } from '../services/metricsDashboard';
import '../styles/metricsDashboard.css';

interface Props {
  filters: any;
}

const MetricsDashboard: React.FC<Props> = ({ filters }) => {
  const { stats, chartData } = useMemo(() => {
    // 1. Apply filters to the base array
    let filteredList = MockPolicies;

    if (filters.engines && filters.engines.length > 0) {
      filteredList = filteredList.filter(p => filters.engines.includes(p.engine));
    }
    if (filters.region && filters.region.length > 0) {
      filteredList = filteredList.filter(p => filters.region.includes(p.region));
    }
    if (filters.severity && filters.severity.length > 0) {
      filteredList = filteredList.filter(p => filters.severity.includes(p.severity));
    }
    if (filters.types && filters.types.length > 0) {
      filteredList = filteredList.filter(p => filters.types.includes(p.type));
    }
    if (filters.providers && filters.providers.length > 0) {
      filteredList = filteredList.filter(p => filters.providers.includes(p.provider));
    }

    // 2. KPI Logic: Unique names, Failures, and Total Runs
    const uniqueNames = new Set(filteredList.map(p => p.name));
    const activeCount = uniqueNames.size;
    const failureCount = filteredList.filter(p => p.status === "Failed").length;
    const totalRuns = filteredList.length;
    const passRate = totalRuns > 0 ? ((totalRuns - failureCount) / totalRuns) * 100 : 0;

    // 3. Time Series Logic: Group filtered data by last_run date
    const timeGroups: { [key: string]: { date: string; passed: number; total: number } } = {};

    filteredList.forEach(policy => {
      const dateKey = policy.last_run.split('T')[0]; // Extracts YYYY-MM-DD
      if (!timeGroups[dateKey]) {
        timeGroups[dateKey] = { date: dateKey, passed: 0, total: 0 };
      }
      timeGroups[dateKey].total += 1;
      if (policy.status === "Passed") {
        timeGroups[dateKey].passed += 1;
      }
    });

    const derivedChartData = Object.values(timeGroups)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(group => ({
        displayDate: group.date.split('-').reverse().slice(0, 2).join('/'), // DD/MM format
        pass_rate: Math.round((group.passed / group.total) * 100)
      }));

    return { 
      stats: { activeCount, totalRuns, failures: failureCount, passRate },
      chartData: derivedChartData 
    };
  }, [filters]);

  return (
    <div className="metrics-container">
      <div className="filter-header-single-line">
        <span className="header-title">Compliance Outlook</span>
      </div>

      <div className="kpi-grid">
        <div className="metric-card active-border">
          <div className="metric-label active-text">Active Policies</div>
          <div className="metric-value">{stats.activeCount}</div>
        </div>
        
        <div className="metric-card runs-border">
          <div className="metric-label runs-text">Total Policy Runs</div>
          <div className="metric-value">{stats.totalRuns}</div>
        </div>

        <div className="metric-card failure-border">
          <div className="metric-label failure-text">Policy Failures</div>
          <div className="metric-value">{stats.failures}</div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <span className="chart-title">Overall Pass Rate</span>
          <span className="average-pass-text">
            Average Pass Rate: <strong>{stats.passRate.toFixed(2)}%</strong>
          </span>
        </div>
        
        <div className='chart-height'>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                unit="%" 
                dx={-10} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="pass_rate" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;