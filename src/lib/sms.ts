/**
 * Valorea Market - Enterprise SMS OTP Dispatcher
 * Supports Twilio, Brevo (Sendinblue), Infobip, and Custom HTTP SMS Gateways.
 */

export interface SendSmsResult {
  success: boolean;
  provider: "twilio" | "brevo" | "infobip" | "custom" | "simulated";
  messageId?: string;
  error?: string;
  isReal: boolean;
}

/**
 * Normalize phone number to standard E.164 format (+[country_code][subscriber_number])
 */
export function normalizePhoneNumber(rawPhone: string): string {
  let cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, "");

  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  } else if (!cleaned.startsWith("+")) {
    // If starts with 06 or 07 (Standard Moroccan mobile prefixes)
    if (/^0[67]\d{8}$/.test(cleaned)) {
      cleaned = "+212" + cleaned.slice(1);
    }
    // If starts with 05 (Saudi Arabia / UAE / Morocco landline / GCC)
    else if (/^05\d{8}$/.test(cleaned)) {
      cleaned = "+966" + cleaned.slice(1);
    } else {
      cleaned = "+" + cleaned;
    }
  }

  return cleaned;
}

/**
 * Check which SMS provider is currently active in the environment
 */
export function getSmsProviderStatus(): {
  isConfigured: boolean;
  provider: "twilio" | "brevo" | "infobip" | "custom" | "none";
} {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return { isConfigured: true, provider: "twilio" };
  }
  if (process.env.BREVO_API_KEY) {
    return { isConfigured: true, provider: "brevo" };
  }
  if (process.env.INFOBIP_API_KEY && process.env.INFOBIP_BASE_URL) {
    return { isConfigured: true, provider: "infobip" };
  }
  if (process.env.CUSTOM_SMS_URL) {
    return { isConfigured: true, provider: "custom" };
  }
  return { isConfigured: false, provider: "none" };
}

/**
 * Send real SMS OTP via Twilio REST API
 */
async function sendViaTwilio(to: string, message: string): Promise<SendSmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!accountSid || !authToken || (!fromNumber && !messagingServiceSid)) {
    return {
      success: false,
      provider: "twilio",
      isReal: true,
      error: "Missing Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)",
    };
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams();
  params.append("To", to);
  if (messagingServiceSid) {
    params.append("MessagingServiceSid", messagingServiceSid);
  } else if (fromNumber) {
    params.append("From", fromNumber);
  }
  params.append("Body", message);

  const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        provider: "twilio",
        isReal: true,
        error: data.message || `Twilio error: ${response.status}`,
      };
    }

    return {
      success: true,
      provider: "twilio",
      messageId: data.sid,
      isReal: true,
    };
  } catch (err: any) {
    return {
      success: false,
      provider: "twilio",
      isReal: true,
      error: err.message || "Failed to connect to Twilio SMS API",
    };
  }
}

/**
 * Send real SMS OTP via Brevo (Sendinblue) Transactional SMS API
 */
async function sendViaBrevo(to: string, message: string): Promise<SendSmsResult> {
  const apiKey = process.env.BREVO_API_KEY;
  // Brevo sender name must be 1-11 alphanumeric characters, no spaces
  const sender = (process.env.BREVO_SMS_SENDER || "Valorea").replace(/[^a-zA-Z0-9]/g, "").slice(0, 11);

  if (!apiKey) {
    return {
      success: false,
      provider: "brevo",
      isReal: true,
      error: "Missing Brevo API key (BREVO_API_KEY)",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/transactionalSMS/send", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        recipient: to,
        content: message,
        type: "transactional",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        provider: "brevo",
        isReal: true,
        error: data.message || `Brevo error: ${response.status}`,
      };
    }

    return {
      success: true,
      provider: "brevo",
      messageId: String(data.reference || data.messageId || ""),
      isReal: true,
    };
  } catch (err: any) {
    return {
      success: false,
      provider: "brevo",
      isReal: true,
      error: err.message || "Failed to connect to Brevo SMS API",
    };
  }
}

