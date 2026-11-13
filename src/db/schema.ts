// GVCE Database Schema - Drizzle ORM for PostgreSQL
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ========================
// ENUMS
// ========================

export const languageEnum = pgEnum("language", [
  "ar", "fr", "en", "es", "zh-Hans", "ja", "de", "ru",
]);

export const userRoleEnum = pgEnum("user_role", [
  "owner", "admin", "member", "viewer",
]);

export const platformRoleEnum = pgEnum("platform_role", [
  "buyer", "supplier", "broker", "compliance_officer", "platform_admin",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "starter", "professional", "enterprise",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active", "past_due", "canceled", "expired", "trialing",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "incomplete", "pending_review", "additional_info_required",
  "approved", "rejected", "expired", "suspended",
]);

export const dealStatusEnum = pgEnum("deal_status", [
  "draft", "open", "matched", "negotiating", "agreed",
  "completed", "canceled", "expired",
]);

export const dealSideEnum = pgEnum("deal_side", ["buy", "sell"]);

export const documentAccessEnum = pgEnum("document_access", [
  "owner_only", "redacted_preview", "download_approved", "revoked",
]);

export const commissionStatusEnum = pgEnum("commission_status", [
  "pending", "due", "invoiced", "paid", "waived",
]);

export const incotermEnum = pgEnum("incoterm", [
  "EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP",
  "DAP", "DPU", "DDP",
]);

export const sectorEnum = pgEnum("sector", [
  "crude_oil_condensates",
  "refined_petroleum",
  "natural_gas_ngls",
  "petrochemicals",
  "sulfur_fertilizers",
  "metals_industrial",
  "sugar",
]);

// ========================
// USERS & ORGANIZATIONS
// ========================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash"),
  preferredLanguage: languageEnum("preferred_language").default("en"),
  preferredCurrency: varchar("preferred_currency", { length: 3 }).default("USD"),
  timezone: varchar("timezone", { length: 64 }).default("UTC"),
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: text("mfa_secret"),
  webauthnCredentials: jsonb("webauthn_credentials"),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  lastLoginIp: varchar("last_login_ip", { length: 45 }),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("users_email_idx").on(table.email),
]);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  legalName: varchar("legal_name", { length: 512 }).notNull(),
  tradeName: varchar("trade_name", { length: 512 }),
  registrationNumber: varchar("registration_number", { length: 128 }),
  country: varchar("country", { length: 2 }).notNull(), // ISO 3166-1 alpha-2
  city: varchar("city", { length: 255 }),
  address: text("address"),
  industry: text("industry"),
  website: varchar("website", { length: 512 }),
  logoUrl: varchar("logo_url", { length: 1024 }),
  preferredCurrency: varchar("preferred_currency", { length: 3 }).default("USD"),
  verificationStatus: verificationStatusEnum("verification_status").default("incomplete"),
  verificationScope: text("verification_scope"),
  verificationExpiresAt: timestamp("verification_expires_at", { withTimezone: true }),
  verificationReviewerId: uuid("verification_reviewer_id"),
  verificationDecisionReason: text("verification_decision_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("orgs_country_idx").on(table.country),
  index("orgs_verification_idx").on(table.verificationStatus),
]);

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: userRoleEnum("role").default("member"),
  platformRole: platformRoleEnum("platform_role").notNull(),
  isLegalRepresentative: boolean("is_legal_representative").default(false),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("org_member_unique").on(table.organizationId, table.userId),
  index("org_members_org_idx").on(table.organizationId),
  index("org_members_user_idx").on(table.userId),
]);

