import React, { useState, useEffect } from 'react';
import { Flame, MapPin, Target, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function DemandHotspots() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHotspots() {
      try {
        setLoading(true);
        const data = await api.getDemandHotspots();
        setHotspots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadHotspots();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Demand Hotspots</h2>
        <p className="text-slate-500 dark:text-slate-400">Geospatial heatmaps of emerging infrastructure and service demands.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm h-[600px] flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full text-sm font-medium flex items-center gap-1"><Flame className="w-4 h-4"/> High Demand</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full text-sm font-medium flex items-center gap-1">Medium Demand</span>
          </div>
          <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none dark:text-white">
            <option>All Sectors</option>
            <option>Water</option>
            <option>Roads</option>
            <option>Healthcare</option>
          </select>
        </div>
        
        {/* Hotspots Grid View instead of mock map */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">{error}</div>
          ) : hotspots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <MapPin className="w-12 h-12 mb-2 text-slate-300" />
              <p>No demand hotspots detected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotspots.map((spot, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white capitalize">{spot.sector || spot.category || 'Unknown Sector'}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {spot.village || spot.district || 'Unknown Location'}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full dark:bg-red-900/40 dark:text-red-400">
                      Score: {spot.average_priority_score ? spot.average_priority_score.toFixed(1) : (spot.priority_score ? spot.priority_score.toFixed(1) : 'N/A')}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span><strong>{spot.request_count}</strong> active requests clustered in this region.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
