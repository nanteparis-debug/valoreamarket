// In-Memory Token Bucket / Sliding Window Rate Limiter
// Enforces rate limits per IP or client identifier

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private maxTokens: number;
  private refillRatePerSec: number;

  constructor(maxTokens = 60, refillRatePerSec = 1) {
    this.maxTokens = maxTokens;
    this.refillRatePerSec = refillRatePerSec;
  }

  public check(identifier: string, cost = 1): { success: boolean; remaining: number } {
    const now = Date.now();
    const record = this.store.get(identifier) || {
      tokens: this.maxTokens,
      lastRefill: now,
    };

    // Calculate elapsed time and add tokens
    const elapsedSeconds = (now - record.lastRefill) / 1000;
    record.tokens = Math.min(
      this.maxTokens,
      record.tokens + elapsedSeconds * this.refillRatePerSec
    );
    record.lastRefill = now;

    if (record.tokens >= cost) {
      record.tokens -= cost;
      this.store.set(identifier, record);
      return { success: true, remaining: Math.floor(record.tokens) };
    }

    this.store.set(identifier, record);
    return { success: false, remaining: Math.floor(record.tokens) };
  }

  public reset(identifier: string) {
    this.store.delete(identifier);
  }
}

// Global instances for various security domains
export const apiRateLimiter = new RateLimiter(60, 2); // 60 requests burst, 2 per sec
export const authRateLimiter = new RateLimiter(5, 0.2); // 5 attempts, 1 every 5 sec
export const messageRateLimiter = new RateLimiter(20, 1); // 20 messages burst, 1 per sec

/**
 * Extract trusted client IP, prioritizing Cloudflare connecting IP over spoofable headers.
 */
export function getClientIp(req: Request | any): string {
  if (!req || !req.headers) return "127.0.0.1";

  const getHeader = (name: string): string | null => {
    if (typeof req.headers.get === "function") {
      return req.headers.get(name);
    }
    return req.headers[name] || req.headers[name.toLowerCase()] || null;
  };

  // 1. Cloudflare verified Connecting IP
  const cfIp = getHeader("cf-connecting-ip");
  if (cfIp && typeof cfIp === "string" && cfIp.trim().length > 0) {
    return cfIp.trim();
  }

  // 2. Standard X-Real-IP
  const realIp = getHeader("x-real-ip");
  if (realIp && typeof realIp === "string" && realIp.trim().length > 0) {
    return realIp.trim();
  }

  // 3. X-Forwarded-For (extract first valid IP)
  const forwarded = getHeader("x-forwarded-for");
  if (forwarded && typeof forwarded === "string") {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp && /^[\da-fA-F.:]+$/.test(firstIp)) {
      return firstIp;
    }
  }

  return "127.0.0.1";
}
