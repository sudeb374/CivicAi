import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, MapPin, Globe, Sparkles, Send, Loader2, AlertCircle, Mic, MicOff } from 'lucide-react';
import { api } from '../services/api';

export default function VoiceComplaints() {
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        
        // Use a generic language or the user's browser default, but Bengali works well as a default for this app
        recog.lang = 'bn-IN'; 
        
        recog.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setText(currentTranscript);
        };

        recog.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          if (event.error !== 'aborted') {
            setError('Microphone error: ' + event.error);
          }
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Safari.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setError(null);
      setText(''); // Clear text when starting a new recording
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await api.createComplaint({ text, location });
      setResult(response);
      setText('');
      setLocation('');
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Submit Grievance</h2>
        <p className="text-slate-500 dark:text-slate-400">Describe your grievance in your local language. AI will translate, categorize, and prioritize it automatically.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          
          <div className="flex flex-col items-center justify-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div className="relative inline-flex items-center justify-center">
              {isRecording && (
                <span className="absolute w-24 h-24 bg-red-500 rounded-full opacity-20 animate-ping"></span>
              )}
              <button 
                type="button"
                onClick={toggleRecording}
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg hover:scale-105 ${isRecording ? 'bg-red-500' : 'bg-blue-600'}`}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              {isRecording ? "Listening... (Click to stop)" : "Click to speak your complaint"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4"/> Complaint Description
            </label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              placeholder="Speak using the microphone above, or type manually here..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4"/> Village / Location (Optional)
            </label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="E.g. Dihi Bhursut"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="text-center pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting || !text.trim()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? 'Analyzing with AI...' : 'Submit Complaint'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-10 text-left bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> AI Analysis Result
            </div>
            
            <div className="space-y-5">
              {result.translated_text && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> Translation ({result.detected_language})</span>
                  </div>
                  <p className="text-slate-900 dark:text-white text-md font-medium">
                    {result.translated_text}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sector</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{result.sector || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Location</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{result.village || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Severity</div>
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">{result.severity || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Priority</div>
                  <div className={`font-semibold ${result.priority_score >= 75 ? 'text-red-600' : result.priority_score >= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {result.priority_level} ({result.priority_score})
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
