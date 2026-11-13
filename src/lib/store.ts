import { sanitizeDealMessage, type SanitizeResult } from "./sanitizer";

export interface DealParticipant {
  id: string;
  alias: string;
  role: "buyer" | "supplier" | "broker";
  orgId: string;
  orgCountry: string;
  isVerified: boolean;
}

export interface VerificationRecord {
  id: string;
  orgId: string;
  orgName: string;
  orgCountry: string;
  jurisdiction: string;
  registrationNumber: string;
  taxNumber: string;
  uboName: string;
  scope: "kyb" | "representative_kyc" | "cargo_title" | "sanctions_pep";
  status: "incomplete" | "pending_review" | "additional_info_required" | "approved" | "rejected" | "expired" | "suspended";
  sanctionsScore: number; // 0 = clean, 100 = match
  reviewerId: string;
  decisionReason?: string;
  documentsSubmitted: string[];
  expiresAt: string;
  updatedAt: string;
}

export interface BrokerMatchItem {
  id: string;
  reference: string;
  buyRequestId: string;
  supplyOfferId: string;
  buyerOrg: string;
  supplierOrg: string;
  commodityName: string;
  sector: string;
  matchScore: number; // 0 - 100%
  quantity: number;
  unit: string;
  buyerTargetPrice: number;
  supplierOfferPrice: number;
  currency: string;
  incoterm: string;
  deliveryPort: string;
  specsDiff: Array<{ spec: string; buyerReq: string; supplierVal: string; match: boolean }>;
  complianceStatusBuyer: "approved" | "pending" | "rejected";
  complianceStatusSupplier: "approved" | "pending" | "rejected";
  status: "proposed" | "broker_approved" | "room_opened" | "rejected";
  dealRoomId?: string;
  estimatedCommissionUsd: number;
  brokerLead: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  type: "subscription" | "commission";
  orgId: string;
  orgName: string;
  amount: number;
  currency: string;
  periodStart?: string;
  periodEnd?: string;
  dealReference?: string;
  status: "paid" | "due" | "canceled";
  issueDate: string;
  dueDate: string;
  pdfUrl: string;
}

export interface UserSessionItem {
  id: string;
  userId: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  passkeyBound: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface DealDocument {
  id: string;
  title: string;
  type: string;
  ownerOrgId: string;
  ownerAlias: string;
  fileSize: string;
  redactedPreviewUrl: string;
  isOriginalAuthorized: boolean;
  authorizedForOrgId?: string;
  downloadCount: number;
}

export interface DealMessage {
  id: string;
  senderAlias: string;
  senderRole: "buyer" | "supplier" | "broker";
  text: string;
  sanitizedText: string;
  contactViolation: boolean;
  timestamp: string;
}

export interface DealItem {
  id: string;
  referenceNumber: string;
  sector: string;
  commodityName: string;
  side: "buy" | "sell";
  quantity: number;
  unit: string;
  pricePerUnit: number;
  currency: string;
  incoterm: string;
  deliveryPort: string;
  deliveryDateRange: string;
  specs: Record<string, string>;
  status: "open" | "matched" | "negotiating" | "agreed" | "settled";
  brokerLead: string;
  commissionRate: number; // e.g., 1.25%
  commissionDueEvent: string;
  participants: DealParticipant[];
  messages: DealMessage[];
  documents: DealDocument[];
  auditLog: Array<{ action: string; actor: string; timestamp: string }>;
}

// In-Memory Global Store seeded with operational test deals
class GVCEDataStore {
  private deals: Map<string, DealItem> = new Map();
  private verifications: Map<string, VerificationRecord> = new Map();
  private matches: Map<string, BrokerMatchItem> = new Map();
  private invoices: Map<string, InvoiceItem> = new Map();
  private sessions: Map<string, UserSessionItem> = new Map();
  private currentSubscription = {
    plan: "enterprise" as "starter" | "professional" | "enterprise",
    status: "active",
    seatsUsed: 8,
    seatsTotal: 15,
    monthlyPriceUsd: 1999,
    renewalDate: "2027-01-15T00:00:00Z",
    billingCycle: "monthly",
  };

  constructor() {
    this.seedDefaultDeals();
    this.seedDefaultVerifications();
    this.seedDefaultMatches();
    this.seedDefaultInvoices();
    this.seedDefaultSessions();
  }

