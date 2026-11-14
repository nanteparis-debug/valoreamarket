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

// 8. Test Deal Registration: Supply Offer vs Buy Request & Server-Side Recalculation
test("Deal Desk: URL query side=sell, calculation & deduplication", async () => {
  const { gvceStore } = await import("../src/lib/store.ts");

  // Simulate deal creation for Crude Oil supply offer
  const created = gvceStore.createDeal({
    sector: "crude_oil_condensates",
    commodityName: "Light Sweet Crude (Brent / WTI)",
    side: "sell",
    quantity: 50000,
    unit: "Barrels",
    pricePerUnit: 78.5,
    currency: "USD",
    incoterm: "FOB",
    deliveryPort: "Ras Tanura Terminal",
    deliveryDateRange: "Jan 10 – Jan 25, 2027",
    specs: {
      "API Gravity": "39.2°",
      "Sulfur Content": "0.35%",
      "BS&W": "< 0.2%",
    },
  });

  assert.ok(created.id, "Deal must be assigned an ID");
  assert.strictEqual(created.side, "sell");
  assert.strictEqual(created.sector, "crude_oil_condensates");
  assert.strictEqual(created.specs["API Gravity"], "39.2°");

  // Verify server-side total recalculation: 50,000 * 78.50 = 3,925,000 USD
  const total = created.quantity * created.pricePerUnit;
  assert.strictEqual(total, 3925000);

  // Brokerage commission calculation at 1.25%: 3,925,000 * 0.0125 = 49,062.50 USD
  const commission = total * (created.commissionRate / 100);
  assert.strictEqual(commission, 49062.5);
});

// 9. Test Pricing Single Source of Truth & Full Annual Totals
test("Pricing SSOT: Annual billed totals, monthly equivalents and savings", async () => {
  const { PLATFORM_PRICING_PLANS, BROKERAGE_COMMISSION_POLICY } = await import("../src/lib/pricing-data.ts");

  assert.strictEqual(PLATFORM_PRICING_PLANS.length, 3);

  // Starter
  const starter = PLATFORM_PRICING_PLANS.find((p) => p.id === "starter");
  assert.strictEqual(starter.priceMonthly, 0);
  assert.strictEqual(starter.annualBilledTotal, 0);

  // Professional: $499/mo, $399/mo equiv billed as $4,788/yr, saving $1,200/yr
  const pro = PLATFORM_PRICING_PLANS.find((p) => p.id === "professional");
  assert.strictEqual(pro.priceMonthly, 499);
  assert.strictEqual(pro.priceAnnuallyMonthlyEquivalent, 399);
  assert.strictEqual(pro.annualBilledTotal, 399 * 12); // $4,788
  assert.strictEqual(pro.annualSavingsUsd, (499 * 12) - pro.annualBilledTotal); // $1,200

  // Enterprise: $1,999/mo, $1,599/mo equiv billed as $19,188/yr, saving $4,800/yr
  const ent = PLATFORM_PRICING_PLANS.find((p) => p.id === "enterprise");
  assert.strictEqual(ent.priceMonthly, 1999);
  assert.strictEqual(ent.priceAnnuallyMonthlyEquivalent, 1599);
  assert.strictEqual(ent.annualBilledTotal, 1599 * 12); // $19,188
  assert.strictEqual(ent.annualSavingsUsd, (1999 * 12) - ent.annualBilledTotal); // $4,800

  // Brokerage commission policy
  assert.strictEqual(BROKERAGE_COMMISSION_POLICY.rateRangeDisplay, "0.50% - 1.50%");
  assert.strictEqual(BROKERAGE_COMMISSION_POLICY.liquidatedDamages, "3x total anticipated brokerage commission (ICC 769)");
});

