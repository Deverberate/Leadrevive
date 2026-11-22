import { test, expect } from '@playwright/test';

test.describe('Webhook & Backend API Integration', () => {
  const VERIFY_TOKEN = 'leadrevive_verify_token_2026';

  test('Meta WhatsApp webhook verification GET handshake succeeds with challenge', async ({ request }) => {
    const challenge = 'random_challenge_str_' + Date.now();
    const res = await request.get('/api/webhooks/whatsapp', {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': VERIFY_TOKEN,
        'hub.challenge': challenge,
      },
    });

    expect(res.status()).toBe(200);
    const bodyText = await res.text();
    expect(bodyText).toBe(challenge);
  });

  test('Meta WhatsApp webhook verification GET fails on incorrect verify token', async ({ request }) => {
    const res = await request.get('/api/webhooks/whatsapp', {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong_token',
        'hub.challenge': '12345',
      },
    });

    expect(res.status()).toBe(403);
  });

  test('Meta WhatsApp incoming text message POST extracts urgency and triggers review prompt', async ({ request }) => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '1689180592782967',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '15550257321',
                  phone_number_id: '1419507854585843',
                },
                messages: [
                  {
                    from: '447700900142',
                    id: 'wamid.e2e_test_' + Date.now(),
                    timestamp: String(Math.floor(Date.now() / 1000)),
                    type: 'text',
                    text: {
                      body: 'Emergency boiler pressure dropped to 0 in SW11',
                    },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    const res = await request.post('/api/webhooks/whatsapp', {
      data: payload,
    });

    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.handled).toBe('text_intent_extracted');
    expect(['EMERGENCY', 'HIGH']).toContain(data.extractedIntent.urgency);
    expect(data.dispatchReply).toContain('Do you want to review or update your request?');
  });

  test('Meta WhatsApp interactive review button click triggers service options', async ({ request }) => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '1689180592782967',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '15550257321',
                  phone_number_id: '1419507854585843',
                },
                messages: [
                  {
                    from: '447700900142',
                    id: 'wamid.e2e_button_' + Date.now(),
                    timestamp: String(Math.floor(Date.now() / 1000)),
                    type: 'interactive',
                    interactive: {
                      button_reply: {
                        id: 'btn_review_options',
                        title: 'Review Request',
                      },
                    },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    const res = await request.post('/api/webhooks/whatsapp', {
      data: payload,
    });

    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.handled).toBe('interactive_button');
    expect(data.actionType).toBe('review_request');
  });
});