  private seedDefaultVerifications() {
    this.verifications.set("ver-total-fr", {
      id: "ver-total-fr",
      orgId: "org-france-energy",
      orgName: "TotalEnergies Trading SA",
      orgCountry: "FR",
      jurisdiction: "France (Paris Commercial Registry)",
      registrationNumber: "FR-542051180",
      taxNumber: "FR82542051180",
      uboName: "Institutional Shareholders & Global Trust (UBO Tier 1)",
      scope: "kyb",
      status: "approved",
      sanctionsScore: 0,
      reviewerId: "CO-GVCE-Geneva-11",
      decisionReason: "Comprehensive KYB verified against Infogreffe and OFAC/EU Sanctions list. Clean beneficial ownership.",
      documentsSubmitted: ["Kbis Excerpt 2026", "Audited Financials FY2025", "Corporate Resolution & Power of Attorney"],
      expiresAt: "2027-11-12T00:00:00Z",
      updatedAt: "2026-11-12T14:20:00Z",
    });

    this.verifications.set("ver-nordic-no", {
      id: "ver-nordic-no",
      orgId: "org-norway-refining",
      orgName: "Nordic Refining & Trading AS",
      orgCountry: "NO",
      jurisdiction: "Norway (Brønnøysund Register Centre)",
      registrationNumber: "NO-981244512",
      taxNumber: "NO981244512MVA",
      uboName: "Haakon Lindqvist (58%), Nordic Energy Holding (42%)",
      scope: "cargo_title",
      status: "approved",
      sanctionsScore: 0,
      reviewerId: "CO-GVCE-Oslo-04",
      decisionReason: "Refinery throughput allocation contract and Mongstad terminal storage title verified.",
      documentsSubmitted: ["Mongstad Tank Storage Receipt #419", "Refinery Allocation Agreement 2026/2027", "SGS Quality Assurance Certificate"],
      expiresAt: "2027-10-30T00:00:00Z",
      updatedAt: "2026-10-30T09:15:00Z",
    });

    this.verifications.set("ver-saudi-chem", {
      id: "ver-saudi-chem",
      orgId: "org-saudi-chem",
      orgName: "Saudi Basic Chemical Exports LLC",
      orgCountry: "SA",
      jurisdiction: "Kingdom of Saudi Arabia (Ministry of Commerce)",
      registrationNumber: "CR-1010892211",
      taxNumber: "30048192800003",
      uboName: "Fahad Al-Husseini (100% Beneficial Owner)",
      scope: "representative_kyc",
      status: "approved",
      sanctionsScore: 0,
      reviewerId: "CO-GVCE-Dubai-09",
      decisionReason: "Passports, biometric identity confirmation, and commercial chamber authorization fully verified.",
      documentsSubmitted: ["Saudi Commercial Register CR", "Chamber of Commerce Signature Card", "Authorized Officer Passport Copy"],
      expiresAt: "2027-08-15T00:00:00Z",
      updatedAt: "2026-08-15T11:00:00Z",
    });

    this.verifications.set("ver-latam-agro", {
      id: "ver-latam-agro",
      orgId: "org-brazil-agro",
      orgName: "AgroFertil Importadora do Brasil Ltda",
      orgCountry: "BR",
      jurisdiction: "Brazil (Receita Federal do Brasil)",
      registrationNumber: "CNPJ-29.412.890/0001-44",
      taxNumber: "IE-118.234.901.115",
      uboName: "Marcelo Silveira (75%), Rodrigo Costa (25%)",
      scope: "kyb",
      status: "pending_review",
      sanctionsScore: 4,
      reviewerId: "CO-GVCE-SaoPaulo-02",
      decisionReason: "Under compliance screening: awaiting supplementary bank comfort letter and updated articles of association.",
      documentsSubmitted: ["CNPJ Registration Certificate", "Articles of Incorporation (Contrato Social)"],
      expiresAt: "2027-03-01T00:00:00Z",
      updatedAt: "2026-11-13T08:30:00Z",
    });

    this.verifications.set("ver-caspian-oil", {
      id: "ver-caspian-oil",
      orgId: "org-caspian-petro",
      orgName: "Caspian Trans-Oil FZE",
      orgCountry: "AZ",
      jurisdiction: "Azerbaijan / UAE Free Zone",
      registrationNumber: "FZ-2024-8831",
      taxNumber: "AZ-990012481",
      uboName: "Undisclosed Offshore Trust (Tier 3 Intermediary)",
      scope: "sanctions_pep",
      status: "additional_info_required",
      sanctionsScore: 28,
      reviewerId: "CO-GVCE-London-07",
      decisionReason: "PEP screening flagged indirect ownership link. Ultimate Beneficial Ownership (UBO) declaration required before approval.",
      documentsSubmitted: ["Trade License Copy", "Intermediary Corporate Chart"],
      expiresAt: "2026-12-31T00:00:00Z",
      updatedAt: "2026-11-13T16:00:00Z",
    });
  }

