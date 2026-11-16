import {
  sanitizeDealMessage,
  analyzeVerbalTranscript,
  type SanitizeResult,
  type VerbalInterceptionResult,
} from "./sanitizer.ts";

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

export interface ComplianceIncident {
  id: string;
  dealId: string;
  participantAlias: string;
  channel: "chat" | "audio_video";
  violationType: string;
  evasionPattern?: string;
  rawSnippet: string;
  sanitizedSnippet: string;
  actionTaken: "MESSAGE_REDACTED" | "AUTO_MUTE_MICROPHONE" | "BROKER_FLAGGED";
  timestamp: string;
  penaltyNotice: string;
}

// ========================================================
// COMMERCIAL VERIFICATION TYPES (التحقق التجاري)
// ========================================================

export type CommercialVerificationScope =
  | "company_due_diligence"
  | "commodity_documents"
  | "deal_consistency"
  | "counterparty_risk"
  | "full_investigation";

export type CommercialVerificationStatus =
  | "new"
  | "in_review"
  | "needs_info"
  | "completed"
  | "archived";

export type VerificationCheckOutcome =
  | "unverified"             // لم يتم التحقق
  | "data_reviewed"          // تمت مراجعة البيانات
  | "needs_human_review"     // تحتاج مراجعة بشرية
  | "confirmed_from_source"   // تم تأكيدها من المصدر
  | "inconclusive";          // تعذر التحقق

export type CommercialVerificationDecision =
  | "pending"
  | "cleared"
  | "conditional"
  | "rejected"
  | "inconclusive";

export type VerificationAvailabilityMode =
  | "admin_only"             // الإدارة فقط
  | "registered_clients"     // عملاء مسجلون
  | "public_informational";  // صفحة عامة تعريفية

export interface CommercialVerificationDocument {
  id: string;
  caseId: string;
  title: string;
  documentType:
    | "bill_of_lading"
    | "sgs_inspection"
    | "mt700_lc"
    | "commercial_invoice"
    | "certificate_of_origin"
    | "cargo_manifest"
    | "sanctions_check"
    | "corporate_registry"
    | "other";
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  storageKey: string;
  sha256Hash: string;
  extractedFields: Record<string, any>;
  uploadedByUserId?: string;
  uploadedByName?: string;
  createdAt: string;
}

export interface CommercialVerificationCheck {
  id: string;
  caseId: string;
  category:
    | "corporate_registry"
    | "sanctions_pep"
    | "document_consistency"
    | "cargo_specs"
    | "vessel_tracking"
    | "bank_instrument";
  title: string;
  description: string;
  outcomeStatus: VerificationCheckOutcome;
  evidenceSource?: string;
  isExternalProviderConnected: boolean;
  evidenceDate?: string;
  findingsSummary?: string;
  reviewerNotes?: string;
  performedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommercialVerificationAuditItem {
  id: string;
  caseId: string;
  action: string;
  performedByUserId?: string;
  performedByName?: string;
  performedByRole?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface CommercialVerificationCase {
  id: string;
  referenceNumber: string;
  organizationId?: string;
  dealRequestId?: string;
  targetEntityName: string;
  targetEntityType: "company" | "supplier" | "buyer" | "broker";
  countryCode: string;
  scope: CommercialVerificationScope;
  status: CommercialVerificationStatus;
  finalDecision: CommercialVerificationDecision;
  decisionJustification?: string;
  reviewerNotes?: string;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  sharedWithClient: boolean;
  sharedAt?: string;
  commodityDetails?: {
    commodityName?: string;
    sector?: string;
    quantity?: number;
    unit?: string;
    vesselName?: string;
    vesselImo?: string;
    dischargePort?: string;
    loadingPort?: string;
    incoterm?: string;
  };
  partyDetails?: {
    buyerName?: string;
    supplierName?: string;
    brokerName?: string;
    shipperName?: string;
    consigneeName?: string;
  };
  documents: CommercialVerificationDocument[];
  checks: CommercialVerificationCheck[];
  auditLog: CommercialVerificationAuditItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CommercialVerificationSettings {
  currentMode: VerificationAvailabilityMode;
  updatedBy?: string;
  reason?: string;
  updatedAt: string;
}

export interface DealMessage {
  id: string;
  senderAlias: string;
  senderRole: "buyer" | "supplier" | "broker";
  text: string;
  sanitizedText: string;
  contactViolation: boolean;
  evasionDetected?: boolean;
  evasionTypes?: string[];
  riskScore?: "CLEAN" | "LOW" | "HIGH" | "CRITICAL";
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
  complianceIncidents?: ComplianceIncident[];
  auditLog: Array<{ action: string; actor: string; timestamp: string }>;
}

// In-Memory Global Store seeded with operational test deals
class GVCEDataStore {
  private deals: Map<string, DealItem> = new Map();
  private verifications: Map<string, VerificationRecord> = new Map();
  private matches: Map<string, BrokerMatchItem> = new Map();
  private invoices: Map<string, InvoiceItem> = new Map();
  private sessions: Map<string, UserSessionItem> = new Map();
  private commercialVerificationSettings: CommercialVerificationSettings = {
    currentMode: "admin_only",
    reason: "Default system initialization: Restricted to authorized compliance officers and platform administrators.",
    updatedAt: new Date().toISOString(),
  };
  private commercialCases: Map<string, CommercialVerificationCase> = new Map();
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
      reviewerId: "CO-VALOREA-Geneva-11",
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
      reviewerId: "CO-VALOREA-Oslo-04",
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
      reviewerId: "CO-VALOREA-Dubai-09",
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
      reviewerId: "CO-VALOREA-SaoPaulo-02",
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
      reviewerId: "CO-VALOREA-London-07",
      decisionReason: "PEP screening flagged indirect ownership link. Ultimate Beneficial Ownership (UBO) declaration required before approval.",
      documentsSubmitted: ["Trade License Copy", "Intermediary Corporate Chart"],
      expiresAt: "2026-12-31T00:00:00Z",
      updatedAt: "2026-11-13T16:00:00Z",
    });
  }

