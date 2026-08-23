import React, { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Zap, Target, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        const data = await api.getRecommendations();
        setRecommendations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Actionable Recommendations</h2>
        <p className="text-slate-500 dark:text-slate-400">Prescriptive analytics suggesting the most impactful governance interventions.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">{error}</div>
        ) : recommendations.length === 0 ? (
          <div className="text-center p-12 text-slate-500">No recommendations available at this time.</div>
        ) : (
          recommendations.map((rec, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rec.recommended_action}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{rec.reason}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                    <Target className={`w-4 h-4 ${rec.priority_score > 75 ? 'text-red-500' : 'text-amber-500'}`} /> 
                    Priority: <span className="font-semibold">{rec.priority_level} ({rec.priority_score.toFixed(1)})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-500" /> District: <span className="font-semibold capitalize">{rec.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                    <Zap className="w-4 h-4 text-amber-500" /> Category: <span className="font-semibold capitalize">{rec.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:border-l border-slate-200 dark:border-slate-700 md:pl-6">
                <button className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  Draft Proposal <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
