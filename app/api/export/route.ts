import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { SearchResponse } from "@/types";
import { exportPayload, toMarkdown } from "@/lib/export/report";
const schema = z.object({
  format: z.enum(["json", "markdown", "csv", "pdf"]),
  report: z.custom<SearchResponse>()
});
function wrap(text: string, width = 92) {
  const words = text.replace(/\s+/g, " ").split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > width) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}
export async function POST(request: NextRequest) {
  try {
    const parsed = schema.parse(await request.json());
    if (parsed.format !== "pdf") {
      const body = exportPayload(parsed.report, parsed.format);
      const type =
        parsed.format === "json"
          ? "application/json"
          : parsed.format === "csv"
            ? "text/csv"
            : "text/markdown";
      return new NextResponse(body, {
        headers: {
          "Content-Type": `${type}; charset=utf-8`,
          "Content-Disposition": `attachment; filename=projectscope-report.${parsed.format === "markdown" ? "md" : parsed.format}`
        }
      });
    }
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const pages: ReturnType<typeof pdf.addPage>[] = [];
    let page = pdf.addPage([595, 842]);
    pages.push(page);
    let y = 800;
    const addLine = (text: string, size = 10, isBold = false) => {
      for (const line of wrap(text, size >= 16 ? 55 : 92)) {
        if (y < 50) {
          page = pdf.addPage([595, 842]);
          pages.push(page);
          y = 800;
        }
        page.drawText(line, {
          x: 45,
          y,
          size,
          font: isBold ? bold : font,
          color: rgb(0.08, 0.12, 0.2)
        });
        y -= size + 5;
      }
    };
    addLine("ProjectScope AI Report", 20, true);
    addLine(parsed.report.analysis.improvedTitle, 14, true);
    addLine(`Search date: ${parsed.report.searchedAt}`);
    y -= 6;
    for (const line of toMarkdown(parsed.report).split("\n").filter(Boolean).slice(2))
      addLine(
        line.replace(/^#+\s*/, ""),
        line.startsWith("##") ? 13 : line.startsWith("###") ? 11 : 9,
        line.startsWith("#")
      );
    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=projectscope-report.pdf"
      }
    });
  } catch {
    return NextResponse.json({ error: "Export failed." }, { status: 400 });
  }
}
