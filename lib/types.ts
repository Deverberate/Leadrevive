export type TradeType = 
  | 'plumbing' 
  | 'electrician' 
  | 'locksmith' 
  | 'hvac' 
  | 'roofing' 
  | 'auto_detailing';

export type UrgencyLevel = 'EMERGENCY' | 'HIGH' | 'STANDARD' | 'LOW';

export type LeadStatus = 'MISSED' | 'ENGAGED' | 'QUALIFIED' | 'BOOKED' | 'COMPLETED' | 'LOST';

export interface Business {
  id: string;
  name: string;
  tradeType: TradeType;
  ownerName: string;
  ownerWhatsApp: string;
  forwardingNumber: string;
  avgJobValue: number;
  currencySymbol: string;
  city: string;
  forwardingCode: string;
}

export interface MessageButton {
  id: string;
  label: string;
  icon?: string;
}

export interface Message {
  id: string;
  leadId: string;
  sender: 'CALLER' | 'BOT' | 'OWNER' | 'SYSTEM';
  content: string;
  timestamp: string;
  buttons?: MessageButton[];
  selectedButtonId?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'location';
  mediaCaption?: string;
}

export interface Lead {
  id: string;
  businessId: string;
  callerPhone: string;
  callerName?: string;
  status: LeadStatus;
  urgency: UrgencyLevel;
  issueSummary: string;
  addressPostcode?: string;
  estimatedRevenue: number;
  missedAt: string;
  recoveredAt?: string;
  messages: Message[];
  notes?: string;
  updated_at?: string;
}

export interface RoiMetrics {
  totalRecoveredRevenue: number;
  missedCallsCount: number;
  recoveredCount: number;
  recoveryRatePercent: number;
  avgResponseTimeSeconds: number;
}
