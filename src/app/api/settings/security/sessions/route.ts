import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true, // Only allows preview if ?demo=true is explicitly in URL
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const allSessions = gvceStore.getActiveSessions();
    const sessions = authResult.user.isDemoSimulation
      ? allSessions.map((s) => ({
          ...s,
          browser: `[نموذج محاكاة • DEMO] ${s.browser}`,
        }))
      : allSessions.filter((s) => s.userId === authResult.user.id || authResult.user.role === "platform_admin");

    return NextResponse.json({
      success: true,
      isDemoSimulation: Boolean(authResult.user.isDemoSimulation),
      simulationNotice: authResult.user.isDemoSimulation
        ? "SAMPLE_DATA_FOR_DEMONSTRATION_ONLY"
        : undefined,
      sessions,
      actor: {
        userId: authResult.user.id,
        role: authResult.user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch active sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const body = await req.json();
    const { action, sessionId } = body;
    const isPlatformAdmin = authResult.user.role === "platform_admin";

    if (action === "revoke") {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: "Missing sessionId" },
          { status: 400 }
        );
      }
      const allSessions = gvceStore.getActiveSessions();
      const targetSession = allSessions.find((s) => s.id === sessionId);
      if (!targetSession) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 }
        );
      }
      // IDOR Protection: Reject attempts to revoke sessions belonging to other accounts
      if (targetSession.userId !== authResult.user.id && !isPlatformAdmin) {
        return NextResponse.json(
          {
            success: false,
            error: "FORBIDDEN_IDOR: Cannot revoke sessions belonging to other organizations or users",
          },
          { status: 403 }
        );
      }

      const ok = gvceStore.revokeSession(sessionId, authResult.user.id, isPlatformAdmin);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Cannot revoke current session or session not found" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, sessions: gvceStore.getActiveSessions() });
    } else if (action === "revoke_all_other") {
      const revokedCount = gvceStore.revokeAllOtherSessions(authResult.user.id, isPlatformAdmin);
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
