import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";

export async function GET() {
  try {
    const matches = gvceStore.getBrokerMatches();
    return NextResponse.json({ success: true, matches });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch broker matches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
