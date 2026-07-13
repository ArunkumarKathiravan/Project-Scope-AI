"use client";
import { CheckCircle2, LoaderCircle } from "lucide-react";
const stages = [
  "Analysing your idea",
  "Extracting technical concepts",
  "Generating search queries",
  "Searching enabled providers",
  "Comparing projects",
  "Calculating similarity",
  "Preparing results"
];
export function ProcessingStages() {
  return (
    <div className="rounded-xl border bg-card p-5" role="status">
      <p className="mb-4 font-medium">Search in progress</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2 text-sm text-muted-foreground">
            {i === 0 ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <CheckCircle2 className="h-4 w-4 opacity-40" />
            )}
            {stage}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Stages reflect the actual workflow. No fake percentage or intentional delay is used.
      </p>
    </div>
  );
}
