import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Filter, ShieldAlert } from 'lucide-react';

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
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
        </div>
        <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/50">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Connection Error</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  const total = infrastructure.length;
  const getCount = (key) => infrastructure.filter(i => i[key] === true).length;
  const calcPercent = (count) => Math.round((count / total) * 100);

  const stats = [
    { title: 'Roads (Pucca)', icon: '🛣️', avail: getCount('pucca_road') },
    { title: 'Treated Water', icon: '💧', avail: getCount('tap_water_treated') },
    { title: 'Healthcare', icon: '🏥', avail: getCount('has_hospital') },
    { title: 'Primary Edu', icon: '🏫', avail: getCount('govt_primary_school') },
    { title: 'Secondary Edu', icon: '🎓', avail: getCount('govt_secondary_school') },
    { title: 'Electricity', icon: '⚡', avail: getCount('power_supply') },
    { title: 'Public Transport', icon: '🚌', avail: getCount('public_bus') },
    { title: 'Financial (ATMs)', icon: '💳', avail: getCount('atm') }
  ];

  let filteredData = infrastructure;
  if (searchTerm) {
    filteredData = filteredData.filter(v => v.village_code.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  if (filter !== 'all') {
    filteredData = filteredData.filter(v => v[filter] === false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Infrastructure Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Monitor multi-sector facility availability across {total} villages.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const availPct = calcPercent(s.avail);
          return (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{s.title}</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Available</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{availPct}%</span>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Unavailable</span>
                  <span className="font-bold text-red-500 dark:text-red-400 text-lg">{100 - availPct}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900">
          <h3 className="font-bold text-slate-900 dark:text-white">Village-Level Availability</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Village Code..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white" 
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="all">Show All</option>
              <option value="pucca_road">Missing Roads</option>
              <option value="tap_water_treated">Missing Water</option>
              <option value="has_hospital">Missing Hospital</option>
              <option value="power_supply">Missing Electricity</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">Roads</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">Water</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">Hospital</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">1° Edu.</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">2° Edu.</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">Power</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">Bus</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center">ATM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredData.map(v => (
                <tr key={v.village_code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">{v.village_code}</td>
                  <td className="px-4 py-4 text-center">{v.pucca_road ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.tap_water_treated ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.has_hospital ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.govt_primary_school ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.govt_secondary_school ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.power_supply ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.public_bus ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.atm ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              No villages match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
