import type { Metadata } from "next";
import { ResultsView } from "@/components/results/results-view";
export const metadata: Metadata = { title: "Results" };
export default function Page() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <ResultsView />
    </section>
  );
}
