'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Zap, Clock, ArrowUpRight, Radio } from 'lucide-react';

export function KpiCards() {
  const { getMetrics, business, leads } = useAppStore();
  const metrics = getMetrics();

  const emergencyCount = leads.filter(l => l.urgency === 'EMERGENCY').length;
  const bookedCount = leads.filter(l => l.status === 'BOOKED' || l.status === 'COMPLETED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Recovered Revenue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recovered Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            {business.currencySymbol}
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {business.currencySymbol}{metrics.totalRecoveredRevenue.toLocaleString()}
          </span>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            <ArrowUpRight className="w-3 h-3" />
            +18%
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Based on {business.currencySymbol}{business.avgJobValue} avg ticket • Zero lost to competitors
        </p>
      </div>

      {/* Card 2: Missed Calls Saved */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Missed Calls Saved
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071E3] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {leads.length} Leads
          </span>
          <span className="text-xs font-medium text-slate-500">
            ({bookedCount} booked)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {emergencyCount} high-urgency emergencies caught while hands-on
        </p>
      </div>

      {/* Card 3: Avg Response Time */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Avg Response Time
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {metrics.avgResponseTimeSeconds}s
          </span>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            Sub-5s SLA
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Twilio webhook → Meta Cloud API automated dispatch
        </p>
      </div>

      {/* Card 4: Forwarding Status Badge */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Status Badge
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active (*61*)
          </span>
          <span className="text-xs font-medium text-slate-500">
            {metrics.recoveryRatePercent}% conv
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 truncate">
          Forwarding code: <span className="font-mono text-slate-600 font-semibold">{business.forwardingCode}</span>
        </p>
      </div>

    </div>
  );
}
