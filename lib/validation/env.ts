import { z } from "zod";

const envSchema = z.object({
  WEB_SEARCH_PROVIDER: z.enum(["tavily", "google", "brave", "bing", "mock"]).default("tavily"),
  AI_PROVIDER: z
    .enum([
      "local",
      "mock",
      "groq",
      "gemini",
      "openai",
      "openai-compatible",
      "ollama",
      "huggingface"
    ])
    .default("local"),
  RATE_LIMIT_REQUESTS: z.coerce.number().int().positive().max(1000).default(20),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().max(86400).default(60),
  CACHE_DURATION_SECONDS: z.coerce.number().int().nonnegative().max(86400).default(3600),
  ENABLE_DEMO_MODE: z.enum(["true", "false"]).default("false")
});

export function validatedEnvironment() {
  const parsed = envSchema.safeParse(process.env);
  if (parsed.success) return { valid: true as const, values: parsed.data, issues: [] as string[] };
  return {
    valid: false as const,
    values: envSchema.parse({}),
    issues: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
  };
}
