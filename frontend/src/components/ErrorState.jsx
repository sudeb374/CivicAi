import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ title = "Something went wrong", message = "We encountered an unexpected error. Please try again.", retryAction = null, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-lg ${className}`}>
      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="text-sm text-red-600 mt-1 max-w-sm">{message}</p>
      {retryAction && (
        <button
          onClick={retryAction}
          className="mt-4 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