// ========================
// SUBSCRIPTIONS & BILLING
// ========================

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  plan: subscriptionPlanEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  billingCycle: varchar("billing_cycle", { length: 10 }).notNull(), // monthly | annual
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  maxDeals: integer("max_deals").default(0),
  maxSeats: integer("max_seats").default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("subs_org_idx").on(table.organizationId),
  index("subs_stripe_idx").on(table.stripeSubscriptionId),
]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  type: varchar("type", { length: 20 }).notNull(), // subscription | commission
  amountUsd: decimal("amount_usd", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  exchangeRate: decimal("exchange_rate", { precision: 12, scale: 6 }),
  exchangeRateDate: timestamp("exchange_rate_date", { withTimezone: true }),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  dueAt: timestamp("due_at", { withTimezone: true }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ========================
// COMMODITY CATALOG
// ========================

export const commoditySectors = pgTable("commodity_sectors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  sector: sectorEnum("sector").notNull(),
  iconUrl: varchar("icon_url", { length: 512 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const commoditySectorTranslations = pgTable("commodity_sector_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectorId: uuid("sector_id").notNull().references(() => commoditySectors.id),
  language: languageEnum("language").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
}, (table) => [
  uniqueIndex("sector_trans_unique").on(table.sectorId, table.language),
]);

export const commodityMaterials = pgTable("commodity_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectorId: uuid("sector_id").notNull().references(() => commoditySectors.id),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  specFields: jsonb("spec_fields"), // JSON schema for material-specific fields
  requiredDocuments: jsonb("required_documents"),
  defaultUnit: varchar("default_unit", { length: 32 }),
  defaultPricingBasis: varchar("default_pricing_basis", { length: 64 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("materials_sector_idx").on(table.sectorId),
]);

export const commodityMaterialTranslations = pgTable("commodity_material_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  materialId: uuid("material_id").notNull().references(() => commodityMaterials.id),
  language: languageEnum("language").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  synonyms: text("synonyms"), // comma-separated for search
  description: text("description"),
  specifications: text("specifications"),
}, (table) => [
  uniqueIndex("material_trans_unique").on(table.materialId, table.language),
]);

export const commodityGrades = pgTable("commodity_grades", {
  id: uuid("id").primaryKey().defaultRandom(),
  materialId: uuid("material_id").notNull().references(() => commodityMaterials.id),
  slug: varchar("slug", { length: 128 }).notNull(),
  specValues: jsonb("spec_values"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("grades_material_idx").on(table.materialId),
  uniqueIndex("grade_slug_unique").on(table.materialId, table.slug),
]);

export const commodityGradeTranslations = pgTable("commodity_grade_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  gradeId: uuid("grade_id").notNull().references(() => commodityGrades.id),
  language: languageEnum("language").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
}, (table) => [
  uniqueIndex("grade_trans_unique").on(table.gradeId, table.language),
]);

// ========================
// DEALS & MATCHING
// ========================

export const dealRequests = pgTable("deal_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceNumber: varchar("reference_number", { length: 32 }).notNull().unique(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  createdByUserId: uuid("created_by_user_id").notNull().references(() => users.id),
  side: dealSideEnum("side").notNull(),
  sectorId: uuid("sector_id").notNull().references(() => commoditySectors.id),
  materialId: uuid("material_id").notNull().references(() => commodityMaterials.id),
  gradeId: uuid("grade_id").references(() => commodityGrades.id),
  quantity: decimal("quantity", { precision: 18, scale: 4 }).notNull(),
  quantityUnit: varchar("quantity_unit", { length: 32 }).notNull(),
  priceAmount: decimal("price_amount", { precision: 18, scale: 4 }),
  priceCurrency: varchar("price_currency", { length: 3 }).default("USD"),
  priceUsdEquivalent: decimal("price_usd_equivalent", { precision: 18, scale: 4 }),
  exchangeRate: decimal("exchange_rate", { precision: 12, scale: 6 }),
  exchangeRateSource: varchar("exchange_rate_source", { length: 128 }),
  exchangeRateDate: timestamp("exchange_rate_date", { withTimezone: true }),
  pricingBasis: varchar("pricing_basis", { length: 128 }),
  incoterm: incotermEnum("incoterm"),
  incotermPlace: varchar("incoterm_place", { length: 255 }),
  originCountry: varchar("origin_country", { length: 2 }),
  destinationCountry: varchar("destination_country", { length: 2 }),
  deliveryPort: varchar("delivery_port", { length: 255 }),
  deliveryDateFrom: timestamp("delivery_date_from", { withTimezone: true }),
  deliveryDateTo: timestamp("delivery_date_to", { withTimezone: true }),
  transportMode: varchar("transport_mode", { length: 32 }),
  specValues: jsonb("spec_values"),
  additionalNotes: text("additional_notes"),
  status: dealStatusEnum("status").default("draft"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("deals_org_idx").on(table.organizationId),
  index("deals_material_idx").on(table.materialId),
  index("deals_status_idx").on(table.status),
  index("deals_side_idx").on(table.side),
]);

export const dealMatches = pgTable("deal_matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyRequestId: uuid("buy_request_id").notNull().references(() => dealRequests.id),
  sellRequestId: uuid("sell_request_id").notNull().references(() => dealRequests.id),
  brokerId: uuid("broker_id").notNull().references(() => users.id),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }),
  matchReasons: jsonb("match_reasons"),
  specDifferences: jsonb("spec_differences"),
  status: varchar("status", { length: 32 }).notNull().default("proposed"),
  complianceCheckStatus: varchar("compliance_check_status", { length: 32 }).default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("matches_buy_idx").on(table.buyRequestId),
  index("matches_sell_idx").on(table.sellRequestId),
  uniqueIndex("match_pair_unique").on(table.buyRequestId, table.sellRequestId),
]);

// ========================
// DEAL ROOMS
// ========================

export const dealRooms = pgTable("deal_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").notNull().references(() => dealMatches.id),
  roomCode: varchar("room_code", { length: 32 }).notNull().unique(),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const dealRoomParticipants = pgTable("deal_room_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealRoomId: uuid("deal_room_id").notNull().references(() => dealRooms.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  alias: varchar("alias", { length: 128 }).notNull(),
  role: varchar("role", { length: 32 }).notNull(), // buyer | supplier | broker
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  removedAt: timestamp("removed_at", { withTimezone: true }),
}, (table) => [
  uniqueIndex("room_participant_unique").on(table.dealRoomId, table.userId),
  index("room_participants_room_idx").on(table.dealRoomId),
]);

