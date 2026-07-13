import type { ProjectAnalysis, ProjectInput, ProjectCategory } from "@/types";
import { tokenize } from "@/lib/scoring/similarity";
import { unique } from "@/lib/utils";

const userPatterns: Record<string, string[]> = {
  elderly: ["older adults", "senior citizens"],
  disabled: ["accessible", "assistive technology"],
  farmer: ["agriculture users", "small farms"],
  student: ["students", "education"]
};
export function analyseLocally(input: ProjectInput): ProjectAnalysis {
  const keywords = unique(
    tokenize(`${input.title} ${input.description}`).filter((t) => t.length > 2)
  ).slice(0, 18);
  const inferredUsers = Object.entries(userPatterns)
    .filter(([word]) => input.description.toLowerCase().includes(word))
    .flatMap(([, values]) => values);
  const technologies = unique([
    ...input.technologies,
    ...keywords.filter((k) =>
      /esp32|arduino|react|python|firebase|tensorflow|opencv|raspberry|iot|ai|ml/i.test(k)
    )
  ]).slice(0, 30);
  const components = unique([
    ...input.components,
    ...keywords.filter((k) =>
      /sensor|relay|motor|camera|display|oled|module|battery|microcontroller/i.test(k)
    )
  ]).slice(0, 30);
  const improvedTitle = input.title.replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const summary = input.description.replace(/\s+/g, " ").trim();
  const expectedOutput = /detect|monitor|measure/i.test(summary)
    ? "A measurable monitoring or detection result with a clear user-facing output."
    : /control|automation|switch/i.test(summary)
      ? "Reliable control of the target system with visible state feedback."
      : "A working prototype that addresses the described problem.";
  const problem =
    summary.split(/[.!?]/)[0]?.trim() || `A practical problem in ${input.category.toLowerCase()}.`;
  const analysis: ProjectAnalysis = {
    originalTitle: input.title,
    improvedTitle,
    summary,
    category: input.category as ProjectCategory,
    level: input.level,
    keywords,
    technologies,
    components,
    intendedUsers: inferredUsers.length
      ? unique(inferredUsers)
      : ["Target users described by the project"],
    problem,
    expectedOutput,
    generatedQueries: []
  };
  analysis.generatedQueries = generateQueries(analysis);
  return analysis;
}
export function generateQueries(analysis: ProjectAnalysis): string[] {
  const tech = analysis.technologies.slice(0, 3).join(" ");
  const comps = analysis.components.slice(0, 2).join(" ");
  const keys = analysis.keywords.slice(0, 5).join(" ");
  return unique(
    [
      analysis.improvedTitle,
      `${tech} ${keys}`.trim(),
      `${analysis.category} ${keys}`.trim(),
      `${tech} ${comps} project`.trim(),
      `${keys} open source`.trim(),
      `${keys} tutorial demonstration`.trim()
    ].filter((q) => q.length > 4)
  ).slice(0, 8);
}
