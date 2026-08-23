import React, { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, ShieldCheck, FileText, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

export default function AIAnalysis() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.getAiAnalysis();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="text-red-500 p-4 text-center border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">{error}</div>;
  }

  // Format data for the chart from sector distribution
  const chartData = stats && stats.sector_distribution 
    ? Object.entries(stats.sector_distribution).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        issues: count,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Sentiment & Analysis</h2>
        <p className="text-slate-500 dark:text-slate-400">NLP-driven insights extracted from thousands of citizen reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-900/40 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Analyzed</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stats.total_analyzed.toLocaleString()}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Complaints processed by AI.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl dark:bg-purple-900/40 dark:text-purple-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Language</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase">
              {stats.language_distribution && Object.keys(stats.language_distribution).length > 0
                ? Object.keys(stats.language_distribution).reduce((a, b) => stats.language_distribution[a] > stats.language_distribution[b] ? a : b)
                : 'N/A'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Most common source language.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl dark:bg-red-900/40 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Severity</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.severity_distribution?.critical || 0}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Issues requiring immediate action.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Issue Volume by Sector</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Issue Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Trending Categories Extraction</h3>
          <div className="flex flex-wrap gap-2">
            {stats.common_categories && stats.common_categories.length > 0 ? (
              stats.common_categories.map((kw, i) => (
                <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${i < 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'}`}>
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-slate-500">No categories extracted yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
