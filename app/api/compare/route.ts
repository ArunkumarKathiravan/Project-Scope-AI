import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateSimilarity } from "@/lib/scoring/similarity";
import type { ProjectAnalysis, SearchResult } from "@/types";
const schema = z.object({ project: z.custom<ProjectAnalysis>(), result: z.custom<SearchResult>() });
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid comparison input" }, { status: 400 });
  return NextResponse.json({
    similarity: calculateSimilarity(parsed.data.project, parsed.data.result),
    suggestions: [
      "Emphasise features missing from the public result.",
      "Document measurable performance, safety and accessibility requirements.",
      "Use an original architecture diagram and implementation plan."
    ]
  });
}
