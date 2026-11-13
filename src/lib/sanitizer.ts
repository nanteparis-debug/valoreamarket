/**
 * Contact Information Leak Detector & Sanitizer for GVCE Deal Rooms
 * Detects: Phone numbers, emails, domains/URLs, messaging handles (WhatsApp, Telegram, WeChat)
 */

export interface SanitizeResult {
  isClean: boolean;
  sanitizedText: string;
  violations: string[];
}

// Regex patterns for detecting contact leaks
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+(?:\s*\[at\]\s*|\s*@\s*)[a-zA-Z0-9.-]+\s*(?:\[dot\]|\.)\s*[a-zA-Z]{2,})/gi;
const PHONE_REGEX = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|me|biz|info|ae|sa|fr|de|ru|cn)[^\s]*)/gi;
const SOCIAL_HANDLE_REGEX = /(?:wa\.me|t\.me|telegram|whatsapp|wechat|skype|viber|signal|line)[\s:]*[@+]?[\w\d.-]+/gi;

export function sanitizeDealMessage(input: string): SanitizeResult {
  const violations: string[] = [];
  let sanitized = input;

  if (EMAIL_REGEX.test(input)) {
    violations.push("EMAIL_ADDRESS");
    sanitized = sanitized.replace(EMAIL_REGEX, "[REDACTED EMAIL]");
  }

  // Filter out phone numbers longer than 7 digits (avoiding matching simple quantities/dates)
  const phoneMatches = input.match(PHONE_REGEX);
  if (phoneMatches) {
    const validPhoneLeaks = phoneMatches.filter((p) => p.replace(/\D/g, "").length >= 8);
    if (validPhoneLeaks.length > 0) {
      violations.push("PHONE_NUMBER");
      validPhoneLeaks.forEach((p) => {
        sanitized = sanitized.replace(p, "[REDACTED PHONE]");
      });
    }
  }

  if (URL_REGEX.test(input)) {
    violations.push("EXTERNAL_URL");
    sanitized = sanitized.replace(URL_REGEX, "[REDACTED LINK]");
  }

  if (SOCIAL_HANDLE_REGEX.test(input)) {
    violations.push("DIRECT_MESSAGING_HANDLE");
    sanitized = sanitized.replace(SOCIAL_HANDLE_REGEX, "[REDACTED MESSENGER]");
  }

  return {
    isClean: violations.length === 0,
    sanitizedText: sanitized,
    violations,
  };
}
