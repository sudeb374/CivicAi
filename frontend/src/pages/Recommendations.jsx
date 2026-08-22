import React from 'react';
import { Lightbulb, ArrowRight, Zap, Target } from 'lucide-react';

export default function Recommendations() {
  const recommendations = [
    {
      title: "Deploy Mobile Health Clinics to Sector 7",
      reason: "AI detected a 45% spike in medical grievances alongside 0 hospital availability in 12 adjacent villages.",
      impact: "High",
      budget: "$50k - $80k",
      timeline: "Immediate (1-2 weeks)"
    },
    {
      title: "Prioritize Road Maintenance in Valley District",
      reason: "Analysis of monsoon patterns and past infrastructure failure data predicts a 90% chance of road collapse.",
      impact: "Critical",
      budget: "$200k+",
      timeline: "Before Nov 15"
    },
    {
      title: "Consolidate Water Pipeline Requests",
      reason: "NLP clustering found 145 separate requests for water piping within a 2km radius. A single central tank project would resolve all.",
      impact: "Medium",
      budget: "$120k",
      timeline: "3 Months"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Actionable Recommendations</h2>
        <p className="text-slate-500 dark:text-slate-400">Prescriptive analytics suggesting the most impactful governance interventions.</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rec.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{rec.reason}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                  <Target className="w-4 h-4 text-red-500" /> Impact: <span className="font-semibold">{rec.impact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-500" /> Timeline: <span className="font-semibold">{rec.timeline}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                   Budget: <span className="font-semibold">{rec.budget}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:border-l border-slate-200 dark:border-slate-700 md:pl-6">
              <button className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                Draft Proposal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
