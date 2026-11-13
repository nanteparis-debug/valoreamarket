import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";

export async function GET() {
  try {
    const sessions = gvceStore.getActiveSessions();
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch active sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId } = body;

    if (action === "revoke") {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: "Missing sessionId" },
          { status: 400 }
        );
      }
      const ok = gvceStore.revokeSession(sessionId);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Cannot revoke current session or session not found" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, sessions: gvceStore.getActiveSessions() });
    } else if (action === "revoke_all_other") {
      const revokedCount = gvceStore.revokeAllOtherSessions();
      return NextResponse.json({
        success: true,
        revokedCount,
        sessions: gvceStore.getActiveSessions(),
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to manage session" },
      { status: 500 }
    );
  }
}
