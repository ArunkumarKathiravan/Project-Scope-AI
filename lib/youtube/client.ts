import type { ProjectAnalysis, SearchResult } from "@/types";
import { calculateSimilarity } from "@/lib/scoring/similarity";
import { safeExternalText } from "@/lib/security/untrusted";

interface SearchItem {
  id: { videoId?: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails?: { high?: { url: string }; medium?: { url: string } };
  };
}
interface VideoItem {
  id: string;
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
}
function category(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (/tutorial|how to|step by step/.test(text)) return "Tutorial";
  if (/demo|demonstration|working/.test(text)) return "Demonstration";
  if (/review/.test(text)) return "Review";
  if (/research|paper/.test(text)) return "Research";
  if (/idea|project/.test(text)) return "Project Idea";
  return "Explanation";
}
export function transformYouTubeItem(
  item: SearchItem,
  details: VideoItem | undefined,
  project: ProjectAnalysis
): SearchResult | null {
  const id = item.id.videoId;
  if (!id) return null;
  const base = {
    id: `youtube-${id}`,
    source: "youtube" as const,
    title: safeExternalText(item.snippet.title, 250),
    description: safeExternalText(item.snippet.description),
    url: `https://www.youtube.com/watch?v=${id}`,
    author: item.snippet.channelTitle,
    authorUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
    imageUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
    viewCount: details?.statistics?.viewCount ? Number(details.statistics.viewCount) : undefined,
    duration: details?.contentDetails?.duration,
    resultType: category(item.snippet.title, item.snippet.description)
  };
  return { ...base, similarity: calculateSimilarity(project, base) };
}
export async function searchYouTube(
  project: ProjectAnalysis,
  queries: string[]
): Promise<SearchResult[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YouTube provider is not configured.");
  const all: SearchItem[] = [];
  for (const query of queries.slice(0, 2)) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(9000), next: { revalidate: 3600 } }
    );
    if (!response.ok)
      throw new Error(
        response.status === 403
          ? "YouTube quota or key validation failed."
          : `YouTube search failed with status ${response.status}.`
      );
    const data = (await response.json()) as { items?: SearchItem[] };
    all.push(...(data.items ?? []));
  }
  const ids = all
    .map((i) => i.id.videoId)
    .filter(Boolean)
    .join(",");
  let detailMap = new Map<string, VideoItem>();
  if (ids) {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(9000), next: { revalidate: 3600 } }
    );
    if (r.ok) {
      const data = (await r.json()) as { items?: VideoItem[] };
      detailMap = new Map((data.items ?? []).map((v) => [v.id, v]));
    }
  }
  return all
    .map((item) =>
      transformYouTubeItem(
        item,
        item.id.videoId ? detailMap.get(item.id.videoId) : undefined,
        project
      )
    )
    .filter((item): item is SearchResult => Boolean(item));
}
