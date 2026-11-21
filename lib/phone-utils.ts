/**
 * LeadRevive Phone Number & Messaging Deep-Link Utilities
 * Handles E.164 normalization, international dialer formatting, and WhatsApp URL generation.
 */

/**
 * Normalizes phone numbers to standard E.164 format.
 * Defaults to UK (+44) if domestic 07... is provided, or US (+1) if 10-digit without country code.
 */
export function normalizeE164(phone: string, defaultCountry: 'GB' | 'US' = 'GB'): string {
  if (!phone) return '+447700900142';

  // Remove whitespace, dashes, parentheses
  const cleaned = phone.trim().replace(/[\s\-()]/g, '');

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // International format without leading plus (e.g. 918921865317 or 447700900142)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('44') && (cleaned.length === 12 || cleaned.length === 11)) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `+${cleaned}`;
  }

  // UK domestic mobile starting with 07...
  if (cleaned.startsWith('07') && cleaned.length === 11) {
    return `+44${cleaned.slice(1)}`;
  }

  // UK domestic landline starting with 02... or 01...
  if ((cleaned.startsWith('02') || cleaned.startsWith('01')) && cleaned.length >= 10) {
    return `+44${cleaned.slice(1)}`;
  }

  // US domestic 10 digits
  if (/^\d{10}$/.test(cleaned)) {
    return `+1${cleaned}`;
  }

  // Any international number 11-15 digits without plus
  if (/^\d{11,15}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  // Default fallback
  if (/^\d+$/.test(cleaned)) {
    return defaultCountry === 'US' ? `+1${cleaned}` : `+44${cleaned}`;
  }

  return `+${cleaned.replace(/[^0-9]/g, '')}`;
}

/**
 * Formats a phone number for direct device calling (tel:+...)
 */
export function formatPhoneForDialer(phone: string): string {
  const normalized = normalizeE164(phone);
  return `tel:${normalized}`;
}

/**
 * Formats a phone number for WhatsApp deep-links (https://wa.me/<digits_without_plus>)
 */
export function formatPhoneForWhatsApp(phone: string, prefilledMessage?: string): string {
  const normalized = normalizeE164(phone);
  const digitsOnly = normalized.replace(/[^0-9]/g, '');
  const baseUrl = `https://wa.me/${digitsOnly}`;
  if (prefilledMessage) {
    return `${baseUrl}?text=${encodeURIComponent(prefilledMessage)}`;
  }
  return baseUrl;
}

/**
 * Formats a phone number for user-friendly display
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '+44 7700 900142';
  const norm = normalizeE164(phone);
  if (norm.startsWith('+44') && norm.length === 13) {
    // UK format: +44 7700 900142
    return `+44 ${norm.slice(3, 7)} ${norm.slice(7)}`;
  }
  if (norm.startsWith('+1') && norm.length === 12) {
    // US format: +1 (555) 123-4567
    return `+1 (${norm.slice(2, 5)}) ${norm.slice(5, 8)}-${norm.slice(8)}`;
  }
  return norm;
}
