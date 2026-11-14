import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";
import { messageRateLimiter } from "@/lib/rate-limiter";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const deal = gvceStore.getDeal(id);

    if (!deal) {
      return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 });
    }

    // Demo Mode Sandbox Isolation:
    // Simulation users are strictly restricted to the demo deal room.
    if (user.isDemoSimulation && id !== "deal-en590-rotterdam") {
      return NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN_DEMO_ISOLATION: Simulation mode cannot post messages into production deals.",
        },
        { status: 403 }
      );
    }

    // Multi-tenant Deal Room Participation Guard:
    // Only certified brokers/compliance officers or registered participants of this specific deal can post.
    const isParticipant =
      user.role === "broker" ||
      user.role === "compliance_officer" ||
      user.role === "platform_admin" ||
      deal.participants.some((p) => p.orgId === user.orgId);

    if (!isParticipant) {
      return NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN_DEAL_TENANCY_MISMATCH: Your organization is not an authorized participant in this private deal room.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { senderAlias, senderRole, text } = body;

    // Rate Limiting Enforcement
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const rateCheck = messageRateLimiter.check(`${ip}:${senderAlias || user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED: Message rate limit exceeded. Please wait before posting.",
        },
        { status: 429 }
      );
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required message text" },
        { status: 400 }
      );
    }

    const effectiveAlias = senderAlias || user.name || `Trader-${user.orgId.split("-")[1] || "01"}`;
    const effectiveRole = senderRole || (user.role === "supplier" ? "supplier" : user.role === "broker" ? "broker" : "buyer");

    const result = gvceStore.addMessage(
      id,
      effectiveAlias,
      effectiveRole,
      text
    );

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result,
      warning: result.contactViolation
        ? "Contact information leak was detected and sanitized."
        : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
