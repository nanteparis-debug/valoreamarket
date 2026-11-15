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
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    professionalCheckoutUrl: process.env.LEMONSQUEEZY_CHECKOUT_PROFESSIONAL,
    enterpriseCheckoutUrl: process.env.LEMONSQUEEZY_CHECKOUT_ENTERPRISE,
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
