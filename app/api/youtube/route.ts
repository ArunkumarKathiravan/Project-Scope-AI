import { NextRequest, NextResponse } from "next/server";
import { projectInputSchema } from "@/lib/validation/project";
import { analyseLocally } from "@/lib/search/query-generator";
import { searchYouTube } from "@/lib/youtube/client";
export async function POST(request: NextRequest) {
  const parsed = projectInputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const analysis = analyseLocally(parsed.data);
  try {
    return NextResponse.json({ results: await searchYouTube(analysis, analysis.generatedQueries) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "YouTube failed" },
      { status: 502 }
    );
  }
}
