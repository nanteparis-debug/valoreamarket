import { NextRequest } from "next/server";
import { gvceStore, type CommercialVerificationScope } from "@/lib/store";
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
 * GET /api/admin/commercial-verification
 * Lists commercial verification cases according to the active availability mode and tenant permissions.
 */
export async function GET(req: NextRequest) {
  const settings = gvceStore.getCommercialVerificationSettings();
  const user = getAuthenticatedUser(req);

  // Check 1: In public_informational mode, private case data is completely air-gapped
  if (settings.currentMode === "public_informational") {
    // Only executives can access the back-office cases in this mode
    const isExecutive =
      user &&
      (user.role === "platform_admin" ||
        user.role === "compliance_officer" ||
        user.role === "broker");

    if (!isExecutive) {
      return jsonResponse(
        {
          success: false,
          error: "FORBIDDEN_PUBLIC_MODE",
          message: "Commercial verification cases and confidential documents are not accessible in public informational mode.",
          currentMode: "public_informational",
        },
        { status: 403 }
      );
    }
  }

  // Check 2: In admin_only mode, require executive authentication
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
          message: "Access restricted. Commercial verification is in Admin-Only mode.",
          currentMode: "admin_only",
        },
        { status: 403 }
      );
    }
  }

  // Check 3: In registered_clients mode, require valid user session
  if (!user) {
    return jsonResponse(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Authentication required to access verification records.",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const country = searchParams.get("country") || undefined;
  const scope = searchParams.get("scope") || undefined;

  const cases = gvceStore.getCommercialCases({
    orgId: user.orgId,
    role: user.role,
    search,
    status,
    country,
    scope,
    currentAvailabilityMode: settings.currentMode,
  });

  return jsonResponse({
    success: true,
    count: cases.length,
    data: cases,
    currentMode: settings.currentMode,
    userRole: user.role,
  });
}

/**
 * POST /api/admin/commercial-verification
 * Creates a new commercial verification case.
 */
export async function POST(req: NextRequest) {
  const settings = gvceStore.getCommercialVerificationSettings();
  const user = getAuthenticatedUser(req);

  if (!user) {
    return jsonResponse(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Authentication required to create verification cases.",
      },
      { status: 401 }
    );
  }

  const isExecutive =
    user.role === "platform_admin" ||
    user.role === "compliance_officer" ||
    user.role === "broker";

  // If in admin_only mode, only executives can create cases
  if (settings.currentMode === "admin_only" && !isExecutive) {
    return jsonResponse(
      {
        success: false,
        error: "FORBIDDEN_ADMIN_ONLY",
        message: "Case creation restricted to authorized compliance officers and platform administrators.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      targetEntityName,
      targetEntityType,
      countryCode,
      scope,
      organizationId,
      dealRequestId,
      commodityDetails,
      partyDetails,
    } = body;

    if (!targetEntityName || !targetEntityName.trim()) {
      return jsonResponse(
        {
          success: false,
          error: "MISSING_ENTITY_NAME",
          message: "Target company or party name is required.",
        },
        { status: 400 }
      );
    }

    if (!countryCode || countryCode.trim().length !== 2) {
      return jsonResponse(
        {
          success: false,
          error: "INVALID_COUNTRY_CODE",
          message: "Valid 2-letter ISO country code is required.",
        },
        { status: 400 }
      );
    }

    // In registered_clients mode, if client is not executive, bind to client's org
    const effectiveOrgId = isExecutive ? organizationId : user.orgId;

    const newCase = gvceStore.createCommercialCase(
      {
        targetEntityName: targetEntityName.trim(),
        targetEntityType: targetEntityType || "company",
        countryCode: countryCode.trim().toUpperCase(),
        scope: (scope as CommercialVerificationScope) || "full_investigation",
        organizationId: effectiveOrgId,
        dealRequestId,
        assignedReviewerId: isExecutive ? user.id : undefined,
        assignedReviewerName: isExecutive ? user.name : undefined,
        commodityDetails,
        partyDetails,
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
        message: "Commercial verification case successfully initiated.",
        case: newCase,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return jsonResponse(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "Failed to create verification case.",
      },
      { status: 500 }
    );
  }
}
