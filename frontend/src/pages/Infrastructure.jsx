import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Infrastructure.css';

export default function Infrastructure() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infrastructure, setInfrastructure] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getInfrastructure();
        setInfrastructure(data || []);
      } catch (err) {
        console.error('Error fetching infrastructure data:', err);
        setError(err.message || 'Failed to load infrastructure data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="infra-container">
        <header className="infra-header">
          <h2>Infrastructure Overview</h2>
          <p>Monitor multi-sector facility availability across villages</p>
        </header>
        <div className="skeleton-container">
          <div className="skeleton-row">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
          </div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="infra-container">
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

  if (infrastructure.length === 0) {
    return (
      <div className="infra-container">
        <div className="empty-state">
          <h2>No Infrastructure Data</h2>
          <p>There is currently no data available for this region.</p>
        </div>
      </div>
    );
  }

  const total = infrastructure.length;
  
  const getCount = (key) => infrastructure.filter(i => i[key] === true).length;
  
  const stats = {
    roads: getCount('pucca_road'),
    water: getCount('tap_water_treated'),
    healthcare: getCount('has_hospital'),
    primaryEd: getCount('govt_primary_school'),
    secondaryEd: getCount('govt_secondary_school'),
    power: getCount('power_supply'),
    transport: getCount('public_bus'),
    atm: getCount('atm')
  };

  const calcPercent = (count) => Math.round((count / total) * 100);

  // Filter Logic
  let filteredData = infrastructure;
  
  if (searchTerm) {
    filteredData = filteredData.filter(v => 
      v.village_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filter !== 'all') {
    filteredData = filteredData.filter(v => v[filter] === false);
  }

  return (
    <div className="infra-container">
      <header className="infra-header">
        <h2>Infrastructure Overview</h2>
        <p>Monitor multi-sector facility availability across {total} villages</p>
      </header>

      <section className="sector-cards">
        <div className="sector-card">
          <div className="sector-icon">🛣️</div>
          <h3>Roads (Pucca)</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Available</span>
              <span className="stat-value">{calcPercent(stats.roads)}%</span>
            </div>
            <div>
              <span className="stat-label">Unavailable</span>
              <span className="stat-value error">{100 - calcPercent(stats.roads)}%</span>
            </div>
          </div>
        </div>

        <div className="sector-card">
          <div className="sector-icon">💧</div>
          <h3>Treated Water</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Available</span>
              <span className="stat-value">{calcPercent(stats.water)}%</span>
            </div>
            <div>
              <span className="stat-label">Unavailable</span>
              <span className="stat-value error">{100 - calcPercent(stats.water)}%</span>
            </div>
          </div>
        </div>

        <div className="sector-card">
          <div className="sector-icon">🏥</div>
          <h3>Healthcare</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Has Hospital</span>
              <span className="stat-value">{stats.healthcare}</span>
            </div>
            <div>
              <span className="stat-label">No Hospital</span>
              <span className="stat-value error">{total - stats.healthcare}</span>
            </div>
          </div>
        </div>

        <div className="sector-card">
          <div className="sector-icon">🎓</div>
          <h3>Education</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Primary</span>
              <span className="stat-value">{stats.primaryEd}</span>
            </div>
            <div>
              <span className="stat-label">Secondary</span>
              <span className="stat-value">{stats.secondaryEd}</span>
            </div>
          </div>
        </div>

        <div className="sector-card">
          <div className="sector-icon">⚡</div>
          <h3>Electricity</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Available</span>
              <span className="stat-value">{calcPercent(stats.power)}%</span>
            </div>
            <div>
              <span className="stat-label">Unavailable</span>
              <span className="stat-value error">{100 - calcPercent(stats.power)}%</span>
            </div>
          </div>
        </div>

        <div className="sector-card">
          <div className="sector-icon">🚌</div>
          <h3>Public Transport</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Available</span>
              <span className="stat-value">{calcPercent(stats.transport)}%</span>
            </div>
            <div>
              <span className="stat-label">Unavailable</span>
              <span className="stat-value error">{100 - calcPercent(stats.transport)}%</span>
            </div>
          </div>
        </div>

        <div className="sector-card">
          <div className="sector-icon">💳</div>
          <h3>Financial (ATMs)</h3>
          <div className="sector-stats">
            <div>
              <span className="stat-label">Available</span>
              <span className="stat-value">{calcPercent(stats.atm)}%</span>
            </div>
            <div>
              <span className="stat-label">Unavailable</span>
              <span className="stat-value error">{100 - calcPercent(stats.atm)}%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="village-details">
        <div className="village-header">
          <h3>Village-Level Availability</h3>
          <div className="controls">
            <input 
              type="text" 
              placeholder="Search Village Code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Show All</option>
              <option value="pucca_road">Missing Roads</option>
              <option value="tap_water_treated">Missing Water</option>
              <option value="has_hospital">Missing Hospital</option>
              <option value="govt_primary_school">Missing Primary School</option>
              <option value="power_supply">Missing Electricity</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="village-table">
            <thead>
              <tr>
                <th>Village Code</th>
                <th>Roads</th>
                <th>Water</th>
                <th>Hospital</th>
                <th>Primary Ed.</th>
                <th>Secondary Ed.</th>
                <th>Power</th>
                <th>Transport</th>
                <th>ATM</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(v => (
                <tr key={v.village_code}>
                  <td className="code-cell">{v.village_code}</td>
                  <td>{v.pucca_road ? '✅' : '❌'}</td>
                  <td>{v.tap_water_treated ? '✅' : '❌'}</td>
                  <td>{v.has_hospital ? '✅' : '❌'}</td>
                  <td>{v.govt_primary_school ? '✅' : '❌'}</td>
                  <td>{v.govt_secondary_school ? '✅' : '❌'}</td>
                  <td>{v.power_supply ? '✅' : '❌'}</td>
                  <td>{v.public_bus ? '✅' : '❌'}</td>
                  <td>{v.atm ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="no-results">No villages match the selected filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}
