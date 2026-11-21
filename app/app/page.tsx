'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { LeadStream } from '@/components/dashboard/lead-stream';
import { LeadDrawer } from '@/components/dashboard/lead-drawer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <DashboardHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards Row */}
        <section>
          <KpiCards />
        </section>

        {/* Realtime Lead Stream */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Live Lead Recovery Feed
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Unanswered calls automatically engaged via WhatsApp Cloud API with instant 1-tap dispatch
              </p>
            </div>
          </div>

          <LeadStream />
        </section>
      </main>

      {/* Slide-Over Drawer */}
      <LeadDrawer />
    </div>
  );
}
