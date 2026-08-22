import React, { useState } from 'react';
import { Mic, Send, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { analyzeComplaintMock } from '../services/mockData';

export default function CitizenPortal() {
  const [complaint, setComplaint] = useState('');
  const [language, setLanguage] = useState('en');
  const [step, setStep] = useState(1); // 1: Input, 2: Analyzing, 3: Preview, 4: Success
  const [analysis, setAnalysis] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) return;
    
    setStep(2);
    try {
      const result = await analyzeComplaintMock(complaint);
      setAnalysis(result);
      setStep(3);
    } catch (err) {
      console.error(err);
      // fallback
      setStep(1);
    }
  };

  const handleConfirm = () => {
    // In real app, we'd send the confirmed analysis + complaint to the backend here
    setStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Report a Civic Issue
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Your voice matters. Describe the issue and we'll automatically route it to the right department.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="px-6 py-8 sm:p-10">
          
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Preferred Language (Optional)
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                </select>
              </div>

              <div>
                <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">
                  Describe the issue
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="complaint"
                    rows={5}
                    className="form-textarea block w-full rounded-md border-gray-300 border p-3 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="E.g. There is a massive pothole on MG Road near the school..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    required
                  />
                  <div className="absolute bottom-3 right-3">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-500 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full"
                      title="Voice input (Demo)"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!complaint.trim()}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Analyze & Review <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">AI is analyzing your complaint...</h3>
              <p className="mt-2 text-sm text-gray-500">Extracting category, urgency, and location.</p>
            </div>
          )}

          {step === 3 && analysis && (
            <div className="space-y-6 py-2">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-900">Review Details</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  AI Extracted
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Category</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{analysis.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Urgency</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 capitalize flex items-center">
                    {analysis.urgency === 'high' && <AlertCircle className="w-4 h-4 mr-1 text-red-500" />}
                    {analysis.urgency}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Summary</p>
                <p className="mt-1 text-gray-900">{analysis.summary}</p>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Edit Request
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 flex justify-center items-center bg-primary text-white py-3 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 focus:outline-none transition-colors"
                >
                  Confirm & Submit <Send className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Your request has been prioritized and added to the Government Dashboard. Our teams will address it shortly.
              </p>
              <button
                onClick={() => {
                  setComplaint('');
                  setStep(1);
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
              >
                Submit Another Request
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
