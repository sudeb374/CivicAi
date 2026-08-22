import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    demographics: [],
    infrastructure: [],
    districts: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [districts, demographics, infrastructure] = await Promise.all([
          api.getDistricts(),
          api.getDemographics(),
          api.getInfrastructure()
        ]);

        setData({
          districts,
          demographics,
          infrastructure
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>CivicAI</h1>
          <p>AI-Powered Civic Governance Platform</p>
        </header>
        <div className="skeleton-container">
          <div className="skeleton-row">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
          </div>
          <div className="skeleton-content">
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>CivicAI</h1>
          <p>AI-Powered Civic Governance Platform</p>
        </header>
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

  const { demographics, infrastructure } = data;

  if (!demographics || demographics.length === 0 || !infrastructure || infrastructure.length === 0) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>CivicAI</h1>
          <p>AI-Powered Civic Governance Platform</p>
        </header>
        <div className="empty-state">
          <h2>No Data Available</h2>
          <p>There is currently no data to display in the system.</p>
        </div>
      </div>
    );
  }

  // Calculations
  const totalVillages = demographics.length;
  const totalPopulation = demographics.reduce((sum, d) => sum + (d.tot_p || 0), 0);
  const totalHouseholds = demographics.reduce((sum, d) => sum + (d.no_hh || 0), 0);

  // Infrastructure availability percentages
  const infraCount = infrastructure.length;
  
  const calcPercent = (key) => {
    if (infraCount === 0) return 0;
    const hasFeature = infrastructure.filter(i => i[key] === true).length;
    return Math.round((hasFeature / infraCount) * 100);
  };

  const availability = {
    roads: calcPercent('pucca_road'),
    water: calcPercent('tap_water_treated'),
    healthcare: calcPercent('has_hospital'),
    primaryEducation: calcPercent('govt_primary_school'),
    secondaryEducation: calcPercent('govt_secondary_school'),
    power: calcPercent('power_supply'),
    transport: calcPercent('public_bus'),
    connectivity: calcPercent('atm') // mapping ATM as connectivity for now, or just an extra metric
  };

  // Calculate generic "Infrastructure Gaps" (average lack of basic facilities)
  const avgAvailability = Object.values(availability).reduce((sum, val) => sum + val, 0) / Object.values(availability).length;
  const infraGapsPercent = 100 - avgAvailability;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CivicAI</h1>
        <p>AI-Powered Civic Governance Platform</p>
      </header>

      <section className="summary-cards">
        <div className="card">
          <div className="card-title">Total Villages</div>
          <div className="card-value">{totalVillages.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Population</div>
          <div className="card-value">{totalPopulation.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Households</div>
          <div className="card-value">{totalHouseholds.toLocaleString()}</div>
        </div>
        <div className="card highlight">
          <div className="card-title">Infrastructure Gaps</div>
          <div className="card-value">{infraGapsPercent.toFixed(1)}%</div>
          <div className="card-subtitle">avg. facility shortage</div>
        </div>
      </section>

      <section className="infrastructure-overview">
        <h2>Infrastructure Availability</h2>
        <div className="indicators-grid">
          
          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">🛣️ Roads (Pucca)</span>
              <span className="indicator-percent">{availability.roads}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.roads}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">💧 Treated Water</span>
              <span className="indicator-percent">{availability.water}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.water}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">🏥 Hospitals</span>
              <span className="indicator-percent">{availability.healthcare}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.healthcare}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">🏫 Primary Schools</span>
              <span className="indicator-percent">{availability.primaryEducation}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.primaryEducation}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">🎓 Secondary Schools</span>
              <span className="indicator-percent">{availability.secondaryEducation}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.secondaryEducation}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">⚡ Power Supply</span>
              <span className="indicator-percent">{availability.power}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.power}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">🚌 Public Bus</span>
              <span className="indicator-percent">{availability.transport}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.transport}%` }}></div>
            </div>
          </div>

          <div className="indicator-card">
            <div className="indicator-header">
              <span className="indicator-name">💳 ATMs / Financial</span>
              <span className="indicator-percent">{availability.connectivity}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${availability.connectivity}%` }}></div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
