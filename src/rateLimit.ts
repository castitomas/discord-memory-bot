interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

const MAX_TOKENS = 5;        // Allowed uses
const REFILL_MS = 60_000;    // Time window
const REFILL_AMOUNT = 5;     // Token refill

export function checkRateLimit(userId: string): { allowed: boolean; retryInMs?: number } {
  const now = Date.now();
  let bucket = buckets.get(userId);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now };
    buckets.set(userId, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  if (elapsed >= REFILL_MS) {
    const refills = Math.floor(elapsed / REFILL_MS);
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refills * REFILL_AMOUNT);
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) {
    const retryInMs = REFILL_MS - elapsed;
    return { allowed: false, retryInMs };
  }

  bucket.tokens -= 1;
  return { allowed: true };
}