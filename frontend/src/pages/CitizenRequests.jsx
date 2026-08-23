import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function CitizenRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadComplaints() {
      try {
        setLoading(true);
        const data = await api.getComplaints();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadComplaints();
  }, []);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'critical': return <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Critical</span>;
      case 'high': return <span className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> High</span>;
      case 'pending':
      case 'received':
      case 'medium': return <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
      case 'resolved':
      case 'low': return <span className="px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Resolved</span>;
      default: return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Citizen Requests</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage and prioritize public grievances.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search requests..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : error ? (
        <div className="text-red-500 p-4 text-center border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">REQ-{req.id}</span>
                {getStatusBadge(req.priority_level || req.status)}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{req.sector || req.category || 'Unknown'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2" title={req.original_text}>{req.original_text}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
                <span className="flex items-center gap-1"><span className="w-3.5 h-3.5">📍</span> {req.village || req.village_code || 'Unknown location'}</span>
                <span>{new Date(req.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="col-span-full text-center p-12 text-slate-500">No requests found.</div>
          )}
        </div>
      )}
    </div>
  );
}
