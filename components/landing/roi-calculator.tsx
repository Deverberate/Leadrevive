'use client';

import React, { useState } from 'react';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export function RoiCalculator() {
  const [missedCalls, setMissedCalls] = useState(4);
  const [avgTicket, setAvgTicket] = useState(450);
  const [currency, setCurrency] = useState<'£' | '$'>('£');

  // Calculations
  const weeklyLeak = missedCalls * avgTicket;
  const monthlyLeak = Math.round(weeklyLeak * 4.33);
  const annualLeak = weeklyLeak * 52;
  const subscriptionCost = currency === '£' ? 179 : 199;
  const roiMultiple = Math.max(1, Math.round(monthlyLeak / subscriptionCost));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200/70 rounded-full text-red-700 text-xs font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Live Revenue Leak Calculator
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              How much are missed calls costing your business?
            </h3>
          </div>

          {/* Currency Toggle */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setCurrency('£')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currency === '£' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              GBP (£)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('$')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currency === '$' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Missed Calls */}
          <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="missed-calls-slider" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Missed Calls Per Week
              </label>
              <span className="text-lg font-bold font-mono text-[#0071E3] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/60">
                {missedCalls} {missedCalls === 1 ? 'call' : 'calls'}
              </span>
            </div>
            <input
              id="missed-calls-slider"
              type="range"
              aria-label="Missed Calls Per Week"
              min={1}
              max={20}
              step={1}
              value={missedCalls}
              onChange={(e) => setMissedCalls(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0071E3]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>1 call/wk</span>
              <span>10 calls/wk</span>
              <span>20 calls/wk</span>
            </div>
          </div>

          {/* Slider 2: Average Job Value */}
          <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="avg-ticket-slider" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Average Emergency Job Value
              </label>
              <span className="text-lg font-bold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                {currency}{avgTicket.toLocaleString()}
              </span>
            </div>
            <input
              id="avg-ticket-slider"
              type="range"
              aria-label="Average Emergency Job Value"
              min={150}
              max={2000}
              step={25}
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{currency}150 (Quick Fix)</span>
              <span>{currency}1,000 (Boiler/Board)</span>
              <span>{currency}2,000+ (Full Install)</span>
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="border-b sm:border-b-0 sm:border-r border-slate-700/80 pb-3 sm:pb-0 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Weekly Revenue Lost
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono mt-1">
                {currency}{weeklyLeak.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">goes to next Google search</span>
            </div>

            <div className="border-b sm:border-b-0 sm:border-r border-slate-700/80 pb-3 sm:pb-0 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Monthly Leakage
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
                {currency}{monthlyLeak.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">at 4.33 weeks/month</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Annual Recoverable
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                {currency}{annualLeak.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-200/80">saved by LeadRevive</span>
            </div>
          </div>

          {/* ROI callout */}
          <div className="pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Recovering just <strong>1 emergency call</strong> covers <strong>2+ months</strong> of LeadRevive ({currency}{subscriptionCost}/mo).
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto text-emerald-300 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estimated ROI: {roiMultiple}x return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
