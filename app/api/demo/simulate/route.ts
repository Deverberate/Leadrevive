import { NextRequest, NextResponse } from 'next/server';
import { extractLeadIntent } from '@/lib/ai-extractor';
import { normalizeE164, formatPhoneForDialer } from '@/lib/phone-utils';

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Empty or invalid body falls back to defaults
    }

    const rawPhone = String(body.phone || '+44 7700 900142');
    const phone = normalizeE164(rawPhone);
    const callerName = String(body.callerName || 'Sarah Jenkins');
    const tradeType = String(body.tradeType || 'plumbing');
    const issueText = String(body.issueText || 'Burst copper pipe under kitchen sink flooding floor');
    const postcode = String(body.postcode || 'SW11 3RL, Battersea');

    const extracted = await extractLeadIntent(issueText, tradeType);
    const locationFinal = extracted.location || postcode;
    const nowId = Date.now();

    const simulatedLead = {
      id: `sim-lead-${nowId}`,
      businessId: 'biz-apex-01',
      callerPhone: phone,
      callerName: callerName,
      status: 'BOOKED',
      urgency: extracted.urgency,
      issueSummary: extracted.issueSummary,
      addressPostcode: locationFinal,
      estimatedRevenue: extracted.estimatedRevenue,
      missedAt: 'Just now',
      recoveredAt: 'Just now',
      notes: `Simulated via /api/demo/simulate. Extracted intent: ${extracted.urgency}`,
      messages: [
        {
          id: `sim-msg-1-${nowId}`,
          leadId: `sim-lead-${nowId}`,
          sender: 'SYSTEM',
          content: `Unanswered call from ${phone} detected via carrier conditional forwarding (*61*).`,
          timestamp: '14:22:04',
        },
        {
          id: `sim-msg-2-${nowId}`,
          leadId: `sim-lead-${nowId}`,
          sender: 'BOT',
          content: `Hi ${callerName}! Dave at Apex 24/7 Emergency Plumbing here. Sorry I missed your call — I'm on a job. How can we help right now?`,
          timestamp: '14:22:07',
          buttons: [
            { id: 'btn-emergency', label: '🚨 Emergency Repair' },
            { id: 'btn-booking', label: '📅 Book Service' },
            { id: 'btn-details', label: '💬 Send Details / Photo' },
          ],
          selectedButtonId: 'btn-emergency',
        },
        {
          id: `sim-msg-3-${nowId}`,
          leadId: `sim-lead-${nowId}`,
          sender: 'CALLER',
          content: issueText,
          timestamp: '14:22:25',
        },
        {
          id: `sim-msg-4-${nowId}`,
          leadId: `sim-lead-${nowId}`,
          sender: 'BOT',
          content: `Understood. Dave has been notified. He is 12 mins away. Please confirm your address.`,
          timestamp: '14:22:28',
        },
        {
          id: `sim-msg-5-${nowId}`,
          leadId: `sim-lead-${nowId}`,
          sender: 'CALLER',
          content: locationFinal,
          timestamp: '14:22:45',
        },
        {
          id: `sim-msg-6-${nowId}`,
          leadId: `sim-lead-${nowId}`,
          sender: 'BOT',
          content: `Job confirmed! Dave is en route to ${locationFinal} and will call you in 60 seconds.`,
          timestamp: '14:22:50',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      lead: simulatedLead,
      contractorAlertPayload: {
        to: '+44 7911 882910',
        message: `🚨 NEW EMERGENCY LEAD: ${callerName} (${phone}) - ${extracted.issueSummary}. Address: ${locationFinal}. Tap to call: ${formatPhoneForDialer(phone)}`,
      },
      message: 'Simulation triggered successfully. Lead captured in <3.2s.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to simulate lead';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
