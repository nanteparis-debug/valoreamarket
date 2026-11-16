import { NextRequest } from "next/server";
import { gvceStore, type VerificationAvailabilityMode } from "@/lib/store";
import { verifyServerSession, getAuthenticatedUser } from "@/lib/auth-server";

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
 * GET /api/admin/commercial-verification/settings
 * Retrieves the current centralized verification availability mode.
 */
export async function GET(req: NextRequest) {
  const settings = gvceStore.getCommercialVerificationSettings();
  const user = getAuthenticatedUser(req);

  // If in admin_only mode, require executive authentication
  if (settings.currentMode === "admin_only") {
    const isExecutive =
      user &&
      (user.role === "platform_admin" ||
        user.role === "compliance_officer" ||
        user.role === "broker");

    if (!isExecutive) {
      return jsonResponse(
        {
          success: false,
          error: "FORBIDDEN_ADMIN_ONLY",
          message: "Commercial verification is strictly restricted to platform administrators.",
          currentMode: "admin_only",
        },
        { status: 403 }
      );
    }
  }

  return jsonResponse({
    success: true,
    settings,
    currentMode: settings.currentMode,
  });
}

/**
 * POST /api/admin/commercial-verification/settings
 * Updates the centralized verification availability mode.
 * Strictly restricted to platform_admin or compliance_officer.
 */
export async function POST(req: NextRequest) {
  const sessionCheck = verifyServerSession(req, {
    allowedRoles: ["platform_admin", "compliance_officer"],
  });

  if ("errorResponse" in sessionCheck) {
    return sessionCheck.errorResponse;
  }

  const { user } = sessionCheck;

  try {
    const body = await req.json();
    const { mode, reason } = body;

    const validModes: VerificationAvailabilityMode[] = [
      "admin_only",
      "registered_clients",
      "public_informational",
    ];

    if (!mode || !validModes.includes(mode)) {
      return jsonResponse(
        {
          success: false,
          error: "INVALID_MODE",
          message: `Invalid availability mode. Must be one of: ${validModes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedSettings = gvceStore.setCommercialVerificationMode(
      mode,
      user.name || user.email,
      reason || `Updated by ${user.role} (${user.name})`
    );

    return jsonResponse({
      success: true,
      message: `Verification availability mode successfully updated to: ${mode}`,
      settings: updatedSettings,
    });
  } catch (err: any) {
    return jsonResponse(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "Failed to update availability mode",
      },
      { status: 500 }
    );
  }
}
