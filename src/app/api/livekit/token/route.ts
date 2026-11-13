import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { dealId, participantAlias } = await req.json();

    if (!dealId || !participantAlias) {
      return NextResponse.json(
        { error: "dealId and participantAlias are required" },
        { status: 400 }
      );
    }

    const deal = gvceStore.getDeal(dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Verify participant is an authorized member of this deal
    const isMember = deal.participants.some((p) => p.alias === participantAlias);
    if (!isMember) {
      return NextResponse.json(
        {
          error: "FORBIDDEN_NOT_DEAL_MEMBER",
          message: "You are not an authorized participant in this private deal room.",
        },
        { status: 403 }
      );
    }

    // Generate short-lived mock/protocol token for LiveKit room session
    const roomName = `room-${deal.referenceNumber.toLowerCase()}`;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
      JSON.stringify({
        sub: participantAlias,
        room: roomName,
        dealId,
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