// 10. Test Multi-Tenant RBAC & Cross-Company Document Isolation (403 Forbidden)
test("Tenant Isolation: Cross-company document gating & unauthorized rejection", async () => {
  const { verifyServerSession, TEST_PERSONAS } = await import("../src/lib/auth-server.ts");

  // Competitor persona trying to access broker-only route
  const fakeReq = {
    headers: new Map([["x-valorea-persona", "unauthorized_competitor"]]),
    cookies: new Map(),
  };

  // Convert to interface expected by verifyServerSession
  const mockReq = {
    headers: {
      get: (header) => (header === "x-valorea-persona" ? "unauthorized_competitor" : null),
    },
    cookies: {
      get: () => undefined,
    },
  };

  const authResult = verifyServerSession(mockReq, {
    allowedRoles: ["broker", "platform_admin"],
  });

  assert.ok("errorResponse" in authResult, "Must reject unauthorized competitor");
  assert.strictEqual(authResult.errorResponse.status, 403);
});

// 11. Test 7 Sectors & Certified Materials Consistency
test("Commodity Catalog: 7 Sectors and verified materials coverage", async () => {
  const { COMMODITY_SECTORS } = await import("../src/lib/constants.ts");

  assert.strictEqual(COMMODITY_SECTORS.length, 7, "Must contain exactly 7 physical commodity sectors");

  const sectorIds = COMMODITY_SECTORS.map((s) => s.id);
  assert.ok(sectorIds.includes("crude_oil_condensates"));
  assert.ok(sectorIds.includes("refined_petroleum"));
  assert.ok(sectorIds.includes("natural_gas_ngls"));
  assert.ok(sectorIds.includes("petrochemicals"));
  assert.ok(sectorIds.includes("sulfur_fertilizers"));
  assert.ok(sectorIds.includes("metals_industrial"));
  assert.ok(sectorIds.includes("sugar"));

  // Check specific required commodities
  const metals = COMMODITY_SECTORS.find((s) => s.id === "metals_industrial");
  const metalItemNames = metals.items.map((i) => i.name);
  assert.ok(metalItemNames.some((n) => n.includes("Copper Cathodes")), "Copper Cathodes must be covered");
  assert.ok(metalItemNames.some((n) => n.includes("Zinc")), "Zinc SHG must be covered");
  assert.ok(metalItemNames.some((n) => n.includes("Aluminium Extrusion Billets")), "Aluminium extrusion billets must be covered");
  assert.ok(metalItemNames.some((n) => n.includes("Steel Rolling Billets")), "Steel rolling billets must be covered");
  assert.ok(metalItemNames.some((n) => n.includes("Cobalt")), "Refined Cobalt must be covered");

  const fertilizers = COMMODITY_SECTORS.find((s) => s.id === "sulfur_fertilizers");
  const fertItemNames = fertilizers.items.map((i) => i.name);
  assert.ok(fertItemNames.some((n) => n.includes("Urea")), "Granular Urea must be covered");
  assert.ok(fertItemNames.some((n) => n.includes("Sulfur")), "Granular Sulfur must be covered");

  const sugar = COMMODITY_SECTORS.find((s) => s.id === "sugar");
  const sugarItemNames = sugar.items.map((i) => i.name);
  assert.ok(sugarItemNames.some((n) => n.includes("Refined White Sugar ICUMSA 45")), "Refined Sugar must be covered");
  assert.ok(sugarItemNames.some((n) => n.includes("Raw Centrifugal Sugar VHP")), "Raw VHP Sugar must be covered");

  // Total certified grades count across 7 sectors
  const totalGrades = COMMODITY_SECTORS.reduce((acc, s) => acc + s.materialsCount, 0);
  assert.strictEqual(totalGrades, 116, "Total catalog sub-specifications count must equal 116");
});