  private seedDefaultMatches() {
    this.matches.set("match-en590-rotterdam", {
      id: "match-en590-rotterdam",
      reference: "GVCE-MATCH-2026-EN590-01",
      buyRequestId: "deal-en590-rotterdam",
      supplyOfferId: "offer-nordic-en590",
      buyerOrg: "TotalEnergies Trading SA",
      supplierOrg: "Nordic Refining & Trading AS",
      commodityName: "Ultra-Low Sulfur Diesel (EN 590 10 PPM)",
      sector: "refined_petroleum",
      matchScore: 98,
      quantity: 50000,
      unit: "Metric Tons",
      buyerTargetPrice: 740,
      supplierOfferPrice: 742,
      currency: "USD",
      incoterm: "CIF",
      deliveryPort: "Rotterdam, Netherlands",
      specsDiff: [
        { spec: "Sulfur Content", buyerReq: "Max 10 PPM", supplierVal: "8.5 PPM (Lab Verified)", match: true },
        { spec: "Cetane Index", buyerReq: "Min 51.0", supplierVal: "52.8", match: true },
        { spec: "Flash Point", buyerReq: "Min 55°C", supplierVal: "62.0°C", match: true },
        { spec: "Delivery Window", buyerReq: "Dec 10 - Dec 20, 2026", supplierVal: "Dec 12 - Dec 18, 2026", match: true },
      ],
      complianceStatusBuyer: "approved",
      complianceStatusSupplier: "approved",
      status: "room_opened",
      dealRoomId: "deal-en590-rotterdam",
      estimatedCommissionUsd: 462500, // 1.25% of $37,000,000
      brokerLead: "Broker-GVCE-Lead",
      createdAt: "2026-11-12T10:00:00Z",
    });

    this.matches.set("match-urea-santos", {
      id: "match-urea-santos",
      reference: "GVCE-MATCH-2026-UREA-02",
      buyRequestId: "deal-urea-latam-buy",
      supplyOfferId: "deal-urea-santos",
      buyerOrg: "AgroFertil Importadora do Brasil Ltda",
      supplierOrg: "Saudi Basic Chemical Exports LLC",
      commodityName: "Granular Urea 46% Nitrogen (Agriculture Grade)",
      sector: "sulfur_fertilizers",
      matchScore: 94,
      quantity: 25000,
      unit: "Metric Tons",
      buyerTargetPrice: 380,
      supplierOfferPrice: 385,
      currency: "USD",
      incoterm: "FOB",
      deliveryPort: "Jubail, Saudi Arabia",
      specsDiff: [
        { spec: "Nitrogen Content", buyerReq: "Min 46.0% N", supplierVal: "46.2% N", match: true },
        { spec: "Biuret", buyerReq: "Max 1.0%", supplierVal: "0.85%", match: true },
        { spec: "Moisture", buyerReq: "Max 0.5%", supplierVal: "0.38%", match: true },
        { spec: "Granulometry (2-4mm)", buyerReq: "Min 90%", supplierVal: "94.5%", match: true },
      ],
      complianceStatusBuyer: "pending",
      complianceStatusSupplier: "approved",
      status: "proposed",
      estimatedCommissionUsd: 144375, // 1.5% of $9,625,000
      brokerLead: "Broker-GVCE-Agro",
      createdAt: "2026-11-13T09:30:00Z",
    });

    this.matches.set("match-copper-cathode", {
      id: "match-copper-cathode",
      reference: "GVCE-MATCH-2026-CU-03",
      buyRequestId: "req-copper-shanghai",
      supplyOfferId: "offer-copper-chile",
      buyerOrg: "China Minmetals East Corp",
      supplierOrg: "Andean Mining & Metals SpA",
      commodityName: "Grade A Copper Cathodes (Cu-CATH-1 99.9935%)",
      sector: "metals_industrial",
      matchScore: 96,
      quantity: 5000,
      unit: "Metric Tons",
      buyerTargetPrice: 9250,
      supplierOfferPrice: 9300,
      currency: "USD",
      incoterm: "CIF",
      deliveryPort: "Shanghai Port, China",
      specsDiff: [
        { spec: "Copper Purity", buyerReq: "Min 99.9935% Cu", supplierVal: "99.9950% (BS EN 1978:1998)", match: true },
        { spec: "Dimensions", buyerReq: "Standard 914 x 914 mm", supplierVal: "Standard 914 x 914 mm (approx 125 kg)", match: true },
        { spec: "Delivery Window", buyerReq: "Jan 15 - Feb 05, 2027", supplierVal: "Jan 20 - Feb 01, 2027", match: true },
      ],
      complianceStatusBuyer: "approved",
      complianceStatusSupplier: "approved",
      status: "broker_approved",
      estimatedCommissionUsd: 465000, // 1.0% of $46,500,000
      brokerLead: "Broker-GVCE-Metals",
      createdAt: "2026-11-13T11:15:00Z",
    });
  }

