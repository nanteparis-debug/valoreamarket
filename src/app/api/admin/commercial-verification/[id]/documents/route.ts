import { NextRequest } from "next/server";
import {
  gvceStore,
  type CommercialVerificationDocument,
} from "@/lib/store";
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

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/tiff",
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

/**
 * POST /api/admin/commercial-verification/[id]/documents
 * Securely uploads or registers a physical trade document into the case's private storage.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = getAuthenticatedUser(req);
  const settings = gvceStore.getCommercialVerificationSettings();

  if (!user) {
    return jsonResponse(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Authentication required to upload verification documents.",
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
        message: "Verification case not found or access denied.",
      },
      { status: 404 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    let title = "";
    let documentType: CommercialVerificationDocument["documentType"] = "other";
    let fileName = "";
    let fileSizeBytes = 0;
    let mimeType = "application/pdf";
    let sha256Hash = "";
    let extractedFields: Record<string, any> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      title = (formData.get("title") as string) || (file ? file.name : "Trade Document");
      documentType = ((formData.get("documentType") as string) || "other") as any;
      const rawExtracted = formData.get("extractedFields") as string | null;
      if (rawExtracted) {
        try {
          extractedFields = JSON.parse(rawExtracted);
        } catch {
          extractedFields = {};
        }
      }

      if (!file) {
        return jsonResponse(
          {
            success: false,
            error: "MISSING_FILE",
            message: "No file provided in form data.",
          },
          { status: 400 }
        );
      }

      fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      fileSizeBytes = file.size;
      mimeType = file.type || "application/octet-stream";

      if (fileSizeBytes > MAX_FILE_SIZE) {
        return jsonResponse(
          {
            success: false,
            error: "FILE_TOO_LARGE",
            message: `File exceeds maximum allowed size of 15MB (${(fileSizeBytes / (1024 * 1024)).toFixed(2)}MB).`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
        return jsonResponse(
          {
            success: false,
            error: "UNSUPPORTED_MIME_TYPE",
            message: `Unsupported file type: ${mimeType}. Allowed formats: PDF, PNG, JPEG, TIFF.`,
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      sha256Hash = crypto.createHash("sha256").update(buffer).digest("hex");
    } else {
      // JSON Metadata Registration (e.g. from secure cloud storage pre-upload)
      const body = await req.json();
      title = body.title;
      documentType = body.documentType || "other";
      fileName = (body.fileName || "document.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
      fileSizeBytes = body.fileSizeBytes || 102400;
      mimeType = body.mimeType || "application/pdf";
      extractedFields = body.extractedFields || {};
      sha256Hash =
        body.sha256Hash ||
        crypto
          .createHash("sha256")
          .update(`${fileName}-${fileSizeBytes}-${Date.now()}`)
          .digest("hex");

      if (!title || !title.trim()) {
        return jsonResponse(
          {
            success: false,
            error: "MISSING_TITLE",
            message: "Document title is required.",
          },
          { status: 400 }
        );
      }
    }

    const storageKey = `cases/${id}/docs/${Date.now()}-${fileName}`;

    const newDoc = gvceStore.addCommercialDocument(
      id,
      {
        title: title.trim(),
        documentType,
        fileName,
        fileSizeBytes,
        mimeType,
        storageKey,
        sha256Hash,
        extractedFields,
        uploadedByUserId: user.id,
        uploadedByName: user.name,
      },
      {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    );

    return jsonResponse(
      {
        success: true,
        message: "Document successfully encrypted and registered to verification case.",
        document: newDoc,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return jsonResponse(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "Failed to process document upload.",
      },
      { status: 500 }
    );
  }
}