  private seedDefaultMatches() {
    this.matches.set("match-en590-rotterdam", {
      id: "match-en590-rotterdam",
      reference: "VALOREA-MATCH-2026-EN590-01",
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
      brokerLead: "Broker-VALOREA-Lead",
      createdAt: "2026-11-12T10:00:00Z",
    });

    this.matches.set("match-urea-santos", {
      id: "match-urea-santos",
      reference: "VALOREA-MATCH-2026-UREA-02",
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
      brokerLead: "Broker-VALOREA-Agro",
      createdAt: "2026-11-13T09:30:00Z",
    });

    this.matches.set("match-copper-cathode", {
      id: "match-copper-cathode",
      reference: "VALOREA-MATCH-2026-CU-03",
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
      brokerLead: "Broker-VALOREA-Metals",
      createdAt: "2026-11-13T11:15:00Z",
    });
  }

  private seedDefaultInvoices() {
    this.invoices.set("inv-sub-089", {
      id: "inv-sub-089",
      invoiceNumber: "VALOREA-INV-2026-SUB-089",
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
      pdfUrl: "/invoices/VALOREA-INV-2026-SUB-089.pdf",
    });

    this.invoices.set("inv-sub-076", {
      id: "inv-sub-076",
      invoiceNumber: "VALOREA-INV-2026-SUB-076",
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
      pdfUrl: "/invoices/VALOREA-INV-2026-SUB-076.pdf",
    });

    this.invoices.set("inv-com-042", {
      id: "inv-com-042",
      invoiceNumber: "VALOREA-INV-2026-COM-042",
      type: "commission",
      orgId: "org-norway-refining",
      orgName: "Nordic Refining & Trading AS",
      amount: 231250.00, // 50% share of $462,500 brokerage
      currency: "USD",
      dealReference: "VALOREA-2026-EN590-410",
      status: "due",
      issueDate: "2026-11-13T12:00:00Z",
      dueDate: "2026-11-28T12:00:00Z",
      pdfUrl: "/invoices/VALOREA-INV-2026-COM-042.pdf",
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
      referenceNumber: "VALOREA-2026-EN590-410",
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
      brokerLead: "Broker-VALOREA-Lead",
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
          alias: "Broker-VALOREA-Lead",
          role: "broker",
          orgId: "org-valorea-clearing",
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
        { action: "DEAL_MATCHED", actor: "Broker-VALOREA-Lead", timestamp: "2026-11-13T10:00:00Z" },
        { action: "ROOM_INITIALIZED", actor: "System", timestamp: "2026-11-13T10:05:00Z" },
        { action: "NCNDA_EXECUTED", actor: "Buyer-Alpha-24 & Supplier-Nordic-77", timestamp: "2026-11-13T11:30:00Z" },
      ],
    });

