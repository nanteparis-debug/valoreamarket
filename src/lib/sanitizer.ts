/**
 * Comprehensive Multi-Channel Anti-Circumvention Armor & Leak Detector
 * VALOREA MARKET Institutional Protection Engine (Governed by ICC Model Contract 769 / NCNDA)
 *
 * Capabilities:
 * - Detects direct and obfuscated emails (e.g., '@' written as 'arobat', 'arobase', 'أروبات', 'اروباز', '.' as 'dot', 'point', 'دوت', 'نقطة')
 * - Detects direct and spaced phone numbers (e.g., '+ 9 7 1 - 5 0 ...', '0 6 1 2 ...')
 * - Detects verbally spelled-out digits in Arabic, English, and French (e.g., 'صفر خمسة...', 'zero six twelve...')
 * - Detects social messaging handles in Latin and Arabic (WhatsApp, Telegram, WeChat, Signal, etc.)
 * - Detects off-platform solicitation phrases and circumvention intent
 * - Provides real-time verbal transcript analysis for video/audio meetings with automatic microphone mute recommendation
 * - Neutralizes XSS, HTML injection, and malicious scripts
 */

export interface SanitizeResult {
  isClean: boolean;
  sanitizedText: string;
  violations: string[];
  evasionDetected: boolean;
  evasionTypes: string[];
  riskScore: "CLEAN" | "LOW" | "HIGH" | "CRITICAL";
  warningMessageAr?: string;
  warningMessageEn?: string;
}

export interface VerbalInterceptionResult {
  isViolation: boolean;
  detectedCategories: string[];
  transcriptionSnippet: string;
  recommendedAction: "ALLOW" | "AUTO_MUTE_MICROPHONE" | "TERMINATE_SESSION";
  warningMessageAr: string;
  warningMessageEn: string;
  legalClauseNotice: string;
}

// 1. AT and DOT phonetic representations across English, French, and Arabic
const AT_TOKEN_PATTERN = "(?:\\s*\\[\\s*(?:at|arobat|arobase|aroba|arroba|arobaz|أروبات|اروبات|أروباز|اروباز|آت|ات)\\s*\\]|\\s*\\(\\s*(?:at|arobat|arobase|aroba|arroba|arobaz|أروبات|اروبات|أروباز|اروباز|آت|ات)\\s*\\)|\\s+(?:at|arobat|arobase|aroba|arroba|arobaz|أروبات|اروبات|أروباز|اروباز|آت|ات)\\s+|\\s*@\\s*)";

const DOT_TOKEN_PATTERN = "(?:\\s*\\[\\s*(?:dot|point|دوت|نقطة|نقطه|بوينت|فاصلة|فاصله)\\s*\\]|\\s*\\(\\s*(?:dot|point|دوت|نقطة|نقطه|بوينت|فاصلة|فاصله)\\s*\\)|\\s+(?:dot|point|دوت|نقطة|نقطه|بوينت|فاصلة|فاصله)\\s+|\\s*\\.\\s*)";

// Complete Obfuscated & Standard Email Regex
const PHONETIC_EMAIL_PATTERN = "([\\u0600-\\u06FFa-zA-Z0-9._%+-]+[\\s]*" + AT_TOKEN_PATTERN + "[\\s]*[\\u0600-\\u06FFa-zA-Z0-9.-]+[\\s]*" + DOT_TOKEN_PATTERN + "[\\s]*(?:[a-zA-Z]{2,}|com|org|net|fr|ch|ae|sa|ru|cn|de|io|gov|edu|كوم|نت|أونلاين))";

// 2. Phone Numbers: Standard, Parenthesized, Spaced Digits, and International Formats
const PHONE_PATTERN = "(?:(?:\\+?\\d{1,4}[-.\\s]?)?\\(?\\d{2,4}\\)?[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}|(?:\\+?\\s*\\d[-.\\s()]*){8,16})";

// 3. Spelled-out Digits (Verbal numbers in Arabic, French, and English)
const ARABIC_DIGIT_WORDS = "(?:صفر|واحد|إثنين|اثنين|ثلاثة|ثلاثه|أربعة|اربعه|خمسة|خمسه|ستة|سته|سبعة|سبعه|ثمانية|ثمانيه|تسعة|تسعه|زيرو)";
const ARABIC_SPELLED_PHONE_PATTERN = "(?:" + ARABIC_DIGIT_WORDS + "[\\s,-]*){4,}";

const LATIN_DIGIT_WORDS = "(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|forty|fifty|hundred|oh|zéro|un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|soixante)";
const LATIN_SPELLED_PHONE_PATTERN = "(?:" + LATIN_DIGIT_WORDS + "[\\s,-]*){4,}";

// 4. External Messengers in Latin and Arabic
const SOCIAL_HANDLE_PATTERN = "(?:واتساب|واتس\\s*اب|واتس|تيليجرام|تليجرام|تيليغرام|تليغرام|ويتشات|ويشات|سيجنال|سكايب|فايبر|سناب\\s*شات|سناب|ايمو|whatsapp|telegram|wechat|skype|signal|viber|snapchat|line|imo|tg|wa\\.me|t\\.me)[\\s:/-]*[@+]?[\\w\\d.\\u0600-\\u06FF-]+";

