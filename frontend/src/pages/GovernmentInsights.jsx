import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp, Users, Activity, CheckCircle, BarChart3, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function GovernmentInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);
        const data = await api.getGovernmentInsights();
        setInsights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  const getSectorData = () => {
    if (!insights || !insights.sector_distribution) return [];
    return Object.entries(insights.sector_distribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const sectorData = getSectorData();

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="text-red-500 p-4 text-center border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">{error}</div>;
  }

  const resolvedPercentage = insights.total_complaints > 0 
    ? Math.round((insights.resolved_complaints / insights.total_complaints) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Government Insights</h2>
        <p className="text-slate-500 dark:text-slate-400">High-level administrative overview and budget allocation analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Complaints', value: insights.total_complaints.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40' },
          { label: 'Avg Priority Score', value: insights.average_priority_score.toFixed(1), icon: Activity, color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/40' },
          { label: 'Critical Issues', value: (insights.urgency_distribution?.critical || 0).toString(), icon: AlertTriangle, color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/40' },
          { label: 'Resolution Rate', value: `${resolvedPercentage}%`, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complaints by Sector</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                  {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Policy Approvals</h3>
           <div className="space-y-4">
             {[
               { name: 'Rural Water Mission Extension', date: 'Oct 12, 2026', status: 'Approved' },
               { name: 'District Solar Grid Initiative', date: 'Oct 10, 2026', status: 'In Review' },
               { name: 'Primary Education Fund Boost', date: 'Oct 05, 2026', status: 'Approved' },
               { name: 'Highway Maintenance Contract', date: 'Sep 28, 2026', status: 'Drafted' },
             ].map((policy, i) => (
               <div key={i} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <div>
                   <p className="font-semibold text-slate-900 dark:text-white">{policy.name}</p>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{policy.date}</p>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                   policy.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                   policy.status === 'In Review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                   'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                 }`}>
                   {policy.status}
                 </span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
