import type { SearchResponse } from "@/types";
export function toMarkdown(report: SearchResponse) {
  const lines = [
    `# ProjectScope AI Report`,
    ``,
    `**Project:** ${report.analysis.improvedTitle}`,
    `**Search date:** ${report.searchedAt}`,
    `**Category:** ${report.analysis.category}`,
    ``,
    `## Summary`,
    report.analysis.summary,
    ``,
    `## Search queries`,
    ...report.analysis.generatedQueries.map((q) => `- ${q}`),
    ``,
    `## Top results`,
    ...report.results
      .slice(0, 10)
      .flatMap((r) => [
        `### ${r.title}`,
        `- Source: ${r.source}`,
        `- URL: ${r.url}`,
        `- Similarity: ${r.similarity.total}% — ${r.similarity.classification}`,
        `- Confidence: ${r.similarity.confidence}`,
        `- ${r.description}`,
        ``
      ]),
    `## Improvement suggestions`,
    `### Basic version`,
    ...report.improvements.basic.map((item) => `- ${item}`),
    `### Intermediate version`,
    ...report.improvements.intermediate.map((item) => `- ${item}`),
    `### Advanced version`,
    ...report.improvements.advanced.map((item) => `- ${item}`),
    ``,
    `## Provider outcomes`,
    ...report.outcomes.map(
      (outcome) =>
        `- ${outcome.provider}: ${outcome.ok ? "successful" : outcome.configured ? "failed" : "not configured"} — ${outcome.message}`
    ),
    ``,
    `## Disclaimer`,
    report.disclaimer,
    ``,
    `Check each repository licence before reusing code.`
  ];
  return lines.join("\n");
}
export function toCsv(report: SearchResponse) {
  const esc = (v: string | number | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const metadata = [
    ["Project", report.analysis.improvedTitle],
    ["Original title", report.analysis.originalTitle],
    ["Search date", report.searchedAt],
    ["Category", report.analysis.category],
    ["Level", report.analysis.level],
    ["Summary", report.analysis.summary],
    ["Search queries", report.analysis.generatedQueries.join(" | ")],
    ["Technologies", report.analysis.technologies.join(" | ")],
    ["Components", report.analysis.components.join(" | ")],
    ["Disclaimer", report.disclaimer]
  ];
  return [
    ...metadata.map((row) => row.map(esc).join(",")),
    "",
    [
      "Source",
      "Title",
      "URL",
      "Similarity",
      "Classification",
      "Confidence",
      "Matching features",
      "Missing features",
      "Description"
    ]
      .map(esc)
      .join(","),
    ...report.results.map((r) =>
      [
        r.source,
        r.title,
        r.url,
        r.similarity.total,
        r.similarity.classification,
        r.similarity.confidence,
        r.similarity.matchingFeatures.join(" | "),
        r.similarity.missingFeatures.join(" | "),
        r.description
      ]
        .map(esc)
        .join(",")
    ),
    "",
    ["Improvement level", "Suggestion"].map(esc).join(","),
    ...(["basic", "intermediate", "advanced"] as const).flatMap((level) =>
      report.improvements[level].map((item) => [level, item].map(esc).join(","))
    )
  ].join("\n");
}
export function exportPayload(report: SearchResponse, format: "json" | "markdown" | "csv") {
  if (format === "json") return JSON.stringify(report, null, 2);
  if (format === "csv") return toCsv(report);
  return toMarkdown(report);
}
