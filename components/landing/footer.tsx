'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/60 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0071E3] flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              LeadRevive
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Missed Call Lead Recovery</span>
          </div>

          <div className="flex items-center space-x-6 font-medium">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
            <Link href="/app" className="text-[#0071E3] hover:underline">
              Contractor Dashboard
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono">
              All Systems Operational • Meta Cloud API & Twilio Voice Live
            </span>
          </div>

          <p className="text-[11px]">
            &copy; 2026 LeadRevive Inc. Built for emergency trade pros.
          </p>
        </div>
      </div>
    </footer>
  );
}