// 5. External URLs & Web Links
const URL_PATTERN = "(https?:\\/\\/[^\\s]+|www\\.[^\\s]+|[a-zA-Z0-9-]+\\.(?:com|org|net|io|co|me|biz|info|ae|sa|fr|de|ru|cn)[^\\s]*)";

// 6. Circumvention Intent & Off-Platform Solicitation Phrases
const CIRCUMVENTION_PHRASES_PATTERN = "(?:راسلني\\s*خارج\\s*المنصة|تواصل\\s*معي\\s*مباشرة|اتصل\\s*بي\\s*على|رقمي\\s*الخاص|إيميلي\\s*الخاص|ايميلي\\s*هو|خارج\\s*المنصة|عقد\\s*مباشر\\s*بدون\\s*وسيط|بدون\\s*عمولة|بدون\\s*عموله|تواصل\\s*على\\s*الخاص|contact\\s*me\\s*outside|reach\\s*me\\s*directly|call\\s*me\\s*at|my\\s*private\\s*cell|bypass\\s*the\\s*platform|off-platform|direct\\s*deal\\s*without\\s*broker|avoid\\s*commission|contactez-moi\\s*directement|appelez-moi\\s*au|mon\\s*portable\\s*direct|hors\\s*plateforme|sans\\s*commission)";

// 7. XSS & Code Injection Payloads
const XSS_PAYLOAD_PATTERN = "<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>|javascript:|onload=|onerror=|onclick=|<iframe|<object|<embed";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitize text messages for Deal Rooms, eliminating direct contacts, phonetic symbol evasions, and code injection.
 */
export function sanitizeDealMessage(input: string): SanitizeResult {
  const violations: string[] = [];
  const evasionTypes: string[] = [];
  let sanitized = input;

  // 1. Neutralize XSS / Script Injection Attempt
  if (new RegExp(XSS_PAYLOAD_PATTERN, "i").test(input)) {
    violations.push("XSS_ATTEMPT");
    sanitized = sanitized.replace(new RegExp(XSS_PAYLOAD_PATTERN, "gi"), "[BLOCKED SCRIPT]");
    sanitized = escapeHtml(sanitized);
  }

  // 2. Check for Standard & Phonetic Email leaks (e.g. 'arobat', 'أروبات', 'arobase', 'dot', 'دوت', 'نقطة')
  if (new RegExp(PHONETIC_EMAIL_PATTERN, "i").test(input)) {
    violations.push("EMAIL_ADDRESS");
    if (
      /(?:arobat|arobase|aroba|arroba|أروبات|اروبات|أروباز|اروباز|دوت|نقطة|نقطه|بوينت|point)/i.test(
        input
      )
    ) {
      violations.push("PHONETIC_SYMBOL_EVASION");
      evasionTypes.push("OBFUSCATED_EMAIL_SYMBOL");
    }
    sanitized = sanitized.replace(new RegExp(PHONETIC_EMAIL_PATTERN, "gi"), "[REDACTED EMAIL]");
  }

  // 3. Spelled-out Digits (Arabic, French, English)
  if (new RegExp(ARABIC_SPELLED_PHONE_PATTERN, "i").test(input)) {
    violations.push("PHONE_NUMBER");
    violations.push("VERBAL_DIGIT_EVASION");
    evasionTypes.push("ARABIC_SPELLED_DIGITS");
    sanitized = sanitized.replace(new RegExp(ARABIC_SPELLED_PHONE_PATTERN, "gi"), "[REDACTED PHONE]");
  }

  if (new RegExp(LATIN_SPELLED_PHONE_PATTERN, "i").test(input)) {
    violations.push("PHONE_NUMBER");
    violations.push("VERBAL_DIGIT_EVASION");
    evasionTypes.push("LATIN_SPELLED_DIGITS");
    sanitized = sanitized.replace(new RegExp(LATIN_SPELLED_PHONE_PATTERN, "gi"), "[REDACTED PHONE]");
  }

  // 4. Standard and Spaced-out Phone Numbers
  const phoneGlobal = new RegExp(PHONE_PATTERN, "g");
  const phoneMatches = input.match(phoneGlobal);
  if (phoneMatches) {
    const validPhoneLeaks = phoneMatches.filter((p) => p.replace(/\D/g, "").length >= 8);
    if (validPhoneLeaks.length > 0) {
      if (!violations.includes("PHONE_NUMBER")) {
        violations.push("PHONE_NUMBER");
      }
      validPhoneLeaks.forEach((p) => {
        sanitized = sanitized.replaceAll(p, "[REDACTED PHONE]");
      });
    }
  }

  // 5. External Messengers (WhatsApp, Telegram, WeChat, Signal, etc.)
  if (new RegExp(SOCIAL_HANDLE_PATTERN, "i").test(input)) {
    violations.push("DIRECT_MESSAGING_HANDLE");
    evasionTypes.push("MESSENGER_SOLICITATION");
    sanitized = sanitized.replace(new RegExp(SOCIAL_HANDLE_PATTERN, "gi"), "[REDACTED MESSENGER]");
  }

  // 6. External URLs & Web Links
  if (new RegExp(URL_PATTERN, "i").test(input)) {
    violations.push("EXTERNAL_URL");
    sanitized = sanitized.replace(new RegExp(URL_PATTERN, "gi"), "[REDACTED LINK]");
  }

  // 7. Circumvention Intent Phrases (off-platform proposals)
  if (new RegExp(CIRCUMVENTION_PHRASES_PATTERN, "i").test(input)) {
    violations.push("CIRCUMVENTION_INTENT");
    evasionTypes.push("OFF_PLATFORM_SOLICITATION");
    sanitized = sanitized.replace(
      new RegExp(CIRCUMVENTION_PHRASES_PATTERN, "gi"),
      "[REDACTED CIRCUMVENTION PROPOSAL]"
    );
  }

  const isClean = violations.length === 0;
  const evasionDetected = evasionTypes.length > 0;

  // Calculate Risk Score
  let riskScore: "CLEAN" | "LOW" | "HIGH" | "CRITICAL" = "CLEAN";
  if (!isClean) {
    if (violations.includes("XSS_ATTEMPT") || violations.includes("CIRCUMVENTION_INTENT")) {
      riskScore = "CRITICAL";
    } else if (
      violations.includes("EMAIL_ADDRESS") ||
      violations.includes("PHONE_NUMBER") ||
      violations.includes("DIRECT_MESSAGING_HANDLE")
    ) {
      riskScore = "HIGH";
    } else {
      riskScore = "LOW";
    }
  }

  return {
    isClean,
    sanitizedText: sanitized,
    violations,
    evasionDetected,
    evasionTypes,
    riskScore,
    warningMessageAr: !isClean
      ? "تنبيه أمني صارم: تم حجب ومصادرة معلومات اتصال أو محاولة التفاف. محاولة التواصل خارج المنصة تعتبر خرقاً صريحاً لعقد ICC Model Contract 769 (NCNDA) وتُعرّض للمساءلة القانونية وغرامة تعويضية تعادل 3 أضعاف العمولة."
      : undefined,
    warningMessageEn: !isClean
      ? "Strict Compliance Notice: Contact information or circumvention evasion was intercepted and redacted. Direct communication outside VALOREA MARKET violates the ICC Model Contract 769 (NCNDA), incurring liquidated circumvention damages of 3x anticipated brokerage commission."
      : undefined,
  };
}

