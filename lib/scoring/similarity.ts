import type { ProjectAnalysis, SearchResult, SimilarityBreakdown } from "@/types";
import { clamp, unique } from "@/lib/utils";
import { stopWords } from "@/lib/constants";

export function tokenize(value: string): string[] {
  return unique(
    value
      .toLowerCase()
      .replace(/[^a-z0-9+#.-]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 1 && !stopWords.has(token))
  );
}
function overlap(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const bset = new Set(b.map((v) => v.toLowerCase()));
  return (a.filter((v) => bset.has(v.toLowerCase())).length / Math.max(a.length, b.length)) * 100;
}
function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  const intersection = [...A].filter((x) => B.has(x)).length;
  return (intersection / (A.size + B.size - intersection)) * 100;
}
export function classification(score: number): SimilarityBreakdown["classification"] {
  if (score >= 90) return "Exact or Near-Exact Match";
  if (score >= 75) return "Highly Similar";
  if (score >= 50) return "Related Project";
  if (score >= 25) return "Weakly Related";
  return "No Strong Match Found";
}
export function calculateSimilarity(
  project: ProjectAnalysis,
  candidate: Pick<
    SearchResult,
    "title" | "description" | "topics" | "language" | "readmeSummary" | "resultType"
  >
): SimilarityBreakdown {
  const projectText = `${project.improvedTitle} ${project.summary} ${project.keywords.join(" ")} ${project.technologies.join(" ")} ${project.components.join(" ")}`;
  const candidateText = `${candidate.title} ${candidate.description} ${(candidate.topics ?? []).join(" ")} ${candidate.language ?? ""} ${candidate.readmeSummary ?? ""}`;
  const semantic = jaccard(tokenize(projectText), tokenize(candidateText));
  const title = jaccard(tokenize(project.improvedTitle), tokenize(candidate.title));
  const keyword = overlap(project.keywords, tokenize(candidateText));
  const technology = overlap(project.technologies, tokenize(candidateText));
  const component = overlap(project.components, tokenize(candidateText));
  const category = candidate.resultType?.toLowerCase().includes(project.category.toLowerCase())
    ? 100
    : overlap(tokenize(project.category), tokenize(candidateText));
  const sourceContent = candidate.readmeSummary
    ? jaccard(tokenize(project.summary), tokenize(candidate.readmeSummary))
    : 0;
  const metrics = { semantic, title, keyword, technology, component, category, sourceContent };
  const weights: Record<keyof typeof metrics, number> = {
    semantic: 40,
    title: 15,
    keyword: 15,
    technology: 10,
    component: 10,
    category: 5,
    sourceContent: 5
  };
  const available = Object.entries(metrics).filter(
    ([key, value]) => value > 0 || !["technology", "component", "sourceContent"].includes(key)
  );
  const weightSum = available.reduce((sum, [key]) => sum + weights[key as keyof typeof metrics], 0);
  const total = clamp(
    Math.round(
      available.reduce(
        (sum, [key, value]) => sum + value * weights[key as keyof typeof metrics],
        0
      ) / Math.max(1, weightSum)
    )
  );
  const candidateTokens = tokenize(candidateText);
  const matchingFeatures = unique(
    [...project.keywords, ...project.technologies, ...project.components].filter((item) =>
      candidateTokens.includes(item.toLowerCase())
    )
  ).slice(0, 8);
  const missingFeatures = unique(
    [...project.technologies, ...project.components].filter(
      (item) => !candidateTokens.includes(item.toLowerCase())
    )
  ).slice(0, 8);
  const dataFields = [
    candidate.title,
    candidate.description,
    candidate.readmeSummary,
    candidate.topics?.length,
    candidate.language
  ].filter(Boolean).length;
  const confidence =
    dataFields >= 5 && project.summary.length > 100 ? "High" : dataFields >= 3 ? "Medium" : "Low";
  return {
    total,
    semantic: Math.round(semantic),
    title: Math.round(title),
    keyword: Math.round(keyword),
    technology: Math.round(technology),
    component: Math.round(component),
    category: Math.round(category),
    sourceContent: Math.round(sourceContent),
    classification: classification(total),
    confidence,
    matchingFeatures,
    missingFeatures,
    differentFeatures: tokenize(candidate.description)
      .filter((token) => !tokenize(projectText).includes(token))
      .slice(0, 6),
    explanation: `${classification(total)} based on title, concepts, technologies, components and available source content. The score is an estimate, not proof of originality.`
  };
}
