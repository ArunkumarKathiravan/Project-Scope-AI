import { expect, it } from "vitest";
import { toCsv, toMarkdown } from "@/lib/export/report";
import type { SearchResponse } from "@/types";
const report = {
  id: "1",
  searchedAt: "2026-01-01",
  analysis: {
    originalTitle: "A",
    improvedTitle: "A",
    summary: "Summary",
    category: "Electronics",
    level: "Beginner",
    keywords: [],
    technologies: [],
    components: [],
    intendedUsers: [],
    problem: "p",
    expectedOutput: "o",
    generatedQueries: ["query"]
  },
  results: [],
  outcomes: [],
  improvements: {
    basic: [],
    intermediate: [],
    advanced: [],
    alternativeTitles: [],
    suggestedTechnologies: [],
    suggestedComponents: [],
    safety: [],
    privacy: [],
    futureScope: [],
    academicTopics: []
  },
  demoMode: false,
  disclaimer: "Disclaimer"
} satisfies SearchResponse;
it("generates markdown and csv", () => {
  expect(toMarkdown(report)).toContain("ProjectScope AI Report");
  expect(toCsv(report)).toContain("Similarity");
});
