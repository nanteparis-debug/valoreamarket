/**
 * Contact Information Leak Detector, XSS Sanitizer & Armor for GVCE Deal Rooms
 * Detects: Phone numbers, emails, domains/URLs, messaging handles (WhatsApp, Telegram, WeChat)
 * Neutralizes: HTML Injection, XSS payloads, script tags
 */

export interface SanitizeResult {
  isClean: boolean;
  sanitizedText: string;
  violations: string[];
}

// Regex patterns for detecting contact leaks and evasions
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+(?:\s*\[at\]\s*|\s*\(at\)\s*|\s*@\s*)[a-zA-Z0-9.-]+\s*(?:\[dot\]|\(dot\)|\.)\s*[a-zA-Z]{2,})/gi;
const PHONE_REGEX = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|me|biz|info|ae|sa|fr|de|ru|cn)[^\s]*)/gi;
const SOCIAL_HANDLE_REGEX = /(?:wa\.me|t\.me|telegram|whatsapp|wechat|skype|viber|signal|line|tg|wechat\s*id)[\s:]*[@+]?[\w\d.-]+/gi;
const XSS_PAYLOAD_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|onload=|onerror=|onclick=|<iframe|<object|<embed/gi;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeDealMessage(input: string): SanitizeResult {
  const violations: string[] = [];
  let sanitized = input;

  // Check for XSS / Script Injection Attempt
  if (XSS_PAYLOAD_REGEX.test(input)) {
    violations.push("XSS_ATTEMPT");
    sanitized = escapeHtml(sanitized).replace(XSS_PAYLOAD_REGEX, "[BLOCKED SCRIPT]");
  }

  // Check for Email leaks
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

  // External URLs
  if (URL_REGEX.test(input)) {
    violations.push("EXTERNAL_URL");
    sanitized = sanitized.replace(URL_REGEX, "[REDACTED LINK]");
  }

  // Direct Social Handles
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
