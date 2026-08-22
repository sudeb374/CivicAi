import React from 'react';
import { Flame, MapPin } from 'lucide-react';

export default function DemandHotspots() {
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
        
        {/* Mock Map Area */}
        <div className="flex-1 relative bg-blue-50 dark:bg-slate-900/50 flex items-center justify-center p-8">
          <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Heatmap blur spots */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-red-500/40 dark:bg-red-500/20 rounded-full blur-2xl"></div>
          
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <div className="z-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-sm text-center">
            <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Cluster Detected: North District</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">450+ overlapping requests for drinking water access in the last 72 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
