// Fixed-window in-memory rate limiter. No external dependencies.
// NOTE: The Map resets on each Vercel cold start. This is intentional for MVP —
// limits are per-function-instance, not global. Still stops naive scripted
// abuse and accidental double-submits effectively.

interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();

// Periodic cleanup to prevent unbounded Map growth. Runs at most once per minute.
let lastCleanup = 0;
function maybeCleanup(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now - entry.windowStart > windowMs) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds until the current window expires
}

/**
 * Check and increment the fixed-window counter for a given (ip, key) pair.
 * @param ip      Client IP address
 * @param key     Route-specific namespace, e.g. "submit"
 * @param limit   Max requests allowed per window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  ip: string,
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  maybeCleanup(windowMs);

  const storeKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = store.get(storeKey);

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(storeKey, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Extract the real client IP from a NextRequest.
 * On Vercel, x-forwarded-for is always injected by the edge with the real client
 * IP as the first (leftmost) entry.
 */
export function getClientIp(request: import("next/server").NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