/**
 * Real-Time Verbal Speech-to-Text Analyzer for Closed Video/Audio Meetings.
 * Evaluates live spoken transcripts and triggers automated defensive actions (e.g. microphone mute).
 */
export function analyzeVerbalTranscript(transcript: string): VerbalInterceptionResult {
  const detectedCategories: string[] = [];

  // Check spoken phonetic emails (e.g. 'arobat', 'أروبات', 'arobase', 'point', 'dot')
  if (new RegExp(PHONETIC_EMAIL_PATTERN, "i").test(transcript)) {
    detectedCategories.push("SPOKEN_EMAIL_OR_AROBAT");
  }

  // Check spoken digits (Arabic, French, or English)
  if (
    new RegExp(ARABIC_SPELLED_PHONE_PATTERN, "i").test(transcript) ||
    new RegExp(LATIN_SPELLED_PHONE_PATTERN, "i").test(transcript) ||
    new RegExp(PHONE_PATTERN, "i").test(transcript)
  ) {
    detectedCategories.push("SPOKEN_PHONE_NUMBER");
  }

  // Check spoken messengers
  if (new RegExp(SOCIAL_HANDLE_PATTERN, "i").test(transcript)) {
    detectedCategories.push("SPOKEN_MESSENGER_NAME");
  }

  // Check spoken circumvention phrases
  if (new RegExp(CIRCUMVENTION_PHRASES_PATTERN, "i").test(transcript)) {
    detectedCategories.push("SPOKEN_CIRCUMVENTION_INTENT");
  }

  const isViolation = detectedCategories.length > 0;

  return {
    isViolation,
    detectedCategories,
    transcriptionSnippet: transcript,
    recommendedAction: isViolation ? "AUTO_MUTE_MICROPHONE" : "ALLOW",
    warningMessageAr: isViolation
      ? "⚠️ تنبيه امتثال فوري في الجلسة: تم رصد محاولة إفشاء بيانات اتصال شفوياً عبر الميكروفون! تم تفعيل كتم الصوت التلقائي لمنع إفشاء البيانات وحماية حقوق الوساطة (ICC NCNDA 769)."
      : "الجلسة الصوتية قيد المراقبة والتتبع الآلي المعتمد.",
    warningMessageEn: isViolation
      ? "⚠️ Immediate Meeting Compliance Alert: Verbal contact disclosure was detected via microphone! Microphone has been automatically muted to prevent breach of ICC NCNDA 769 non-circumvention rules."
      : "Audio session actively monitored under institutional compliance rules.",
    legalClauseNotice:
      "ICC Model Contract 769 (NCNDA) • Swiss Arbitration Centre, Geneva • Liquidated circumvention damages: 3x total anticipated brokerage commission.",
  };
}
