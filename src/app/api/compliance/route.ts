import { NextRequest, NextResponse } from "next/server";
import { gvceStore, type VerificationRecord } from "@/lib/store";

export async function GET() {
  try {
    const records = gvceStore.getVerificationRecords();
    return NextResponse.json({ success: true, records });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch verification records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
