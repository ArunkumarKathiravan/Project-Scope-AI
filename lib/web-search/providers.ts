import type { ProjectAnalysis, SearchResult } from "@/types";
import { calculateSimilarity } from "@/lib/scoring/similarity";
import { safeExternalText } from "@/lib/security/untrusted";

export interface RawWebResult {
  title: string;
  url: string;
  content?: string;
  snippet?: string;
  description?: string;
  published_date?: string;
  age?: string;
}
function classify(text: string) {
  const t = text.toLowerCase();
  if (/patent/.test(t)) return "Patent Search";
  if (/university|college/.test(t)) return "University Project";
  if (/student|hackathon/.test(t)) return "Student Project";
  if (/github|open source/.test(t)) return "Open-Source Project";
  if (/paper|journal|research/.test(t)) return "Research Paper";
  if (/documentation|docs/.test(t)) return "Documentation";
  if (/tutorial|how to/.test(t)) return "Tutorial";
  if (/product|buy|pricing/.test(t)) return "Existing Product";
  if (/news/.test(t)) return "News";
  return "Technical Article";
}
export function transformWebResult(
  raw: RawWebResult,
  project: ProjectAnalysis,
  index: number
): SearchResult | null {
  try {
    const u = new URL(raw.url);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    const description = safeExternalText(raw.content || raw.snippet || raw.description || "");
    const base = {
      id: `web-${index}-${Buffer.from(raw.url).toString("base64url").slice(0, 16)}`,
      source: "web" as const,
      title: safeExternalText(raw.title, 250),
      description,
      url: u.toString(),
      domain: u.hostname,
      publishedAt: raw.published_date || raw.age,
      resultType: classify(`${raw.title} ${description}`)
    };
    return { ...base, similarity: calculateSimilarity(project, base) };
  } catch {
    return null;
  }
}
async function tavily(query: string): Promise<RawWebResult[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("Tavily is not configured.");
  const r = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      max_results: 8,
      include_answer: false
    }),
    signal: AbortSignal.timeout(10000)
  });
  if (!r.ok) throw new Error(`Tavily failed with status ${r.status}.`);
  const d = (await r.json()) as { results?: RawWebResult[] };
  return d.results ?? [];
}
async function google(query: string): Promise<RawWebResult[]> {
  const key = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
  if (!key || !cx) throw new Error("Google Programmable Search is not configured.");
  const r = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}&num=8`,
    { signal: AbortSignal.timeout(10000) }
  );
  if (!r.ok) throw new Error(`Google search failed with status ${r.status}.`);
  const d = (await r.json()) as { items?: Array<{ title: string; link: string; snippet: string }> };
  return (d.items ?? []).map((x) => ({ title: x.title, url: x.link, snippet: x.snippet }));
}
async function brave(query: string): Promise<RawWebResult[]> {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) throw new Error("Brave Search is not configured.");
  const r = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8`,
    {
      headers: { Accept: "application/json", "X-Subscription-Token": key },
      signal: AbortSignal.timeout(10000)
    }
  );
  if (!r.ok) throw new Error(`Brave Search failed with status ${r.status}.`);
  const d = (await r.json()) as {
    web?: { results?: Array<{ title: string; url: string; description: string; age?: string }> };
  };
  return d.web?.results ?? [];
}
async function bing(query: string): Promise<RawWebResult[]> {
  const key = process.env.BING_SEARCH_API_KEY;
  if (!key) throw new Error("Bing Search is not configured.");
  const r = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=8`,
    {
      headers: { "Ocp-Apim-Subscription-Key": key },
      signal: AbortSignal.timeout(10000)
    }
  );
  if (!r.ok) throw new Error(`Bing Search failed with status ${r.status}.`);
  const d = (await r.json()) as {
    webPages?: {
      value?: Array<{ name: string; url: string; snippet: string; dateLastCrawled?: string }>;
    };
  };
  return (d.webPages?.value ?? []).map((x) => ({
    title: x.name,
    url: x.url,
    snippet: x.snippet,
    published_date: x.dateLastCrawled
  }));
}
async function mock(query: string): Promise<RawWebResult[]> {
  return [
    {
      title: `[Mock] Technical reference for ${query}`,
      url: "https://example.com/projectscope-mock-result",
      snippet:
        "Clearly labelled mock result for interface and automated testing. This is not live web data."
    }
  ];
}
export async function searchWeb(
  project: ProjectAnalysis,
  queries: string[]
): Promise<SearchResult[]> {
  const provider = (process.env.WEB_SEARCH_PROVIDER || "tavily").toLowerCase();
  const run =
    provider === "google"
      ? google
      : provider === "brave"
        ? brave
        : provider === "bing"
          ? bing
          : provider === "mock"
            ? mock
            : tavily;
  const raws: RawWebResult[] = [];
  for (const query of queries.slice(0, 2)) raws.push(...(await run(query)));
  return raws
    .map((r, i) => transformWebResult(r, project, i))
    .filter((x): x is SearchResult => Boolean(x));
}
