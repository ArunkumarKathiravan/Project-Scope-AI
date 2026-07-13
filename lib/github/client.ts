import type { ProjectAnalysis, SearchResult } from "@/types";
import { calculateSimilarity } from "@/lib/scoring/similarity";
import { safeExternalText } from "@/lib/security/untrusted";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  owner: { login: string; avatar_url: string; html_url: string };
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { spdx_id?: string; name?: string } | null;
  archived: boolean;
  fork: boolean;
  default_branch: string;
  updated_at: string;
  pushed_at: string;
}
interface GitHubSearchResponse {
  items?: GitHubRepo[];
  message?: string;
}
interface GitHubReadmeResponse {
  content?: string;
  encoding?: string;
}
const headers = () => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
});

async function readReadme(fullName: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers: headers(),
      signal: AbortSignal.timeout(7000),
      next: { revalidate: 3600 }
    });
    if (!response.ok) return "";
    const data = (await response.json()) as GitHubReadmeResponse;
    if (!data.content || data.encoding !== "base64") return "";
    return safeExternalText(
      Buffer.from(data.content.replace(/\s/g, ""), "base64").toString("utf8"),
      1600
    );
  } catch {
    return "";
  }
}

export function transformGitHubRepo(
  repo: GitHubRepo,
  project: ProjectAnalysis,
  readmeSummary = ""
): SearchResult {
  const base = {
    id: `github-${repo.id}`,
    source: "github" as const,
    title: repo.full_name,
    description: safeExternalText(repo.description || "No repository description provided."),
    url: repo.html_url,
    author: repo.owner.login,
    authorUrl: repo.owner.html_url,
    imageUrl: repo.owner.avatar_url,
    updatedAt: repo.updated_at,
    language: repo.language || undefined,
    topics: repo.topics || [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    license: repo.license?.spdx_id || repo.license?.name || "Not specified",
    archived: repo.archived,
    isFork: repo.fork,
    defaultBranch: repo.default_branch,
    readmeSummary: safeExternalText(readmeSummary, 1200),
    resultType: "Open-Source Project",
    metadata: { pushedAt: repo.pushed_at }
  };
  return { ...base, similarity: calculateSimilarity(project, base) };
}

export async function searchGitHub(
  project: ProjectAnalysis,
  queries: string[]
): Promise<SearchResult[]> {
  const repositories = new Map<number, GitHubRepo>();
  for (const query of queries.slice(0, 3)) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const qualified = `${query} in:name,description,readme`;
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(qualified)}&sort=updated&order=desc&per_page=6`,
      { headers: headers(), signal: controller.signal, next: { revalidate: 3600 } }
    );
    clearTimeout(timeout);
    if (response.status === 403 || response.status === 429)
      throw new Error("GitHub API rate limit reached.");
    if (!response.ok) throw new Error(`GitHub search failed with status ${response.status}.`);
    const data = (await response.json()) as GitHubSearchResponse;
    for (const repo of data.items ?? []) repositories.set(repo.id, repo);
  }
  const rows = [...repositories.values()];
  const readmes = new Map<number, string>();
  await Promise.all(
    rows.slice(0, 6).map(async (repo) => readmes.set(repo.id, await readReadme(repo.full_name)))
  );
  return rows.map((repo) => transformGitHubRepo(repo, project, readmes.get(repo.id) || ""));
}
