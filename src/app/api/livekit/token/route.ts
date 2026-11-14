import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const { dealId, participantAlias } = await req.json();

    if (!dealId) {
      return NextResponse.json(
        { error: "dealId is required" },
        { status: 400 }
      );
    }

    const deal = gvceStore.getDeal(dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Demo Mode Sandbox Isolation:
    if (user.isDemoSimulation && dealId !== "deal-en590-rotterdam") {
      return NextResponse.json(
        {
          error: "FORBIDDEN_DEMO_ISOLATION",
          message: "Simulation mode cannot join LiveKit meetings for production deals.",
        },
        { status: 403 }
      );
    }

    // Verify participant is an authorized member of this deal or an overseeing broker
    const isMember =
      user.role === "broker" ||
      user.role === "compliance_officer" ||
      user.role === "platform_admin" ||
      deal.participants.some((p) => p.orgId === user.orgId);

    if (!isMember) {
      return NextResponse.json(
        {
          error: "FORBIDDEN_DEAL_TENANCY_MISMATCH",
          message: "Your organization is not an authorized participant in this private deal room.",
        },
        { status: 403 }
      );
    }

    const alias = participantAlias || user.name || `Participant-${user.orgId.split("-")[1] || "01"}`;

    // Generate short-lived mock/protocol token for LiveKit room session
    const roomName = `room-${deal.referenceNumber.toLowerCase()}`;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
      JSON.stringify({
        sub: alias,
        room: roomName,
        dealId,
        orgId: user.orgId,
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      })
    ).toString("base64")}.mock_signature`;

    return NextResponse.json({
      success: true,
      roomName,
      token,
      e2eeSupported: true,
      serverUrl: "wss://livekit.gvce.exchange",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
