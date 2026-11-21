import { spawn } from 'node:child_process';
import assert from 'node:assert';

const PORT = 3099;
const BASE_URL = `http://127.0.0.1:${PORT}`;

console.log(`Starting Next.js production server on port ${PORT}...`);
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  cwd: '/Users/jonahgeorgenishant/Documents/fvf/STARTUP/leadrevive',
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout.on('data', () => {});
server.stderr.on('data', () => {});

// Helper: poll until server is ready
async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) {
        console.log('✅ Next.js server is ready.');
        return;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error('Server failed to start within timeout');
}

async function runTests() {
  try {
    await waitForServer();

    // 1. Test Landing Page
    console.log('1. Testing GET / ...');
    const homeRes = await fetch(`${BASE_URL}/`);
    assert.strictEqual(homeRes.status, 200, 'Home page must return 200');
    const homeText = await homeRes.text();
    assert.ok(homeText.includes('LeadRevive'), 'Home page must contain brand name');
    assert.ok(homeText.includes('Simulate a Missed Emergency Call'), 'Must contain phone simulator');
    assert.ok(homeText.includes('Live Revenue Leak Calculator'), 'Must contain ROI calculator');
    assert.ok(homeText.includes('Catch 2 Jobs in 48 Hours, or Pay $0'), 'Must contain pricing');
    console.log('   ✅ Landing page returned 200 OK with all required sections');

    // 2. Test Contractor Dashboard App
    console.log('2. Testing GET /app ...');
    const appRes = await fetch(`${BASE_URL}/app`);
    assert.strictEqual(appRes.status, 200, 'Dashboard page must return 200');
    const appText = await appRes.text();
    assert.ok(appText.includes('Live Lead Recovery Feed'), 'Must contain lead feed');
    assert.ok(appText.includes('Recovered Revenue'), 'Must contain KPI cards');
    console.log('   ✅ Dashboard app returned 200 OK');

    // 3. Test /api/demo/simulate POST (valid payload)
    console.log('3. Testing POST /api/demo/simulate (valid payload) ...');
    const simRes = await fetch(`${BASE_URL}/api/demo/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+44 7700 900999',
        callerName: 'E2E Test User',
        tradeType: 'plumbing',
        issueText: 'Burst water main in kitchen SW11 1AA',
      }),
    });
    assert.strictEqual(simRes.status, 200);
    const simData = await simRes.json();
    assert.strictEqual(simData.success, true);
    assert.ok(simData.lead.id);
    assert.strictEqual(simData.lead.callerPhone, '+447700900999');
    assert.strictEqual(simData.lead.urgency, 'EMERGENCY');
    assert.ok(simData.contractorAlertPayload.to);
    console.log('   ✅ /api/demo/simulate passed with valid payload');

    // 4. Test /api/demo/simulate POST (empty payload fallback)
    console.log('4. Testing POST /api/demo/simulate (empty payload fallback) ...');
    const simEmptyRes = await fetch(`${BASE_URL}/api/demo/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(simEmptyRes.status, 200);
    const simEmptyData = await simEmptyRes.json();
    assert.strictEqual(simEmptyData.success, true);
    assert.ok(simEmptyData.lead.id);
    console.log('   ✅ /api/demo/simulate passed with empty payload');

    // 5. Test /api/webhooks/call-status POST (JSON missed call: no-answer)
    console.log('5. Testing POST /api/webhooks/call-status (JSON no-answer) ...');
    const callRes = await fetch(`${BASE_URL}/api/webhooks/call-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CallSid: 'CA1234567890',
        From: '+447700900142',
        CallStatus: 'no-answer',
      }),
    });
    assert.strictEqual(callRes.status, 200);
    const callData = await callRes.json();
    assert.strictEqual(callData.action, 'whatsapp_recovery_dispatched');
    assert.ok(callData.recoveryPayload);
    console.log('   ✅ /api/webhooks/call-status passed for JSON missed call');

    // 6. Test /api/webhooks/call-status POST (urlencoded form data: busy)
    console.log('6. Testing POST /api/webhooks/call-status (urlencoded busy) ...');
    const formData = new URLSearchParams();
    formData.append('CallSid', 'CA_FORM_123');
    formData.append('From', '07700900883');
    formData.append('CallStatus', 'busy');

    const formRes = await fetch(`${BASE_URL}/api/webhooks/call-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    assert.strictEqual(formRes.status, 200);
    const formDataRes = await formRes.json();
    assert.strictEqual(formDataRes.action, 'whatsapp_recovery_dispatched');
    assert.strictEqual(formDataRes.from, '+447700900883');
    console.log('   ✅ /api/webhooks/call-status passed for urlencoded formData');

    // 7. Test /api/webhooks/call-status POST (answered call: completed)
    console.log('7. Testing POST /api/webhooks/call-status (completed) ...');
    const answeredRes = await fetch(`${BASE_URL}/api/webhooks/call-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CallSid: 'CA1234567891',
        From: '+447700900142',
        CallStatus: 'completed',
      }),
    });
    assert.strictEqual(answeredRes.status, 200);
    const answeredData = await answeredRes.json();
    assert.strictEqual(answeredData.action, 'ignored_answered_call');
    console.log('   ✅ /api/webhooks/call-status passed for answered call');

    // 8. Test /api/webhooks/whatsapp GET (challenge verification)
    console.log('8. Testing GET /api/webhooks/whatsapp (valid verification) ...');
    const waVerifyRes = await fetch(
      `${BASE_URL}/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=leadrevive_verify_token_2026&hub.challenge=VERIFIED_CHALLENGE_789`
    );
    assert.strictEqual(waVerifyRes.status, 200);
    const challengeText = await waVerifyRes.text();
    assert.strictEqual(challengeText, 'VERIFIED_CHALLENGE_789');
    console.log('   ✅ Meta Webhook verification handshake passed');

    // 9. Test /api/webhooks/whatsapp GET (invalid verification token)
    console.log('9. Testing GET /api/webhooks/whatsapp (invalid token) ...');
    const waBadVerifyRes = await fetch(
      `${BASE_URL}/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=TEST`
    );
    assert.strictEqual(waBadVerifyRes.status, 403);
    console.log('   ✅ Meta Webhook invalid token returned 403 Forbidden');

    // 10. Test /api/webhooks/whatsapp POST (interactive button reply: emergency)
    console.log('10. Testing POST /api/webhooks/whatsapp (button emergency) ...');
    const waBtnRes = await fetch(`${BASE_URL}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '+447700900142',
                      type: 'interactive',
                      interactive: {
                        button_reply: {
                          id: 'btn_emergency',
                          title: '🚨 Emergency Leak',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    });
    assert.strictEqual(waBtnRes.status, 200);
    const waBtnData = await waBtnRes.json();
    assert.strictEqual(waBtnData.actionType, 'dispatch_emergency');
    console.log('   ✅ WhatsApp interactive emergency button reply passed');

    // 11. Test /api/webhooks/whatsapp POST (interactive button reply: booking)
    console.log('11. Testing POST /api/webhooks/whatsapp (button booking) ...');
    const waBookBtnRes = await fetch(`${BASE_URL}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '+447700900142',
                      type: 'interactive',
                      interactive: {
                        button_reply: {
                          id: 'btn_booking',
                          title: '📅 Book Service',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    });
    assert.strictEqual(waBookBtnRes.status, 200);
    const waBookBtnData = await waBookBtnRes.json();
    assert.strictEqual(waBookBtnData.actionType, 'schedule_service');
    console.log('   ✅ WhatsApp interactive booking button reply passed');

    // 12. Test /api/webhooks/whatsapp POST (free text message)
    console.log('12. Testing POST /api/webhooks/whatsapp (text message) ...');
    const waTextRes = await fetch(`${BASE_URL}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '+447700900142',
                      type: 'text',
                      text: {
                        body: 'Our combi boiler broke down and error code F22 is flashing SW4 8EG',
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    });
    assert.strictEqual(waTextRes.status, 200);
    const waTextData = await waTextRes.json();
    assert.strictEqual(waTextData.handled, 'text_intent_extracted');
    assert.strictEqual(waTextData.extractedIntent.urgency, 'HIGH');
    assert.strictEqual(waTextData.extractedIntent.location, 'SW4 8EG');
    console.log('   ✅ WhatsApp text intent extractor passed');

    // 13. Test /api/webhooks/whatsapp POST (customer photo/image message)
    console.log('13. Testing POST /api/webhooks/whatsapp (customer photo) ...');
    const waImgRes = await fetch(`${BASE_URL}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '+447700900142',
                      type: 'image',
                      image: {
                        id: 'img_upload_123',
                        caption: 'Burst pipe under sink flooding cupboard SW11 3RL',
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    });
    assert.strictEqual(waImgRes.status, 200);
    const waImgData = await waImgRes.json();
    assert.strictEqual(waImgData.handled, 'image_received');
    assert.strictEqual(waImgData.urgency, 'EMERGENCY');
    assert.ok(waImgData.contractorAlert.message.includes('PHOTO RECEIVED'));
    console.log('   ✅ WhatsApp image/photo message handler passed');

    // 14. Test /api/webhooks/whatsapp POST (location pin message)
    console.log('14. Testing POST /api/webhooks/whatsapp (location pin) ...');
    const waLocRes = await fetch(`${BASE_URL}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '+447700900142',
                      type: 'location',
                      location: {
                        latitude: 51.4643,
                        longitude: -0.1664,
                        name: 'Battersea High Street',
                        address: 'SW11 3HX, London',
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    });
    assert.strictEqual(waLocRes.status, 200);
    const waLocData = await waLocRes.json();
    assert.strictEqual(waLocData.handled, 'location_received');
    assert.ok(waLocData.location.includes('SW11 3HX'));
    console.log('   ✅ WhatsApp location pin handler passed');

    // 15. Test /api/webhooks/whatsapp POST (delivery receipt status event without message)
    console.log('15. Testing POST /api/webhooks/whatsapp (delivery receipt event) ...');
    const waReceiptRes = await fetch(`${BASE_URL}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  statuses: [{ id: 'msg_123', status: 'delivered' }],
                },
              },
            ],
          },
        ],
      }),
    });
    assert.strictEqual(waReceiptRes.status, 200);
    const waReceiptData = await waReceiptRes.json();
    assert.strictEqual(waReceiptData.status, 'ignored_non_message_event');
    console.log('   ✅ WhatsApp delivery receipt status ignored with 200 OK');

    console.log('\n🎉 ALL 15 END-TO-END HTTP TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    server.kill('SIGTERM');
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  server.kill('SIGTERM');
  process.exit(1);
});
