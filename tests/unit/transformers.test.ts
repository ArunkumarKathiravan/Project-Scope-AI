import { describe, expect, it } from "vitest";
import { transformGitHubRepo } from "@/lib/github/client";
import { transformYouTubeItem } from "@/lib/youtube/client";
import { analyseLocally } from "@/lib/search/query-generator";
import { transformWebResult } from "@/lib/web-search/providers";
const p = analyseLocally({
  title: "ESP32 automation",
  description:
    "ESP32 relay automation with a web dashboard and physical switch feedback for home users.",
  category: "Internet of Things",
  level: "Beginner",
  technologies: ["ESP32"],
  components: ["Relay"],
  sources: "all"
});
describe("provider transformers", () => {
  it("transforms GitHub data", () => {
    const r = transformGitHubRepo(
      {
        id: 1,
        name: "repo",
        full_name: "a/repo",
        html_url: "https://github.com/a/repo",
        description: "ESP32 relay",
        owner: {
          login: "a",
          avatar_url: "https://avatars.githubusercontent.com/u/1",
          html_url: "https://github.com/a"
        },
        language: "C++",
        topics: ["esp32"],
        stargazers_count: 2,
        forks_count: 1,
        open_issues_count: 0,
        license: { spdx_id: "MIT" },
        archived: false,
        fork: false,
        default_branch: "main",
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString()
      },
      p
    );
    expect(r.source).toBe("github");
  });
  it("transforms a web result and rejects unsafe URLs", () => {
    const result = transformWebResult(
      {
        title: "University ESP32 project",
        url: "https://example.edu/project",
        snippet: "Research and documentation for an ESP32 relay"
      },
      p,
      0
    );
    expect(result?.source).toBe("web");
    expect(transformWebResult({ title: "bad", url: "javascript:alert(1)" }, p, 1)).toBeNull();
  });
  it("transforms YouTube data", () => {
    const r = transformYouTubeItem(
      {
        id: { videoId: "abc" },
        snippet: {
          title: "ESP32 tutorial",
          description: "relay project",
          channelTitle: "Lab",
          channelId: "c",
          publishedAt: new Date().toISOString(),
          thumbnails: {}
        }
      },
      { id: "abc", statistics: { viewCount: "42" }, contentDetails: { duration: "PT3M" } },
      p
    );
    expect(r?.viewCount).toBe(42);
  });
});
