import React from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Water', issues: 120, urgency: 90 },
  { name: 'Roads', issues: 85, urgency: 65 },
  { name: 'Power', issues: 40, urgency: 80 },
  { name: 'Health', issues: 30, urgency: 95 },
  { name: 'Edu', issues: 20, urgency: 45 },
];

export default function AIAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Sentiment & Analysis</h2>
        <p className="text-slate-500 dark:text-slate-400">NLP-driven insights extracted from thousands of citizen reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl dark:bg-red-900/40 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Alert</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Water Scarcity</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Spike in negative sentiment detected in Sector 4.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-900/40 dark:text-blue-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Model Confidence</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">94.2%</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Accuracy in categorizing incoming audio complaints.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl dark:bg-emerald-900/40 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved Automatically</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1,240</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Duplicate issues merged by AI this week.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Issue Volume vs AI Urgency Score</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Issue Count" />
                <Bar dataKey="urgency" fill="#ef4444" radius={[4, 4, 0, 0]} name="Urgency Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Trending Keywords Extraction</h3>
          <div className="flex flex-wrap gap-2">
            {['Pothole', 'Dengue', 'Pipeline Burst', 'No Electricity', 'Streetlight', 'Garbage', 'School Roof', 'Ration', 'Doctor absent', 'Drainage overflow'].map((kw, i) => (
              <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${i < 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'}`}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
