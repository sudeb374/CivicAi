import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = "No data available", message = "There is currently nothing to display here.", actionButton = null, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 ${className}`}>
      <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm mb-5">{message}</p>
      {actionButton}
    </div>
  );
}
