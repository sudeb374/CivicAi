import React, { useState } from 'react';
import { Mic, Square, Volume2, Globe, Sparkles } from 'lucide-react';

export default function VoiceComplaints() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Voice Complaint Portal</h2>
        <p className="text-slate-500 dark:text-slate-400">Speak your grievance in your local language. AI will translate and categorize it automatically.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            {isRecording && (
              <span className="absolute w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping"></span>
            )}
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 ${isRecording ? 'bg-red-500' : 'bg-blue-600'}`}
            >
              {isRecording ? <Square className="w-10 h-10" fill="currentColor" /> : <Mic className="w-10 h-10" />}
            </button>
          </div>
          <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">
            {isRecording ? "Listening..." : "Tap to speak"}
          </p>
        </div>

        {/* Wave Animation Placeholder */}
        {isRecording && (
          <div className="flex justify-center items-center gap-1 h-12 mb-8">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-blue-500 rounded-full animate-pulse"
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.05}s`
                }}
              ></div>
            ))}
          </div>
        )}

        <div className="text-left bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> AI Transcription & Translation
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Volume2 className="w-3 h-3"/> Original (Hindi)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">
                "Hamare gaon mein pichle do hafte se peene ka pani nahi aa raha hai."
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> Translated (English)</span>
                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">98% Confidence</span>
              </div>
              <p className="text-slate-900 dark:text-white text-lg font-medium">
                "There has been no drinking water supply in our village for the past two weeks."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
