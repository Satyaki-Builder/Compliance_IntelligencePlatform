import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { getFilteredRegionalRisk, mockRiskData } from '../services/regionalRiskMetrics';
import type { GlobalFilterState } from '../interfaces/globalFilterState';
import '../styles/GeographicalRiskMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeographicalRiskMapProps {
  filters: GlobalFilterState;
}

export const GeographicalRiskMap: React.FC<GeographicalRiskMapProps> = ({ filters }) => {
  
  const processedMapData = useMemo(() => {
    return getFilteredRegionalRisk(filters, mockRiskData);
  }, [filters]);

  const calculateRadius = (failures: number) => {
    if (failures === 0) return 0;
    return Math.min(Math.max(failures * 0.35, 8), 38);
  };

  return (
    <div className="hcp-footprint-section">
      {/* Platform Level Section Title on the Left */}
      <h3 className="hcp-section-subtitle-heading">COMPLIANCE FOOTPRINT</h3>
      
      {/* Horizontal Row Wrapper holding all 3 metric blocks */}
      <div className="hcp-footprint-metrics-row">
        
        {/* Geographical Risk Map (Metric 3 - Shifted cleanly to the right) */}
        <div className="hcp-risk-map-panel">

          {/* Move the title here, outside the canvas container */}
          <h3 className="hcp-card-inner-title">Geographical Risk Map</h3>

          <div className="hcp-risk-map-canvas-container">
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 135 }}
              width={800}
              height={380}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      className="hcp-risk-map-landmass"
                    />
                  ))
                }
              </Geographies>

              {processedMapData.map(({ region, coordinates, totalFailures }) => {
                const staticRadius = calculateRadius(totalFailures);
                if (staticRadius === 0) return null;

                return (
                  <Marker key={region} coordinates={coordinates}>
                    <g className="hcp-marker-group">
                      <circle r={staticRadius + 4} className="hcp-risk-map-bubble-glow" />
                      <circle r={staticRadius} className="hcp-risk-map-bubble-core" />
                      <text y={1} textAnchor="middle" dominantBaseline="middle" className="hcp-risk-map-bubble-number-only">
                        {totalFailures}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeographicalRiskMap;