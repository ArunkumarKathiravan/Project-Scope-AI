"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bookmark, BookOpen, Copy, ExternalLink, GitCompareArrows, User } from "lucide-react";
import type { ProjectAnalysis, SearchResult, SavedItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { savedStorage } from "@/lib/storage/client-storage";
import { formatNumber, shortDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
export function ResultCard({
  result,
  project
}: {
  result: SearchResult;
  project: ProjectAnalysis;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const save = () => {
    const item: SavedItem = {
      id: result.id,
      savedAt: new Date().toISOString(),
      note: "",
      result,
      project
    };
    savedStorage.add(item);
    toast("Result saved to this browser.");
  };
  const compare = () => {
    localStorage.setItem("projectscope:comparison", JSON.stringify({ project, result }));
    router.push("/compare");
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
          {result.imageUrl ? (
            <Image src={result.imageUrl} alt="" fill className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-xs uppercase">{result.source}</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge>{result.source}</Badge>
            <Badge>
              {result.similarity.total}% · {result.similarity.classification}
            </Badge>
            <Badge>{result.similarity.confidence} confidence</Badge>
          </div>
          <CardTitle className="break-words">{result.title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.author || result.domain || result.resultType}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{result.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {result.language && <span>Language: {result.language}</span>}
          {typeof result.stars === "number" && <span>Stars: {formatNumber(result.stars)}</span>}
          {typeof result.forks === "number" && <span>Forks: {formatNumber(result.forks)}</span>}
          {typeof result.openIssues === "number" && (
            <span>Open issues: {formatNumber(result.openIssues)}</span>
          )}
          {result.license && <span>Licence: {result.license}</span>}
          {result.duration && <span>Duration: {result.duration}</span>}
          {result.resultType && <span>Type: {result.resultType}</span>}
          {typeof result.viewCount === "number" && (
            <span>Views: {formatNumber(result.viewCount)}</span>
          )}
          {(result.updatedAt || result.publishedAt) && (
            <span>Date: {shortDate(result.updatedAt || result.publishedAt)}</span>
          )}
        </div>
        <details className="mt-4 rounded-lg bg-muted/60 p-3 text-sm">
          <summary className="cursor-pointer font-medium">Score breakdown and explanation</summary>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <span>Semantic {result.similarity.semantic}%</span>
            <span>Title {result.similarity.title}%</span>
            <span>Keywords {result.similarity.keyword}%</span>
            <span>Technology {result.similarity.technology}%</span>
            <span>Components {result.similarity.component}%</span>
            <span>Category {result.similarity.category}%</span>
            <span>Source content {result.similarity.sourceContent}%</span>
          </div>
          <p className="mt-3 text-muted-foreground">{result.similarity.explanation}</p>
          {result.similarity.matchingFeatures.length > 0 && (
            <p className="mt-2">
              <strong>Matches:</strong> {result.similarity.matchingFeatures.join(", ")}
            </p>
          )}
          {result.similarity.missingFeatures.length > 0 && (
            <p className="mt-1">
              <strong>Not found in source:</strong> {result.similarity.missingFeatures.join(", ")}
            </p>
          )}
        </details>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm">
              <ExternalLink className="h-4 w-4" />
              {result.source === "github"
                ? "Open repository"
                : result.source === "youtube"
                  ? "Watch on YouTube"
                  : "Open page"}
            </Button>
          </a>
          {result.authorUrl && (
            <a href={result.authorUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <User className="h-4 w-4" />
                Open {result.source === "youtube" ? "channel" : "owner"}
              </Button>
            </a>
          )}
          {result.source === "github" && (
            <a href={`${result.url}#readme`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <BookOpen className="h-4 w-4" />
                View README
              </Button>
            </a>
          )}
          <Button size="sm" variant="outline" onClick={compare}>
            <GitCompareArrows className="h-4 w-4" />
            Compare
          </Button>
          <Button size="sm" variant="outline" onClick={save}>
            <Bookmark className="h-4 w-4" />
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(result.url);
              toast("Link copied.");
            }}
          >
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
