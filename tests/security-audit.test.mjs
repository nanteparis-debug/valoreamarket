import test from "node:test";
import assert from "node:assert";

// 1. Test XSS & Code Injection Defense
test("Security Audit: XSS & Script Injection Neutralization", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  // Script tag injection
  const scriptAttack = sanitizeDealMessage("Hello trader <script>alert(document.cookie)</script> let's trade");
  assert.strictEqual(scriptAttack.isClean, false);
  assert.strictEqual(scriptAttack.violations.includes("XSS_ATTEMPT"), true);
  assert.strictEqual(scriptAttack.sanitizedText.includes("<script>"), false);

  // Event handler injection
  const imgAttack = sanitizeDealMessage("Inspect batch details <iframe src='javascript:malicious()'>");
  assert.strictEqual(imgAttack.isClean, false);
  assert.strictEqual(imgAttack.violations.includes("XSS_ATTEMPT"), true);
  assert.strictEqual(imgAttack.sanitizedText.includes("<iframe"), false);
});

// 2. Test Advanced Anti-Circumvention Evasion Defense
test("Security Audit: Anti-Circumvention Evasion Patterns", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  // Spaced [at] email evasion
  const emailEvasion = sanitizeDealMessage("Write to my direct desk at director [at] petro-trading [dot] com");
  assert.strictEqual(emailEvasion.isClean, false);
  assert.strictEqual(emailEvasion.violations.includes("EMAIL_ADDRESS"), true);
  assert.strictEqual(emailEvasion.sanitizedText.includes("[REDACTED EMAIL]"), true);

  // Telegram handle evasion
  const tgEvasion = sanitizeDealMessage("Add me on telegram: @gulf_trader_oil for direct LC terms");
  assert.strictEqual(tgEvasion.isClean, false);
  assert.strictEqual(tgEvasion.violations.includes("DIRECT_MESSAGING_HANDLE"), true);
  assert.strictEqual(tgEvasion.sanitizedText.includes("@gulf_trader_oil"), false);

  // WhatsApp wa.me link
  const waEvasion = sanitizeDealMessage("Fast chat via wa.me/+971501234567 regarding CIF parcel");
  assert.strictEqual(waEvasion.isClean, false);
  assert.strictEqual(waEvasion.violations.includes("DIRECT_MESSAGING_HANDLE") || waEvasion.violations.includes("PHONE_NUMBER"), true);

  // WeChat handle evasion
  const wechatEvasion = sanitizeDealMessage("Contact my assistant on wechat: asia_commodities_99");
  assert.strictEqual(wechatEvasion.isClean, false);
  assert.strictEqual(wechatEvasion.violations.includes("DIRECT_MESSAGING_HANDLE"), true);
});

// 3. Test Regex Statelessness & Idempotency (Preventing RegExp.lastIndex State Leakage)
test("Security Audit: Sanitizer RegExp Statelessness & Idempotency", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  const maliciousPayload = "<script>alert(1)</script> contact me at info@example.com or +971501234567";

  // Execute 15 consecutive iterations to guarantee no regex lastIndex desynchronization
  for (let i = 0; i < 15; i++) {
    const result = sanitizeDealMessage(maliciousPayload);
    assert.strictEqual(result.isClean, false, `Failed on iteration ${i}: isClean should be false`);
    assert.ok(result.violations.includes("XSS_ATTEMPT"), `Failed on iteration ${i}: should detect XSS`);
    assert.ok(result.violations.includes("EMAIL_ADDRESS"), `Failed on iteration ${i}: should detect EMAIL`);
    assert.ok(result.violations.includes("PHONE_NUMBER"), `Failed on iteration ${i}: should detect PHONE`);
    assert.strictEqual(result.sanitizedText.includes("<script>"), false);
  }
});

// 4. Test IDOR & Document Access Control Invariants
test("Security Audit: IDOR Prevention & Document Gating Integrity", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const dealId = "deal-en590-rotterdam";
  const docId = "doc-coa-1";
  const deal = gvceStore.getDeal(dealId);
  assert.ok(deal);

  const doc = deal.documents.find((d) => d.id === docId);
  assert.ok(doc);

  // Ensure unapproved download is forbidden
  gvceStore.revokeOriginalDownload(dealId, docId);
  assert.strictEqual(doc.isOriginalAuthorized, false);
  assert.strictEqual(doc.authorizedForOrgId, undefined);

  // Authorize organization A
  gvceStore.authorizeOriginalDownload(dealId, docId, "org-france-energy");
  assert.strictEqual(doc.isOriginalAuthorized, true);
  assert.strictEqual(doc.authorizedForOrgId, "org-france-energy");

  // Revoke immediately verifies access cut-off
  gvceStore.revokeOriginalDownload(dealId, docId);
  assert.strictEqual(doc.isOriginalAuthorized, false);
  assert.strictEqual(doc.authorizedForOrgId, undefined);
});

