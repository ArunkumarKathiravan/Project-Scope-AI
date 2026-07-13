import type { Metadata } from "next";
import { ComparisonView } from "@/components/comparison/comparison-view";
export const metadata: Metadata = { title: "Compare" };
export default function Page() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Project comparison</h1>
      <ComparisonView />
    </section>
  );
}
