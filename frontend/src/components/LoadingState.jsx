import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-gray-500 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
