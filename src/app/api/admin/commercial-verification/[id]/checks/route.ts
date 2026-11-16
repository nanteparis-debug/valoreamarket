import { NextRequest } from "next/server";
import {
  gvceStore,
  type VerificationCheckOutcome,
} from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";

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
 * PATCH /api/admin/commercial-verification/[id]/checks
 * Updates the outcome status and investigation notes of a specific check.
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
    const {
      checkId,
      outcomeStatus,
      findingsSummary,
      reviewerNotes,
      evidenceSource,
      isExternalProviderConnected,
    } = body;

    if (!checkId) {
      return jsonResponse(
        {
          success: false,
          error: "MISSING_CHECK_ID",
          message: "checkId is required.",
        },
        { status: 400 }
      );
    }

    const validOutcomes: VerificationCheckOutcome[] = [
      "unverified",             // لم يتم التحقق
      "data_reviewed",          // تمت مراجعة البيانات
      "needs_human_review",     // تحتاج مراجعة بشرية
      "confirmed_from_source",   // تم تأكيدها من المصدر
      "inconclusive",           // تعذر التحقق
    ];

    if (outcomeStatus && !validOutcomes.includes(outcomeStatus)) {
      return jsonResponse(
        {
          success: false,
          error: "INVALID_OUTCOME_STATUS",
          message: `outcomeStatus must be one of: ${validOutcomes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedCheck = gvceStore.updateCommercialCheck(
      id,
      checkId,
      {
        outcomeStatus,
        findingsSummary,
        reviewerNotes,
        evidenceSource,
        isExternalProviderConnected: Boolean(isExternalProviderConnected),
      },
      {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    );

    if (!updatedCheck) {
      return jsonResponse(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Check or case not found.",
        },
        { status: 404 }
      );
    }

    return jsonResponse({
      success: true,
      message: "Check outcome successfully updated.",
      check: updatedCheck,
    });
  } catch (err: any) {
    return jsonResponse(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "Failed to update check outcome.",
      },
      { status: 500 }
    );
  }
}
