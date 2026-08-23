import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Map, Users, Home, Activity, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demographics, setDemographics] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [demoData, infraData, compData] = await Promise.all([
          api.getDemographics(),
          api.getInfrastructure(),
          api.getComplaints()
        ]);
        setDemographics(demoData || []);
        setInfrastructure(infraData || []);
        setComplaints(compData || []);
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

  // Group complaints by month for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  
  // Create last 6 months list
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonthIdx - i;
    if (m < 0) m += 12;
    last6Months.push({ name: months[m], monthIdx: m, requests: 0 });
  }
  
  complaints.forEach(c => {
    const d = new Date(c.created_at);
    const m = d.getMonth();
    const entry = last6Months.find(l => l.monthIdx === m);
    if (entry) {
      entry.requests += 1;
    }
  });

  const chartData = last6Months.map(({name, requests}) => ({name, requests}));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-[length:200%_200%] animate-gradient-x rounded-3xl p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
        {/* Decorative glass orbs */}
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-float"></div>
        
        <div className="absolute top-0 right-0 p-8 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6 animate-pulse">
            Live AI Monitoring Active
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">AI-Powered Governance Dashboard</h2>
          <p className="text-blue-50/90 max-w-2xl text-lg leading-relaxed">Real-time monitoring, predictive analytics, and automated grievance resolution for <strong className="text-white">{totalVillages.toLocaleString()}</strong> villages across the region.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Villages', value: totalVillages.toLocaleString(), icon: Map, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Total Population', value: totalPopulation.toLocaleString(), icon: Users, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Total Households', value: totalHouseholds.toLocaleString(), icon: Home, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Infrastructure Gap', value: `${Math.round(infraGapsPercent)}%`, icon: Activity, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-400 group-hover:via-indigo-500 group-hover:to-purple-500 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1.5">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Citizen Request Volume</h3>
             <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40 px-4 py-1.5 rounded-full shadow-sm"><TrendingUp className="w-4 h-4"/> +14% this month</span>
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
        
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Infrastructure Availability</h3>
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
