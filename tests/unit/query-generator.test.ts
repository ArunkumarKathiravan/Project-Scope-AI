import { expect, it } from "vitest";
import { analyseLocally } from "@/lib/search/query-generator";
it("generates distinct technical queries", () => {
  const a = analyseLocally({
    title: "Solar monitor",
    description:
      "Monitor voltage current and temperature from a solar panel and generate alerts for maintenance staff.",
    category: "Renewable Energy",
    level: "Intermediate",
    technologies: ["Arduino"],
    components: ["Voltage sensor"],
    sources: "all"
  });
  expect(a.generatedQueries.length).toBeGreaterThan(2);
  expect(new Set(a.generatedQueries).size).toBe(a.generatedQueries.length);
});
