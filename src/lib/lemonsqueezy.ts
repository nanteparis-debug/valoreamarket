import crypto from "crypto";

export interface LemonSqueezyConfig {
  apiKey?: string;
  storeId?: string;
  webhookSecret?: string;
  professionalCheckoutUrl?: string;
  enterpriseCheckoutUrl?: string;
}

export function getLemonSqueezyConfig(): LemonSqueezyConfig {
  return {
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
    webhookSecret:
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "Server@1977/*/@1977/*/@",
    professionalCheckoutUrl:
      process.env.LEMONSQUEEZY_CHECKOUT_PROFESSIONAL ||
      "https://valoreamarket.lemonsqueezy.com/checkout/buy/8d9c977f-9b9c-41f4-a61e-92d9897aab37",
    enterpriseCheckoutUrl:
      process.env.LEMONSQUEEZY_CHECKOUT_ENTERPRISE ||
      "https://valoreamarket.lemonsqueezy.com/checkout/buy/29fed9b0-8ff5-4736-947e-8f851dd55675",
  };
}

/**
 * Verify Lemon Squeezy Webhook signature using HMAC-SHA256
 */
export function verifyLemonSqueezyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(signatureHeader, "utf8");

    if (digest.length !== signature.length) return false;
    return crypto.timingSafeEqual(digest, signature);
  } catch (err) {
    console.error("Failed to verify Lemon Squeezy signature:", err);
    return false;
  }
}
