import { generatePhoneOtp, getUserTotpSecret } from "../../../../../lib/mfa";
import { authRateLimiter, getClientIp } from "../../../../../lib/rate-limiter";
import { sendRealSmsOtp, getSmsProviderStatus, normalizePhoneNumber } from "../../../../../lib/sms";

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
    const smsStatus = getSmsProviderStatus();

    return jsonResponse({
      success: true,
      email,
      secret: totpData.secret,
      otpauthUrl: totpData.otpauthUrl,
      issuer: "VALOREA MARKET",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      smsService: {
        isConfigured: smsStatus.isConfigured,
        activeProvider: smsStatus.provider,
        supportedProviders: ["twilio", "brevo", "infobip", "custom"],
      },
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
    const rateCheck = authRateLimiter.check(`mfa-send-otp:${ip}`, 3);
    if (!rateCheck.success) {
      return jsonResponse(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          messageAr: "تم تجاوز الحد المسموح به لطلبات رمز التحقق. يرجى الانتظار 60 ثانية قبل المحاولة مجدداً.",
          messageEn: "Too many OTP requests. Please wait 60 seconds before requesting another SMS.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, phone, locale = "ar" } = body;

    const targetIdentifier = phone || email || "director@valorea.exchange";
    const otp = generatePhoneOtp(targetIdentifier);
    const masked = phone ? maskPhone(phone) : "+966 50 ••• ••41";

    // Attempt to dispatch via real SMS provider (Twilio / Brevo / Infobip)
    const smsResult = await sendRealSmsOtp({
      to: targetIdentifier,
      code: otp.code,
      locale,
    });

    // 1. Success with Real SMS provider
    if (smsResult.isReal && smsResult.success) {
      return jsonResponse({
        success: true,
        isRealSms: true,
        provider: smsResult.provider,
        messageId: smsResult.messageId,
        identifier: targetIdentifier,
        maskedPhone: masked,
        expiresIn: otp.expiresInSeconds,
        messageAr: `تم إرسال رمز التحقق الأمني الفعلي بنجاح إلى هاتفك المحمول ${masked} عبر الرسائل القصيرة (SMS).`,
        messageEn: `Security verification code sent successfully via real SMS to ${masked}.`,
      });
    }

    // 2. Real provider attempted, but telecom API returned an error
    if (smsResult.isReal && !smsResult.success) {
      return jsonResponse(
        {
          success: false,
          isRealSms: true,
          error: "SMS_DELIVERY_FAILED",
          provider: smsResult.provider,
          providerError: smsResult.error,
          maskedPhone: masked,
          messageAr: `تعذر إرسال الرسالة القصيرة عبر مزود (${smsResult.provider}): ${smsResult.error || "خطأ في الشبكة أو بيانات الاعتماد"}`,
          messageEn: `Failed to deliver SMS via ${smsResult.provider}: ${smsResult.error || "Network or credential error"}`,
        },
        { status: 502 }
      );
    }

    // 3. No real provider configured in environment variables
    const allowSimulation = process.env.SMS_SIMULATION_MODE === "true" || process.env.NODE_ENV !== "production";

    if (allowSimulation) {
      return jsonResponse({
        success: true,
        isRealSms: false,
        isSimulated: true,
        provider: "simulated",
        identifier: targetIdentifier,
        maskedPhone: masked,
        expiresIn: otp.expiresInSeconds,
        demoCode: otp.code,
        messageAr: `(وضع تجريبي) مزود SMS الحقيقي غير مهيأ بعد. رمز التجربة: ${otp.code}`,
        messageEn: `(Demo Mode) Real SMS provider not yet configured. Demo code: ${otp.code}`,
      });
    }

    return jsonResponse(
      {
        success: false,
        isRealSms: false,
        error: "SMS_PROVIDER_NOT_CONFIGURED",
        messageAr: "خدمة إرسال SMS الحقيقية غير مهيأة بعد. يرجى إدخال مفاتيح Twilio أو Brevo في متغيرات البيئة (Environment Variables).",
        messageEn: "Real SMS service is not configured. Please add Twilio or Brevo credentials to your environment variables.",
        configuredProviders: getSmsProviderStatus(),
      },
      { status: 503 }
    );
  } catch (error: any) {
    return jsonResponse(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
