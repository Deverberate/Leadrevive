'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowLeft, 
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TradeType } from '@/lib/types';

export function DashboardHeader() {
  const { business, setBusiness, addLead } = useAppStore();

  const tradePresets: { 
    [key in TradeType]?: { 
      name: string; 
      owner: string; 
      avg: number; 
      symbol: string; 
      code: string;
      simCaller: string;
      simPhone: string;
      simIssue: string;
      simLocation: string;
      simMsg: string;
    } 
  } = {
    plumbing: {
      name: 'Apex 24/7 Emergency Plumbing',
      owner: 'Dave Morrison',
      avg: 450,
      symbol: '£',
      code: '*61*+442079460192#',
      simCaller: 'Tom Harding',
      simPhone: '+44 7911 882104',
      simIssue: 'Water burst behind kitchen washing machine, flooding laminate floor.',
      simLocation: 'SW11 2AB, Battersea',
      simMsg: 'Emergency water burst behind kitchen washing machine! Need someone now.',
    },
    electrician: {
      name: 'VoltCare 24/7 Electricians',
      owner: 'Marcus Vance',
      avg: 380,
      symbol: '£',
      code: '*61*+442079460555#',
      simCaller: 'Rachel Adams',
      simPhone: '+44 7911 882555',
      simIssue: 'Main consumer unit sparking and burning smell, total power failure.',
      simLocation: 'SW4 9LL, Clapham Old Town',
      simMsg: 'Fuse board sparked loudly and burning smell in hallway, no power in house!',
    },
    locksmith: {
      name: 'SureLock 24hr Emergency Locksmiths',
      owner: 'Sarah Connor',
      avg: 290,
      symbol: '£',
      code: '*61*+442079460888#',
      simCaller: 'James Miller',
      simPhone: '+44 7911 882888',
      simIssue: 'Front door cylinder sheared off, key broken inside lock, locked outside.',
      simLocation: 'SW8 1UJ, Vauxhall',
      simMsg: 'Front door key snapped off inside euro cylinder, freezing outside with toddler!',
    },
    hvac: {
      name: 'AirPro Climate & Heating',
      owner: 'Liam Wright',
      avg: 650,
      symbol: '£',
      code: '*61*+442079460999#',
      simCaller: 'David Chen',
      simPhone: '+44 7911 882999',
      simIssue: 'Worcester Bosch boiler error EA 229, no hot water or heating during freeze.',
      simLocation: 'SW18 2PT, Wandsworth Town',
      simMsg: 'Boiler completely locked out with EA code, radiators are ice cold!',
    },
  };

  const handleSwitchTrade = (trade: TradeType) => {
    const preset = tradePresets[trade];
    if (preset) {
      setBusiness({
        ...business,
        tradeType: trade,
        name: preset.name,
        ownerName: preset.owner,
        avgJobValue: preset.avg,
        currencySymbol: preset.symbol,
        forwardingCode: preset.code,
      });
    }
  };

  const handleSimulateQuickLead = () => {
    const id = `lead-test-${Date.now()}`;
    const currentTrade = tradePresets[business.tradeType] || tradePresets.plumbing!;

    addLead({
      id,
      businessId: business.id,
      callerPhone: currentTrade.simPhone,
      callerName: currentTrade.simCaller,
      status: 'BOOKED',
      urgency: 'EMERGENCY',
      issueSummary: currentTrade.simIssue,
      addressPostcode: currentTrade.simLocation,
      estimatedRevenue: business.avgJobValue,
      missedAt: 'Just now',
      recoveredAt: 'Just now',
      notes: `Simulated for ${business.name}. Contractor alerted via WhatsApp.`,
      messages: [
        {
          id: `msg-t1-${Date.now()}`,
          leadId: id,
          sender: 'SYSTEM',
          content: `Unanswered call from ${currentTrade.simPhone} forwarded via ${business.forwardingCode}`,
          timestamp: 'Just now',
        },
        {
          id: `msg-t2-${Date.now()}`,
          leadId: id,
          sender: 'BOT',
          content: `Hi ${currentTrade.simCaller}! ${business.ownerName} at ${business.name} here. Sorry I missed your call — how can we help?`,
          timestamp: 'Just now',
        },
        {
          id: `msg-t3-${Date.now()}`,
          leadId: id,
          sender: 'CALLER',
          content: currentTrade.simMsg,
          timestamp: 'Just now',
        },
        {
          id: `msg-t4-${Date.now()}`,
          leadId: id,
          sender: 'BOT',
          content: `Priority 1 logged! ${business.ownerName} will call you immediately.`,
          timestamp: 'Just now',
        },
      ],
    }, true);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Side: Brand & Active Business */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center text-white shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {business.name}
                </h1>
                {/* Active Forwarding Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Forwarding Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Owner: <strong>{business.ownerName}</strong> • {business.forwardingNumber} • Avg Ticket {business.currencySymbol}{business.avgJobValue}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Trade Switcher & Test Trigger */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Trade Selector */}
          <select
            value={business.tradeType}
            onChange={(e) => handleSwitchTrade(e.target.value as TradeType)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-[#0071E3]"
          >
            <option value="plumbing">🚰 Emergency Plumbing</option>
            <option value="electrician">⚡ 24/7 Electrician</option>
            <option value="locksmith">🔑 Emergency Locksmith</option>
            <option value="hvac">❄️ Emergency HVAC</option>
          </select>

          {/* Quick Simulate Button */}
          <button
            type="button"
            onClick={handleSimulateQuickLead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Simulate Missed Call
          </button>
        </div>

      </div>
    </header>
  );
}
