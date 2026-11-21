'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Do I have to change my phone number or get a new SIM?',
    answer:
      'Never. You keep your current number and mobile carrier. LeadRevive uses standard carrier conditional call forwarding (*61*). When you answer your phone, nothing changes. Only unanswered calls after 15–20 seconds are automatically caught by LeadRevive.',
  },
  {
    question: 'How fast does the customer receive the WhatsApp message?',
    answer:
      'In under 3 seconds. The moment your phone stops ringing, our system fires an automated WhatsApp message with your business branding and emergency quick-reply buttons before the customer even has time to tap the next search result on Google.',
  },
  {
    question: 'What if a caller does not use WhatsApp or has a landline?',
    answer:
      'If our system detects a non-mobile number that cannot receive WhatsApp, it immediately pings your mobile with an urgent priority alert: "🚨 Landline emergency call from 020 7946... — Tap to call back directly." For mobile callers without WhatsApp, it automatically falls back to an instant SMS with a 1-tap booking link. You never lose a lead.',
  },
  {
    question: 'How do I receive the job alert while working?',
    answer:
      'You receive an instant notification directly to your personal WhatsApp with the customer’s name, phone number, issue details, and postcode, along with a 1-tap "Call Customer" link. All you have to do is tap to dial.',
  },
  {
    question: 'What is the 48-Hour Free Lead Test guarantee?',
    answer:
      'We set up LeadRevive on your phone for free for 48 hours. If we catch at least 2 emergency jobs you would have lost, you pay £179/month to keep it running. If not, you pay £0 and keep whatever revenue was recovered. No credit card required upfront.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Under 5 minutes. We give you a short 3-digit carrier forwarding code (e.g. *61*02079460192#) to dial once on your keypad, and you’re live immediately.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Got Questions? We’ve Got Answers.
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about setting up missed-call recovery for your trade business.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAFAFC] border border-slate-200/70 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 hover:text-slate-950 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0071E3]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
