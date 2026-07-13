"use client";
import { useEffect, useState } from "react";
import type { ProjectAnalysis, SearchResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export function ComparisonView() {
  const [data, setData] = useState<{ project: ProjectAnalysis; result: SearchResult } | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = localStorage.getItem("projectscope:comparison");
      if (raw) setData(JSON.parse(raw) as { project: ProjectAnalysis; result: SearchResult });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!data)
    return (
      <Card>
        <CardContent className="p-10 text-center">
          Choose “Compare” on a result card first.
        </CardContent>
      </Card>
    );
  const { project, result } = data;
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Badge>User project</Badge>
            <CardTitle>{project.improvedTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{project.summary}</p>
            <Field
              label="Technologies"
              value={project.technologies.join(", ") || "Not specified"}
            />
            <Field label="Components" value={project.components.join(", ") || "Not specified"} />
            <Field label="Users" value={project.intendedUsers.join(", ")} />
            <Field label="Problem" value={project.problem} />
            <Field label="Expected output" value={project.expectedOutput} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Badge>Existing public result</Badge>
            <CardTitle>{result.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{result.description}</p>
            <Field label="Source" value={result.source} />
            <Field
              label="Technologies"
              value={
                [result.language, ...(result.topics || [])].filter(Boolean).join(", ") ||
                "Not available"
              }
            />
            <Field label="Type" value={result.resultType || "Unknown"} />
            <a
              className="text-primary underline"
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open source
            </a>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Comparison summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field
            label="Similarity"
            value={`${result.similarity.total}% — ${result.similarity.classification}`}
          />
          <Field label="Confidence" value={result.similarity.confidence} />
          <Field
            label="Common features"
            value={
              result.similarity.matchingFeatures.join(", ") || "No strong shared feature detected"
            }
          />
          <Field
            label="Features not visible in existing result"
            value={
              result.similarity.missingFeatures.join(", ") || "None identified from available text"
            }
          />
          <Field
            label="Major differences"
            value={result.similarity.differentFeatures.join(", ") || "Insufficient source detail"}
          />
          <Field
            label="Ways to differentiate"
            value="Document your target users, safety constraints, measurable performance, architecture and unique interaction design."
          />
        </CardContent>
      </Card>
    </div>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
