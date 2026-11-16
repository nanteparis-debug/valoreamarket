-- Migration 0001: Commercial Verification Module (التحقق التجاري)
-- Safe, idempotent migration for PostgreSQL / Neon Database

-- 1. Create Enums if they do not exist
DO $$ BEGIN
    CREATE TYPE "commercial_verification_scope" AS ENUM(
        'company_due_diligence',
        'commodity_documents',
        'deal_consistency',
        'counterparty_risk',
        'full_investigation'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "commercial_verification_status" AS ENUM(
        'new',
        'in_review',
        'needs_info',
        'completed',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "verification_check_outcome" AS ENUM(
        'unverified',             -- لم يتم التحقق
        'data_reviewed',          -- تمت مراجعة البيانات
        'needs_human_review',     -- تحتاج مراجعة بشرية
        'confirmed_from_source',   -- تم تأكيدها من المصدر
        'inconclusive'            -- تعذر التحقق
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "commercial_verification_decision" AS ENUM(
        'pending',
        'cleared',
        'conditional',
        'rejected',
        'inconclusive'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "verification_availability_mode" AS ENUM(
        'admin_only',             -- الإدارة فقط (الافتراضي)
        'registered_clients',     -- عملاء مسجلون
        'public_informational'    -- صفحة عامة تعريفية
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Settings Table (Centralized Availability Control)
CREATE TABLE IF NOT EXISTS "commercial_verification_settings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "current_mode" "verification_availability_mode" NOT NULL DEFAULT 'admin_only',
    "updated_by" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "reason" TEXT,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed default setting if empty
INSERT INTO "commercial_verification_settings" ("id", "current_mode", "reason")
SELECT gen_random_uuid(), 'admin_only', 'Default system initialization: Restricted to authorized compliance officers and platform administrators.'
WHERE NOT EXISTS (SELECT 1 FROM "commercial_verification_settings");

-- 3. Create Commercial Verification Cases Table
CREATE TABLE IF NOT EXISTS "commercial_verification_cases" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "reference_number" VARCHAR(64) NOT NULL UNIQUE,
    "organization_id" UUID REFERENCES "organizations"("id") ON DELETE SET NULL,
    "deal_request_id" UUID REFERENCES "deal_requests"("id") ON DELETE SET NULL,
    "target_entity_name" VARCHAR(255) NOT NULL,
    "target_entity_type" VARCHAR(64) NOT NULL,
    "country_code" VARCHAR(2) NOT NULL,
    "scope" "commercial_verification_scope" NOT NULL DEFAULT 'full_investigation',
    "status" "commercial_verification_status" NOT NULL DEFAULT 'new',
    "final_decision" "commercial_verification_decision" NOT NULL DEFAULT 'pending',
    "decision_justification" TEXT,
    "reviewer_notes" TEXT,
    "assigned_reviewer_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "assigned_reviewer_name" VARCHAR(255),
    "shared_with_client" BOOLEAN NOT NULL DEFAULT FALSE,
    "shared_at" TIMESTAMP WITH TIME ZONE,
    "commodity_details" JSONB,
    "party_details" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "cv_case_ref_idx" ON "commercial_verification_cases"("reference_number");
CREATE INDEX IF NOT EXISTS "cv_case_org_idx" ON "commercial_verification_cases"("organization_id");
CREATE INDEX IF NOT EXISTS "cv_case_status_idx" ON "commercial_verification_cases"("status");
CREATE INDEX IF NOT EXISTS "cv_case_country_idx" ON "commercial_verification_cases"("country_code");
CREATE INDEX IF NOT EXISTS "cv_case_scope_idx" ON "commercial_verification_cases"("scope");

-- 4. Create Documents Table (Encrypted / Private storage metadata with SHA-256)
CREATE TABLE IF NOT EXISTS "commercial_verification_documents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "case_id" UUID NOT NULL REFERENCES "commercial_verification_cases"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "document_type" VARCHAR(64) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "mime_type" VARCHAR(128) NOT NULL,
    "storage_key" VARCHAR(512) NOT NULL,
    "sha256_hash" VARCHAR(64) NOT NULL,
    "extracted_fields" JSONB,
    "uploaded_by_user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "uploaded_by_name" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "cv_doc_case_idx" ON "commercial_verification_documents"("case_id");
CREATE INDEX IF NOT EXISTS "cv_doc_type_idx" ON "commercial_verification_documents"("document_type");

-- 5. Create Verification Checks & Evidence Sources Table
CREATE TABLE IF NOT EXISTS "commercial_verification_checks" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "case_id" UUID NOT NULL REFERENCES "commercial_verification_cases"("id") ON DELETE CASCADE,
    "category" VARCHAR(64) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "outcome_status" "verification_check_outcome" NOT NULL DEFAULT 'unverified',
    "evidence_source" VARCHAR(255),
    "is_external_provider_connected" BOOLEAN NOT NULL DEFAULT FALSE,
    "evidence_date" TIMESTAMP WITH TIME ZONE,
    "findings_summary" TEXT,
    "reviewer_notes" TEXT,
    "performed_by" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "cv_check_case_idx" ON "commercial_verification_checks"("case_id");
CREATE INDEX IF NOT EXISTS "cv_check_category_idx" ON "commercial_verification_checks"("category");
CREATE INDEX IF NOT EXISTS "cv_check_outcome_idx" ON "commercial_verification_checks"("outcome_status");

-- 6. Create Audit Log Table
CREATE TABLE IF NOT EXISTS "commercial_verification_audit_log" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "case_id" UUID REFERENCES "commercial_verification_cases"("id") ON DELETE CASCADE,
    "action" VARCHAR(128) NOT NULL,
    "performed_by_user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "performed_by_name" VARCHAR(255),
    "performed_by_role" VARCHAR(64),
    "details" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "cv_audit_case_idx" ON "commercial_verification_audit_log"("case_id");
CREATE INDEX IF NOT EXISTS "cv_audit_action_idx" ON "commercial_verification_audit_log"("action");
CREATE INDEX IF NOT EXISTS "cv_audit_created_idx" ON "commercial_verification_audit_log"("created_at");
