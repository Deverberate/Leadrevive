'use client';

import React from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { Lead, UrgencyLevel, LeadStatus } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { formatPhoneForDialer, formatPhoneForWhatsApp, formatPhoneDisplay } from '@/lib/phone-utils';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const { selectLead, business } = useAppStore();

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
            <Flame className="w-3 h-3 text-red-600 fill-red-500" />
            EMERGENCY
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            HIGH PRIORITY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
            STANDARD
          </span>
        );
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'BOOKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            BOOKED
          </span>
        );
      case 'QUALIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold">
            QUALIFIED
          </span>
        );
      case 'ENGAGED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
            CHATTING
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium">
            {status}
          </span>
        );
    }
  };

  const telLink = formatPhoneForDialer(lead.callerPhone);
  const waUrl = formatPhoneForWhatsApp(
    lead.callerPhone,
    `Hi ${lead.callerName || ''}, this is ${business.ownerName} from ${business.name} following up on your request.`
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Top Header Row */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {getUrgencyBadge(lead.urgency)}
            {getStatusBadge(lead.status)}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Missed {lead.missedAt}</span>
          </div>
        </div>

        {/* Caller Info */}
        <div className="mt-3.5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{lead.callerName || 'Unknown Caller'}</span>
            </h3>
            <p className="text-xs font-mono font-medium text-slate-500 mt-0.5">
              {formatPhoneDisplay(lead.callerPhone)}
            </p>
          </div>

          {/* Job Value */}
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Est. Revenue</span>
            <span className="text-base font-extrabold font-mono text-emerald-600">
              {business.currencySymbol}{lead.estimatedRevenue}
            </span>
          </div>
        </div>

        {/* AI Extracted Issue Summary */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {lead.issueSummary}
          </p>
          
          {lead.addressPostcode && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{lead.addressPostcode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Touch-Friendly Action Buttons (Minimum 52px height) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
        {/* 1-Tap Call */}
        <a
          href={telLink}
          className="w-full sm:flex-1 h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          Call Customer Now
        </a>

        {/* 1-Tap WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto h-[52px] px-4 bg-[#008069] hover:bg-[#006e5a] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp
        </a>

        {/* View Transcript & Details */}
        <button
          type="button"
          onClick={() => selectLead(lead.id)}
          className="w-full sm:w-auto h-[52px] px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-98 transition-all"
        >
          Chat Log ({lead.messages.length})
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
