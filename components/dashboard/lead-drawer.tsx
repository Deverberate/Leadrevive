'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  CheckCheck, 
  CheckCircle2, 
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { LeadStatus, Lead } from '@/lib/types';
import { formatPhoneForDialer, formatPhoneForWhatsApp, formatPhoneDisplay } from '@/lib/phone-utils';

interface LeadNotesSectionProps {
  lead: Lead;
  onSave: (notes: string) => void;
}

function LeadNotesSection({ lead, onSave }: LeadNotesSectionProps) {
  const [noteText, setNoteText] = useState(lead.notes || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSave = () => {
    onSave(noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="space-y-2 pt-2 border-t border-slate-200/60">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Contractor Notes & Access Details
        </label>
        {noteSaved && (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Saved!
          </span>
        )}
      </div>
      <textarea
        rows={3}
        placeholder="Add notes (e.g. key under mat, customer needs Mira cartridge, visit scheduled for 4pm)..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleSave();
          }
        }}
        className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0071E3]"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
        >
          Save Notes
        </button>
        <span className="text-[10px] text-slate-400">
          Auto-saves on blur or ⌘+Enter
        </span>
      </div>
    </div>
  );
}

export function LeadDrawer() {
  const { leads, selectedLeadId, isDrawerOpen, closeDrawer, updateLeadStatus, updateLeadNotes, business } = useAppStore();
  
  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen || !selectedLead) {
    return null;
  }

  const telLink = formatPhoneForDialer(selectedLead.callerPhone);
  const waUrl = formatPhoneForWhatsApp(
    selectedLead.callerPhone,
    `Hi ${selectedLead.callerName || ''}, this is ${business.ownerName} from ${business.name}. I saw your request regarding: "${selectedLead.issueSummary}".`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div 
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col font-sans animate-slide-left">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lead Details & Transcript
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {business.currencySymbol}{selectedLead.estimatedRevenue} Est.
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {selectedLead.callerName || 'Unknown Caller'}
              </h2>
              <p className="text-xs font-mono font-medium text-slate-500">
                {formatPhoneDisplay(selectedLead.callerPhone)}
              </p>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Dispatch Bar */}
          <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <a
                href={telLink}
                className="flex-1 h-12 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                Call Customer
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-4 bg-[#008069] hover:bg-[#006e5a] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>

            {/* Status Dropdown */}
            <div className="shrink-0">
              <select
                value={selectedLead.status}
                onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
                className="h-12 px-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-[#0071E3]"
              >
                <option value="MISSED">🔴 Missed</option>
                <option value="ENGAGED">💬 Chatting</option>
                <option value="QUALIFIED">🔵 Qualified</option>
                <option value="BOOKED">🟢 Booked</option>
                <option value="COMPLETED">✅ Completed</option>
                <option value="LOST">⚪ Lost</option>
              </select>
            </div>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Lead Summary Info Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0071E3]" />
                Job Summary & Location
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedLead.issueSummary}
              </p>
              {selectedLead.addressPostcode && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{selectedLead.addressPostcode}</span>
                </div>
              )}
            </div>

            {/* Full WhatsApp Conversation Transcript */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live WhatsApp Transcript
                </h4>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                  {selectedLead.messages.length} messages
                </span>
              </div>

              {selectedLead.messages.length > 0 ? (
                <div className="bg-[#EFEAE2] p-4 rounded-2xl space-y-3 border border-slate-200/60">
                  {selectedLead.messages.map((msg) => {
                    const isCaller = msg.sender === 'CALLER';
                    const isSystem = msg.sender === 'SYSTEM';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="bg-slate-200 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                            ⚙️ {msg.content}
                          </span>
                        </div>
                      );
                    }

                    if (isCaller) {
                      return (
                        <div key={msg.id} className="flex flex-col items-end">
                          <div className="bg-[#D9FDD3] rounded-2xl rounded-tr-xs p-2.5 text-xs text-slate-900 shadow-2xs max-w-[85%] leading-relaxed">
                            {msg.mediaType === 'image' && (
                              <div className="mb-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                                <ImageIcon className="w-4 h-4 text-emerald-600" />
                                <span>[Customer Photo: {msg.mediaCaption || 'Damage view'}]</span>
                              </div>
                            )}
                            <p>{msg.content}</p>
                            <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-slate-500">
                              <span>{msg.timestamp}</span>
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="flex flex-col items-start">
                        <div className="bg-white rounded-2xl rounded-tl-xs p-2.5 text-xs text-slate-800 shadow-2xs border border-slate-200/50 max-w-[85%] leading-relaxed">
                          <p>{msg.content}</p>
                          {msg.buttons && (
                            <div className="mt-2 space-y-1">
                              {msg.buttons.map((b) => {
                                const isSelected = msg.selectedButtonId === b.id;
                                return (
                                  <div
                                    key={b.id}
                                    className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center justify-between ${
                                      isSelected
                                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold'
                                        : 'bg-slate-50 border border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span>{b.label}</span>
                                    {isSelected && <span className="text-[9px] text-emerald-600 font-bold">Selected</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-slate-400">
                            <span>{msg.timestamp}</span>
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No chat messages logged yet for this lead.
                </div>
              )}
            </div>

            {/* Contractor Notes Section */}
            <LeadNotesSection 
              key={selectedLead.id} 
              lead={selectedLead} 
              onSave={(notes) => updateLeadNotes(selectedLead.id, notes)} 
            />

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
            <span>Lead ID: {selectedLead.id}</span>
            <button
              type="button"
              onClick={closeDrawer}
              className="font-semibold text-slate-700 hover:text-slate-900"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
