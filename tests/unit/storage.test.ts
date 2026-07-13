import { beforeEach, describe, expect, it } from "vitest";
import { historyStorage, savedStorage } from "@/lib/storage/client-storage";
import type { HistoryItem, SavedItem } from "@/types";

const similarity = {
  total: 1,
  semantic: 1,
  title: 1,
  keyword: 1,
  technology: 1,
  component: 1,
  category: 1,
  sourceContent: 1,
  classification: "No Strong Match Found" as const,
  confidence: "Low" as const,
  matchingFeatures: [],
  missingFeatures: [],
  differentFeatures: [],
  explanation: ""
};
const analysis = {
  originalTitle: "A",
  improvedTitle: "A",
  summary: "A project summary",
  category: "Other" as const,
  level: "Beginner" as const,
  keywords: [],
  technologies: [],
  components: [],
  intendedUsers: [],
  problem: "p",
  expectedOutput: "o",
  generatedQueries: []
};
const result = {
  id: "r",
  source: "web" as const,
  title: "Result",
  description: "Description",
  url: "https://example.com",
  similarity
};
const response = {
  id: "h",
  searchedAt: "2026-01-01",
  analysis,
  results: [result],
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
  disclaimer: "d"
};
const input = {
  title: "Test project",
  description: "A sufficiently detailed test project description.",
  category: "Other" as const,
  level: "Beginner" as const,
  technologies: [],
  components: [],
  sources: "all" as const
};

beforeEach(() => localStorage.clear());
describe("local storage", () => {
  it("adds and reads history", () => {
    const item: HistoryItem = { id: "h", searchedAt: "2026-01-01", input, response };
    historyStorage.add(item);
    expect(historyStorage.list()[0]?.id).toBe("h");
  });
  it("adds, updates and removes saved results", () => {
    const item: SavedItem = { id: "r", savedAt: "2026-01-01", note: "", result, project: analysis };
    savedStorage.add(item);
    savedStorage.updateNote("r", "Useful");
    expect(savedStorage.list()[0]?.note).toBe("Useful");
    savedStorage.remove("r");
    expect(savedStorage.list()).toEqual([]);
  });
  it("clears stores", () => {
    historyStorage.clear();
    savedStorage.clear();
    expect(historyStorage.list()).toEqual([]);
    expect(savedStorage.list()).toEqual([]);
  });
});
