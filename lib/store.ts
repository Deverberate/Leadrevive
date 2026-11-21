'use client';

import { create } from 'zustand';
import { Business, Lead, LeadStatus, RoiMetrics } from './types';
import { mockBusiness, initialMockLeads } from './mock-data';

interface AppState {
  business: Business;
  leads: Lead[];
  selectedLeadId: string | null;
  activeFilter: 'ALL' | 'EMERGENCY' | 'BOOKED' | 'ENGAGED';
  isDrawerOpen: boolean;
  
  // Actions
  setBusiness: (business: Business) => void;
  selectLead: (id: string | null) => void;
  closeDrawer: () => void;
  setActiveFilter: (filter: 'ALL' | 'EMERGENCY' | 'BOOKED' | 'ENGAGED') => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadNotes: (id: string, notes: string) => void;
  addLead: (lead: Lead, openDrawer?: boolean) => void;
  getMetrics: () => RoiMetrics;
}

export const useAppStore = create<AppState>((set, get) => ({
  business: mockBusiness,
  leads: initialMockLeads,
  selectedLeadId: initialMockLeads[0].id,
  activeFilter: 'ALL',
  isDrawerOpen: false,

  setBusiness: (business) => set({ business }),
  
  selectLead: (id) => set({ selectedLeadId: id, isDrawerOpen: id !== null }),
  
  closeDrawer: () => set({ isDrawerOpen: false }),

  setActiveFilter: (activeFilter) => set({ activeFilter }),

  updateLeadStatus: (id, status) => {
    set((state) => ({
      leads: state.leads.map((lead) => 
        lead.id === id ? { ...lead, status, updated_at: new Date().toISOString() } : lead
      ),
    }));
  },

  updateLeadNotes: (id, notes) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, notes, updated_at: new Date().toISOString() } : lead
      ),
    }));
  },

  addLead: (newLead, openDrawer = false) => {
    set((state) => ({
      leads: [newLead, ...state.leads],
      selectedLeadId: newLead.id,
      isDrawerOpen: openDrawer,
    }));
  },

  getMetrics: () => {
    const leads = get().leads;
    const business = get().business;
    
    const recoveredLeads = leads.filter(l => l.status === 'BOOKED' || l.status === 'COMPLETED' || l.status === 'QUALIFIED');
    const totalRecovered = recoveredLeads.reduce((acc, l) => acc + (l.estimatedRevenue || business.avgJobValue), 0);
    const missedCount = leads.length + 3; // +3 unrecovered baseline
    const recoveredCount = recoveredLeads.length;
    const rate = Math.round((recoveredCount / missedCount) * 100);

    return {
      totalRecoveredRevenue: totalRecovered,
      missedCallsCount: missedCount,
      recoveredCount,
      recoveryRatePercent: rate,
      avgResponseTimeSeconds: 3.2,
    };
  },
}));
