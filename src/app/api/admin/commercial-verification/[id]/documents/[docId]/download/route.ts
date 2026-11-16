import { NextRequest } from "next/server";
import { gvceStore } from "@/lib/store";
import { getAuthenticatedUser } from "@/lib/auth-server";
import crypto from "crypto";

function jsonResponse(data: any, init?: { status?: number }) {
  return Response.json(data, {
    status: init?.status || 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

/**
 * GET /api/admin/commercial-verification/[id]/documents/[docId]/download
 * Generates an ephemeral, cryptographically-signed download authorization token (300 seconds expiration).
 * Enforces role checks, multi-tenant isolation, and comprehensive audit logging.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const { id, docId } = await context.params;
  const user = getAuthenticatedUser(req);
  const settings = gvceStore.getCommercialVerificationSettings();

  if (!user) {
    return jsonResponse(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Institutional authentication required to access private trade documents.",
      },
      { status: 401 }
    );
  }

  const isExecutive =
    user.role === "platform_admin" ||
    user.role === "compliance_officer" ||
    user.role === "broker";

  if (settings.currentMode === "admin_only" && !isExecutive) {
    return jsonResponse(
      {
        success: false,
        error: "FORBIDDEN_ADMIN_ONLY",
        message: "Commercial verification is in Admin-Only mode.",
      },
      { status: 403 }
    );
  }

  const targetCase = gvceStore.getCommercialCase(id, {
    orgId: user.orgId,
    role: user.role,
  });

  if (!targetCase) {
    return jsonResponse(
      {
        success: false,
        error: "NOT_FOUND_OR_FORBIDDEN",
        message: "Case not found or cross-company tenant isolation violation.",
      },
      { status: 404 }
    );
  }

  const doc = targetCase.documents.find((d) => d.id === docId);
  if (!doc) {
    return jsonResponse(
      {
        success: false,
        error: "DOCUMENT_NOT_FOUND",
        message: "Document not found in this verification case.",
      },
      { status: 404 }
    );
  }

  // Generate ephemeral 300-second download signature token
  const now = Date.now();
  const expiresInSeconds = 300;
  const expiresAt = now + expiresInSeconds * 1000;
  const secret = process.env.SESSION_SECRET || "valorea-institution-vault-2026";
  const signaturePayload = `${id}:${docId}:${user.id}:${expiresAt}`;
  const signedToken = crypto
    .createHmac("sha256", secret)
    .update(signaturePayload)
    .digest("hex");

  // Record audit log entry
  gvceStore.addCommercialAuditLog(
    id,
    "DOCUMENT_DOWNLOADED",
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    {
      docId,
      title: doc.title,
      fileName: doc.fileName,
      sha256Hash: doc.sha256Hash,
      ip: req.headers.get("x-forwarded-for") || "internal",
    }
  );

  return jsonResponse({
    success: true,
    message: "Ephemeral download access authorized. Link valid for 300 seconds.",
    document: {
      id: doc.id,
      title: doc.title,
      fileName: doc.fileName,
      fileSizeBytes: doc.fileSizeBytes,
      mimeType: doc.mimeType,
      sha256Hash: doc.sha256Hash,
    },
    downloadUrl: `/api/admin/commercial-verification/${id}/documents/${docId}/file?token=${signedToken}&expires=${expiresAt}`,
    token: signedToken,
    expiresAt: new Date(expiresAt).toISOString(),
    expiresInSeconds,
    watermarkNotice: `Authorized for ${user.name} (${user.orgName || "Admin"}) — Trade Secret & Confidential`,
  });
}
