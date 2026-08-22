import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

const navItems = [
  { path: '/', label: 'Dashboard', enabled: true },
  { path: '/infrastructure', label: 'Infrastructure', enabled: true },
  { path: '/villages', label: 'Villages', enabled: true },
  { path: '/citizen-requests', label: 'Citizen Requests', enabled: false },
  { path: '/ai-analysis', label: 'AI Analysis', enabled: false },
  { path: '/priority-issues', label: 'Priority Issues', enabled: false },
  { path: '/recommendations', label: 'Recommendations', enabled: false },
];

function NavLink({ to, children, enabled }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (!enabled) {
    return (
      <div className="nav-item disabled" title="Coming Soon">
        {children} <span className="badge">Coming Soon</span>
      </div>
    );
  }

  return (
    <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1>CivicAI</h1>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} enabled={item.enabled}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import Dashboard from './pages/Dashboard';
import Infrastructure from './pages/Infrastructure';
import Villages from './pages/Villages';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <header className="top-header">
            <div className="header-title">CivicAI System</div>
          </header>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/villages" element={<Villages />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
