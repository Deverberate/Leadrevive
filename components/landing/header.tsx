'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, PhoneCall } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              LeadRevive
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Emergency Trades
            </span>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#simulator" className="hover:text-slate-900 transition-colors">
            Live Simulator
          </a>
          <a href="#calculator" className="hover:text-slate-900 transition-colors">
            ROI Calculator
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            £0 Pilot Pricing
          </a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/app"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
            Contractor App
          </Link>

          <a
            href="#pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-blue-600 rounded-xl shadow-xs shadow-blue-500/20 active:scale-95 transition-all"
          >
            Start 48h Free Pilot
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
