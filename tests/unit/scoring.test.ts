import { describe, expect, it } from "vitest";
import { calculateSimilarity, classification } from "@/lib/scoring/similarity";
import { analyseLocally } from "@/lib/search/query-generator";
const input = {
  title: "ESP32 Voice Home Automation",
  description:
    "ESP32 voice controlled relay system for elderly users with physical wall switches and status feedback.",
  category: "Internet of Things" as const,
  level: "Intermediate" as const,
  technologies: ["ESP32"],
  components: ["Relay", "Wall switch"],
  sources: "all" as const
};
describe("similarity", () => {
  it("classifies score bands", () => {
    expect(classification(91)).toBe("Exact or Near-Exact Match");
    expect(classification(10)).toBe("No Strong Match Found");
  });
  it("scores a close result above an unrelated one", () => {
    const p = analyseLocally(input);
    const close = calculateSimilarity(p, {
      title: "ESP32 voice home automation",
      description: "Relay and physical switch control for elderly users",
      topics: ["esp32", "iot"],
      language: "C++",
      readmeSummary: "Accessible home automation"
    });
    const far = calculateSimilarity(p, {
      title: "Concrete strength calculator",
      description: "Civil engineering spreadsheet"
    });
    expect(close.total).toBeGreaterThan(far.total);
  });
});
