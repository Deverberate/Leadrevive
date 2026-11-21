import type { UrgencyLevel, TradeType } from './types.ts';

export interface ExtractedIntent {
  urgency: UrgencyLevel;
  issueSummary: string;
  location: string | null;
  requestedTime: string | null;
  estimatedRevenue: number;
}

/**
 * Intelligent Intent & Detail Extractor
 * Uses Google Gemini Flash with a strict 3-second timeout and robust heuristic fallback.
 */
export async function extractLeadIntent(
  messageText: string,
  tradeType: string = 'plumbing'
): Promise<ExtractedIntent> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && messageText.trim().length > 0) {
    try {
      const prompt = `You are a high-speed emergency dispatcher for an emergency trade business (${tradeType}).
Extract caller intent from this customer message: ${JSON.stringify(messageText)}.
Return ONLY valid JSON in this exact structure:
{
  "urgency": "EMERGENCY" | "HIGH" | "STANDARD",
  "issueSummary": "Concise 1-sentence summary",
  "location": "Postcode, city, or address if mentioned or null",
  "requestedTime": "Immediate / afternoon / specific time or null",
  "estimatedRevenue": number
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            urgency: parsed.urgency === 'EMERGENCY' || parsed.urgency === 'HIGH' ? parsed.urgency : 'STANDARD',
            issueSummary: parsed.issueSummary || messageText.slice(0, 100),
            location: parsed.location || null,
            requestedTime: parsed.requestedTime || null,
            estimatedRevenue: Number(parsed.estimatedRevenue) || getDefaultRevenue(tradeType, parsed.urgency),
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Flash call failed or timed out, using local extractor:', err);
    }
  }

  // Heuristic Triage Fallback
  return extractHeuristicIntent(messageText, tradeType);
}

/**
 * Local deterministic triage heuristic
 */
export function extractHeuristicIntent(messageText: string, tradeType: string = 'plumbing'): ExtractedIntent {
  const lower = messageText.toLowerCase();

  // Emergency triggers across trades
  const emergencyKeywords = [
    'flood', 'burst', 'overflow', 'gushing', 'water pouring', 'ceiling leak', 'stopcock',
    'spark', 'sparking', 'burning smell', 'fire', 'smoke', 'blackout', 'loss of power', 'shocks',
    'locked out', 'lockout', 'keys inside', 'keys locked', 'door jammed', 'broken key',
    'smell gas', 'gas leak', 'carbon monoxide',
    'urgent', 'emergency', 'asap', 'immediate', 'danger'
  ];

  // High priority triggers
  const highKeywords = [
    'boiler', 'no heat', 'no heating', 'cold water', 'f22', 'pressure drop', 'pilot light',
    'tripped', 'fuse box', 'breaker', 'no hot water', 'radiator leaking',
    'lock replacement', 'cylinder seized', 'ac outage'
  ];

  const isEmergency = emergencyKeywords.some((kw) => lower.includes(kw));
  const isHigh = highKeywords.some((kw) => lower.includes(kw));
  const urgency: UrgencyLevel = isEmergency ? 'EMERGENCY' : isHigh ? 'HIGH' : 'STANDARD';

  // Extract UK postcode regex (e.g. SW11 3RL, EC1A 1BB, W1A 0AX)
  const ukPostcodeMatch = messageText.match(/\b([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})\b/i);
  // Extract US 5-digit zip code if no UK postcode found
  const usZipMatch = messageText.match(/\b\d{5}(?:-\d{4})?\b/);

  let location: string | null = null;
  if (ukPostcodeMatch) {
    location = ukPostcodeMatch[1].toUpperCase();
  } else if (usZipMatch) {
    location = `ZIP ${usZipMatch[0]}`;
  }

  const estimatedRevenue = getDefaultRevenue(tradeType, urgency);

  return {
    urgency,
    issueSummary: messageText.length > 120 ? messageText.slice(0, 117) + '...' : messageText || 'Emergency service call request',
    location,
    requestedTime: isEmergency ? 'Immediate' : isHigh ? 'Today' : 'Standard scheduled',
    estimatedRevenue,
  };
}

function getDefaultRevenue(tradeType: string, urgency: UrgencyLevel): number {
  const baseMap: Record<string, { EMERGENCY: number; HIGH: number; STANDARD: number }> = {
    plumbing: { EMERGENCY: 580, HIGH: 380, STANDARD: 220 },
    electrician: { EMERGENCY: 520, HIGH: 350, STANDARD: 190 },
    locksmith: { EMERGENCY: 390, HIGH: 280, STANDARD: 160 },
    hvac: { EMERGENCY: 680, HIGH: 450, STANDARD: 260 },
    roofing: { EMERGENCY: 750, HIGH: 500, STANDARD: 320 },
    auto_detailing: { EMERGENCY: 300, HIGH: 220, STANDARD: 150 },
  };

  const tradeKey = tradeType.toLowerCase() as TradeType;
  const rates = baseMap[tradeKey] || baseMap.plumbing;
  return rates[urgency as keyof typeof rates] || rates.STANDARD;
}
