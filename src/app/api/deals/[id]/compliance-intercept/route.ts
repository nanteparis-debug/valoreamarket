import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";
import { getClientIp, apiRateLimiter } from "@/lib/rate-limiter";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = verifyServerSession(req, { allowExplicitDemo: true });
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const incidents = gvceStore.getComplianceIncidents(id);
    const deal = gvceStore.getDeal(id);

    return NextResponse.json({
      success: true,
      dealReference: deal?.referenceNumber || id,
      monitoringStatus: "ACTIVE_E2EE_SUPERVISED",
      antiCircumventionPolicy: "ICC_MODEL_CONTRACT_769_NCNDA",
      liquidatedDamagesRule: "3x total anticipated brokerage commission",
      incidents,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = verifyServerSession(req, { allowExplicitDemo: true });
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const ip = getClientIp(req);
    const rateCheck = apiRateLimiter.check(`compliance-intercept:${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { participantAlias, transcriptSnippet } = body;

    if (!transcriptSnippet || typeof transcriptSnippet !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing transcript snippet" },
        { status: 400 }
      );
    }

    const effectiveAlias = participantAlias || authResult.user.name || "Participant";
    const result = gvceStore.recordVerbalIncident(id, effectiveAlias, transcriptSnippet);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