  private seedDefaultInvoices() {
    this.invoices.set("inv-sub-089", {
      id: "inv-sub-089",
      invoiceNumber: "GVCE-INV-2026-SUB-089",
      type: "subscription",
      orgId: "org-norway-refining",
      orgName: "Nordic Refining & Trading AS",
      amount: 1999.00,
      currency: "USD",
      periodStart: "2026-11-15T00:00:00Z",
      periodEnd: "2026-12-15T00:00:00Z",
      status: "paid",
      issueDate: "2026-11-10T00:00:00Z",
      dueDate: "2026-11-15T00:00:00Z",
      pdfUrl: "/invoices/GVCE-INV-2026-SUB-089.pdf",
    });

    this.invoices.set("inv-sub-076", {
      id: "inv-sub-076",
      invoiceNumber: "GVCE-INV-2026-SUB-076",
      type: "subscription",
      orgId: "org-norway-refining",
      orgName: "Nordic Refining & Trading AS",
      amount: 1999.00,
      currency: "USD",
      periodStart: "2026-10-15T00:00:00Z",
      periodEnd: "2026-11-15T00:00:00Z",
      status: "paid",
      issueDate: "2026-10-10T00:00:00Z",
      dueDate: "2026-10-15T00:00:00Z",
      pdfUrl: "/invoices/GVCE-INV-2026-SUB-076.pdf",
    });

    this.invoices.set("inv-com-042", {
      id: "inv-com-042",
      invoiceNumber: "GVCE-INV-2026-COM-042",
      type: "commission",
      orgId: "org-norway-refining",
      orgName: "Nordic Refining & Trading AS",
      amount: 231250.00, // 50% share of $462,500 brokerage
      currency: "USD",
      dealReference: "GVCE-2026-EN590-410",
      status: "due",
      issueDate: "2026-11-13T12:00:00Z",
      dueDate: "2026-11-28T12:00:00Z",
      pdfUrl: "/invoices/GVCE-INV-2026-COM-042.pdf",
    });
  }

  private seedDefaultSessions() {
    this.sessions.set("sess-current", {
      id: "sess-current",
      userId: "usr-trader-01",
      deviceType: "desktop",
      browser: "Chrome 133.0 / MacOS",
      os: "macOS Sonoma (Darwin 24.3)",
      ipAddress: "194.26.29.112",
      location: "Paris, Île-de-France, France",
      isCurrent: true,
      passkeyBound: true,
      lastActiveAt: "Just now",
      createdAt: "2026-11-13T08:15:00Z",
    });

    this.sessions.set("sess-mobile-ios", {
      id: "sess-mobile-ios",
      userId: "usr-trader-01",
      deviceType: "mobile",
      browser: "Mobile Safari 18.2 / iOS",
      os: "iOS 18.2 (iPhone 16 Pro)",
      ipAddress: "82.165.197.14",
      location: "Geneva, Switzerland",
      isCurrent: false,
      passkeyBound: true,
      lastActiveAt: "3 hours ago",
      createdAt: "2026-11-12T19:40:00Z",
    });

    this.sessions.set("sess-workstation-win", {
      id: "sess-workstation-win",
      userId: "usr-trader-01",
      deviceType: "desktop",
      browser: "Microsoft Edge 132.0 / Windows",
      os: "Windows 11 Enterprise (64-bit)",
      ipAddress: "212.58.244.70",
      location: "London, Greater London, United Kingdom",
      isCurrent: false,
      passkeyBound: false,
      lastActiveAt: "2 days ago",
      createdAt: "2026-11-11T14:10:00Z",
    });
  }