export const dealRoomMessages = pgTable("deal_room_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealRoomId: uuid("deal_room_id").notNull().references(() => dealRooms.id),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  senderAlias: varchar("sender_alias", { length: 128 }).notNull(),
  content: text("content").notNull(),
  contentSanitized: text("content_sanitized"),
  contactInfoDetected: boolean("contact_info_detected").default(false),
  messageType: varchar("message_type", { length: 32 }).default("text"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("messages_room_idx").on(table.dealRoomId),
  index("messages_created_idx").on(table.createdAt),
]);

// ========================
// MEETINGS (LiveKit)
// ========================

export const meetings = pgTable("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealRoomId: uuid("deal_room_id").notNull().references(() => dealRooms.id),
  title: varchar("title", { length: 255 }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  scheduledDuration: integer("scheduled_duration"), // minutes
  livekitRoomName: varchar("livekit_room_name", { length: 128 }),
  e2eeEnabled: boolean("e2ee_enabled").default(true),
  recordingEnabled: boolean("recording_enabled").default(false),
  screenShareEnabled: boolean("screen_share_enabled").default(false),
  status: varchar("status", { length: 32 }).default("scheduled"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("meetings_room_idx").on(table.dealRoomId),
  index("meetings_scheduled_idx").on(table.scheduledAt),
]);

// ========================
// DOCUMENTS
// ========================

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerOrganizationId: uuid("owner_organization_id").notNull().references(() => organizations.id),
  uploadedByUserId: uuid("uploaded_by_user_id").notNull().references(() => users.id),
  dealRoomId: uuid("deal_room_id").references(() => dealRooms.id),
  isComplianceDoc: boolean("is_compliance_doc").default(false),
  documentType: varchar("document_type", { length: 128 }).notNull(),
  originalFilename: varchar("original_filename", { length: 512 }).notNull(),
  storagePath: varchar("storage_path", { length: 1024 }).notNull(),
  redactedStoragePath: varchar("redacted_storage_path", { length: 1024 }),
  mimeType: varchar("mime_type", { length: 128 }),
  fileSize: integer("file_size"),
  virusScanStatus: varchar("virus_scan_status", { length: 32 }).default("pending"),
  virusScanAt: timestamp("virus_scan_at", { withTimezone: true }),
  version: integer("version").default(1),
  replacedById: uuid("replaced_by_id"),
  language: languageEnum("language"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("docs_owner_idx").on(table.ownerOrganizationId),
  index("docs_deal_idx").on(table.dealRoomId),
  index("docs_compliance_idx").on(table.isComplianceDoc),
]);

export const documentAccessGrants = pgTable("document_access_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  grantedToUserId: uuid("granted_to_user_id").notNull().references(() => users.id),
  grantedToOrganizationId: uuid("granted_to_organization_id").notNull().references(() => organizations.id),
  grantedByUserId: uuid("granted_by_user_id").notNull().references(() => users.id),
  accessLevel: documentAccessEnum("access_level").notNull(),
  allowOriginal: boolean("allow_original").default(false),
  requiresIdentityDisclosure: boolean("requires_identity_disclosure").default(false),
  identityDisclosed: boolean("identity_disclosed").default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  revokedByUserId: uuid("revoked_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("doc_grants_doc_idx").on(table.documentId),
  index("doc_grants_user_idx").on(table.grantedToUserId),
]);

