import { NextRequest, NextResponse } from 'next/server';
import { extractLeadIntent } from '@/lib/ai-extractor';
import { normalizeE164 } from '@/lib/phone-utils';
import fs from 'fs';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'leadrevive_verify_token_2026';

function logDebug(msg: string) {
  try {
    fs.appendFileSync('/tmp/leadrevive_webhook.log', `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

async function sendWhatsAppTextMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  logDebug(`sendWhatsAppTextMessage to: ${to}, token present: ${!!token}, phoneId: ${phoneId}`);
  if (!token || !phoneId) return;

  try {
    const cleanTo = to.replace(/[^0-9]/g, '');
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo,
        type: 'text',
        text: { body: text },
      }),
    });
    const resText = await res.text();
    logDebug(`sendWhatsAppTextMessage response status ${res.status}: ${resText}`);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    logDebug(`Failed to send WhatsApp message: ${errMsg}`);
  }
}

/**
 * Meta WhatsApp Cloud API Webhook Verification (GET)
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge !== null) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * Meta WhatsApp Cloud API Incoming Message Handler (POST)
 */
export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
      logDebug(`Incoming Webhook POST body: ${JSON.stringify(body)}`);
    } catch {
      logDebug('Incoming Webhook POST with invalid JSON body');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Check if valid WhatsApp notification
    const entry = (body?.entry as Array<{ changes?: Array<{ value?: { messages?: Array<Record<string, unknown>> } }> }>)?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Handles delivery receipts / read receipts with 200 OK
      return NextResponse.json({ status: 'ignored_non_message_event' }, { status: 200 });
    }

    const rawFrom = String(message.from || '+447700900142');
    const from = normalizeE164(rawFrom);
    const messageType = String(message.type || 'text');

    // 1. Handle Interactive Quick-Reply Button Click
    if (messageType === 'interactive' && message.interactive) {
      const interactive = message.interactive as { button_reply?: { id?: string; title?: string } };
      const buttonReply = interactive.button_reply;
      const buttonId = buttonReply?.id || '';
      const buttonTitle = buttonReply?.title || '';

      let actionType = 'standard_quote';
      let replyText = '';

      if (buttonId.includes('emergency') || buttonId.includes('leak') || buttonId.includes('urgent')) {
        actionType = 'dispatch_emergency';
        replyText = '🚨 Priority 1 Emergency logged! Dave is 10-15 mins away. What is your street address or postcode?';
      } else if (buttonId.includes('boiler') || buttonId.includes('book') || buttonId.includes('slot')) {
        actionType = 'schedule_service';
        replyText = '📅 Scheduled service logged. We have arrival windows at 16:30 today or 08:30 tomorrow. What is your postcode?';
      } else {
        actionType = 'details_requested';
        replyText = 'Thanks! Please reply with a short description or photo of what needs fixing.';
      }

      await sendWhatsAppTextMessage(from, replyText);

      return NextResponse.json({
        success: true,
        handled: 'interactive_button',
        from,
        buttonId,
        buttonTitle,
        actionType,
        dispatchReply: replyText,
        contractorAlert: {
          to: '+44 7911 882910',
          message: `🚨 Button tapped by ${from}: ${buttonTitle}. Tap to call: tel:${from}`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Handle Text Messages with Intent Extractor
    if (messageType === 'text') {
      const textObj = message.text as { body?: string } | undefined;
      const textContent = textObj?.body || '';
      const extracted = await extractLeadIntent(textContent);

      const replyText = extracted.urgency === 'EMERGENCY'
        ? `🚨 Understood — Priority 1 dispatched! Dave is on-site nearby. We have your details (${extracted.location || 'London'}). Expect a call in 60s.`
        : `Thank you! Dave has received your request: "${extracted.issueSummary}". He will contact you shortly.`;

      await sendWhatsAppTextMessage(from, replyText);

      return NextResponse.json({
        success: true,
        handled: 'text_intent_extracted',
        from,
        text: textContent,
        extractedIntent: extracted,
        dispatchReply: replyText,
        contractorAlert: {
          to: '+44 7911 882910',
          summary: `${extracted.urgency} from ${from}: ${extracted.issueSummary}`,
          location: extracted.location,
          callLink: `tel:${from}`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Handle Customer Uploaded Photo / Image
    if (messageType === 'image') {
      const imageObj = message.image as { caption?: string; id?: string } | undefined;
      const caption = imageObj?.caption || 'Customer sent a photo of damage/equipment';
      const extracted = await extractLeadIntent(caption);

      const dispatchReply = 'Photo received! Dave has been alerted and is reviewing the image now. Expect a call in 60 seconds.';
      await sendWhatsAppTextMessage(from, dispatchReply);

      return NextResponse.json({
        success: true,
        handled: 'image_received',
        from,
        caption,
        urgency: extracted.urgency,
        contractorAlert: {
          to: '+44 7911 882910',
          message: `📸 PHOTO RECEIVED (${extracted.urgency}) from ${from}: "${caption}". Tap to call: tel:${from}`,
        },
        dispatchReply,
        timestamp: new Date().toISOString(),
      });
    }

    // 4. Handle Customer Shared Location Pin
    if (messageType === 'location') {
      const locObj = message.location as { latitude?: number; longitude?: number; name?: string; address?: string } | undefined;
      const locStr = locObj?.address || locObj?.name || `${locObj?.latitude}, ${locObj?.longitude}`;
      const dispatchReply = `Location received (${locStr})! Dave is calculating his route now.`;
      await sendWhatsAppTextMessage(from, dispatchReply);

      return NextResponse.json({
        success: true,
        handled: 'location_received',
        from,
        location: locStr,
        contractorAlert: {
          to: '+44 7911 882910',
          message: `📍 LOCATION PIN from ${from}: ${locStr}. Tap to route and call: tel:${from}`,
        },
        dispatchReply,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, status: 'unhandled_message_type' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