// 5. Test Session Revocation IDOR Boundary
test("Security Audit: Session Revocation IDOR Boundary Protection", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const allSessions = gvceStore.getActiveSessions();
  assert.ok(allSessions.length > 0);

  // Try to revoke a session with mismatched userId
  const targetSession = allSessions.find((s) => !s.isCurrent);
  if (targetSession) {
    const isRevoked = gvceStore.revokeSession(targetSession.id, "usr-attacker-fake-id", false);
    assert.strictEqual(isRevoked, false, "Cross-user session revocation must be rejected");
  }
});

// 6. Test Production Auth Header Spoofing Protection
test("Security Audit: Production Header Persona Spoofing Rejection", async () => {
  const { getAuthenticatedUser } = await import("../src/lib/auth-server.ts");

  const prevEnv = process.env.NODE_ENV;
  const prevPersonas = process.env.ENABLE_TEST_PERSONAS;

  try {
    // Simulate Production Environment
    process.env.NODE_ENV = "production";
    delete process.env.ENABLE_TEST_PERSONAS;

    const fakeReq = {
      headers: new Headers([
        ["x-valorea-persona", "broker"],
        ["x-valorea-role", "platform_admin"],
      ]),
      cookies: {
        get: () => undefined,
      },
    };

    const user = getAuthenticatedUser(fakeReq);
    assert.strictEqual(user, null, "Production mode must strictly reject header spoofing of personas and roles");
  } finally {
    process.env.NODE_ENV = prevEnv;
    if (prevPersonas) process.env.ENABLE_TEST_PERSONAS = prevPersonas;
  }
});

// 7. Test Trusted Client IP Extraction (Cloudflare Priority)
test("Security Audit: Trusted Client IP Extraction Prioritizing Cloudflare", async () => {
  const { getClientIp } = await import("../src/lib/rate-limiter.ts");

  // Scenario 1: Cloudflare CF-Connecting-IP present
  const reqWithCf = {
    headers: {
      get: (header) => {
        const h = header.toLowerCase();
        if (h === "cf-connecting-ip") return "198.51.100.25";
        if (h === "x-forwarded-for") return "203.0.113.195, 10.0.0.1";
        return null;
      },
    },
  };
  assert.strictEqual(getClientIp(reqWithCf), "198.51.100.25", "Must prioritize CF-Connecting-IP");

  // Scenario 2: Standard X-Forwarded-For fallback
  const reqWithoutCf = {
    headers: {
      get: (header) => {
        const h = header.toLowerCase();
        if (h === "x-forwarded-for") return "203.0.113.88, 192.168.1.1";
        return null;
      },
    },
  };
  assert.strictEqual(getClientIp(reqWithoutCf), "203.0.113.88", "Must extract first IP from X-Forwarded-For");
});

// 8. Test Token Bucket Rate Limiter
test("Security Audit: Rate Limiter Token Depletion & Throttle", async () => {
  const { authRateLimiter } = await import("../src/lib/rate-limiter.ts");

  const testIp = "test-attacker-ip-127.0.0.1";
  authRateLimiter.reset(testIp);

  // Exhaust all 5 allowed tokens
  for (let i = 0; i < 5; i++) {
    const res = authRateLimiter.check(testIp);
    assert.strictEqual(res.success, true);
  }

  // 6th attempt must be rejected (rate limited)
  const blocked = authRateLimiter.check(testIp);
  assert.strictEqual(blocked.success, false);
  assert.strictEqual(blocked.remaining, 0);

  // Clean up
  authRateLimiter.reset(testIp);
});

// 9. Test Compliance Lock Barrier
test("Security Audit: Compliance Lock Invariant Enforcement", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  // Ensure that a deal match with pending compliance strictly fails approval
  gvceStore.updateVerificationStatus("ver-latam-agro", "pending_review");
  const approvalAttempt = gvceStore.approveBrokerMatch("match-urea-santos");
  assert.strictEqual(approvalAttempt.success, false);
  assert.strictEqual(approvalAttempt.error?.includes("COMPLIANCE_LOCK"), true);
});

// 10. Test Security Headers & Hardened CSP
test("Security Audit: HTTP Security Headers in NextConfig", async () => {
  const nextConfigModule = await import("../next.config.ts");
  const nextConfig = nextConfigModule.default;

  assert.ok(typeof nextConfig.headers === "function", "nextConfig must define async headers()");
  const headersList = await nextConfig.headers();
  assert.ok(Array.isArray(headersList));

  const allHeaders = headersList[0]?.headers || [];
  const headerKeys = allHeaders.map((h) => h.key);

  assert.ok(headerKeys.includes("Content-Security-Policy"), "CSP must be present");
  assert.ok(headerKeys.includes("X-Frame-Options"), "X-Frame-Options must be present");
  assert.ok(headerKeys.includes("X-Content-Type-Options"), "X-Content-Type-Options must be present");
  assert.ok(headerKeys.includes("Strict-Transport-Security"), "HSTS must be present");
  assert.ok(headerKeys.includes("Permissions-Policy"), "Permissions-Policy must be present");

  const cspHeader = allHeaders.find((h) => h.key === "Content-Security-Policy")?.value || "";
  assert.strictEqual(cspHeader.includes("'unsafe-eval'"), false, "CSP must NOT contain 'unsafe-eval'");
  assert.ok(cspHeader.includes("https://challenges.cloudflare.com"), "CSP must permit Cloudflare Turnstile");
});
