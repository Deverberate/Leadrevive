import { NextRequest, NextResponse } from 'next/server';
import { normalizeE164 } from '@/lib/phone-utils';

/**
 * Twilio Voice Status Callback Webhook Handler
 * Triggered when a phone call forwarded via *61* is unanswered or busy.
 */
export async function POST(req: NextRequest) {
  try {
    const payload: Record<string, string> = {};

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((val, key) => {
        payload[key] = val.toString();
      });
    } else {
      const parsed = await req.json().catch(() => ({}));
      Object.assign(payload, parsed);
    }

    const CallSid = payload.CallSid || `CA${Date.now()}`;
    const rawFrom = payload.From || '+447700900142';
    const From = normalizeE164(rawFrom);
    const To = payload.To || '+442079460192';
    const CallStatus = (payload.CallStatus || 'no-answer').toLowerCase();
    const Duration = payload.Duration || '0';

    const isMissed = ['no-answer', 'busy', 'canceled', 'failed'].includes(CallStatus);

    if (!isMissed) {
      return NextResponse.json({
        success: true,
        status: CallStatus,
        action: 'ignored_answered_call',
      });
    }

    // WhatsApp Cloud API interactive recovery message payload
    const recoveryWhatsAppPayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: From,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: {
          type: 'text',
          text: 'Apex 24/7 Emergency Services',
        },
        body: {
          text: 'Hi! Sorry we missed your call — our contractor is currently hands-on fixing an emergency. How can we help right now?',
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: { id: 'btn_emergency', title: '🚨 Emergency Repair' },
            },
            {
              type: 'reply',
              reply: { id: 'btn_booking', title: '📅 Book Service' },
            },
            {
              type: 'reply',
              reply: { id: 'btn_details', title: '💬 Send Details / Photo' },
            },
          ],
        },
      },
    };

    return NextResponse.json({
      success: true,
      callSid: CallSid,
      from: From,
      to: To,
      status: CallStatus,
      duration: Duration,
      action: 'whatsapp_recovery_dispatched',
      recoveryPayload: recoveryWhatsAppPayload,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
