'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { LeadCard } from './lead-card';
import { 
  Flame, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  Inbox
} from 'lucide-react';

export function LeadStream() {
  const { leads, activeFilter, setActiveFilter } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Counts for tabs
  const allCount = leads.length;
  const emergencyCount = leads.filter(l => l.urgency === 'EMERGENCY').length;
  const bookedCount = leads.filter(l => l.status === 'BOOKED' || l.status === 'COMPLETED').length;
  const chattingCount = leads.filter(l => l.status === 'ENGAGED' || l.status === 'QUALIFIED').length;

  // Filter leads based on active tab and search query
  const filteredLeads = leads.filter((lead) => {
    // Tab filter
    if (activeFilter === 'EMERGENCY' && lead.urgency !== 'EMERGENCY') return false;
    if (activeFilter === 'BOOKED' && lead.status !== 'BOOKED' && lead.status !== 'COMPLETED') return false;
    if (activeFilter === 'ENGAGED' && lead.status !== 'ENGAGED' && lead.status !== 'QUALIFIED') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.callerName?.toLowerCase().includes(q);
      const matchPhone = lead.callerPhone.toLowerCase().includes(q);
      const matchIssue = lead.issueSummary.toLowerCase().includes(q);
      const matchAddress = lead.addressPostcode?.toLowerCase().includes(q);
      return matchName || matchPhone || matchIssue || matchAddress;
    }

    return true;
  });

  return (
    <div className="space-y-5">
      
      {/* Controls Bar: Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Leads ({allCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('EMERGENCY')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'EMERGENCY'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-red-700 bg-red-50 hover:bg-red-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            🚨 Emergency ({emergencyCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('BOOKED')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'BOOKED'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            📅 Booked ({bookedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ENGAGED')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'ENGAGED'
                ? 'bg-[#0071E3] text-white shadow-2xs'
                : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            💬 Replying ({chattingCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads, phone, postcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
          />
        </div>

      </div>

      {/* Leads List / Grid */}
      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">No leads match this view</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching filter tabs or clearing your search term to see recovered missed calls.
          </p>
        </div>
      )}

    </div>
  );
}
