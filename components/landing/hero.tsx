'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PhoneSimulator } from '@/components/simulator/phone-simulator';
import { RoiCalculator } from './roi-calculator';

export function Hero() {
  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-100/40 via-emerald-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Live UK Activity Radar Ticker */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium shadow-md border border-slate-800">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Live UK Radar</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-200 text-[11px] truncate max-w-[280px] sm:max-w-md">
              ⚡ Clapham Emergency Plumbing recovered a £650 burst pipe 4m ago
            </span>
          </div>
        </div>

        {/* Top Split Layout: Copy + Phone Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (Hero Copy) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Catch 2 Jobs in 48 Hours, or Pay £0 • No Credit Card Required</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.06]">
              Stop letting missed calls hire your competitors.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Automated WhatsApp lead triage for emergency trade contractors. When your hands are on the tools, LeadRevive catches callers in <strong className="text-slate-900 font-semibold">under 3 seconds</strong>, collects their emergency details, and alerts your phone before they ring the next guy on Google.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <a
                href="#pricing"
                className="w-full sm:w-auto px-7 py-4 bg-[#0071E3] hover:bg-blue-600 active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
              >
                Start Free 48h Pilot
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/app"
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200/90 active:scale-[0.98] transition-all text-slate-800 font-semibold rounded-2xl shadow-xs flex items-center justify-center gap-2 text-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Live Contractor App Demo
              </Link>
            </div>

            {/* Social Proof Contractor Cluster */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-blue-600 text-white text-[11px] font-bold items-center justify-center shadow-xs">DM</div>
                <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[11px] font-bold items-center justify-center shadow-xs">TB</div>
                <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-amber-600 text-white text-[11px] font-bold items-center justify-center shadow-xs">AR</div>
                <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-indigo-600 text-white text-[11px] font-bold items-center justify-center shadow-xs">SJ</div>
              </div>
              <div className="text-center sm:text-left text-xs">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 font-bold">
                  <span>★★★★★</span>
                  <span className="text-slate-900 font-bold">4.9/5</span>
                </div>
                <span className="text-slate-500 font-medium">Trusted by 40+ UK Emergency Plumbers, Locksmiths & HVAC Pros</span>
              </div>
            </div>

            {/* Value Props Strip */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/60 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Under 3s WhatsApp Latency</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Keep Your Current Number (*61*)</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Tap Phone Call Dispatch</span>
              </div>
            </div>

            {/* Reassurance note */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Works alongside Checkatrade, MyBuilder, TrustATrader & Google Local Services</span>
            </div>
          </div>

          {/* Right Column (Interactive iPhone Simulator) */}
          <div id="simulator" className="lg:col-span-5 flex justify-center">
            <PhoneSimulator />
          </div>

        </div>

        {/* Live ROI Calculator Below Hero */}
        <div id="calculator" className="mt-20">
          <RoiCalculator />
        </div>

      </div>
    </section>
  );
}
