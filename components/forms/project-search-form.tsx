"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/forms/tag-input";
import { ProcessingStages } from "@/components/search/processing-stages";
import { categories, projectLevels, type ProjectInput, type SearchResponse } from "@/types";
import { projectInputSchema } from "@/lib/validation/project";
import { historyStorage } from "@/lib/storage/client-storage";
const examples: ProjectInput[] = [
  {
    title: "Accessible ESP32 Home Automation",
    description:
      "An ESP32 system for elderly and disabled people to control lights through voice commands, a web dashboard and physical wall switches with real-time status feedback.",
    category: "Internet of Things",
    level: "Intermediate",
    technologies: ["ESP32", "Firebase"],
    components: ["Relay module", "Wall switch"],
    sources: "all"
  },
  {
    title: "Solar Panel Fault Monitor",
    description:
      "A low-cost monitoring system that measures solar-panel voltage, current and temperature, detects abnormal output and displays maintenance alerts.",
    category: "Renewable Energy",
    level: "Final-Year Project",
    technologies: ["Arduino", "IoT"],
    components: ["Voltage sensor", "Current sensor", "Temperature sensor"],
    sources: "github-youtube"
  }
];
const initial: ProjectInput = {
  title: "",
  description: "",
  category: "Electronics",
  level: "Beginner",
  technologies: [],
  components: [],
  sources: "all"
};
export function ProjectSearchForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const mutation = useMutation({
    mutationFn: async (payload: ProjectInput) => {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as SearchResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Search failed.");
      return data;
    },
    onSuccess: (response) => {
      sessionStorage.setItem("projectscope:latest", JSON.stringify(response));
      historyStorage.add({
        id: response.id,
        searchedAt: response.searchedAt,
        input: form,
        response
      });
      router.push("/results");
    }
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = projectInputSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    mutation.mutate(parsed.data);
  };
  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-soft md:p-7">
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            Project title{" "}
            <Input
              value={form.title}
              maxLength={150}
              placeholder="e.g. Accessible ESP32 Home Automation"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <span className="text-right text-xs text-muted-foreground">
              {form.title.length}/150
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Project description{" "}
            <Textarea
              value={form.description}
              maxLength={5000}
              placeholder="Explain the problem, users, working method, technology and expected output."
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <span className="text-right text-xs text-muted-foreground">
              {form.description.length}/5000
            </span>
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Category{" "}
              <Select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ProjectInput["category"] })
                }
              >
                {categories.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Project level{" "}
              <Select
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: e.target.value as ProjectInput["level"] })
                }
              >
                {projectLevels.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Technologies{" "}
              <TagInput
                value={form.technologies}
                onChange={(technologies) => setForm({ ...form, technologies })}
                placeholder="ESP32, React, Python…"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Hardware components{" "}
              <TagInput
                value={form.components}
                onChange={(components) => setForm({ ...form, components })}
                placeholder="Relay, sensor, camera…"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Search sources{" "}
            <Select
              value={form.sources}
              onChange={(e) =>
                setForm({ ...form, sources: e.target.value as ProjectInput["sources"] })
              }
            >
              <option value="github">GitHub only</option>
              <option value="youtube">YouTube only</option>
              <option value="web">Web only</option>
              <option value="github-youtube">GitHub and YouTube</option>
              <option value="all">Search all sources</option>
            </Select>
          </label>
          {errors.length > 0 && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {errors.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>
          )}
          {mutation.error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {mutation.error.message}
            </p>
          )}
          <Button size="lg" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              "Searching…"
            ) : (
              <>
                Analyse and search <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
      <div>
        <p className="mb-2 text-sm font-medium">Try an example</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button
              key={example.title}
              variant="outline"
              type="button"
              onClick={() => setForm(example)}
            >
              <Sparkles className="h-4 w-4" />
              {example.title}
            </Button>
          ))}
        </div>
      </div>
      {mutation.isPending && <ProcessingStages />}
    </div>
  );
}
