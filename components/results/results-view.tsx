"use client";
import { useEffect, useMemo, useState } from "react";
import { Download, SearchX } from "lucide-react";
import type { ResultSource, SearchResponse } from "@/types";
import { ResultCard } from "@/components/results/result-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { GENERAL_DISCLAIMERS } from "@/lib/constants";
import { useToast } from "@/components/ui/toast";
export function ResultsView() {
  const [report, setReport] = useState<SearchResponse | null>(null);
  const { toast } = useToast();
  const [tab, setTab] = useState<"overview" | ResultSource | "improvements">("overview");
  const [sort, setSort] = useState("relevant");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = sessionStorage.getItem("projectscope:latest");
      if (raw) setReport(JSON.parse(raw) as SearchResponse);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const results = useMemo(() => {
    if (!report) return [];
    const rows =
      tab === "overview"
        ? report.results
        : ["github", "youtube", "web"].includes(tab)
          ? report.results.filter((r) => r.source === tab)
          : [];
    const confidenceRank = { High: 3, Medium: 2, Low: 1 };
    return [...rows].sort((a, b) =>
      sort === "recent"
        ? new Date(b.updatedAt || b.publishedAt || 0).getTime() -
          new Date(a.updatedAt || a.publishedAt || 0).getTime()
        : sort === "popular"
          ? (b.stars || b.viewCount || 0) - (a.stars || a.viewCount || 0)
          : sort === "documented"
            ? Number(Boolean(b.readmeSummary)) +
              (b.topics?.length || 0) -
              (Number(Boolean(a.readmeSummary)) + (a.topics?.length || 0))
            : sort === "confidence"
              ? confidenceRank[b.similarity.confidence] - confidenceRank[a.similarity.confidence]
              : b.similarity.total - a.similarity.total
    );
  }, [report, tab, sort]);
  const download = async (format: "pdf" | "markdown" | "json" | "csv") => {
    if (!report) return;
    const r = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, report })
    });
    if (!r.ok) {
      toast("Report export failed.");
      return;
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projectscope-report.${format === "markdown" ? "md" : format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`${format.toUpperCase()} report downloaded.`);
  };
  if (!report)
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <SearchX className="mx-auto mb-4 h-10 w-10" />
          <p>No recent search is available. Start a search from the home page.</p>
        </CardContent>
      </Card>
    );
  const top = report.results[0];
  const counts = {
    github: report.results.filter((r) => r.source === "github").length,
    youtube: report.results.filter((r) => r.source === "youtube").length,
    web: report.results.filter((r) => r.source === "web").length
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge>{report.analysis.category}</Badge>
            <Badge>{report.analysis.level}</Badge>
            {report.demoMode && <Badge className="border-amber-500">Demo mode</Badge>}
          </div>
          <CardTitle className="mt-3 text-2xl">{report.analysis.improvedTitle}</CardTitle>
          {report.analysis.originalTitle !== report.analysis.improvedTitle && (
            <p className="text-sm text-muted-foreground">
              Original title: {report.analysis.originalTitle}
            </p>
          )}
          <p className="text-muted-foreground">{report.analysis.summary}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Highest similarity"
              value={top ? `${top.similarity.total}%` : "No result"}
            />
            <Stat
              label="Classification"
              value={top?.similarity.classification || "No Strong Match Found"}
            />
            <Stat
              label="GitHub / YouTube / Web"
              value={`${counts.github} / ${counts.youtube} / ${counts.web}`}
            />
            <Stat label="Search time" value={new Date(report.searchedAt).toLocaleString()} />
          </div>
          <details className="mt-5 rounded-lg bg-muted p-4">
            <summary className="cursor-pointer font-medium">
              Generated search terms and detected concepts
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.analysis.generatedQueries.map((q) => (
                <Badge key={q}>{q}</Badge>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <ConceptList label="Keywords" items={report.analysis.keywords} />
              <ConceptList label="Technologies" items={report.analysis.technologies} />
              <ConceptList label="Components" items={report.analysis.components} />
            </div>
            <p className="mt-3 text-sm">
              <strong>Problem:</strong> {report.analysis.problem}
            </p>
            <p className="mt-2 text-sm">
              <strong>Expected output:</strong> {report.analysis.expectedOutput}
            </p>
            <p className="mt-2 text-sm">
              <strong>Intended users:</strong> {report.analysis.intendedUsers.join(", ")}
            </p>
          </details>
          <details className="mt-5 rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">Provider outcomes</summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {report.outcomes.map((outcome, index) => (
                <div
                  key={`${outcome.provider}-${index}`}
                  className="rounded-lg bg-muted p-3 text-sm"
                >
                  <p className="font-medium capitalize">
                    {outcome.provider}:{" "}
                    {outcome.ok ? "Successful" : outcome.configured ? "Failed" : "Not configured"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {outcome.message} {outcome.count ? `(${outcome.count} results)` : ""}
                  </p>
                </div>
              ))}
            </div>
          </details>
          <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            {report.disclaimer}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["overview", "github", "youtube", "web", "improvements"] as const).map((name) => (
            <Button
              key={name}
              variant={tab === name ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(name)}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Select className="w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevant">Most relevant</option>
            <option value="recent">Most recently updated</option>
            <option value="popular">Most popular</option>
            <option value="documented">Best documented</option>
            <option value="confidence">Highest confidence</option>
          </Select>
        </div>
      </div>
      {tab === "improvements" ? (
        <ImprovementView report={report} />
      ) : (
        <div className="grid gap-5">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} project={report.analysis} />
          ))}
          {results.length === 0 && (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                No results are available in this tab. Check provider setup in Settings or Status.
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Export report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(["pdf", "markdown", "json", "csv"] as const).map((f) => (
            <Button key={f} variant="outline" onClick={() => download(f)}>
              <Download className="h-4 w-4" />
              {f.toUpperCase()}
            </Button>
          ))}
        </CardContent>
      </Card>
      <div className="rounded-xl border p-4 text-sm text-muted-foreground">
        {GENERAL_DISCLAIMERS.map((d) => (
          <p key={d}>• {d}</p>
        ))}
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
function ConceptList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {items.length ? (
          items.map((item) => <Badge key={item}>{item}</Badge>)
        ) : (
          <span className="text-sm text-muted-foreground">Not specified</span>
        )}
      </div>
    </div>
  );
}
function ImprovementView({ report }: { report: SearchResponse }) {
  const extras = [
    ["Alternative titles", report.improvements.alternativeTitles],
    ["Suggested technologies", report.improvements.suggestedTechnologies],
    ["Suggested components", report.improvements.suggestedComponents],
    ["Safety improvements", report.improvements.safety],
    ["Privacy improvements", report.improvements.privacy],
    ["Future scope", report.improvements.futureScope],
    ["Academic-report topics", report.improvements.academicTopics]
  ] as const;
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        {(["basic", "intermediate", "advanced"] as const).map((level) => (
          <Card key={level}>
            <CardHeader>
              <CardTitle>{level[0].toUpperCase() + level.slice(1)} version</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {report.improvements[level].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {extras.map(([title, items]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
