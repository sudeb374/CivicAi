import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import './Villages.css';

export default function Villages() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [demographics, setDemographics] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  
  // Filtering & Selection state
  const [searchTerm, setSearchTerm] = useState('');
  const [missingFilter, setMissingFilter] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch up to 1000 records to ensure we get all ~650 villages
        const [demoData, infraData] = await Promise.all([
          api.getDemographics(),
          api.getInfrastructure()
        ]);
        
        setDemographics(demoData || []);
        setInfrastructure(infraData || []);
      } catch (err) {
        console.error('Error fetching villages data:', err);
        setError(err.message || 'Failed to load villages data.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Combine and memoize the data based on village_code
  const combinedData = useMemo(() => {
    const infraMap = new Map(infrastructure.map(item => [item.village_code, item]));
    
    return demographics.map(demo => {
      const infra = infraMap.get(demo.village_code) || {};
      
      let literacyRate = 0;
      if (demo.tot_p > 0 && demo.p_lit > 0) {
        literacyRate = Math.round((demo.p_lit / demo.tot_p) * 100);
      }
      
      return {
        ...demo,
        ...infra,
        literacyRate
      };
    });
  }, [demographics, infrastructure]);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = combinedData;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v => 
        (v.village_name && v.village_name.toLowerCase().includes(term)) ||
        (v.village_code && v.village_code.toLowerCase().includes(term))
      );
    }
    
    if (missingFilter !== 'all') {
      // Show villages where the selected infrastructure is missing (false)
      result = result.filter(v => v[missingFilter] === false);
    }
    
    return result;
  }, [combinedData, searchTerm, missingFilter]);

  if (loading) {
    return (
      <div className="villages-container">
        <header className="villages-header">
          <h2>Village Explorer</h2>
          <p>Analyzing demographics and infrastructure across the region</p>
        </header>
        <div className="skeleton-container">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="villages-container">
        <div className="error-state">
          <h2>⚠️ Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (combinedData.length === 0) {
    return (
      <div className="villages-container">
        <div className="empty-state">
          <h2>No Villages Found</h2>
          <p>There is currently no village data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="villages-container">
      <header className="villages-header">
        <h2>Village Explorer</h2>
        <p>Analyzing {combinedData.length} villages in the region</p>
      </header>

      <div className="villages-controls">
        <input 
          type="text" 
          placeholder="Search by village name or code..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={missingFilter} 
          onChange={(e) => setMissingFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Villages</option>
          <option value="pucca_road">Needs Roads</option>
          <option value="tap_water_treated">Needs Water</option>
          <option value="has_hospital">Needs Hospital</option>
          <option value="govt_primary_school">Needs Primary School</option>
          <option value="govt_secondary_school">Needs Secondary School</option>
          <option value="power_supply">Needs Electricity</option>
          <option value="public_bus">Needs Transport</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="villages-table">
          <thead>
            <tr>
              <th>Village</th>
              <th>Code</th>
              <th>Population</th>
              <th>Households</th>
              <th>Literacy</th>
              <th title="Pucca Road">Road</th>
              <th title="Treated Tap Water">Water</th>
              <th title="Hospital">Hosp.</th>
              <th title="Primary School">1° Sch.</th>
              <th title="Secondary School">2° Sch.</th>
              <th title="Power Supply">Elec.</th>
              <th title="Public Bus">Bus</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(v => (
              <tr 
                key={v.village_code} 
                className="clickable-row"
                onClick={() => setSelectedVillage(v)}
              >
                <td className="village-name">{v.village_name}</td>
                <td className="code-cell">{v.village_code}</td>
                <td className="number-cell">{v.tot_p?.toLocaleString()}</td>
                <td className="number-cell">{v.no_hh?.toLocaleString()}</td>
                <td className="number-cell">{v.literacyRate}%</td>
                <td className="icon-cell">{v.pucca_road ? '✅' : '❌'}</td>
                <td className="icon-cell">{v.tap_water_treated ? '✅' : '❌'}</td>
                <td className="icon-cell">{v.has_hospital ? '✅' : '❌'}</td>
                <td className="icon-cell">{v.govt_primary_school ? '✅' : '❌'}</td>
                <td className="icon-cell">{v.govt_secondary_school ? '✅' : '❌'}</td>
                <td className="icon-cell">{v.power_supply ? '✅' : '❌'}</td>
                <td className="icon-cell">{v.public_bus ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="no-results">
            No villages match the selected search and filters.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedVillage && (
        <div className="modal-overlay" onClick={() => setSelectedVillage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedVillage.village_name}</h3>
              <span className="modal-code">Code: {selectedVillage.village_code}</span>
              <button className="close-btn" onClick={() => setSelectedVillage(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h4>Demographics</h4>
                <div className="modal-grid">
                  <div className="stat-box">
                    <div className="stat-label">Total Population</div>
                    <div className="stat-value">{selectedVillage.tot_p?.toLocaleString()}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Households</div>
                    <div className="stat-value">{selectedVillage.no_hh?.toLocaleString()}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Male</div>
                    <div className="stat-value">{selectedVillage.tot_m?.toLocaleString()}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Female</div>
                    <div className="stat-value">{selectedVillage.tot_f?.toLocaleString()}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Literacy Rate</div>
                    <div className="stat-value">{selectedVillage.literacyRate}%</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Working Pop.</div>
                    <div className="stat-value">{selectedVillage.tot_work_p?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="modal-section">
                <h4>Infrastructure Status</h4>
                <div className="infra-list">
                  <div className="infra-item">
                    <span className="infra-name">Pucca Road</span>
                    <span>{selectedVillage.pucca_road ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">Treated Tap Water</span>
                    <span>{selectedVillage.tap_water_treated ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">Hospital</span>
                    <span>{selectedVillage.has_hospital ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">Primary School</span>
                    <span>{selectedVillage.govt_primary_school ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">Secondary School</span>
                    <span>{selectedVillage.govt_secondary_school ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">Power Supply</span>
                    <span>{selectedVillage.power_supply ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">Public Bus</span>
                    <span>{selectedVillage.public_bus ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-name">ATM Facility</span>
                    <span>{selectedVillage.atm ? '✅ Available' : '❌ Missing'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