    // Deal 2: Fertilizer - Granular Urea 46% N
    this.deals.set("deal-urea-santos", {
      id: "deal-urea-santos",
      referenceNumber: "VALOREA-2026-UREA-902",
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
      brokerLead: "Broker-VALOREA-Agro",
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
        { action: "BUY_OFFER_MATCHED", actor: "Broker-VALOREA-Agro", timestamp: "2026-11-13T12:00:00Z" },
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
      referenceNumber: `VALOREA-2026-${deal.sector?.toUpperCase().slice(0, 4) || "COMM"}-${Math.floor(100 + Math.random() * 900)}`,
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
      brokerLead: "Broker-VALOREA-Lead",
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
      evasionDetected: sanitized.evasionDetected,
      evasionTypes: sanitized.evasionTypes,
      riskScore: sanitized.riskScore,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC",
    };

    deal.messages.push(msg);

    if (!sanitized.isClean) {
      if (!deal.complianceIncidents) deal.complianceIncidents = [];
      const incident: ComplianceIncident = {
        id: `inc-${Date.now().toString(36)}`,
        dealId,
        participantAlias: senderAlias,
        channel: "chat",
        violationType: sanitized.violations.join(", "),
        evasionPattern: sanitized.evasionTypes?.join(", "),
        rawSnippet: text.slice(0, 150),
        sanitizedSnippet: sanitized.sanitizedText.slice(0, 150),
        actionTaken: "MESSAGE_REDACTED",
        timestamp: new Date().toISOString(),
        penaltyNotice:
          "Liquidated circumvention damages: 3x total anticipated brokerage commission (ICC Model Contract 769 / NCNDA)",
      };
      deal.complianceIncidents.push(incident);
    }

    deal.auditLog.push({
      action: sanitized.isClean
        ? "MESSAGE_DELIVERED"
        : sanitized.evasionDetected
        ? "CIRCUMVENTION_EVASION_INTERCEPTED"
        : "MESSAGE_SANITIZED_VIOLATION",
      actor: senderAlias,
      timestamp: new Date().toISOString(),
    });

    return msg;
  }

  public recordVerbalIncident(
    dealId: string,
    participantAlias: string,
    spokenTranscript: string
  ): {
    incident: ComplianceIncident | null;
    autoMute: boolean;
    violationDetected: boolean;
    alertMessageAr: string;
    alertMessageEn: string;
    strikesCount: number;
    penaltyNotice: string;
  } {
    const deal = this.deals.get(dealId);
    const analysis = analyzeVerbalTranscript(spokenTranscript);

    if (!analysis.isViolation) {
      return {
        incident: null,
        autoMute: false,
        violationDetected: false,
        alertMessageAr: "الحديث سليم ومتوافق مع قواعد الوساطة.",
        alertMessageEn: "Verbal stream complies with brokerage rules.",
        strikesCount: 0,
        penaltyNotice: analysis.legalClauseNotice,
      };
    }

    let incident: ComplianceIncident | null = null;
    if (deal) {
      if (!deal.complianceIncidents) deal.complianceIncidents = [];
      incident = {
        id: `v-inc-${Date.now().toString(36)}`,
        dealId,
        participantAlias,
        channel: "audio_video",
        violationType: analysis.detectedCategories.join(", "),
        rawSnippet: spokenTranscript.slice(0, 150),
        sanitizedSnippet: "[VERBAL CONTACT ATTEMPT MUTED IN REAL TIME]",
        actionTaken: "AUTO_MUTE_MICROPHONE",
        timestamp: new Date().toISOString(),
        penaltyNotice: analysis.legalClauseNotice,
      };
      deal.complianceIncidents.push(incident);

      deal.auditLog.push({
        action: "AUDIO_SPEECH_LEAK_INTERCEPTED_AUTO_MUTE",
        actor: participantAlias,
        timestamp: new Date().toISOString(),
      });
    }

    const strikesCount = deal
      ? (deal.complianceIncidents || []).filter((i) => i.participantAlias === participantAlias).length
      : 1;

    return {
      incident,
      autoMute: true,
      violationDetected: true,
      alertMessageAr: analysis.warningMessageAr,
      alertMessageEn: analysis.warningMessageEn,
      strikesCount,
      penaltyNotice: analysis.legalClauseNotice,
    };
  }

