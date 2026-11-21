'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, CheckCircle2 } from 'lucide-react';
import { PhoneSimulator } from '@/components/simulator/phone-simulator';
import { RoiCalculator } from './roi-calculator';

export function Hero() {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-100/50 via-emerald-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Split Layout: Copy + Phone Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Hero Copy) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Free 48-Hour Pilot • Zero Setup Fee • No Credit Card</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Stop letting missed calls hire your competitors.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Instant automated WhatsApp lead recovery for emergency trade contractors. Catch customers in <strong className="text-slate-900 font-semibold">under 3 seconds</strong> while your hands are busy on the tools.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
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
                Live Contractor Dashboard Demo
              </Link>
            </div>

            {/* Value Props Strip */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/60 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Under 3s WhatsApp Response</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Keep Your Current Number</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Tap Phone Call Dispatch</span>
              </div>
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
