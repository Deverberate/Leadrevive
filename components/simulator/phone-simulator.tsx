'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PhoneMissed, 
  PhoneIncoming, 
  PhoneOff,
  CheckCheck, 
  Sparkles, 
  Zap, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { normalizeE164, formatPhoneForDialer } from '@/lib/phone-utils';
import confetti from 'canvas-confetti';

type SimulatorStage = 
  | 'READY' 
  | 'RINGING' 
  | 'MISSED' 
  | 'FORWARDING' 
  | 'WHATSAPP_CHAT';

type InteractionPath = 'IDLE' | 'EMERGENCY' | 'BOOKING' | 'DETAILS' | 'CONFIRMED';

interface Preset {
  name: string;
  phone: string;
  issue: string;
  urgency: 'EMERGENCY' | 'HIGH' | 'STANDARD';
  jobValue: number;
  initialReply: string;
  address: string;
}

interface ChatMsg {
  id: string;
  sender: 'BOT' | 'CALLER' | 'SYSTEM';
  text: string;
  time: string;
  isPhoto?: boolean;
}

const PRESETS: Preset[] = [
  {
    name: 'Sarah Jenkins',
    phone: '+44 7700 900142',
    issue: '🚨 Burst pipe under kitchen sink, flooding floor',
    urgency: 'EMERGENCY',
    jobValue: 580,
    initialReply: '🚨 Emergency Leak / Flood',
    address: '42 Altenburg Gardens, SW11 1JJ',
  },
  {
    name: 'Mark Thompson',
    phone: '+44 7700 900883',
    issue: '🔥 Boiler breakdown, 0 bar pressure, no heat',
    urgency: 'HIGH',
    jobValue: 380,
    initialReply: '🔥 Boiler Breakdown',
    address: 'SW4 8EG, Clapham Common',
  },
  {
    name: 'Alex Rivera',
    phone: '+44 7700 900319',
    issue: '🔑 Locked out of house, toddler inside',
    urgency: 'EMERGENCY',
    jobValue: 420,
    initialReply: '🚨 Emergency Lockout',
    address: '18 Ponton Road, SW8 2JU',
  },
];

