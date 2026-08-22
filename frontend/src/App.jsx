import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Infrastructure from './pages/Infrastructure';
import Villages from './pages/Villages';

// Mock Pages to be created
import CitizenRequests from './pages/CitizenRequests';
import VoiceComplaints from './pages/VoiceComplaints';
import AIAnalysis from './pages/AIAnalysis';
import DemandHotspots from './pages/DemandHotspots';
import GovernmentInsights from './pages/GovernmentInsights';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<CitizenRequests />} />
          <Route path="/voice" element={<VoiceComplaints />} />
          <Route path="/map" element={<Infrastructure />} /> {/* Route to existing Infrastructure page, or we can make a mock Map page */}
          <Route path="/analysis" element={<AIAnalysis />} />
          <Route path="/hotspots" element={<DemandHotspots />} />
          <Route path="/insights" element={<GovernmentInsights />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/villages" element={<Villages />} />
          <Route path="/infrastructure" element={<Infrastructure />} /> {/* Keep original route for safety */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