  private seedDefaultDeals() {
    // Deal 1: Energy - Diesel EN 590
    this.deals.set("deal-en590-rotterdam", {
      id: "deal-en590-rotterdam",
      referenceNumber: "GVCE-2026-EN590-410",
      sector: "refined_petroleum",
      commodityName: "Ultra-Low Sulfur Diesel (EN 590 10 PPM)",
      side: "buy",
      quantity: 50000,
      unit: "Metric Tons",
      pricePerUnit: 740,
      currency: "USD",
      incoterm: "CIF",
      deliveryPort: "Rotterdam, Netherlands",
      deliveryDateRange: "Dec 10, 2026 – Dec 20, 2026",
      specs: {
        "Sulfur Content": "Max 10 PPM",
        "Cetane Index": "Min 51.0",
        "Flash Point": "Min 55°C",
        "Density at 15°C": "0.820 - 0.845 kg/l",
      },
      status: "negotiating",
      brokerLead: "Broker-GVCE-Lead",
      commissionRate: 1.25,
      commissionDueEvent: "Commercial Invoice & LC 100% at Sight Confirmation",
      participants: [
        {
          id: "p-buyer-1",
          alias: "Buyer-Alpha-24",
          role: "buyer",
          orgId: "org-france-energy",
          orgCountry: "FR",
          isVerified: true,
        },
        {
          id: "p-supp-1",
          alias: "Supplier-Nordic-77",
          role: "supplier",
          orgId: "org-norway-refining",
          orgCountry: "NO",
          isVerified: true,
        },
        {
          id: "p-broker-1",
          alias: "Broker-GVCE-Lead",
          role: "broker",
          orgId: "org-gvce-clearing",
          orgCountry: "AE",
          isVerified: true,
        },
      ],
      messages: [
        {
          id: "m-1",
          senderAlias: "Buyer-Alpha-24",
          senderRole: "buyer",
          text: "We require confirmed delivery port CIF Rotterdam between Dec 10 and Dec 20. Can you guarantee SGS testing at loading?",
          sanitizedText: "We require confirmed delivery port CIF Rotterdam between Dec 10 and Dec 20. Can you guarantee SGS testing at loading?",
          contactViolation: false,
          timestamp: "14:02 UTC",
        },
        {
          id: "m-2",
          senderAlias: "Supplier-Nordic-77",
          senderRole: "supplier",
          text: "Yes, SGS inspection at loading port is fully accepted. We have uploaded the redacted Certificate of Analysis to the Documents tab.",
          sanitizedText: "Yes, SGS inspection at loading port is fully accepted. We have uploaded the redacted Certificate of Analysis to the Documents tab.",
          contactViolation: false,
          timestamp: "14:05 UTC",
        },
      ],
      documents: [
        {
          id: "doc-coa-1",
          title: "Certificate of Analysis (COA) - Refinery Batch #441",
          type: "quality_certificate",
          ownerOrgId: "org-norway-refining",
          ownerAlias: "Supplier-Nordic-77",
          fileSize: "2.4 MB PDF",
          redactedPreviewUrl: "/docs/redacted-coa.pdf",
          isOriginalAuthorized: false,
          downloadCount: 0,
        },
        {
          id: "doc-sgs-1",
          title: "SGS Independent Load Port Inspection Report",
          type: "sgs_inspection",
          ownerOrgId: "org-norway-refining",
          ownerAlias: "Supplier-Nordic-77",
          fileSize: "3.8 MB PDF",
          redactedPreviewUrl: "/docs/redacted-sgs.pdf",
          isOriginalAuthorized: false,
          downloadCount: 0,
        },
      ],
      auditLog: [
        { action: "DEAL_MATCHED", actor: "Broker-GVCE-Lead", timestamp: "2026-11-13T10:00:00Z" },
        { action: "ROOM_INITIALIZED", actor: "System", timestamp: "2026-11-13T10:05:00Z" },
        { action: "NCNDA_EXECUTED", actor: "Buyer-Alpha-24 & Supplier-Nordic-77", timestamp: "2026-11-13T11:30:00Z" },
      ],
    });

    // Deal 2: Fertilizer - Granular Urea 46% N
    this.deals.set("deal-urea-santos", {
      id: "deal-urea-santos",
      referenceNumber: "GVCE-2026-UREA-902",
      sector: "sulfur_fertilizers",
      commodityName: "Granular Urea 46% Nitrogen (Agriculture Grade)",
      side: "sell",
      quantity: 25000,
      unit: "Metric Tons",
      pricePerUnit: 385,
      currency: "USD",
      incoterm: "FOB",
      deliveryPort: "Jubail, Saudi Arabia",
      deliveryDateRange: "Jan 05, 2027 – Jan 20, 2027",
      specs: {
        "Nitrogen Content": "Min 46.0% N",
        "Biuret": "Max 1.0%",
        "Moisture": "Max 0.5%",
        "Granulometry (2-4 mm)": "Min 90%",
      },
      status: "matched",
      brokerLead: "Broker-GVCE-Agro",
      commissionRate: 1.5,
      commissionDueEvent: "Bill of Lading issuance and Port Clearance",
      participants: [
        {
          id: "p-buyer-2",
          alias: "Buyer-Latam-12",
          role: "buyer",
          orgId: "org-brazil-agro",
          orgCountry: "BR",
          isVerified: true,
        },
        {
          id: "p-supp-2",
          alias: "Supplier-Gulf-45",
          role: "supplier",
          orgId: "org-saudi-chem",
          orgCountry: "SA",
          isVerified: true,
        },
      ],
      messages: [],
      documents: [
        {
          id: "doc-urea-specs",
          title: "SABIC Technical Specification Sheet & Biuret Certificate",
          type: "quality_certificate",
          ownerOrgId: "org-saudi-chem",
          ownerAlias: "Supplier-Gulf-45",
          fileSize: "1.9 MB PDF",
          redactedPreviewUrl: "/docs/redacted-urea.pdf",
          isOriginalAuthorized: false,
          downloadCount: 0,
        },
      ],
      auditLog: [
        { action: "SUPPLY_OFFER_REGISTERED", actor: "Supplier-Gulf-45", timestamp: "2026-11-13T08:00:00Z" },
        { action: "BUY_OFFER_MATCHED", actor: "Broker-GVCE-Agro", timestamp: "2026-11-13T12:00:00Z" },
      ],
    });
  }

