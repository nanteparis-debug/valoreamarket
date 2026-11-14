import test from "node:test";
import assert from "node:assert";

test("Anti-Circumvention: Phonetic & Word-Substituted Email Evasions (arobat, أروبات, arobase, دوت, نقطة)", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  // 1. English/French "arobat" + "dot"
  const res1 = sanitizeDealMessage("Write directly to trader arobat oilcorp dot com for terms");
  assert.strictEqual(res1.isClean, false);
  assert.ok(res1.violations.includes("EMAIL_ADDRESS"));
  assert.ok(res1.violations.includes("PHONETIC_SYMBOL_EVASION"));
  assert.strictEqual(res1.evasionDetected, true);
  assert.strictEqual(res1.sanitizedText.includes("[REDACTED EMAIL]"), true);
  assert.strictEqual(res1.sanitizedText.includes("arobat"), false);

  // 2. Arabic "أروبات" + "دوت"
  const res2 = sanitizeDealMessage("ايميلي الخاص هو أحمد أروبات جيميل دوت كوم للتواصل");
  assert.strictEqual(res2.isClean, false);
  assert.ok(res2.violations.includes("EMAIL_ADDRESS"));
  assert.ok(res2.violations.includes("PHONETIC_SYMBOL_EVASION"));
  assert.strictEqual(res2.sanitizedText.includes("[REDACTED EMAIL]"), true);
  assert.strictEqual(res2.sanitizedText.includes("أروبات"), false);

  // 3. French "arobase" + "point"
  const res3 = sanitizeDealMessage("Contactez alex arobase total point fr directement");
  assert.strictEqual(res3.isClean, false);
  assert.ok(res3.violations.includes("EMAIL_ADDRESS"));
  assert.ok(res3.violations.includes("PHONETIC_SYMBOL_EVASION"));
  assert.strictEqual(res3.sanitizedText.includes("[REDACTED EMAIL]"), true);
  assert.strictEqual(res3.sanitizedText.includes("arobase"), false);

  // 4. Bracketed [arobat] and (point)
  const res4 = sanitizeDealMessage("send to ceo[arobat]petro(point)ch");
  assert.strictEqual(res4.isClean, false);
  assert.ok(res4.violations.includes("EMAIL_ADDRESS"));
  assert.strictEqual(res4.sanitizedText.includes("[REDACTED EMAIL]"), true);
});

test("Anti-Circumvention: Spelled-Out Verbal Digits in Arabic, French, and English", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  // 1. Arabic Spelled Digits
  const arDigits = sanitizeDealMessage("اتصل بي على صفر خمسة صفر واحد اثنين ثلاثة أربعة خمسة");
  assert.strictEqual(arDigits.isClean, false);
  assert.ok(arDigits.violations.includes("PHONE_NUMBER"));
  assert.ok(arDigits.violations.includes("VERBAL_DIGIT_EVASION"));
  assert.strictEqual(arDigits.sanitizedText.includes("[REDACTED PHONE]"), true);

  // 2. English Spelled Digits
  const enDigits = sanitizeDealMessage("my number is zero five zero one two three four five six");
  assert.strictEqual(enDigits.isClean, false);
  assert.ok(enDigits.violations.includes("PHONE_NUMBER"));
  assert.ok(enDigits.violations.includes("VERBAL_DIGIT_EVASION"));
  assert.strictEqual(enDigits.sanitizedText.includes("[REDACTED PHONE]"), true);

  // 3. French Spelled Digits
  const frDigits = sanitizeDealMessage("mon portable zero six douze trente quatre cinquante six");
  assert.strictEqual(frDigits.isClean, false);
  assert.ok(frDigits.violations.includes("PHONE_NUMBER"));
  assert.ok(frDigits.violations.includes("VERBAL_DIGIT_EVASION"));
  assert.strictEqual(frDigits.sanitizedText.includes("[REDACTED PHONE]"), true);
});

test("Anti-Circumvention: Arabic & Latin Messenger Handles Interception", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  const waAr = sanitizeDealMessage("راسلني على الواتساب: +971501234567");
  assert.strictEqual(waAr.isClean, false);
  assert.ok(waAr.violations.includes("DIRECT_MESSAGING_HANDLE") || waAr.violations.includes("PHONE_NUMBER"));

  const tgAr = sanitizeDealMessage("تواصل معي عبر تيليجرام: @gulf_trader_oil");
  assert.strictEqual(tgAr.isClean, false);
  assert.ok(tgAr.violations.includes("DIRECT_MESSAGING_HANDLE"));
  assert.strictEqual(tgAr.sanitizedText.includes("[REDACTED MESSENGER]"), true);
});

test("Anti-Circumvention: Real-time Verbal Audio Guardian & Auto-Mute Recommendation", async () => {
  const { analyzeVerbalTranscript } = await import("../src/lib/sanitizer.ts");

  // 1. Verbal contact attempt with "arobat" in audio meeting
  const spokenLeak1 = analyzeVerbalTranscript("my email is director arobat petro dot com");
  assert.strictEqual(spokenLeak1.isViolation, true);
  assert.strictEqual(spokenLeak1.recommendedAction, "AUTO_MUTE_MICROPHONE");
  assert.ok(spokenLeak1.detectedCategories.includes("SPOKEN_EMAIL_OR_AROBAT"));
  assert.ok(spokenLeak1.legalClauseNotice.includes("ICC Model Contract 769"));

  // 2. Verbal contact attempt with Arabic spelled phone in audio meeting
  const spokenLeak2 = analyzeVerbalTranscript("رقم هاتفي صفر خمسة صفر تسعة ثمانية سبعة ستة");
  assert.strictEqual(spokenLeak2.isViolation, true);
  assert.strictEqual(spokenLeak2.recommendedAction, "AUTO_MUTE_MICROPHONE");
  assert.ok(spokenLeak2.detectedCategories.includes("SPOKEN_PHONE_NUMBER"));

  // 3. Clean professional trade discussion
  const cleanSpeech = analyzeVerbalTranscript("نحن متفقون على جدول التسليم وفحص المواصفات بميناء روتردام");
  assert.strictEqual(cleanSpeech.isViolation, false);
  assert.strictEqual(cleanSpeech.recommendedAction, "ALLOW");
});

test("Anti-Circumvention: Store Integration & Compliance Incidents Logging", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const dealId = "deal-en590-rotterdam";

  // Test 1: Chat message with evasion creates compliance incident
  const msgResult = gvceStore.addMessage(
    dealId,
    "Buyer-Alpha-24",
    "buyer",
    "Contact my desk at alex arobat oilcorp dot fr"
  );
  assert.strictEqual(msgResult.contactViolation, true);
  assert.strictEqual(msgResult.evasionDetected, true);

  const incidents = gvceStore.getComplianceIncidents(dealId);
  assert.ok(incidents.length > 0);
  const lastIncident = incidents[incidents.length - 1];
  assert.strictEqual(lastIncident.channel, "chat");
  assert.strictEqual(lastIncident.actionTaken, "MESSAGE_REDACTED");

  // Test 2: Verbal leak incident triggers autoMute and logs incident
  const verbalResult = gvceStore.recordVerbalIncident(
    dealId,
    "Supplier-Nordic-77",
    "call me on zero five zero one two three four five"
  );
  assert.strictEqual(verbalResult.autoMute, true);
  assert.strictEqual(verbalResult.violationDetected, true);
  assert.ok(verbalResult.strikesCount >= 1);
  assert.ok(verbalResult.penaltyNotice.includes("3x"));
});
