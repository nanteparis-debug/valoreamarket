import { NextRequest, NextResponse } from "next/server";
import { gvceStore, type VerificationRecord } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowedRoles: ["compliance_officer", "broker", "platform_admin"],
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const isDemo = user.isDemoSimulation;

    let records = gvceStore.getVerificationRecords();
    if (isDemo) {
      records = records.map((r) => ({
        ...r,
        orgName: `[نموذج تدقيق افتراضي • DEMO] ${r.orgName}`,
      }));
    }

    return NextResponse.json({
      success: true,
      records,
      isDemoSimulation: isDemo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch verification records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowedRoles: ["compliance_officer", "broker", "platform_admin"],
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const body = await req.json();
    const { id, status, decisionReason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, status" },
        { status: 400 }
      );
    }

    const updated = gvceStore.updateVerificationStatus(
      id,
      status as VerificationRecord["status"],
      decisionReason
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    const record = gvceStore.getVerificationRecord(id);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update verification record" },
      { status: 500 }
    );
  }
}