  public getDeal(id: string): DealItem | undefined {
    return this.deals.get(id);
  }

  public getAllDeals(): DealItem[] {
    return Array.from(this.deals.values());
  }

  public createDeal(deal: Partial<DealItem>): DealItem {
    const id = `deal-${Date.now().toString(36)}`;
    const newDeal: DealItem = {
      id,
      referenceNumber: `GVCE-2026-${deal.sector?.toUpperCase().slice(0, 4) || "COMM"}-${Math.floor(100 + Math.random() * 900)}`,
      sector: deal.sector || "crude_oil_condensates",
      commodityName: deal.commodityName || "Custom Commodity",
      side: deal.side || "buy",
      quantity: deal.quantity || 1000,
      unit: deal.unit || "Metric Tons",
      pricePerUnit: deal.pricePerUnit || 100,
      currency: "USD",
      incoterm: deal.incoterm || "FOB",
      deliveryPort: deal.deliveryPort || "Designated Port",
      deliveryDateRange: deal.deliveryDateRange || "30 Days from Contract",
      specs: deal.specs || {},
      status: "open",
      brokerLead: "Broker-GVCE-Lead",
      commissionRate: 1.25,
      commissionDueEvent: "LC Confirmation at Banking Channel",
      participants: deal.participants || [],
      messages: [],
      documents: [],
      auditLog: [
        { action: "REQUEST_SUBMITTED", actor: "User", timestamp: new Date().toISOString() },
      ],
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }

  public addMessage(
    dealId: string,
    senderAlias: string,
    senderRole: "buyer" | "supplier" | "broker",
    text: string
  ): DealMessage | { error: string } {
    const deal = this.deals.get(dealId);
    if (!deal) return { error: "Deal not found" };

    const sanitized = sanitizeDealMessage(text);
    const msg: DealMessage = {
      id: `msg-${Date.now().toString(36)}`,
      senderAlias,
      senderRole,
      text,
      sanitizedText: sanitized.sanitizedText,
      contactViolation: !sanitized.isClean,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC",
    };

    deal.messages.push(msg);
    deal.auditLog.push({
      action: sanitized.isClean ? "MESSAGE_DELIVERED" : "MESSAGE_SANITIZED_VIOLATION",
      actor: senderAlias,
      timestamp: new Date().toISOString(),
    });

    return msg;
  }

  public authorizeOriginalDownload(dealId: string, docId: string, authorizedOrgId: string): boolean {
    const deal = this.deals.get(dealId);
    if (!deal) return false;
    const doc = deal.documents.find((d) => d.id === docId);
    if (!doc) return false;

    doc.isOriginalAuthorized = true;
    doc.authorizedForOrgId = authorizedOrgId;
    deal.auditLog.push({
      action: "DOWNLOAD_ORIGINAL_AUTHORIZED",
      actor: doc.ownerAlias,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  public revokeOriginalDownload(dealId: string, docId: string): boolean {
    const deal = this.deals.get(dealId);
    if (!deal) return false;
    const doc = deal.documents.find((d) => d.id === docId);
    if (!doc) return false;

    doc.isOriginalAuthorized = false;
    doc.authorizedForOrgId = undefined;
    deal.auditLog.push({
      action: "DOWNLOAD_ACCESS_REVOKED",
      actor: "Broker-System",
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  // --- Verification Records ---
  public getVerificationRecords(): VerificationRecord[] {
    return Array.from(this.verifications.values());
  }

  public getVerificationRecord(id: string): VerificationRecord | undefined {
    return this.verifications.get(id);
  }

  public updateVerificationStatus(
    id: string,
    status: VerificationRecord["status"],
    decisionReason?: string
  ): boolean {
    const rec = this.verifications.get(id);
    if (!rec) return false;
    rec.status = status;
    if (decisionReason) rec.decisionReason = decisionReason;
    rec.updatedAt = new Date().toISOString();
    return true;
  }

  // --- Broker Matches ---
  public getBrokerMatches(): BrokerMatchItem[] {
    return Array.from(this.matches.values());
  }

  public approveBrokerMatch(matchId: string): { success: boolean; error?: string; dealRoomId?: string } {
    const match = this.matches.get(matchId);
    if (!match) return { success: false, error: "Match not found" };

    // Compliance lock enforcement
    if (match.complianceStatusBuyer !== "approved" || match.complianceStatusSupplier !== "approved") {
      return {
        success: false,
        error: "COMPLIANCE_LOCK: Cannot approve match. Both parties must have APPROVED compliance status before opening a deal room.",
      };
    }

    match.status = "broker_approved";
    if (!match.dealRoomId) {
      match.dealRoomId = "deal-en590-rotterdam"; // Link to active deal room or initialize
    }
    return { success: true, dealRoomId: match.dealRoomId };
  }

  public rejectBrokerMatch(matchId: string): boolean {
    const match = this.matches.get(matchId);
    if (!match) return false;
    match.status = "rejected";
    return true;
  }

  // --- Subscriptions & Invoices ---
  public getSubscription() {
    return this.currentSubscription;
  }

  public updateSubscriptionPlan(newPlan: "starter" | "professional" | "enterprise") {
    this.currentSubscription.plan = newPlan;
    if (newPlan === "starter") {
      this.currentSubscription.monthlyPriceUsd = 0;
      this.currentSubscription.seatsTotal = 1;
    } else if (newPlan === "professional") {
      this.currentSubscription.monthlyPriceUsd = 499;
      this.currentSubscription.seatsTotal = 5;
    } else {
      this.currentSubscription.monthlyPriceUsd = 1999;
      this.currentSubscription.seatsTotal = 15;
    }
    return this.currentSubscription;
  }

  public getInvoices(): InvoiceItem[] {
    return Array.from(this.invoices.values());
  }

  // --- Sessions Management ---
  public getActiveSessions(): UserSessionItem[] {
    return Array.from(this.sessions.values());
  }

  public revokeSession(sessionId: string): boolean {
    const sess = this.sessions.get(sessionId);
    if (!sess) return false;
    if (sess.isCurrent) return false; // Cannot revoke own active session
    return this.sessions.delete(sessionId);
  }

  public revokeAllOtherSessions(): number {
    let count = 0;
    for (const [id, sess] of this.sessions.entries()) {
      if (!sess.isCurrent) {
        this.sessions.delete(id);
        count++;
      }
    }
    return count;
  }
}

export const gvceStore = new GVCEDataStore();
