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
