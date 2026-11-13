import test from "node:test";
import assert from "node:assert";

// 1. Test Leak Sanitizer
test("Anti-Leak Filter: Intercepts and redacts phone numbers, emails, and external messengers", async () => {
  const { sanitizeDealMessage } = await import("../src/lib/sanitizer.ts");

  // Email test
  const emailRes = sanitizeDealMessage("Please reach me at trader@glencore.com for direct terms");
  assert.strictEqual(emailRes.isClean, false);
  assert.strictEqual(emailRes.violations.includes("EMAIL_ADDRESS"), true);
  assert.strictEqual(emailRes.sanitizedText.includes("trader@glencore.com"), false);
  assert.strictEqual(emailRes.sanitizedText.includes("[REDACTED EMAIL]"), true);

  // Phone test
  const phoneRes = sanitizeDealMessage("Call my mobile on +1 (717) 555-0199 or 00971501234567 right now");
  assert.strictEqual(phoneRes.isClean, false);
  assert.strictEqual(phoneRes.violations.includes("PHONE_NUMBER"), true);
  assert.strictEqual(phoneRes.sanitizedText.includes("+1 (717) 555-0199"), false);

  // Clean commodity trade message
  const cleanRes = sanitizeDealMessage("We require delivery CIF Rotterdam with SGS inspection at loading port.");
  assert.strictEqual(cleanRes.isClean, true);
  assert.strictEqual(cleanRes.violations.length, 0);
  assert.strictEqual(cleanRes.sanitizedText, "We require delivery CIF Rotterdam with SGS inspection at loading port.");
});

// 2. Test Store & Security Rules
test("Security & Access Control: Refusal of unauthorized original download", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const deal = gvceStore.getDeal("deal-en590-rotterdam");
  assert.ok(deal, "Deal 1 (Energy - EN590) must exist");

  const doc = deal.documents.find((d) => d.id === "doc-coa-1");
  assert.ok(doc, "Document COA must exist");

  // Initial state: original is NOT authorized
  assert.strictEqual(doc.isOriginalAuthorized, false);

  // Step A: Owner authorizes download for Buyer org
  gvceStore.authorizeOriginalDownload("deal-en590-rotterdam", "doc-coa-1", "org-france-energy");
  assert.strictEqual(doc.isOriginalAuthorized, true);
  assert.strictEqual(doc.authorizedForOrgId, "org-france-energy");

  // Step B: Revocation halts subsequent access
  gvceStore.revokeOriginalDownload("deal-en590-rotterdam", "doc-coa-1");
  assert.strictEqual(doc.isOriginalAuthorized, false);
  assert.strictEqual(doc.authorizedForOrgId, undefined);
});

// 3. Test Multi-Commodity Deals Seeded
test("Multi-Commodity Verification: Energy, Fertilizer, and Metals deals are initialized", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const energyDeal = gvceStore.getDeal("deal-en590-rotterdam");
  assert.strictEqual(energyDeal.commodityName.includes("Diesel"), true);
  assert.strictEqual(energyDeal.currency, "USD");
  assert.strictEqual(energyDeal.commissionRate, 1.25);

  const ureaDeal = gvceStore.getDeal("deal-urea-santos");
  assert.strictEqual(ureaDeal.commodityName.includes("Urea"), true);
  assert.strictEqual(ureaDeal.currency, "USD");
  assert.strictEqual(ureaDeal.commissionRate, 1.5);
});

// 4. Test Multi-Stage Compliance Verification Records
test("Compliance Verification: Multi-stage statuses and sanctions screening", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const records = gvceStore.getVerificationRecords();
  assert.ok(records.length >= 4, "Must have seeded compliance records");

  // Verify approved KYB
  const approvedRecord = records.find((r) => r.orgCountry === "FR");
  assert.ok(approvedRecord, "French organization record must exist");
  assert.strictEqual(approvedRecord.status, "approved");
  assert.strictEqual(approvedRecord.sanctionsScore, 0);

  // Verify pending review
  const pendingRecord = records.find((r) => r.orgCountry === "BR");
  assert.ok(pendingRecord, "Brazilian organization record must exist");
  assert.strictEqual(pendingRecord.status, "pending_review");

  // Test status mutation
  const updated = gvceStore.updateVerificationStatus("ver-latam-agro", "approved", "Bank comfort letter verified by Geneva compliance officer");
  assert.strictEqual(updated, true);
  assert.strictEqual(gvceStore.getVerificationRecord("ver-latam-agro")?.status, "approved");
});

// 5. Test Broker Matching and Compliance Lock
test("Broker Command Center: Compliance Lock blocks match approval for unverified parties", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const matches = gvceStore.getBrokerMatches();
  assert.ok(matches.length >= 3, "Must have broker match proposals");

  // Approved match with both parties verified
  const dieselMatch = matches.find((m) => m.id === "match-en590-rotterdam");
  assert.ok(dieselMatch);
  assert.strictEqual(dieselMatch.matchScore, 98);
  const dieselRes = gvceStore.approveBrokerMatch("match-en590-rotterdam");
  assert.strictEqual(dieselRes.success, true);

  // Reset latam agro to pending to test compliance lock
  gvceStore.updateVerificationStatus("ver-latam-agro", "pending_review");
  const ureaMatch = matches.find((m) => m.id === "match-urea-santos");
  assert.ok(ureaMatch);
  assert.strictEqual(ureaMatch.complianceStatusBuyer, "pending");

  // Attempting to approve must be blocked by compliance lock
  const lockedRes = gvceStore.approveBrokerMatch("match-urea-santos");
  assert.strictEqual(lockedRes.success, false);
  assert.strictEqual(lockedRes.error?.includes("COMPLIANCE_LOCK"), true);
});

// 6. Test Separation of Subscription Invoices vs Brokerage Fees (USD Benchmarked)
test("Billing: Subscription vs Brokerage Invoicing separation", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const invoices = gvceStore.getInvoices();
  const subInvoices = invoices.filter((i) => i.type === "subscription");
  const comInvoices = invoices.filter((i) => i.type === "commission");

  assert.ok(subInvoices.length >= 2, "Subscription invoices must exist");
  assert.ok(comInvoices.length >= 1, "Brokerage commission invoices must exist");

  assert.strictEqual(subInvoices[0].currency, "USD");
  assert.strictEqual(comInvoices[0].currency, "USD");
  assert.ok(comInvoices[0].dealReference, "Commission invoice must reference underlying deal");
});

// 7. Test Session Security & Revocation
test("Session Security: Revocation of remote sessions", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  const initialSessions = gvceStore.getActiveSessions();
  assert.ok(initialSessions.length >= 3, "Must have seeded sessions");

  // Current session cannot be revoked
  const cannotRevokeSelf = gvceStore.revokeSession("sess-current");
  assert.strictEqual(cannotRevokeSelf, false);

  // Revoke specific remote mobile session
  const revokedMobile = gvceStore.revokeSession("sess-mobile-ios");
  assert.strictEqual(revokedMobile, true);

  // Revoke all remaining other sessions
  const countRevoked = gvceStore.revokeAllOtherSessions();
  assert.ok(countRevoked >= 1);

  // Only current session remains
  const remaining = gvceStore.getActiveSessions();
  assert.strictEqual(remaining.length, 1);
  assert.strictEqual(remaining[0].isCurrent, true);
});
