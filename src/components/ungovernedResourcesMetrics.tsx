import React, { useMemo } from 'react';
import { mockUngovernedResources } from '../services/ungovernedResources';
import '../styles/ungovernedResourcesMetrics.css';

export const UngovernedResourcesMetrics: React.FC = () => {
  const chartData = useMemo(() => {
    const counts = { January: 0, February: 0, March: 0, April: 0, May: 0 };
    const totalRecords = mockUngovernedResources.length;

    mockUngovernedResources.forEach((item) => {
      const date = new Date(item.last_run);
      const month = date.toLocaleString('default', { month: 'long' });
      if (month in counts) {
        counts[month as keyof typeof counts]++;
      }
    });

    return Object.entries(counts).map(([month, count]) => ({
      month,
      percentage: totalRecords > 0 ? Math.round((count / totalRecords) * 100) : 0
    }));
  }, []);

  const yAxisTicks = [35, 30, 25, 20, 15, 10, 5, 0];

  return (
    <div className="metrics-container">
      <div className="chart-box">
        <h3 className="chart-title">Ungoverned Resources Deployed (Historical Trend)</h3>
        
        {/* Isolated Visualization Window */}
        <div className="chart-visualization-window">
          
          {/* Left Absolute Y-Axis Title */}
          <div className="y-axis-title-rotated">
            Ungoverned Resources Deployed (%)
          </div>

          {/* Shifted Main Chart Viewport */}
          <div className="chart-main-viewport">
            {/* Background Grid Ticks */}
            <div className="y-axis-ticks-container">
              {yAxisTicks.map((tick) => (
                <div key={tick} className="tick-row">
                  <span className="tick-label">{tick}%</span>
                  <div className="tick-line"></div>
                </div>
              ))}
            </div>

            {/* Foreground Columns */}
            <div className="bars-container">
              {chartData.map(({ month, percentage }) => {
                const barHeight = `${(percentage / 35) * 100}%`;
                return (
                  <div key={month} className="bar-column">
                    <div className="bar-fill-percentage" style={{ height: barHeight }} title={`${percentage}%`}></div>
                    <div className="bar-label-month">{month}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};