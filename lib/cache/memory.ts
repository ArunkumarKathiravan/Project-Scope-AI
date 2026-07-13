type Entry<T> = { value: T; expires: number };
const cache = new Map<string, Entry<unknown>>();
export function cacheGet<T>(key: string): T | null {
  const e = cache.get(key);
  if (!e || e.expires < Date.now()) {
    cache.delete(key);
    return null;
  }
  return e.value as T;
}
export function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds = Number(process.env.CACHE_DURATION_SECONDS || 3600)
) {
  cache.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}
export function cacheStatus() {
  return {
    entries: cache.size,
    durationSeconds: Number(process.env.CACHE_DURATION_SECONDS || 3600)
  };
}
