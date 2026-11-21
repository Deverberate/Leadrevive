'use client';

import React from 'react';
import { PhoneMissed, MessageSquare, Zap, Clock } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Forward Unanswered Calls',
      description:
        'When you’re hands-on under a sink or on a roof, your carrier (*61*) automatically sends unanswered rings after 15 seconds to LeadRevive. You never change your phone number or miss customer calls.',
      icon: PhoneMissed,
      pill: 'Standard Carrier *61*',
      accent: 'text-blue-600 bg-blue-50 border-blue-200/60',
    },
    {
      number: '02',
      title: 'Instant WhatsApp Recovery (under 3s)',
      description:
        'Before the caller can search for another contractor on Google, they receive a verified WhatsApp message with interactive buttons (🚨 Emergency Repair, 📅 Book Service). Triage handles their urgent request immediately.',
      icon: MessageSquare,
      pill: 'Under 3s Response Time',
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
    },
    {
      number: '03',
      title: 'Direct Contractor Alert & Booking',
      description:
        'You receive an instant alert on your own phone with the customer’s name, exact address, emergency description, and a 1-tap call button. Call them back within 60 seconds with total context and secure the job.',
      icon: Zap,
      pill: '1-Tap Call Dispatch',
      accent: 'text-amber-600 bg-amber-50 border-amber-200/60',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-[#0071E3] text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Simple 3-Step Automation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            How LeadRevive Catches Jobs While You Work
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Zero complicated apps for customers to download. Zero changes to your advertising or existing phone number.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[#FAFAFC] rounded-3xl border border-slate-200/80 p-7 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group"
              >
                {/* Step Number Watermark */}
                <span className="text-4xl font-black text-slate-200/70 font-mono select-none group-hover:text-blue-100 transition-colors">
                  {step.number}
                </span>

                <div className="mt-4 space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${step.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 font-mono">
                    {step.pill}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Trade Use Cases */}
        <div className="mt-16 p-6 sm:p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Tailored for High-Ticket Emergency Trades
              </span>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
                Plumbers, Electricians, Locksmiths & HVAC Specialists
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Average ticket $300–$1,500. When their home is flooding or freezing, they won’t leave a voicemail. They hire whoever answers first.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-center">
                <span className="block text-emerald-400 text-base">🚰</span>
                <span className="mt-1 block">Burst Pipes & Leaks</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-center">
                <span className="block text-amber-400 text-base">⚡</span>
                <span className="mt-1 block">Tripped Breakers</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-center">
                <span className="block text-blue-400 text-base">🔑</span>
                <span className="mt-1 block">Emergency Lockouts</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-center">
                <span className="block text-red-400 text-base">❄️</span>
                <span className="mt-1 block">Boiler / AC Outage</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
