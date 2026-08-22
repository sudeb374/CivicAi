import React from 'react';
import { Lightbulb, TrendingUp, AlertOctagon, Info } from 'lucide-react';

export default function AIInsightCard({ insight }) {
  const getIcon = (type) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'anomaly': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'demand': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-start space-x-3 hover:bg-slate-100 transition-colors">
      <div className="bg-white p-2 rounded-full shadow-sm">
        {getIcon(insight.type)}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800 leading-snug">{insight.text}</p>
        <p className="text-xs text-slate-500 mt-1 capitalize">AI Insight • {insight.type}</p>
      </div>
    </div>
  );
}
