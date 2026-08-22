import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Map, Users, Home, Activity, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demographics, setDemographics] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);

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
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
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

  const totalVillages = demographics.length;
  const totalPopulation = demographics.reduce((sum, v) => sum + (v.tot_p || 0), 0);
  const totalHouseholds = demographics.reduce((sum, v) => sum + (v.no_hh || 0), 0);

  const getCount = (key) => infrastructure.filter(i => i[key] === true).length;
  const calcPercent = (key) => infrastructure.length > 0 ? Math.round((getCount(key) / infrastructure.length) * 100) : 0;

  const availability = {
    roads: calcPercent('pucca_road'),
    water: calcPercent('tap_water_treated'),
    healthcare: calcPercent('has_hospital'),
    education: calcPercent('govt_primary_school'),
    power: calcPercent('power_supply'),
    transport: calcPercent('public_bus'),
  };

  const avgAvailability = Object.values(availability).reduce((sum, val) => sum + val, 0) / Object.values(availability).length;
  const infraGapsPercent = 100 - avgAvailability;

  // Mock chart data for UI
  const chartData = [
    { name: 'Jan', requests: 400 },
    { name: 'Feb', requests: 300 },
    { name: 'Mar', requests: 550 },
    { name: 'Apr', requests: 450 },
    { name: 'May', requests: 700 },
    { name: 'Jun', requests: 650 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">AI-Powered Governance Dashboard</h2>
          <p className="text-blue-100 max-w-2xl text-lg">Real-time monitoring, predictive analytics, and automated grievance resolution for {totalVillages.toLocaleString()} villages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Villages', value: totalVillages.toLocaleString(), icon: Map, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Total Population', value: totalPopulation.toLocaleString(), icon: Users, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Total Households', value: totalHouseholds.toLocaleString(), icon: Home, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Infrastructure Gap', value: `${Math.round(infraGapsPercent)}%`, icon: Activity, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Citizen Request Volume</h3>
             <span className="flex items-center gap-1 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full"><TrendingUp className="w-4 h-4"/> +14% this month</span>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                 <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Infrastructure Availability</h3>
          <div className="flex-1 space-y-4">
            {Object.entries(availability).map(([key, percent]) => (
              <div key={key}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="capitalize text-slate-700 dark:text-slate-300">{key}</span>
                  <span className="text-slate-900 dark:text-white">{percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${percent > 70 ? 'bg-emerald-500' : percent > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
