import { NextRequest, NextResponse } from "next/server";
import { projectInputSchema } from "@/lib/validation/project";
import { runSearch } from "@/lib/search/orchestrator";
import { checkRateLimit } from "@/lib/rate-limit/memory";
import { cacheGet, cacheSet } from "@/lib/cache/memory";
import type { SearchResponse } from "@/types";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limit = checkRateLimit(ip);
  if (!limit.allowed)
    return NextResponse.json(
      { error: "Too many searches. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  try {
    const parsed = projectInputSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid project input.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    const key = `search:${JSON.stringify(parsed.data)}`;
    const cached = cacheGet<SearchResponse>(key);
    if (cached) return NextResponse.json({ ...cached, cached: true });
    const result = await runSearch(parsed.data);
    cacheSet(key, result);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error:
          "The search could not be completed. Provider errors are isolated, but the request itself failed."
      },
      { status: 500 }
    );
  }
}
