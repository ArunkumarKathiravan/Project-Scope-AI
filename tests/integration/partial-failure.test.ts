import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/github/client", () => ({
  searchGitHub: vi.fn().mockRejectedValue(new Error("rate limited"))
}));
vi.mock("@/lib/youtube/client", () => ({ searchYouTube: vi.fn().mockResolvedValue([]) }));
vi.mock("@/lib/web-search/providers", () => ({ searchWeb: vi.fn().mockResolvedValue([]) }));
describe("partial provider failure", () => {
  it("returns a response instead of crashing", async () => {
    const { runSearch } = await import("@/lib/search/orchestrator");
    const response = await runSearch({
      title: "Test project",
      description: "A long enough description for a useful engineering project search.",
      category: "Other",
      level: "Beginner",
      technologies: [],
      components: [],
      sources: "github"
    });
    expect(response.outcomes.find((outcome) => outcome.provider === "github")?.ok).toBe(false);
    expect(response.results).toEqual([]);
  });
});