export function PhoneSimulator() {
  const { addLead } = useAppStore();
  const [stage, setStage] = useState<SimulatorStage>('READY');
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [phoneNumber, setPhoneNumber] = useState(PRESETS[0].phone);
  const [callerName, setCallerName] = useState(PRESETS[0].name);
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contractorAlert, setContractorAlert] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(3);
  const [interactionPath, setInteractionPath] = useState<InteractionPath>('IDLE');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmedAddress, setConfirmedAddress] = useState<string>(PRESETS[0].address);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stage, chatMessages, isTyping, contractorAlert, interactionPath]);

  const initializeWhatsAppChat = useCallback(() => {
    setChatMessages([
      {
        id: 'msg-init-1',
        sender: 'BOT',
        text: `Hi ${callerName || 'there'}! Dave at Apex 24/7 Emergency Plumbing here. Sorry I missed your call — I'm currently hands-on fixing a leak. How can we help right now?`,
        time: '14:22',
      },
    ]);
    setInteractionPath('IDLE');
  }, [callerName]);

  // Stage transition timings: total ringing + missed + forward = < 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'RINGING') {
      timer = setTimeout(() => {
        setStage('MISSED');
      }, 1000);
    } else if (stage === 'MISSED') {
      timer = setTimeout(() => {
        setStage('FORWARDING');
      }, 700);
    } else if (stage === 'FORWARDING') {
      timer = setTimeout(() => {
        setStage('WHATSAPP_CHAT');
        initializeWhatsAppChat();
      }, 900);
    }
    return () => clearTimeout(timer);
  }, [stage, initializeWhatsAppChat]);

  const startSimulation = () => {
    setContractorAlert(false);
    setInteractionPath('IDLE');
    setSelectedSlot(null);
    setConfirmedAddress(selectedPreset.address);
    setTimerSeconds(1);
    setStage('RINGING');
  };

  const resetSimulation = () => {
    setStage('READY');
    setContractorAlert(false);
    setIsTyping(false);
    setTimerSeconds(3);
    setInteractionPath('IDLE');
    setSelectedSlot(null);
    setChatMessages([]);
  };

  // Helper to append message
  const pushMessage = (msg: ChatMsg) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  // Path 1: 🚨 Emergency Repair
  const handleSelectEmergency = () => {
    setInteractionPath('EMERGENCY');
    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: selectedPreset.initialReply,
      time: '14:23',
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: '🚨 Priority 1 Emergency logged! Dave is ~12 mins away in Clapham. Please confirm your address or postcode so he can route immediately:',
        time: '14:23',
      });
    }, 600);
  };

  // Path 2: 📅 Book Service
  const handleSelectBooking = () => {
    setInteractionPath('BOOKING');
    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: '📅 Book Scheduled Service',
      time: '14:23',
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'We have arrival windows available today and tomorrow. Which slot works best for you?',
        time: '14:23',
      });
    }, 600);
  };

  // Path 2b: Choose slot
  const handleChooseSlot = (slotText: string) => {
    setSelectedSlot(slotText);
    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: slotText,
      time: '14:23',
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `Slot reserved (${slotText}). Please confirm your street address or postcode to lock in this appointment:`,
        time: '14:24',
      });
    }, 600);
  };

  // Path 3: 💬 Send Details / Photo
  const handleSelectDetails = () => {
    setInteractionPath('DETAILS');
    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: '💬 Send Details / Photo',
      time: '14:23',
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Please send a quick photo of what needs fixing or describe the issue below:',
        time: '14:23',
      });
    }, 600);
  };

  // Path 3b: Send quick photo sample
  const handleSendSamplePhoto = () => {
    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: '📸 Attached photo of leaking pipe under kitchen sink.',
      time: '14:24',
      isPhoto: true,
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Photo received! Dave reviewed the image — that is an isolated compression joint failure. Please confirm your address so he can bring the correct fittings:',
        time: '14:24',
      });
    }, 700);
  };

  // Confirmation step: User confirms address / location
  const handleConfirmBookingWithAddress = (addressStr: string) => {
    const finalAddress = addressStr.trim() || selectedPreset.address;
    setConfirmedAddress(finalAddress);

    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: `📍 ${finalAddress}`,
      time: '14:24',
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setInteractionPath('CONFIRMED');
      setContractorAlert(true);

      const confirmMsg = interactionPath === 'BOOKING' && selectedSlot
        ? `✅ Booking Confirmed for ${selectedSlot}! Dave has added this to his schedule at ${finalAddress}. He will ring 10 mins prior.`
        : `✅ Emergency Dispatched! Dave has accepted this job at ${finalAddress}. He will ring you in 60 seconds as he heads over.`;

      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: confirmMsg,
        time: '14:25',
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0071E3', '#059669', '#10B981'],
        });
      } catch {
        // Fallback gracefully
      }

      // Add to global Zustand leads store
      const normPhone = normalizeE164(phoneNumber);
      const leadId = `sim-lead-${Date.now()}`;
      addLead({
        id: leadId,
        businessId: 'biz-apex-01',
        callerPhone: normPhone,
        callerName: callerName || 'Landing Page Tester',
        status: 'BOOKED',
        urgency: selectedPreset.urgency,
        issueSummary: selectedPreset.issue,
        addressPostcode: finalAddress,
        estimatedRevenue: selectedPreset.jobValue,
        missedAt: 'Just now',
        recoveredAt: 'Just now',
        notes: `Simulated live lead from landing page test. Slot: ${selectedSlot || 'Immediate'}`,
        messages: [
          {
            id: `msg-sim-sys-${Date.now()}`,
            leadId,
            sender: 'SYSTEM',
            content: `Unanswered call from ${normPhone} forwarded via *61*.`,
            timestamp: '14:22:04',
          },
          ...chatMessages.map((m, idx) => ({
            id: `msg-sim-${idx}-${Date.now()}`,
            leadId,
            sender: m.sender,
            content: m.text,
            timestamp: m.time,
          })),
        ],
      }, false);
    }, 800);
  };

  // Handle freeform input bar
  const handleSendMessage = () => {
    const text = customInput.trim();
    if (!text) return;
    setCustomInput('');

    // If at confirmation address stage or booking stage with slot chosen
    if (interactionPath === 'EMERGENCY' || (interactionPath === 'BOOKING' && selectedSlot) || interactionPath === 'DETAILS') {
      handleConfirmBookingWithAddress(text);
      return;
    }

    // Otherwise, treat as customer message
    pushMessage({
      id: `call-${Date.now()}`,
      sender: 'CALLER',
      text: text,
      time: '14:23',
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushMessage({
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `Got your message: "${text}". Dave has been alerted on his phone. Please share your street address or postcode so he can confirm availability:`,
        time: '14:24',
      });
      setInteractionPath('EMERGENCY');
    }, 700);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto">
      {/* Smartphone Outer Chassis */}
      <div className="relative w-full aspect-[9/18.5] max-h-[720px] bg-slate-900 rounded-[50px] p-3 shadow-2xl ring-1 ring-slate-900/20 shadow-slate-900/40 select-none">
        {/* Subtle Outer Metal Bezel Gradient */}
        <div className="absolute inset-0 rounded-[50px] ring-2 ring-white/10 pointer-events-none" />

        {/* Side Hardware Buttons */}
        <div className="absolute -left-1 top-24 w-1 h-10 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-1 top-38 w-1 h-14 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-1 top-56 w-1 h-14 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-1 top-32 w-1 h-16 bg-slate-700 rounded-r-md" />

        {/* Inner Screen Canvas */}
        <div className="relative w-full h-full bg-[#FAFAFC] rounded-[40px] overflow-hidden flex flex-col font-sans">
          
          {/* iOS Top Status Bar & Dynamic Island */}
          <div className="relative z-30 pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 bg-white/70 backdrop-blur-md border-b border-slate-100">
            <span>09:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-6 bg-black rounded-full flex items-center justify-center space-x-1.5 px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 ring-1 ring-slate-800" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center space-x-1.5 text-slate-800">
              <span className="text-[10px] font-mono tracking-tighter">5G</span>
              <div className="w-5 h-2.5 border border-slate-700 rounded-[3px] p-[1px] flex items-center">
                <div className="h-full w-4 bg-slate-800 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* SIMULATOR SCREEN CONTENT */}
          <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">

            {/* STAGE: READY / SETUP */}
            {stage === 'READY' && (
              <div className="flex-1 flex flex-col justify-between p-5 text-slate-800">
                <div className="space-y-4 pt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-blue-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive Simulator
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      Simulate a Missed Emergency Call
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose an emergency scenario or type any number to test sub-3s recovery.
                    </p>
                  </div>

                  {/* Scenario Presets */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Emergency Scenario
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {PRESETS.map((p) => {
                        const isSelected = selectedPreset.name === p.name;
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => {
                              setSelectedPreset(p);
                              setPhoneNumber(p.phone);
                              setCallerName(p.name);
                              setConfirmedAddress(p.address);
                            }}
                            className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                              isSelected
                                ? 'bg-blue-50/80 border-[#0071E3] ring-1 ring-[#0071E3]/30 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{p.name}</span>
                              <span className="text-[11px] font-mono font-bold text-emerald-600">
                                £{p.jobValue}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                              {p.issue}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone & Name input */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Caller Phone
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0071E3]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Caller Name
                      </label>
                      <input
                        type="text"
                        value={callerName}
                        onChange={(e) => setCallerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0071E3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Trigger Button */}
                <div className="pt-4 pb-2">
                  <button
                    type="button"
                    onClick={startSimulation}
                    className="w-full py-3.5 px-4 bg-[#0071E3] hover:bg-blue-600 active:scale-[0.98] transition-all text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
                  >
                    <PhoneMissed className="w-4 h-4 text-white" />
                    Simulate Missed Call Drop
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Tests carrier conditional forwarding (*61*) to WhatsApp Cloud API
                  </p>
                </div>
              </div>
            )}

            {/* STAGE: RINGING (< 1.0s) */}
            {stage === 'RINGING' && (
              <div className="flex-1 flex flex-col justify-between items-center p-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white animate-fade-in">
                <div className="pt-8 text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-700/60 ring-2 ring-white/20 flex items-center justify-center shadow-lg">
                    <PhoneIncoming className="w-9 h-9 text-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold tracking-tight text-white">{callerName || 'Emergency Caller'}</h4>
                  <p className="text-xs text-slate-300 font-mono">{phoneNumber}</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium mt-2">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Contractor on ladder • Ringing...
                  </div>
                </div>

                <div className="w-full space-y-4 pb-6 text-center">
                  <p className="text-xs text-slate-400">
                    Dave Morrison is hands-on under a sink.
                  </p>
                  <div className="flex items-center justify-around px-4">
                    <button
                      type="button"
                      onClick={() => setStage('MISSED')}
                      className="flex flex-col items-center gap-1 text-slate-300 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                        <PhoneOff className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-medium">Decline</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage('MISSED')}
                      className="flex flex-col items-center gap-1 text-slate-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                        <PhoneIncoming className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-medium">Ring Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE: MISSED (< 0.7s) */}
            {stage === 'MISSED' && (
              <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-900 text-white animate-fade-in text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 ring-1 ring-red-500/40 flex items-center justify-center text-red-400">
                  <PhoneMissed className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Call Dropped / Unanswered</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{callerName} ({phoneNumber})</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 max-w-xs text-xs text-slate-300 text-left">
                  <span className="font-semibold text-red-400 block mb-0.5">⚠️ The Revenue Leak Moment:</span>
                  Normally, 82% of emergency callers hang up and call the next listing on Google right now.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStage('WHATSAPP_CHAT');
                    initializeWhatsAppChat();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-all inline-flex items-center gap-1"
                >
                  Forwarding to WhatsApp...
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* STAGE: FORWARDING (< 0.9s, Sub-3s transition guaranteed) */}
            {stage === 'FORWARDING' && (
              <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50 text-slate-800 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse-glow">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    *61* Conditional Forwarding Active
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Unanswered call detected. Twilio webhook initiating WhatsApp recovery API...
                  </p>
                </div>

                <div className="w-full max-w-xs bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#059669] h-2 rounded-full transition-all duration-500 w-3/4 animate-pulse" />
                </div>

                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  Connecting WhatsApp in {timerSeconds}s
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStage('WHATSAPP_CHAT');
                    initializeWhatsAppChat();
                  }}
                  className="text-xs text-[#0071E3] font-medium hover:underline pt-2"
                >
                  Skip waiting →
                </button>
              </div>
            )}

            {/* STAGE: WHATSAPP CHAT */}
            {stage === 'WHATSAPP_CHAT' && (
              <div className="flex-1 flex flex-col bg-[#EFEAE2] relative">
                
                {/* CONTRACTOR LIVE NOTIFICATION BANNER (Triggered on Booking) */}
                {contractorAlert && (
                  <div className="absolute top-2 left-3 right-3 z-30 p-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/40 animate-bounce duration-1000 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                        <span>⚡ DAVE MORRISON&apos;S PHONE</span>
                        <span>Just now</span>
                      </div>
                      <p className="text-[11px] text-slate-200 font-medium truncate">
                        🚨 NEW EMERGENCY LEAD: {callerName} ({phoneNumber})
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {confirmedAddress} • Est. £{selectedPreset.jobValue}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <a
                          href={formatPhoneForDialer(phoneNumber)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg inline-flex items-center gap-1"
                        >
                          📞 Tap to Call
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp Chat Header */}
                <div className="px-3 py-2 bg-[#008069] text-white flex items-center justify-between shadow-xs z-10">
                  <div className="flex items-center space-x-2">
                    <button 
                      type="button"
                      onClick={() => setStage('READY')}
                      className="text-white hover:opacity-80 p-0.5"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs">
                      AP
                    </div>
                    <div>
                      <div className="flex items-center gap-1 leading-tight">
                        <span className="font-semibold text-xs tracking-tight">Apex 24/7 Plumbing</span>
                        <CheckCircle2 className="w-3 h-3 text-white fill-emerald-400" />
                      </div>
                      <span className="text-[10px] text-emerald-100 opacity-90 block">
                        online • Response time &lt;3s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="p-1 rounded-full bg-white/10 text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Encryption Pill */}
                <div className="px-4 py-1.5 flex justify-center">
                  <span className="bg-[#FFEECD] text-[#54656F] text-[10px] px-2.5 py-1 rounded-lg text-center shadow-2xs max-w-xs font-medium">
                    🔒 Messages are end-to-end encrypted. Lead recovered in 2.8s.
                  </span>
                </div>

                {/* Message Bubble Feed */}
                <div className="flex-1 px-3 py-2 space-y-2.5 overflow-y-auto">
                  
                  {/* System Event Pill */}
                  <div className="flex justify-center">
                    <span className="bg-slate-200/80 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      Missed call caught • 14:22:04
                    </span>
                  </div>

                  {/* Render Message List */}
                  {chatMessages.map((msg) => {
                    const isCaller = msg.sender === 'CALLER';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCaller ? 'items-end' : 'items-start'} max-w-[85%] ${isCaller ? 'ml-auto' : ''}`}
                      >
                        <div
                          className={`rounded-2xl p-2.5 text-xs shadow-2xs leading-relaxed ${
                            isCaller
                              ? 'bg-[#D9FDD3] rounded-tr-xs text-slate-900'
                              : 'bg-white rounded-tl-xs text-slate-800 border border-slate-200/50'
                          }`}
                        >
                          {msg.isPhoto && (
                            <div className="mb-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                              <ImageIcon className="w-4 h-4 text-emerald-600" />
                              <span>[Photo of kitchen pipe joint uploaded]</span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                          <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-slate-400">
                            <span>{msg.time}</span>
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center space-x-1 p-2 bg-white rounded-xl max-w-[70px] shadow-2xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}

                  {/* INTERACTIVE CONTROLS BY PATH */}

                  {/* 1. Initial Quick-Reply Options */}
                  {interactionPath === 'IDLE' && !isTyping && (
                    <div className="space-y-1.5 pt-1 max-w-[95%]">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider pl-1">
                        Tap an instant response:
                      </p>
                      <button
                        type="button"
                        onClick={handleSelectEmergency}
                        className="w-full text-left p-2.5 bg-white hover:bg-red-50 active:bg-red-100 border border-red-300 rounded-xl text-xs font-semibold text-red-800 shadow-xs flex items-center justify-between transition-all group"
                      >
                        <span className="truncate">{selectedPreset.initialReply}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-red-600 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={handleSelectBooking}
                        className="w-full text-left p-2.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          📅 Book Scheduled Service
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={handleSelectDetails}
                        className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span>💬 Send Details / Photo</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  )}

                  {/* 2. Emergency Address Selection */}
                  {interactionPath === 'EMERGENCY' && !isTyping && (
                    <div className="pt-1 space-y-1.5 max-w-[95%]">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider pl-1">
                        Confirm your location:
                      </p>
                      <button
                        type="button"
                        onClick={() => handleConfirmBookingWithAddress(selectedPreset.address)}
                        className="w-full text-left p-2.5 bg-white hover:bg-blue-50 border border-blue-300 rounded-xl text-xs font-semibold text-blue-900 shadow-xs flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{selectedPreset.address}</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono shrink-0">
                          Confirm
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmBookingWithAddress('Battersea High Street, SW11 3HX')}
                        className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">Battersea High Street, SW11 3HX</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono shrink-0">
                          Send
                        </span>
                      </button>
                    </div>
                  )}

                  {/* 3. Booking Slot Selection */}
                  {interactionPath === 'BOOKING' && !selectedSlot && !isTyping && (
                    <div className="pt-1 space-y-1.5 max-w-[95%]">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider pl-1">
                        Select arrival window:
                      </p>
                      <button
                        type="button"
                        onClick={() => handleChooseSlot('🕒 Today: 16:30 – 18:00')}
                        className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span>🕒 Today: 16:30 – 18:00</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Available
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChooseSlot('🕒 Tomorrow: 08:30 – 10:00')}
                        className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span>🕒 Tomorrow: 08:30 – 10:00</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChooseSlot('🕒 Tomorrow: 14:00 – 15:30')}
                        className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span>🕒 Tomorrow: 14:00 – 15:30</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  )}

                  {/* 3b. Booking Slot Selected -> Address needed */}
                  {interactionPath === 'BOOKING' && selectedSlot && !isTyping && (
                    <div className="pt-1 space-y-1.5 max-w-[95%]">
                      <button
                        type="button"
                        onClick={() => handleConfirmBookingWithAddress(selectedPreset.address)}
                        className="w-full text-left p-2.5 bg-white hover:bg-blue-50 border border-blue-300 rounded-xl text-xs font-semibold text-blue-900 shadow-xs flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{selectedPreset.address}</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono shrink-0">
                          Confirm Booking
                        </span>
                      </button>
                    </div>
                  )}

                  {/* 4. Details / Photo Selection */}
                  {interactionPath === 'DETAILS' && !isTyping && (
                    <div className="pt-1 space-y-1.5 max-w-[95%]">
                      <button
                        type="button"
                        onClick={handleSendSamplePhoto}
                        className="w-full text-left p-2.5 bg-white hover:bg-blue-50 border border-blue-300 rounded-xl text-xs font-semibold text-blue-900 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          📸 Send Sample Photo of Pipe Leak
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmBookingWithAddress('Water dripping through ceiling spotlight, SW8 2JU')}
                        className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs flex items-center justify-between transition-all"
                      >
                        <span>📝 &quot;Water dripping through ceiling spotlight, SW8 2JU&quot;</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* WhatsApp Chat Input Bar */}
                <div className="p-2 bg-white/90 border-t border-slate-200 flex items-center space-x-2">
                  <input
                    type="text"
                    disabled={interactionPath === 'CONFIRMED'}
                    placeholder={
                      interactionPath === 'CONFIRMED'
                        ? 'Job confirmed & dispatched!'
                        : interactionPath === 'EMERGENCY' || selectedSlot
                        ? 'Type address or postcode...'
                        : 'Type a message or address...'
                    }
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-slate-100 text-xs px-3 py-2 rounded-full border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={interactionPath === 'CONFIRMED' || !customInput.trim()}
                    onClick={handleSendMessage}
                    className="w-8 h-8 rounded-full bg-[#008069] text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#006e5a] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* iOS Bottom Home Bar */}
          <div className="py-2 flex justify-center bg-white/80 backdrop-blur-xs border-t border-slate-100">
            <div className="w-28 h-1 bg-slate-400/80 rounded-full" />
          </div>
        </div>
      </div>

      {/* Simulator Bottom Controls */}
      <div className="w-full mt-4 flex items-center justify-between text-xs px-2">
        <button
          type="button"
          onClick={resetSimulation}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Simulator
        </button>

        <a
          href="/app"
          className="inline-flex items-center gap-1 text-[#0071E3] hover:text-blue-700 font-semibold py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-all"
        >
          View Contractor App
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
