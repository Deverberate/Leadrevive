'use client';

import React from 'react';
import { Check, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Pricing() {
  const features = [
    'Automated WhatsApp recovery in under 3 seconds',
    'Carrier conditional forwarding (*61*) — keep your current number',
    'Interactive triage buttons (Emergency Leak, Booking, Photo intake)',
    'Real-time contractor alert pings directly to your mobile',
    'Owner Dashboard with full WhatsApp chat transcripts',
    'AI-powered issue & address extraction',
    'Unlimited missed calls recovered (Zero per-lead commissions)',
    'White-glove 5-minute carrier setup call with our team',
    'No contract — cancel anytime with 1 click',
  ];

  return (
    <section id="pricing" className="py-20 bg-[#FAFAFC] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-emerald-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            The 48-Hour Zero-Risk Guarantee
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Catch 2 Jobs in 48 Hours, or Pay £0.
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            We connect LeadRevive to your existing business number for 48 hours completely free. If we don’t catch at least 2 emergency jobs you would have lost to voicemail, you pay nothing.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mt-12 bg-white rounded-3xl border-2 border-[#0071E3]/20 shadow-xl shadow-blue-500/5 p-8 sm:p-10 relative overflow-hidden">
          {/* Top highlight ribbon */}
          <div className="absolute top-0 right-0 bg-[#0071E3] text-white text-[11px] font-bold px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-xs">
            Most Popular Pilot
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Plan Price & Core Offer */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                48-Hour Free Trial
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-center lg:justify-start gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">£0</span>
                  <span className="text-slate-500 text-sm font-medium">for 48 hours</span>
                </div>
                <p className="text-xs text-slate-400">
                  Then <strong className="text-slate-700 font-semibold">£179 / month</strong> flat. Cancel anytime.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>The No-Risk Promise</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  One emergency plumbing or HVAC ticket (£350+) covers your entire monthly bill. If LeadRevive doesn’t deliver positive ROI in 48 hours, walk away with £0 charged.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/app"
                  className="w-full py-4 px-6 bg-[#0071E3] hover:bg-blue-600 active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
                >
                  Start Free 48-Hour Pilot
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="block text-[11px] text-slate-400 text-center mt-2">
                  No credit card required • Active in 5 minutes
                </span>
              </div>
            </div>

            {/* Right Col: Feature Checklist */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Everything Included in Your Pilot:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>⚡ Operating on Meta Verified Cloud API</span>
                <span className="font-semibold text-emerald-600">99.98% Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
