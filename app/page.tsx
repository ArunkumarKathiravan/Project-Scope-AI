import { ProjectSearchForm } from "@/components/forms/project-search-form";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { HomeStorageSummary } from "@/components/storage/home-storage-summary";
export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <Badge>Engineering project discovery</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Discover, compare and analyse project ideas across public technical sources.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Enter your project idea to find related repositories, videos and web resources.
            ProjectScope AI explains similarities transparently and never treats a search result as
            legal proof of originality.
          </p>
          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
            <Feature
              icon={<Search />}
              title="Multi-source search"
              text="GitHub, YouTube and configurable web providers."
            />
            <Feature
              icon={<SlidersHorizontal />}
              title="Transparent scoring"
              text="See title, keyword, technology and component overlap."
            />
            <Feature
              icon={<ShieldCheck />}
              title="Safe by design"
              text="Server-side keys, validation and untrusted-content isolation."
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <ProjectSearchForm />
        <HomeStorageSummary />
      </section>
    </>
  );
}
function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-background/80 p-4">
      <div className="mb-3 text-primary">{icon}</div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
