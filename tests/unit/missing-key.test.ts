import { expect, it, vi } from "vitest";
it("YouTube reports missing key without exposing secrets", async () => {
  vi.stubEnv("YOUTUBE_API_KEY", "");
  const { searchYouTube } = await import("@/lib/youtube/client");
  await expect(
    searchYouTube(
      {
        originalTitle: "a",
        improvedTitle: "a",
        summary: "a",
        category: "Other",
        level: "Beginner",
        keywords: [],
        technologies: [],
        components: [],
        intendedUsers: [],
        problem: "",
        expectedOutput: "",
        generatedQueries: []
      },
      ["a"]
    )
  ).rejects.toThrow("not configured");
  vi.unstubAllEnvs();
});
