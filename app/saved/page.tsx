import { SavedView } from "@/components/storage/saved-view";
export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Saved results</h1>
      <SavedView />
    </section>
  );
}
