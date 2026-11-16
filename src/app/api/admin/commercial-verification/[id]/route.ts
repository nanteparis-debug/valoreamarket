import { NextRequest } from "next/server";
import {
  gvceStore,
  type CommercialVerificationDecision,
  type CommercialVerificationStatus,
} from "@/lib/store";
import { getAuthenticatedUser, verifyServerSession } from "@/lib/auth-server";

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
 * GET /api/admin/commercial-verification/[id]
 * Retrieves details, documents, checks, and consistency matrix for a specific case.
 */
export async function GET(
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
        message: "Authentication required to view verification dossier.",
      },
      { status: 401 }
    );
  }

  const isExecutive =
    user.role === "platform_admin" ||
    user.role === "compliance_officer" ||
    user.role === "broker";

  // Check admin_only mode
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
        message: "Verification case not found or access denied under institutional tenant isolation rules.",
      },
      { status: 404 }
    );
  }

  // Calculate Cross-Document Consistency Matrix
  const consistencyMatrix = gvceStore.calculateCrossDocumentConsistency(id);

  return jsonResponse({
    success: true,
    case: targetCase,
    consistencyMatrix,
    userRole: user.role,
  });
}

/**
 * PATCH /api/admin/commercial-verification/[id]
 * Executive decision action: sets final outcome, writes rationale, and manages client release.
 * Strictly restricted to platform_admin or compliance_officer.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sessionCheck = verifyServerSession(req, {
    allowedRoles: ["platform_admin", "compliance_officer"],
  });

  if ("errorResponse" in sessionCheck) {
    return sessionCheck.errorResponse;
  }

  const { user } = sessionCheck;

  try {
    const body = await req.json();
    const { decision, justification, reviewerNotes, shareWithClient, status } = body;

    const validDecisions: CommercialVerificationDecision[] = [
      "pending",
      "cleared",
      "conditional",
      "rejected",
      "inconclusive",
    ];

    if (decision && !validDecisions.includes(decision)) {
      return jsonResponse(
        {
          success: false,
          error: "INVALID_DECISION",
          message: `Decision must be one of: ${validDecisions.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedCase = gvceStore.makeCaseDecision(
      id,
      {
        decision: decision || "pending",
        justification: justification || "",
        reviewerNotes,
        shareWithClient: Boolean(shareWithClient),
        status: status as CommercialVerificationStatus,
      },
      {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    );

    if (!updatedCase) {
      return jsonResponse(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Verification case not found.",
        },
        { status: 404 }
      );
    }

    return jsonResponse({
      success: true,
      message: "Executive decision and review notes successfully recorded.",
      case: updatedCase,
    });
  } catch (err: any) {
    return jsonResponse(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "Failed to update case decision.",
      },
      { status: 500 }
    );
  }
}