/**
 * Send real SMS OTP via Infobip SMS API
 */
async function sendViaInfobip(to: string, message: string): Promise<SendSmsResult> {
  const apiKey = process.env.INFOBIP_API_KEY;
  let baseUrl = process.env.INFOBIP_BASE_URL;
  const sender = process.env.INFOBIP_SENDER || "Valorea";

  if (!apiKey || !baseUrl) {
    return {
      success: false,
      provider: "infobip",
      isReal: true,
      error: "Missing Infobip credentials (INFOBIP_API_KEY, INFOBIP_BASE_URL)",
    };
  }

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  const endpoint = `${baseUrl.replace(/\/+$/, "")}/sms/2/text/advanced`;
  const cleanPhone = to.replace(/[^\d]/g, "");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `App ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            from: sender,
            destinations: [{ to: cleanPhone }],
            text: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        provider: "infobip",
        isReal: true,
        error: data.requestError?.serviceException?.text || `Infobip error: ${response.status}`,
      };
    }

    const msgId = data.messages?.[0]?.messageId;
    return {
      success: true,
      provider: "infobip",
      messageId: msgId,
      isReal: true,
    };
  } catch (err: any) {
    return {
      success: false,
      provider: "infobip",
      isReal: true,
      error: err.message || "Failed to connect to Infobip SMS API",
    };
  }
}

/**
 * Send real SMS OTP via Custom HTTP / Webhook Gateway
 */
async function sendViaCustomGateway(to: string, message: string, code: string): Promise<SendSmsResult> {
  const gatewayUrl = process.env.CUSTOM_SMS_URL;
  const token = process.env.CUSTOM_SMS_TOKEN;

  if (!gatewayUrl) {
    return {
      success: false,
      provider: "custom",
      isReal: true,
      error: "Missing CUSTOM_SMS_URL",
    };
  }

  try {
    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        phone: to,
        message,
        code,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        provider: "custom",
        isReal: true,
        error: data.message || `Custom gateway error: ${response.status}`,
      };
    }

    return {
      success: true,
      provider: "custom",
      isReal: true,
    };
  } catch (err: any) {
    return {
      success: false,
      provider: "custom",
      isReal: true,
      error: err.message || "Failed to connect to Custom SMS Gateway",
    };
  }
}

/**
 * Primary Dispatcher: Send real SMS OTP code
 */
export async function sendRealSmsOtp(params: {
  to: string;
  code: string;
  locale?: string;
}): Promise<SendSmsResult> {
  const { to, code, locale = "ar" } = params;
  const cleanPhone = normalizePhoneNumber(to);
  const isAr = locale === "ar";

  const message = isAr
    ? `رمز التحقق الأمني لمنصة Valorea Market هو: ${code}\nصالح لمدة 5 دقائق. لا تشارك هذا الرمز مع أي شخص حفاظاً على أمان حسابك.`
    : `Your Valorea Market verification code is: ${code}\nValid for 5 minutes. Do not share this code with anyone.`;

  // 1. Try Twilio
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return await sendViaTwilio(cleanPhone, message);
  }

  // 2. Try Brevo
  if (process.env.BREVO_API_KEY) {
    return await sendViaBrevo(cleanPhone, message);
  }

  // 3. Try Infobip
  if (process.env.INFOBIP_API_KEY && process.env.INFOBIP_BASE_URL) {
    return await sendViaInfobip(cleanPhone, message);
  }

  // 4. Try Custom Gateway
  if (process.env.CUSTOM_SMS_URL) {
    return await sendViaCustomGateway(cleanPhone, message, code);
  }

  // No real provider configured in environment variables
  return {
    success: false,
    provider: "simulated",
    isReal: false,
    error: "NO_PROVIDER_CONFIGURED",
  };
}
