import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowedRoles: ["broker", "compliance_officer", "platform_admin"],
      allowExplicitDemo: true, // Only allows preview if ?demo=true is explicitly in URL
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const matches = gvceStore.getBrokerMatches();
    return NextResponse.json({
      success: true,
      isDemoSimulation: Boolean(authResult.user.isDemoSimulation),
      simulationNotice: authResult.user.isDemoSimulation
        ? "SAMPLE_DATA_FOR_DEMONSTRATION_ONLY"
        : undefined,
      matches,
      actor: {
        role: authResult.user.role,
        orgId: authResult.user.orgId,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch broker matches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only certified brokers and platform admins can approve or reject matches
    const authResult = verifyServerSession(req, {
      allowedRoles: ["broker", "platform_admin"],
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const body = await req.json();
    const { matchId, action } = body;

    if (!matchId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: matchId, action" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const result = gvceStore.approveBrokerMatch(matchId);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, dealRoomId: result.dealRoomId });
    } else if (action === "reject") {
      const ok = gvceStore.rejectBrokerMatch(matchId);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Match not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
