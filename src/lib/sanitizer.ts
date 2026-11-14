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

// Regex pattern strings for detecting contact leaks and evasions
const EMAIL_PATTERN = "([a-zA-Z0-9._%+-]+(?:\\s*\\[at\\]\\s*|\\s*\\(at\\)\\s*|\\s*@\\s*)[a-zA-Z0-9.-]+\\s*(?:\\[dot\\]|\\(dot\\)|\\.)\\s*[a-zA-Z]{2,})";
const PHONE_PATTERN = "(?:\\+?\\d{1,4}[-.\\s]?)?\\(?\\d{2,4}\\)?[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}";
const URL_PATTERN = "(https?:\\/\\/[^\\s]+|www\\.[^\\s]+|[a-zA-Z0-9-]+\\.(?:com|org|net|io|co|me|biz|info|ae|sa|fr|de|ru|cn)[^\\s]*)";
const SOCIAL_HANDLE_PATTERN = "(?:wa\\.me|t\\.me|telegram|whatsapp|wechat|skype|viber|signal|line|tg|wechat\\s*id)[\\s:]*[@+]?[\\w\\d.-]+";
const XSS_PAYLOAD_PATTERN = "<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>|javascript:|onload=|onerror=|onclick=|<iframe|<object|<embed";

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

  // 1. Check for XSS / Script Injection Attempt (Stateless regex execution)
  if (new RegExp(XSS_PAYLOAD_PATTERN, "i").test(input)) {
    violations.push("XSS_ATTEMPT");
    sanitized = sanitized.replace(new RegExp(XSS_PAYLOAD_PATTERN, "gi"), "[BLOCKED SCRIPT]");
    sanitized = escapeHtml(sanitized);
  }

  // 2. Check for Email leaks (Stateless regex execution)
  if (new RegExp(EMAIL_PATTERN, "i").test(input)) {
    violations.push("EMAIL_ADDRESS");
    sanitized = sanitized.replace(new RegExp(EMAIL_PATTERN, "gi"), "[REDACTED EMAIL]");
  }

  // 3. Filter out phone numbers longer than 7 digits (avoiding matching simple quantities/dates)
  const phoneMatches = input.match(new RegExp(PHONE_PATTERN, "g"));
  if (phoneMatches) {
    const validPhoneLeaks = phoneMatches.filter((p) => p.replace(/\D/g, "").length >= 8);
    if (validPhoneLeaks.length > 0) {
      violations.push("PHONE_NUMBER");
      validPhoneLeaks.forEach((p) => {
        sanitized = sanitized.replaceAll(p, "[REDACTED PHONE]");
      });
    }
  }

  // 4. External URLs (Stateless regex execution)
  if (new RegExp(URL_PATTERN, "i").test(input)) {
    violations.push("EXTERNAL_URL");
    sanitized = sanitized.replace(new RegExp(URL_PATTERN, "gi"), "[REDACTED LINK]");
  }

  // 5. Direct Social Handles (Stateless regex execution)
  if (new RegExp(SOCIAL_HANDLE_PATTERN, "i").test(input)) {
    violations.push("DIRECT_MESSAGING_HANDLE");
    sanitized = sanitized.replace(new RegExp(SOCIAL_HANDLE_PATTERN, "gi"), "[REDACTED MESSENGER]");
  }

  return {
    isClean: violations.length === 0,
    sanitizedText: sanitized,
    violations,
  };
}
