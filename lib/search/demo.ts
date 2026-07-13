import type { ProjectAnalysis, SearchResult } from "@/types";
import { calculateSimilarity } from "@/lib/scoring/similarity";
export function demoResults(project: ProjectAnalysis): SearchResult[] {
  const rows = [
    {
      source: "github" as const,
      id: "demo-gh",
      title: "example-labs/accessible-iot-controller",
      description: `Reference implementation for an accessible ${project.category.toLowerCase()} controller using ${project.technologies.slice(0, 2).join(" and ") || "common web and embedded technologies"}.`,
      url: "https://github.com/topics/iot",
      author: "Example Labs",
      authorUrl: "https://github.com/topics/iot",
      language: project.technologies[0] || "TypeScript",
      topics: project.keywords.slice(0, 5),
      stars: 0,
      forks: 0,
      license: "Example only",
      resultType: "Open-Source Project"
    },
    {
      source: "youtube" as const,
      id: "demo-yt",
      title: `${project.improvedTitle} — demonstration concept`,
      description:
        "Mock demonstration result used only to test the interface. It is not presented as a live YouTube result.",
      url: "https://www.youtube.com/results?search_query=engineering+project",
      author: "Demo provider",
      resultType: "Demonstration"
    },
    {
      source: "web" as const,
      id: "demo-web",
      title: `Technical overview related to ${project.improvedTitle}`,
      description: "Mock technical article used for interface testing when demo mode is enabled.",
      url: "https://example.com/projectscope-demo",
      domain: "example.com",
      resultType: "Technical Article"
    }
  ];
  return rows.map((base) => ({ ...base, similarity: calculateSimilarity(project, base) }));
}
