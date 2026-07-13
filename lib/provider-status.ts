import { activeAIProviderName, isExternalAIConfigured } from "@/lib/ai";
import { cacheStatus } from "@/lib/cache/memory";
import { validatedEnvironment } from "@/lib/validation/env";
export function getProviderStatus() {
  const environment = validatedEnvironment();
  const web = environment.values.WEB_SEARCH_PROVIDER;
  const webConfigured =
    web === "mock"
      ? true
      : web === "google"
        ? Boolean(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID)
        : web === "brave"
          ? Boolean(process.env.BRAVE_SEARCH_API_KEY)
          : web === "bing"
            ? Boolean(process.env.BING_SEARCH_API_KEY)
            : Boolean(process.env.TAVILY_API_KEY);
  return {
    application: { status: "Operational" },
    github: { status: "Operational", authenticated: Boolean(process.env.GITHUB_TOKEN) },
    youtube: { status: process.env.YOUTUBE_API_KEY ? "Configured" : "Not configured" },
    web: { status: webConfigured ? "Configured" : "Not configured", provider: web },
    ai: {
      status: isExternalAIConfigured() ? "Configured" : "Not configured",
      provider: activeAIProviderName(),
      fallback: "local"
    },
    ollama: {
      status:
        activeAIProviderName() === "ollama" && isExternalAIConfigured("ollama")
          ? "Configured"
          : "Not configured"
    },
    cache: { status: "Operational", ...cacheStatus() },
    environment: {
      status: environment.valid ? "Operational" : "Invalid",
      issues: environment.issues
    },
    demoMode: environment.values.ENABLE_DEMO_MODE === "true"
  };
}