export const documentDownloads = pgTable("document_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  grantId: uuid("grant_id").notNull().references(() => documentAccessGrants.id),
  downloadedByUserId: uuid("downloaded_by_user_id").notNull().references(() => users.id),
  version: integer("version").notNull(),
  wasOriginal: boolean("was_original").default(false),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  downloadedAt: timestamp("downloaded_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("downloads_doc_idx").on(table.documentId),
  index("downloads_user_idx").on(table.downloadedByUserId),
]);

// ========================
// AGREEMENTS
// ========================

export const agreementTemplates = pgTable("agreement_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 64 }).notNull(), // confidentiality | non_circumvention | brokerage
  version: integer("version").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("agreement_tpl_unique").on(table.type, table.version),
]);

export const agreementTemplateTranslations = pgTable("agreement_template_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id").notNull().references(() => agreementTemplates.id),
  language: languageEnum("language").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  body: text("body").notNull(),
  isAuthoritative: boolean("is_authoritative").default(false),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedByUserId: uuid("reviewed_by_user_id"),
}, (table) => [
  uniqueIndex("agreement_tpl_trans_unique").on(table.templateId, table.language),
]);

export const agreementAcceptances = pgTable("agreement_acceptances", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id").notNull().references(() => agreementTemplates.id),
  dealRoomId: uuid("deal_room_id").references(() => dealRooms.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  templateVersion: integer("template_version").notNull(),
  acceptedLanguage: languageEnum("accepted_language").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("acceptances_deal_idx").on(table.dealRoomId),
  index("acceptances_user_idx").on(table.userId),
]);

// ========================
// COMMISSIONS
// ========================

export const commissions = pgTable("commissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealRoomId: uuid("deal_room_id").notNull().references(() => dealRooms.id),
  obligorOrganizationId: uuid("obligor_organization_id").notNull().references(() => organizations.id),
  amountUsd: decimal("amount_usd", { precision: 12, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  triggerEvent: varchar("trigger_event", { length: 128 }).notNull(),
  triggerEvidence: text("trigger_evidence"),
  status: commissionStatusEnum("status").default("pending"),
  invoiceId: uuid("invoice_id").references(() => invoices.id),
  dueAt: timestamp("due_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("commissions_deal_idx").on(table.dealRoomId),
  index("commissions_org_idx").on(table.obligorOrganizationId),
]);

// ========================
// VERIFICATION (KYC/KYB)
// ========================

export const verificationRecords = pgTable("verification_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").references(() => users.id),
  type: varchar("type", { length: 32 }).notNull(), // kyc | kyb | deal_specific
  dealRequestId: uuid("deal_request_id").references(() => dealRequests.id),
  status: verificationStatusEnum("status").default("incomplete"),
  providerId: varchar("provider_id", { length: 255 }),
  providerResult: jsonb("provider_result"),
  reviewerId: uuid("reviewer_id"),
  decisionReason: text("decision_reason"),
  scope: text("scope"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("verif_org_idx").on(table.organizationId),
  index("verif_user_idx").on(table.userId),
  index("verif_status_idx").on(table.status),
]);

// ========================
// AUDIT LOG
// ========================

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  dealRoomId: uuid("deal_room_id").references(() => dealRooms.id),
  action: varchar("action", { length: 128 }).notNull(),
  resourceType: varchar("resource_type", { length: 64 }),
  resourceId: uuid("resource_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("audit_user_idx").on(table.userId),
  index("audit_org_idx").on(table.organizationId),
  index("audit_deal_idx").on(table.dealRoomId),
  index("audit_action_idx").on(table.action),
  index("audit_created_idx").on(table.createdAt),
]);

// ========================
// COUNTRY-LANGUAGE MAPPING
// ========================

export const countryLanguageMap = pgTable("country_language_map", {
  id: uuid("id").primaryKey().defaultRandom(),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  defaultLanguage: languageEnum("default_language").notNull(),
  alternativeLanguages: jsonb("alternative_languages"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("country_lang_unique").on(table.countryCode),
]);

// ========================
// SESSIONS
// ========================

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  sessionToken: varchar("session_token", { length: 512 }).notNull().unique(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  deviceInfo: jsonb("device_info"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("sessions_user_idx").on(table.userId),
  index("sessions_token_idx").on(table.sessionToken),
]);
