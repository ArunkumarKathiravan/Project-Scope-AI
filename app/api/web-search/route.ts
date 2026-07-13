import { NextRequest, NextResponse } from "next/server";
import { projectInputSchema } from "@/lib/validation/project";
import { analyseLocally } from "@/lib/search/query-generator";
import { searchWeb } from "@/lib/web-search/providers";
export async function POST(request: NextRequest) {
  const parsed = projectInputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const analysis = analyseLocally(parsed.data);
  try {
    return NextResponse.json({ results: await searchWeb(analysis, analysis.generatedQueries) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Web search failed" },
      { status: 502 }
    );
  }
}