  public getComplianceIncidents(dealId: string): ComplianceIncident[] {
    const deal = this.deals.get(dealId);
    return deal?.complianceIncidents || [];
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

  public revokeSession(sessionId: string, requesterUserId?: string, isPlatformAdmin?: boolean): boolean {
    const sess = this.sessions.get(sessionId);
    if (!sess) return false;
    if (sess.isCurrent) return false; // Cannot revoke own active session
    // IDOR Protection: Prevent users from revoking sessions belonging to other accounts
    if (requesterUserId && !isPlatformAdmin && sess.userId !== requesterUserId) {
      return false;
    }
    return this.sessions.delete(sessionId);
  }

  public revokeAllOtherSessions(requesterUserId?: string, isPlatformAdmin?: boolean): number {
    let count = 0;
    for (const [id, sess] of this.sessions.entries()) {
      if (!sess.isCurrent) {
        if (!requesterUserId || isPlatformAdmin || sess.userId === requesterUserId) {
          this.sessions.delete(id);
          count++;
        }
      }
    }
    return count;
  }

  // ========================================================
  // COMMERCIAL VERIFICATION METHODS (التحقق التجاري)
  // ========================================================

  public getCommercialVerificationSettings(): CommercialVerificationSettings {
    return { ...this.commercialVerificationSettings };
  }

  public setCommercialVerificationMode(
    mode: VerificationAvailabilityMode,
    updatedBy: string,
    reason?: string
  ): CommercialVerificationSettings {
    this.commercialVerificationSettings = {
      currentMode: mode,
      updatedBy,
      reason: reason || `Availability mode updated to ${mode}`,
      updatedAt: new Date().toISOString(),
    };

    // Log this system-wide action in audit log
    this.addCommercialAuditLog(
      "system-settings",
      "MODE_CHANGED",
      { id: updatedBy, name: updatedBy, role: "platform_admin" },
      { newMode: mode, reason }
    );

    return { ...this.commercialVerificationSettings };
  }

  public getCommercialCases(options?: {
    orgId?: string;
    role?: string;
    search?: string;
    status?: string;
    country?: string;
    scope?: string;
    currentAvailabilityMode?: VerificationAvailabilityMode;
  }): CommercialVerificationCase[] {
    const isExecutive =
      options?.role === "platform_admin" ||
      options?.role === "compliance_officer" ||
      options?.role === "broker";

    let list = Array.from(this.commercialCases.values());

    // Multi-tenant isolation: If not executive, strictly filter by client's own organization
    if (!isExecutive) {
      if (!options?.orgId) {
        return [];
      }
      list = list.filter(
        (c) => c.organizationId === options.orgId && (c.sharedWithClient || c.status === "new")
      );
    }

    // Filter by Status
    if (options?.status && options.status !== "all") {
      list = list.filter((c) => c.status === options.status);
    }

    // Filter by Country
    if (options?.country && options.country !== "all") {
      list = list.filter((c) => c.countryCode.toLowerCase() === options.country?.toLowerCase());
    }

    // Filter by Scope
    if (options?.scope && options.scope !== "all") {
      list = list.filter((c) => c.scope === options.scope);
    }

    // Filter by Search (Entity name, Reference number, Reviewer, Cargo)
    if (options?.search && options.search.trim() !== "") {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.targetEntityName.toLowerCase().includes(q) ||
          c.referenceNumber.toLowerCase().includes(q) ||
          (c.assignedReviewerName && c.assignedReviewerName.toLowerCase().includes(q)) ||
          (c.commodityDetails?.commodityName && c.commodityDetails.commodityName.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getCommercialCase(
    caseId: string,
    options?: { orgId?: string; role?: string }
  ): CommercialVerificationCase | null {
    const item = this.commercialCases.get(caseId);
    if (!item) return null;

    const isExecutive =
      options?.role === "platform_admin" ||
      options?.role === "compliance_officer" ||
      options?.role === "broker";

    // Multi-tenant check
    if (!isExecutive && item.organizationId !== options?.orgId) {
      return null;
    }

    return item;
  }

  public createCommercialCase(
    data: {
      targetEntityName: string;
      targetEntityType: "company" | "supplier" | "buyer" | "broker";
      countryCode: string;
      scope?: CommercialVerificationScope;
      organizationId?: string;
      dealRequestId?: string;
      assignedReviewerId?: string;
      assignedReviewerName?: string;
      commodityDetails?: CommercialVerificationCase["commodityDetails"];
      partyDetails?: CommercialVerificationCase["partyDetails"];
    },
    actor: { id: string; name: string; role: string }
  ): CommercialVerificationCase {
    const id = `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `CV-${new Date().getFullYear()}-${randomSeq}`;
    const now = new Date().toISOString();

    // Standard investigative check categories initialized to "unverified"
    const standardChecks: CommercialVerificationCheck[] = [
      {
        id: `chk-corp-${id}`,
        caseId: id,
        category: "corporate_registry",
        title: "National Corporate Registry & Legal Standing",
        description: "Verification of entity incorporation, active legal status, and official extract validity.",
        outcomeStatus: "unverified",
        evidenceSource: "Official National Registry",
        isExternalProviderConnected: false,
        findingsSummary: "Awaiting official certified extract or manual registry search confirmation.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `chk-sanc-${id}`,
        caseId: id,
        category: "sanctions_pep",
        title: "International Sanctions & PEP Watchlist Screening",
        description: "Screening of company, directors, and ultimate beneficial owners against OFAC, EU, UN, and UK sanctions.",
        outcomeStatus: "unverified",
        evidenceSource: "OFAC / UN / EU Consolidated Lists",
        isExternalProviderConnected: false,
        findingsSummary: "Screening against target entity and declared beneficial owners pending compliance cross-check.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `chk-doc-${id}`,
        caseId: id,
        category: "document_consistency",
        title: "Cross-Document Data Consistency Matrix",
        description: "Algorithmic and manual cross-matching of vessel IMO, quantities, ports, and parties across trade documents.",
        outcomeStatus: "unverified",
        evidenceSource: "VALOREA Cross-Document Consistency Engine",
        isExternalProviderConnected: true,
        findingsSummary: "Awaiting document uploads (B/L, SGS, LC, Invoice) for cross-field consistency verification.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `chk-spec-${id}`,
        caseId: id,
        category: "cargo_specs",
        title: "Commodity Quality & Inspection Specifications",
        description: "Verification of laboratory analysis parameters (density, sulfur, moisture, ASTM standards) from accredited surveyors.",
        outcomeStatus: "unverified",
        evidenceSource: "Accredited Surveyor (SGS / Saybolt / Intertek)",
        isExternalProviderConnected: false,
        findingsSummary: "Certificate of Analysis / Inspection report verification pending direct surveyor confirmation.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `chk-vsl-${id}`,
        caseId: id,
        category: "vessel_tracking",
        title: "Maritime Vessel Tracking & Voyage History",
        description: "Verification of vessel IMO, flag, AIS tracking, and past calls to sanctioned ports.",
        outcomeStatus: "unverified",
        evidenceSource: "Satellite AIS / Lloyd's Maritime Registry",
        isExternalProviderConnected: false,
        findingsSummary: "Live satellite AIS position and historical voyage log pending manual maritime registry verification.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `chk-bank-${id}`,
        caseId: id,
        category: "bank_instrument",
        title: "Financial Instrument & Documentary Credit (MT700 LC)",
        description: "Verification of Letter of Credit terms, issuing bank SWIFT routing, and conformity with UCP 600 rules.",
        outcomeStatus: "unverified",
        evidenceSource: "SWIFT MT700 / Issuing Bank Verification",
        isExternalProviderConnected: false,
        findingsSummary: "Documentary credit consistency check pending advising bank validation.",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const newCase: CommercialVerificationCase = {
      id,
      referenceNumber,
      organizationId: data.organizationId,
      dealRequestId: data.dealRequestId,
      targetEntityName: data.targetEntityName,
      targetEntityType: data.targetEntityType,
      countryCode: data.countryCode.toUpperCase(),
      scope: data.scope || "full_investigation",
      status: "new",
      finalDecision: "pending",
      assignedReviewerId: data.assignedReviewerId || actor.id,
      assignedReviewerName: data.assignedReviewerName || actor.name,
      sharedWithClient: false,
      commodityDetails: data.commodityDetails,
      partyDetails: data.partyDetails,
      documents: [],
      checks: standardChecks,
      auditLog: [
        {
          id: `aud-${Date.now()}-1`,
          caseId: id,
          action: "CASE_CREATED",
          performedByUserId: actor.id,
          performedByName: actor.name,
          performedByRole: actor.role,
          details: {
            targetEntityName: data.targetEntityName,
            countryCode: data.countryCode,
            scope: data.scope || "full_investigation",
          },
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.commercialCases.set(id, newCase);
    return newCase;
  }

  public updateCommercialCase(
    caseId: string,
    updates: Partial<CommercialVerificationCase>,
    actor: { id: string; name: string; role: string }
  ): CommercialVerificationCase | null {
    const existing = this.commercialCases.get(caseId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: CommercialVerificationCase = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    updated.auditLog.unshift({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      caseId,
      action: "CASE_UPDATED",
      performedByUserId: actor.id,
      performedByName: actor.name,
      performedByRole: actor.role,
      details: updates,
      createdAt: now,
    });

    this.commercialCases.set(caseId, updated);
    return updated;
  }

  public addCommercialDocument(
    caseId: string,
    docData: Omit<CommercialVerificationDocument, "id" | "caseId" | "createdAt">,
    actor: { id: string; name: string; role: string }
  ): CommercialVerificationDocument | null {
    const targetCase = this.commercialCases.get(caseId);
    if (!targetCase) return null;

    const now = new Date().toISOString();
    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newDoc: CommercialVerificationDocument = {
      id: docId,
      caseId,
      title: docData.title,
      documentType: docData.documentType,
      fileName: docData.fileName,
      fileSizeBytes: docData.fileSizeBytes,
      mimeType: docData.mimeType,
      storageKey: docData.storageKey,
      sha256Hash: docData.sha256Hash,
      extractedFields: docData.extractedFields || {},
      uploadedByUserId: actor.id,
      uploadedByName: actor.name,
      createdAt: now,
    };

    targetCase.documents.push(newDoc);
    targetCase.updatedAt = now;

    // Transition case from 'new' to 'in_review' if still 'new'
    if (targetCase.status === "new") {
      targetCase.status = "in_review";
    }

    targetCase.auditLog.unshift({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      caseId,
      action: "DOCUMENT_UPLOADED",
      performedByUserId: actor.id,
      performedByName: actor.name,
      performedByRole: actor.role,
      details: {
        docId,
        title: newDoc.title,
        documentType: newDoc.documentType,
        sha256Hash: newDoc.sha256Hash,
      },
      createdAt: now,
    });

    return newDoc;
  }

  public updateCommercialCheck(
    caseId: string,
    checkId: string,
    updates: Partial<CommercialVerificationCheck>,
    actor: { id: string; name: string; role: string }
  ): CommercialVerificationCheck | null {
    const targetCase = this.commercialCases.get(caseId);
    if (!targetCase) return null;

    const check = targetCase.checks.find((c) => c.id === checkId);
    if (!check) return null;

    const now = new Date().toISOString();
    Object.assign(check, updates, { updatedAt: now, performedBy: actor.name });
    targetCase.updatedAt = now;

    targetCase.auditLog.unshift({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      caseId,
      action: "CHECK_UPDATED",
      performedByUserId: actor.id,
      performedByName: actor.name,
      performedByRole: actor.role,
      details: {
        checkId,
        category: check.category,
        outcomeStatus: check.outcomeStatus,
        findingsSummary: check.findingsSummary,
      },
      createdAt: now,
    });

    return check;
  }

  public makeCaseDecision(
    caseId: string,
    data: {
      decision: CommercialVerificationDecision;
      justification: string;
      reviewerNotes?: string;
      shareWithClient: boolean;
      status?: CommercialVerificationStatus;
    },
    actor: { id: string; name: string; role: string }
  ): CommercialVerificationCase | null {
    const targetCase = this.commercialCases.get(caseId);
    if (!targetCase) return null;

    const now = new Date().toISOString();
    targetCase.finalDecision = data.decision;
    targetCase.decisionJustification = data.justification;
    if (data.reviewerNotes !== undefined) {
      targetCase.reviewerNotes = data.reviewerNotes;
    }
    targetCase.sharedWithClient = data.shareWithClient;
    if (data.shareWithClient && !targetCase.sharedAt) {
      targetCase.sharedAt = now;
    }
    targetCase.status = data.status || (data.decision === "pending" ? "in_review" : "completed");
    targetCase.updatedAt = now;

    targetCase.auditLog.unshift({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      caseId,
      action: "DECISION_MADE",
      performedByUserId: actor.id,
      performedByName: actor.name,
      performedByRole: actor.role,
      details: {
        decision: data.decision,
        sharedWithClient: data.shareWithClient,
        justificationSnippet: data.justification.substring(0, 100),
      },
      createdAt: now,
    });

    return targetCase;
  }

  public addCommercialAuditLog(
    caseId: string,
    action: string,
    actor: { id: string; name: string; role: string },
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ): CommercialVerificationAuditItem {
    const now = new Date().toISOString();
    const auditItem: CommercialVerificationAuditItem = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      caseId,
      action,
      performedByUserId: actor.id,
      performedByName: actor.name,
      performedByRole: actor.role,
      details,
      ipAddress,
      userAgent,
      createdAt: now,
    };

    const targetCase = this.commercialCases.get(caseId);
    if (targetCase) {
      targetCase.auditLog.unshift(auditItem);
    }

    return auditItem;
  }

  /**
   * Cross-Document Data Consistency Engine
   * Compares extracted parameters across Bills of Lading, SGS Inspection, LC (MT700), and Commercial Invoice.
   */
  public calculateCrossDocumentConsistency(caseId: string): Array<{
    field: string;
    fieldAr: string;
    status: "match" | "discrepancy" | "pending_documents";
    documentsCompared: string[];
    values: Record<string, string>;
    notes: string;
  }> {
    const targetCase = this.commercialCases.get(caseId);
    if (!targetCase || targetCase.documents.length === 0) {
      return [
        {
          field: "Vessel Name & IMO",
          fieldAr: "اسم الناقلة ورقم IMO",
          status: "pending_documents",
          documentsCompared: [],
          values: {},
          notes: "بانتظار رفع بوليصة الشحن (B/L) وشهادة الفحص (SGS) لإجراء المطابقة الآلية.",
        },
        {
          field: "Cargo Net Quantity & Tolerance",
          fieldAr: "كمية الشحنة الصافية ونسبة التفاوت",
          status: "pending_documents",
          documentsCompared: [],
          values: {},
          notes: "بانتظار رفع الفاتورة التجارية وبوليصة الشحن.",
        },
        {
          field: "Port of Loading & Discharge",
          fieldAr: "ميناء الشحن والتفريغ",
          status: "pending_documents",
          documentsCompared: [],
          values: {},
          notes: "بانتظار مطابقة شروط الاعتماد المستندي (LC) مع بيانات الناقلة.",
        },
        {
          field: "Consignee & Shipper Identities",
          fieldAr: "بيانات المرسل والمرسل إليه",
          status: "pending_documents",
          documentsCompared: [],
          values: {},
          notes: "بانتظار فحص تطابق الأطراف التجارية في مستندات التداول.",
        },
      ];
    }

    // Examine extracted fields in attached documents
    const docMap = new Map<string, Record<string, any>>();
    for (const doc of targetCase.documents) {
      docMap.set(doc.documentType, doc.extractedFields || {});
    }

    const bl = docMap.get("bill_of_lading");
    const sgs = docMap.get("sgs_inspection");
    const inv = docMap.get("commercial_invoice");
    const lc = docMap.get("mt700_lc");

    const results: Array<{
      field: string;
      fieldAr: string;
      status: "match" | "discrepancy" | "pending_documents";
      documentsCompared: string[];
      values: Record<string, string>;
      notes: string;
    }> = [];

    // 1. Vessel Comparison
    const vesselValues: Record<string, string> = {};
    if (bl?.vesselName) vesselValues["Bill of Lading"] = `${bl.vesselName} (IMO: ${bl.vesselImo || "N/A"})`;
    if (sgs?.vesselName) vesselValues["SGS Inspection"] = `${sgs.vesselName} (IMO: ${sgs.vesselImo || "N/A"})`;
    if (Object.keys(vesselValues).length < 2) {
      results.push({
        field: "Vessel Name & IMO",
        fieldAr: "اسم الناقلة ورقم IMO",
        status: "pending_documents",
        documentsCompared: Object.keys(vesselValues),
        values: vesselValues,
        notes: "يتطلب وثيقتين على الأقل (B/L و SGS) للتحقق من تطابق الناقلة.",
      });
    } else {
      const match =
        bl?.vesselName?.toLowerCase().trim() === sgs?.vesselName?.toLowerCase().trim() &&
        (!bl?.vesselImo || !sgs?.vesselImo || bl.vesselImo === sgs.vesselImo);
      results.push({
        field: "Vessel Name & IMO",
        fieldAr: "اسم الناقلة ورقم IMO",
        status: match ? "match" : "discrepancy",
        documentsCompared: Object.keys(vesselValues),
        values: vesselValues,
        notes: match
          ? "تطابق تام في اسم الناقلة ورقم المنظمة البحرية الدولية (IMO) بين البوليصة وتقرير الفحص."
          : "⚠️ تعارض في اسم الناقلة أو رقم IMO بين بوليصة الشحن وشهادة الفحص!",
      });
    }

    // 2. Quantity Comparison
    const qtyValues: Record<string, string> = {};
    if (bl?.quantity) qtyValues["Bill of Lading"] = `${bl.quantity} ${bl.unit || "MT"}`;
    if (sgs?.quantity) qtyValues["SGS Inspection"] = `${sgs.quantity} ${sgs.unit || "MT"}`;
    if (inv?.quantity) qtyValues["Commercial Invoice"] = `${inv.quantity} ${inv.unit || "MT"}`;
    if (Object.keys(qtyValues).length < 2) {
      results.push({
        field: "Cargo Net Quantity & Tolerance",
        fieldAr: "كمية الشحنة الصافية ونسبة التفاوت",
        status: "pending_documents",
        documentsCompared: Object.keys(qtyValues),
        values: qtyValues,
        notes: "بانتظار مستندات إضافية لمقارنة الكميات.",
      });
    } else {
      const nums = Object.values(qtyValues).map((v) => parseFloat(v));
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      // Tolerance allowed in bulk commodity trade is usually 0.5% - 2%
      const diffPercent = min > 0 ? ((max - min) / min) * 100 : 0;
      const match = diffPercent <= 2.0;
      results.push({
        field: "Cargo Net Quantity & Tolerance",
        fieldAr: "كمية الشحنة الصافية ونسبة التفاوت",
        status: match ? "match" : "discrepancy",
        documentsCompared: Object.keys(qtyValues),
        values: qtyValues,
        notes: match
          ? `الكميات متسقة ضمن حدود التفاوت الملاحي المسموح به (${diffPercent.toFixed(2)}% فرق).`
          : `⚠️ فرق غير مبرر في الكميات يتجاوز نسبة التفاوت الملاحي (${diffPercent.toFixed(2)}%). يتطلب مراجعة بشرية.`,
      });
    }

    // 3. Ports Comparison
    const portValues: Record<string, string> = {};
    if (bl?.dischargePort) portValues["Bill of Lading"] = `Discharge: ${bl.dischargePort}`;
    if (lc?.dischargePort) portValues["Letter of Credit"] = `Discharge: ${lc.dischargePort}`;
    if (Object.keys(portValues).length < 2) {
      results.push({
        field: "Port of Discharge",
        fieldAr: "ميناء التفريغ",
        status: "pending_documents",
        documentsCompared: Object.keys(portValues),
        values: portValues,
        notes: "يتطلب بوليصة الشحن وشروط الاعتماد المستندي لمقارنة ميناء الوصول.",
      });
    } else {
      const match = bl?.dischargePort?.toLowerCase().trim() === lc?.dischargePort?.toLowerCase().trim();
      results.push({
        field: "Port of Discharge",
        fieldAr: "ميناء التفريغ",
        status: match ? "match" : "discrepancy",
        documentsCompared: Object.keys(portValues),
        values: portValues,
        notes: match
          ? "تطابق ميناء التفريغ المعتمد في الاعتماد المستندي مع بوليصة الشحن."
          : "⚠️ تعارض في ميناء التفريغ بين الاعتماد المستندي وبوليصة الشحن!",
      });
    }

    return results;
  }
}

export const gvceStore = new GVCEDataStore();
export const valoreaStore = gvceStore;
