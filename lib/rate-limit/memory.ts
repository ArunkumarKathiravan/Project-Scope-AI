const buckets = new Map<string, number[]>();
export function checkRateLimit(key: string) {
  const max = Number(process.env.RATE_LIMIT_REQUESTS || 20);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60) * 1000;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= max)
    return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}
