import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Activity, MapPin, Filter, RefreshCcw, Sparkles } from 'lucide-react';

import { 
  mockDashboardStats, 
  mockCategoryDistribution, 
  mockHotspots, 
  mockPriorityList,
  mockDistricts,
  mockCategories,
  mockInsights
} from '../services/mockData';

// Reusable Components
import StatCard from '../components/StatCard';
import DistrictRanking from '../components/DistrictRanking';
import AIInsightCard from '../components/AIInsightCard';
import MapView from '../components/MapView';
import PriorityBadge from '../components/PriorityBadge';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    district: '',
    category: '',
    priority: ''
  });

  // Simulate data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate random error if needed, but keep false for demo reliability
      setHasError(false); 
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ district: '', category: '', priority: '' });
  };

  // Filtered Data
  const filteredHotspots = useMemo(() => {
    return mockHotspots.filter(spot => {
      if (filters.district && spot.district !== filters.district) return false;
      if (filters.category && spot.category !== filters.category) return false;
      if (filters.priority && spot.priority.toLowerCase() !== filters.priority.toLowerCase()) return false;
      return true;
    });
  }, [filters]);

  const filteredPriorities = useMemo(() => {
    return mockPriorityList.filter(item => {
      if (filters.district && item.district !== filters.district) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.priority && item.level.toLowerCase() !== filters.priority.toLowerCase()) return false;
      return true;
    });
  }, [filters]);

  const hasNoResults = filteredHotspots.length === 0 && filteredPriorities.length === 0;

  if (hasError) {
    return (
      <div className="pt-10">
        <ErrorState retryAction={() => setHasError(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Civic Intelligence Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time priority scoring & hotspot detection</p>
        </div>
        <div className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center shadow-sm">
          <Activity className="w-4 h-4 mr-1.5 animate-pulse" /> Live Mock Data
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading dashboard data..." className="py-20" />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Complaints" value={mockDashboardStats.totalComplaints} icon={Activity} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Resolved" value={mockDashboardStats.resolved} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
            <StatCard title="Critical Hotspots" value={mockDashboardStats.criticalHotspots} icon={AlertTriangle} colorClass="bg-red-100 text-red-600" />
            <StatCard title="Avg Resolution Time" value={mockDashboardStats.averageResolutionTime} icon={Clock} colorClass="bg-purple-100 text-purple-600" />
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">District</label>
              <select 
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 bg-gray-50 border"
              >
                <option value="">All Districts</option>
                {mockDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 bg-gray-50 border"
              >
                <option value="">All Categories</option>
                {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Priority Level</label>
              <select 
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 bg-gray-50 border"
              >
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <button 
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors w-full sm:w-auto"
              >
                <RefreshCcw className="w-4 h-4 mr-2 text-gray-400" />
                Reset
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          {hasNoResults ? (
            <EmptyState 
              title="No matching data found" 
              message="Your current filter combination didn't return any hotspots or priorities."
              actionButton={
                <button onClick={handleResetFilters} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (Maps & Lists) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Hotspots Map */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Geospatial Hotspots</h3>
                  </div>
                  <MapView hotspots={filteredHotspots} />
                </div>

                {/* Priority List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">AI Priority Recommendations</h3>
                    <p className="text-sm text-gray-500">Calculated via Demographics + Infra Gap Formula</p>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {filteredPriorities.map((item) => (
                      <li key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">{item.id}</span>
                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {item.location}, {item.district}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <PriorityBadge level={item.level} />
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm shadow-sm">
                              {item.score}
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50/50 rounded-lg p-3.5 text-sm text-gray-700 border border-blue-100/50 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-gray-900">Score Reasoning: </span> 
                            {item.reason}
                          </div>
                        </div>
                      </li>
                    ))}
                    {filteredPriorities.length === 0 && (
                      <li className="p-8 text-center text-gray-500 text-sm">No priorities match these filters.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Right Column (Analytics & Insights) */}
              <div className="space-y-6">
                
                {/* AI Insights */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" /> AI Insights
                  </h3>
                  <div className="space-y-3">
                    {mockInsights.map(insight => (
                      <AIInsightCard key={insight.id} insight={insight} />
                    ))}
                  </div>
                </div>

                {/* District Ranking */}
                <DistrictRanking hotspots={filteredHotspots} />

                {/* Distribution Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Category Distribution</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockCategoryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {mockCategoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                          itemStyle={{color: '#0f172a', fontWeight: 500}}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 justify-center">
                    {mockCategoryDistribution.map((entry, index) => (
                      <div key={entry.name} className="flex items-center text-xs font-medium text-gray-600">
                        <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
