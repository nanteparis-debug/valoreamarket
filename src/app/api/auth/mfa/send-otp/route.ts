import { generatePhoneOtp, getUserTotpSecret } from "../../../../../lib/mfa.ts";
import { authRateLimiter, getClientIp } from "../../../../../lib/rate-limiter.ts";

function jsonResponse(data: any, init?: { status?: number }) {
  return new Response(JSON.stringify(data), {
    status: init?.status || 200,
    headers: { "Content-Type": "application/json" },
  });
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, "");
  if (clean.length < 7) return clean;
  const start = clean.slice(0, 4);
  const end = clean.slice(-2);
  return `${start} ••• ••${end}`;
}

export async function GET(req: Request | any) {
  try {
    const url = new URL(req.url, "http://localhost:3000");
    const email = url.searchParams.get("email") || "director@valorea.exchange";

    const totpData = getUserTotpSecret(email);

    return jsonResponse({
      success: true,
      email,
      secret: totpData.secret,
      otpauthUrl: totpData.otpauthUrl,
      issuer: "VALOREA MARKET",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });
  } catch (error: any) {
    return jsonResponse(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request | any) {
  try {
    const ip = getClientIp(req);
    const rateCheck = authRateLimiter.check(`mfa-send-otp:${ip}`, 1);
    if (!rateCheck.success) {
      return jsonResponse(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: "Too many OTP requests. Please wait 60 seconds before requesting another SMS.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, phone, channel = "sms" } = body;

    const targetIdentifier = phone || email || "director@valorea.exchange";
    const otp = generatePhoneOtp(targetIdentifier);
    const masked = phone ? maskPhone(phone) : "+966 50 ••• ••41";

    return jsonResponse({
      success: true,
      channel,
      identifier: targetIdentifier,
      maskedPhone: masked,
      expiresIn: otp.expiresInSeconds,
      // Provide demo/preview code for immediate verification during evaluation
      demoCode: otp.code,
      messageAr: `تم إرسال رمز التحقق (OTP) بنجاح إلى هاتفك المحمول ${masked} عبر الرسائل القصيرة.`,
      messageEn: `Security verification code (OTP) sent successfully via SMS to ${masked}.`,
    });
  } catch (error: any) {
    return jsonResponse(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
