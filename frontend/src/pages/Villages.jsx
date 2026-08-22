import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Search, MapPin, X, ShieldAlert, Navigation } from 'lucide-react';

export default function Villages() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [demographics, setDemographics] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [missingFilter, setMissingFilter] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
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

  const combinedData = useMemo(() => {
    const infraMap = new Map(infrastructure.map(item => [item.village_code, item]));
    return demographics.map(demo => {
      const infra = infraMap.get(demo.village_code) || {};
      let literacyRate = 0;
      if (demo.tot_p > 0 && demo.p_lit > 0) {
        literacyRate = Math.round((demo.p_lit / demo.tot_p) * 100);
      }
      return { ...demo, ...infra, literacyRate };
    });
  }, [demographics, infrastructure]);

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
      result = result.filter(v => v[missingFilter] === false);
    }
    return result;
  }, [combinedData, searchTerm, missingFilter]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
        <div className="h-[600px] bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
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

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Village Explorer</h2>
        <p className="text-slate-500 dark:text-slate-400">Analyzing {combinedData.length} villages across the region.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by village name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white transition-all"
          />
        </div>
        <select 
          value={missingFilter} 
          onChange={(e) => setMissingFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none dark:bg-slate-900 dark:text-white cursor-pointer min-w-[200px]"
        >
          <option value="all">All Villages</option>
          <option value="pucca_road">Needs Roads</option>
          <option value="tap_water_treated">Needs Water</option>
          <option value="has_hospital">Needs Hospital</option>
          <option value="govt_primary_school">Needs Primary School</option>
          <option value="power_supply">Needs Electricity</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 overflow-hidden flex flex-col h-[600px]">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Village</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">Code</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-right">Population</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-right">Households</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-right">Literacy</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center" title="Pucca Road">Road</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center" title="Treated Tap Water">Water</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center" title="Hospital">Hosp.</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center" title="Primary School">Edu.</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-center" title="Power Supply">Elec.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredData.map(v => (
                <tr 
                  key={v.village_code} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedVillage(v)}
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">{v.village_name}</td>
                  <td className="px-4 py-4 font-mono text-sm text-blue-600 dark:text-blue-400">{v.village_code}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300">{v.tot_p?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300">{v.no_hh?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300">{v.literacyRate}%</td>
                  <td className="px-4 py-4 text-center">{v.pucca_road ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.tap_water_treated ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.has_hospital ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.govt_primary_school ? '✅' : '❌'}</td>
                  <td className="px-4 py-4 text-center">{v.power_supply ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              No villages match the selected search and filters.
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVillage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedVillage(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedVillage.village_name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> Code: <span className="font-mono">{selectedVillage.village_code}</span>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" onClick={() => setSelectedVillage(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <section>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Demographics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Population', val: selectedVillage.tot_p },
                    { label: 'Households', val: selectedVillage.no_hh },
                    { label: 'Male', val: selectedVillage.tot_m },
                    { label: 'Female', val: selectedVillage.tot_f },
                    { label: 'Literacy Rate', val: `${selectedVillage.literacyRate}%` },
                    { label: 'Working Pop.', val: selectedVillage.tot_work_p },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{typeof stat.val === 'number' ? stat.val.toLocaleString() : stat.val}</div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Infrastructure Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Pucca Road', key: 'pucca_road' },
                    { label: 'Treated Tap Water', key: 'tap_water_treated' },
                    { label: 'Hospital', key: 'has_hospital' },
                    { label: 'Primary School', key: 'govt_primary_school' },
                    { label: 'Secondary School', key: 'govt_secondary_school' },
                    { label: 'Power Supply', key: 'power_supply' },
                    { label: 'Public Bus', key: 'public_bus' },
                    { label: 'ATM Facility', key: 'atm' },
                  ].map((infra, i) => (
                    <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{infra.label}</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${selectedVillage[infra.key] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {selectedVillage[infra.key] ? 'Available' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-end pt-4">
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                   <Navigation className="w-4 h-4"/> Target for Intervention
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
