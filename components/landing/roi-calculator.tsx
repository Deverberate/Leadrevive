'use client';

import React, { useState } from 'react';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export function RoiCalculator() {
  const [missedCalls, setMissedCalls] = useState(4);
  const [avgTicket, setAvgTicket] = useState(450);

  // Calculations
  const weeklyLeak = missedCalls * avgTicket;
  const monthlyLeak = Math.round(weeklyLeak * 4.33);
  const annualLeak = weeklyLeak * 52;
  const subscriptionCost = 179; // £179/mo flat
  const roiMultiple = Math.max(1, Math.round(monthlyLeak / subscriptionCost));

  // Leakage percentage for competitor leakage meter (relative scale)
  const leakPercent = Math.min(100, Math.round((missedCalls / 15) * 100));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-900/5 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200/80 rounded-full text-red-700 text-xs font-semibold mb-2 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Live UK Revenue Leak Calculator
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              How much are missed calls costing your trade business?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Adjust the sliders based on your weekly volume to see your annual revenue leakage.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>UK Pound Sterling (£)</span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Slider 1: Missed Calls */}
          <div className="space-y-3.5 p-5 bg-slate-50/90 rounded-2xl border border-slate-200/70 shadow-xs">
            <div className="flex items-center justify-between">
              <label htmlFor="missed-calls-slider" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Missed Calls Per Week
              </label>
              <span className="text-lg font-bold font-mono text-[#0071E3] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200/60 shadow-2xs">
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
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0071E3]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>1 call/wk (Part-time)</span>
              <span>10 calls/wk (Busy Solo)</span>
              <span>20 calls/wk (Multi-Van)</span>
            </div>
          </div>

          {/* Slider 2: Average Job Value */}
          <div className="space-y-3.5 p-5 bg-slate-50/90 rounded-2xl border border-slate-200/70 shadow-xs">
            <div className="flex items-center justify-between">
              <label htmlFor="avg-ticket-slider" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Average Emergency Ticket
              </label>
              <span className="text-lg font-bold font-mono text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-200/60 shadow-2xs">
                £{avgTicket.toLocaleString()}
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
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>£150 (Unblock/Fix)</span>
              <span>£650 (Emergency Leak)</span>
              <span>£2,000+ (New Boiler)</span>
            </div>
          </div>
        </div>

        {/* Competitor Leakage Visual Bar */}
        <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-red-900">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Competitor Steal Rate in Your Postal Area
            </span>
            <span className="font-mono text-red-700">£{monthlyLeak.toLocaleString()} handed over / month</span>
          </div>
          <div className="w-full h-3 bg-red-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-300"
              style={{ width: `${leakPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-red-700 leading-tight">
            82% of customers who reach your voicemail hang up within 8 seconds and dial the next listing on Google or Checkatrade.
          </p>
        </div>

        {/* Results Banner */}
        <div className="p-6 sm:p-7 bg-slate-950 text-white rounded-3xl shadow-xl space-y-5 border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Weekly Revenue Lost
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-red-400 font-mono mt-1 tracking-tight">
                £{weeklyLeak.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">lost to voicemail drops</span>
            </div>

            <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Monthly Leakage
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mt-1 tracking-tight">
                £{monthlyLeak.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">based on 4.33 weeks/mo</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Annual Recoverable
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-1 tracking-tight">
                £{annualLeak.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-300/80 mt-0.5 block">secured with LeadRevive</span>
            </div>
          </div>

          {/* ROI callout & Guarantee */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Just <strong>1 emergency call</strong> recovered covers LeadRevive (&pound;{subscriptionCost}/mo) for over <strong>2.5 months</strong>.
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto text-emerald-300 font-bold bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estimated ROI: {roiMultiple}x return on £179/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