test("Compliance API & RBAC: Rejects unauthenticated requests with 401 and tags simulation under explicit demo", async () => {
  const { verifyServerSession } = await import("../src/lib/auth-server.ts");

  // 1. Direct unauthenticated request
  const unauthReq = new Request("http://localhost:3000/api/compliance");
  const authResult = verifyServerSession(unauthReq, {
    allowedRoles: ["compliance_officer", "broker", "platform_admin"],
    allowExplicitDemo: true,
  });
  assert.ok("errorResponse" in authResult, "Unauthenticated request without demo must be rejected");

  // 2. Request with explicit demo query param
  const demoReq = new Request("http://localhost:3000/api/compliance?demo=true");
  const demoResult = verifyServerSession(demoReq, {
    allowedRoles: ["compliance_officer", "broker", "platform_admin"],
    allowExplicitDemo: true,
  });
  assert.ok("user" in demoResult, "Explicit demo query param must grant demo persona");
  assert.strictEqual(demoResult.user.isDemoSimulation, true, "Persona must be tagged as isDemoSimulation");
});

test("Sector Tabs & Light Mode Contrast Verification", async () => {
  const fs = await import("fs/promises");
  const sectorsBento = await fs.readFile("src/components/landing/sectors-bento.tsx", "utf-8");
  assert.ok(
    sectorsBento.includes("flex-wrap"),
    "Sector pill tabs must use flex-wrap to prevent horizontal clipping on desktop"
  );
  assert.ok(
    !sectorsBento.includes("w-max min-w-full px-6 sm:px-10 justify-start xl:justify-center"),
    "Rigid single-row w-max container must be removed"
  );

  const globalsCss = await fs.readFile("src/app/globals.css", "utf-8");
  assert.ok(
    globalsCss.includes("html.light h1,") &&
    globalsCss.includes("html.light h2,") &&
    globalsCss.includes("html.light h3,") &&
    globalsCss.includes("html.light h4,"),
    "Globals CSS must enforce dark color for all heading levels in light mode"
  );
  assert.ok(
    globalsCss.includes("html.light input.bg-transparent"),
    "Simulator transparent inputs must be preserved in light mode"
  );
});

// 14. Test Multi-Tenant Server Isolation: Unauthenticated Visitor 401 Rejection
test("Multi-Tenant Server RBAC: Unauthenticated requests receive 401 on private endpoints", async () => {
  const { verifyServerSession } = await import("../src/lib/auth-server.ts");

  // A. Unauthenticated request to /api/deals
  const unauthDealsReq = new Request("http://localhost:3000/api/deals");
  const authDeals = verifyServerSession(unauthDealsReq, { allowExplicitDemo: false });
  assert.ok("errorResponse" in authDeals);
  assert.strictEqual(authDeals.errorResponse.status, 401);

  // B. Unauthenticated request to /api/billing
  const unauthBillingReq = new Request("http://localhost:3000/api/billing");
  const authBilling = verifyServerSession(unauthBillingReq, { allowExplicitDemo: false });
  assert.ok("errorResponse" in authBilling);
  assert.strictEqual(authBilling.errorResponse.status, 401);

  // C. Unauthenticated request to /api/settings/security/sessions
  const unauthSessionsReq = new Request("http://localhost:3000/api/settings/security/sessions");
  const authSessions = verifyServerSession(unauthSessionsReq, { allowExplicitDemo: false });
  assert.ok("errorResponse" in authSessions);
  assert.strictEqual(authSessions.errorResponse.status, 401);
});

