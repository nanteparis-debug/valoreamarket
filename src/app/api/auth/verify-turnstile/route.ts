import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getClientIp } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, action } = body;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing Turnstile verification token" },
        { status: 400 }
      );
    }

    const remoteip = getClientIp(req);

    const result = await verifyTurnstileToken(token, action, remoteip);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error || "Turnstile verification failed" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      hostname: result.hostname,
      action: result.action,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
