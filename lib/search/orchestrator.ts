import type {
  ImprovementSuggestions,
  ProjectInput,
  ProviderOutcome,
  SearchResponse,
  SearchResult
} from "@/types";
import { getAIProvider } from "@/lib/ai";
import { searchGitHub } from "@/lib/github/client";
import { searchYouTube } from "@/lib/youtube/client";
import { searchWeb } from "@/lib/web-search/providers";
import { dedupeResults } from "@/lib/search/dedupe";
import { demoResults } from "@/lib/search/demo";
import { NO_MATCH_DISCLAIMER } from "@/lib/constants";

function selected(sources: ProjectInput["sources"], provider: "github" | "youtube" | "web") {
  return (
    sources === "all" ||
    sources === provider ||
    (sources === "github-youtube" && provider !== "web")
  );
}
function configured(provider: "github" | "youtube" | "web") {
  if (provider === "github") return true;
  if (provider === "youtube") return Boolean(process.env.YOUTUBE_API_KEY);
  const p = (process.env.WEB_SEARCH_PROVIDER || "tavily").toLowerCase();
  return p === "mock"
    ? true
    : p === "google"
      ? Boolean(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID)
      : p === "brave"
        ? Boolean(process.env.BRAVE_SEARCH_API_KEY)
        : p === "bing"
          ? Boolean(process.env.BING_SEARCH_API_KEY)
          : Boolean(process.env.TAVILY_API_KEY);
}
function improvements(input: ProjectInput): ImprovementSuggestions {
  return {
    basic: [
      "Define one measurable core feature and build it first.",
      "Use low-cost, widely available components.",
      "Create a simple block diagram and test each module independently."
    ],
    intermediate: [
      "Add persistent storage and clear error recovery.",
      "Improve accessibility, responsive layout and state feedback.",
      "Add authentication only when user-specific cloud data is required."
    ],
    advanced: [
      "Add privacy-preserving analytics and optional AI assistance.",
      "Support offline operation and reliable cloud synchronisation.",
      "Design for modular scaling, observability and secure updates."
    ],
    alternativeTitles: [
      `Smart ${input.title}`,
      `${input.category} ProjectScope Prototype`,
      `${input.title}: Accessible and Scalable Edition`
    ],
    suggestedTechnologies: [
      ...new Set([...input.technologies, "TypeScript", "Automated testing"])
    ].slice(0, 10),
    suggestedComponents: [
      ...new Set([...input.components, "Status indicator", "Protected power supply"])
    ].slice(0, 10),
    safety: [
      "Add electrical protection, current limits and safe enclosures where hardware is used.",
      "Document failure modes and provide a manual override."
    ],
    privacy: [
      "Collect only necessary data and explain retention.",
      "Keep secrets server-side and avoid logging personal information."
    ],
    futureScope: [
      "Mobile companion interface",
      "Offline-first operation",
      "Usage analytics",
      "Multi-user deployment"
    ],
    academicTopics: [
      "Problem definition and literature survey",
      "System architecture",
      "Similarity scoring methodology",
      "Testing and limitations",
      "Ethics, privacy and safety"
    ]
  };
}
export async function runSearch(input: ProjectInput): Promise<SearchResponse> {
  const ai = getAIProvider();
  const analysis = await ai.analyseIdea(input);
  analysis.generatedQueries = await ai.generateSearchQueries(analysis);
  const results: SearchResult[] = [];
  const outcomes: ProviderOutcome[] = [
    {
      provider: "ai",
      ok: true,
      configured: ai.configured,
      count: 0,
      message: `Analysis completed with ${ai.name}${ai.name === "local" ? " fallback" : " provider"}.`
    }
  ];
  const jobs = [
    { name: "github" as const, fn: () => searchGitHub(analysis, analysis.generatedQueries) },
    { name: "youtube" as const, fn: () => searchYouTube(analysis, analysis.generatedQueries) },
    { name: "web" as const, fn: () => searchWeb(analysis, analysis.generatedQueries) }
  ].filter((job) => selected(input.sources, job.name));
  await Promise.all(
    jobs.map(async (job) => {
      const isConfigured = configured(job.name);
      if (!isConfigured) {
        outcomes.push({
          provider: job.name,
          ok: false,
          configured: false,
          count: 0,
          message: `${job.name} provider is not configured.`
        });
        return;
      }
      try {
        const found = await job.fn();
        results.push(...found);
        outcomes.push({
          provider: job.name,
          ok: true,
          configured: true,
          count: found.length,
          message: "Search completed."
        });
      } catch (error) {
        outcomes.push({
          provider: job.name,
          ok: false,
          configured: isConfigured,
          count: 0,
          message: error instanceof Error ? error.message : "Provider failed."
        });
      }
    })
  );
  const demoMode = process.env.ENABLE_DEMO_MODE === "true";
  if (demoMode && results.length === 0) {
    const demo = demoResults(analysis);
    results.push(...demo);
    outcomes.push({
      provider: "ai",
      ok: true,
      configured: true,
      count: demo.length,
      message: "Clearly labelled demo results were used."
    });
  }
  const ranked = dedupeResults(results)
    .sort((a, b) => b.similarity.total - a.similarity.total)
    .slice(0, 40);
  return {
    id: crypto.randomUUID(),
    searchedAt: new Date().toISOString(),
    analysis,
    results: ranked,
    outcomes,
    improvements: improvements(input),
    demoMode,
    disclaimer:
      ranked[0]?.similarity.total && ranked[0].similarity.total >= 50
        ? "Public matches were ranked using an automated, transparent similarity estimate. Results may be incomplete."
        : NO_MATCH_DISCLAIMER
  };
}