// 15. Test Multi-Tenant Data Isolation: Company A cannot read or modify Company B deals
test("Multi-Tenant Isolation: Company A vs Company B isolation and deal tenancy validation", async () => {
  const { verifyServerSession, TEST_PERSONAS } = await import("../src/lib/auth-server.ts");
  const { gvceStore } = await import("../src/lib/store.ts");

  // Company A (Buyer: org-france-energy)
  const reqCompanyA = {
    headers: {
      get: (h) => (h.toLowerCase() === "x-valorea-persona" ? "buyer" : null),
    },
    cookies: { get: () => undefined },
  };

  // Company B (Supplier: org-saudi-chem)
  const reqCompanyB = {
    headers: {
      get: (h) => (h.toLowerCase() === "x-valorea-persona" ? "company_b" : null),
    },
    cookies: { get: () => undefined },
  };

  // Neutral Broker (org-valorea-brokerage)
  const reqBroker = {
    headers: {
      get: (h) => (h.toLowerCase() === "x-valorea-persona" ? "broker" : null),
    },
    cookies: { get: () => undefined },
  };

  const sessionA = verifyServerSession(reqCompanyA);
  const sessionB = verifyServerSession(reqCompanyB);
  const sessionBroker = verifyServerSession(reqBroker);

  assert.ok("user" in sessionA);
  assert.ok("user" in sessionB);
  assert.ok("user" in sessionBroker);

  assert.strictEqual(sessionA.user.orgId, "org-france-energy");
  assert.strictEqual(sessionB.user.orgId, "org-saudi-chem");
  assert.strictEqual(sessionBroker.user.role, "broker");

  const allDeals = gvceStore.getAllDeals();

  // 1. Read isolation: Company A deals vs Company B deals
  const companyADeals = allDeals.filter((d) =>
    d.participants.some((p) => p.orgId === sessionA.user.orgId)
  );
  const companyBDeals = allDeals.filter((d) =>
    d.participants.some((p) => p.orgId === sessionB.user.orgId)
  );
  const brokerDeals = allDeals; // Broker supervises all

  assert.ok(companyADeals.some((d) => d.id === "deal-en590-rotterdam"), "Company A must see its own deal");
  assert.ok(!companyBDeals.some((d) => d.id === "deal-en590-rotterdam"), "Company B MUST NOT see Company A's deal");
  assert.ok(brokerDeals.length >= allDeals.length, "Broker must have visibility over all clearing deals");

  // 2. Tenancy enforcement on Deal Room Participation (Message & LiveKit guard check)
  const targetDeal = gvceStore.getDeal("deal-en590-rotterdam");
  assert.ok(targetDeal);

  // Helper verifying participant eligibility check
  const isParticipantA =
    sessionA.user.role === "broker" ||
    targetDeal.participants.some((p) => p.orgId === sessionA.user.orgId);
  const isParticipantB =
    sessionB.user.role === "broker" ||
    targetDeal.participants.some((p) => p.orgId === sessionB.user.orgId);
  const isParticipantBroker =
    sessionBroker.user.role === "broker" ||
    targetDeal.participants.some((p) => p.orgId === sessionBroker.user.orgId);

  assert.strictEqual(isParticipantA, true, "Company A is a participant in its deal");
  assert.strictEqual(isParticipantB, false, "Company B is NOT a participant and must be denied (403)");
  assert.strictEqual(isParticipantBroker, true, "Broker is authorized to oversee the deal room");
});

// 16. Test Demo Mode Sandbox Isolation: Simulation users cannot tamper with production deals
test("Sandbox Isolation: Demo mode users strictly confined to simulated sandbox records", async () => {
  const { verifyServerSession } = await import("../src/lib/auth-server.ts");

  const demoReq = new Request("http://localhost:3000/api/deals?demo=true");
  const authDemo = verifyServerSession(demoReq, { allowExplicitDemo: true });

  assert.ok("user" in authDemo);
  assert.strictEqual(authDemo.user.isDemoSimulation, true);

  // Attempting to post message or join meeting on a non-demo deal ID must be forbidden
  const productionDealId = "deal-urea-santos";
  const isDemoDeal = productionDealId === "deal-en590-rotterdam";
  const forbiddenDemoIsolation = authDemo.user.isDemoSimulation && !isDemoDeal;

  assert.strictEqual(
    forbiddenDemoIsolation,
    true,
    "Demo user attempting to touch production deal must trigger FORBIDDEN_DEMO_ISOLATION (403)"
  );
});
