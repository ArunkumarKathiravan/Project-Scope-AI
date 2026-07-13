import { expect, it } from "vitest";
import { dedupeResults } from "@/lib/search/dedupe";
import type { SearchResult } from "@/types";
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
it("removes URL duplicates per source", () => {
  const rows = [
    {
      id: "1",
      source: "web",
      title: "a",
      description: "",
      url: "https://example.com/x",
      similarity
    },
    {
      id: "2",
      source: "web",
      title: "b",
      description: "",
      url: "https://example.com/x/",
      similarity
    }
  ] satisfies SearchResult[];
  expect(dedupeResults(rows)).toHaveLength(1);
});
