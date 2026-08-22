import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp, Users, Activity, CheckCircle } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const budgetData = [
  { name: 'Infrastructure', value: 45 },
  { name: 'Healthcare', value: 25 },
  { name: 'Education', value: 20 },
  { name: 'Admin', value: 10 },
];

export default function GovernmentInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Government Insights</h2>
        <p className="text-slate-500 dark:text-slate-400">High-level administrative overview and budget allocation analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Budget Utilization', value: '76%', icon: Activity, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40' },
          { label: 'Projects Active', value: '142', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40' },
          { label: 'Citizen Reach', value: '1.2M', icon: Users, color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/40' },
          { label: 'Grievance Resolution', value: '89%', icon: CheckCircle, color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40' },
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Current Budget Allocation</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                  {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
