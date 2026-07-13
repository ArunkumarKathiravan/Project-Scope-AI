import type { AIProvider } from "@/lib/ai/provider";
import { localAIProvider } from "@/lib/ai/local";
import { createRemoteAIProvider } from "@/lib/ai/remote";

export function activeAIProviderName() {
  return (process.env.AI_PROVIDER || "local").toLowerCase();
}

export function isExternalAIConfigured(name = activeAIProviderName()) {
  if (name === "groq") return Boolean(process.env.GROQ_API_KEY);
  if (name === "gemini") return Boolean(process.env.GEMINI_API_KEY);
  if (name === "openai" || name === "openai-compatible")
    return Boolean(process.env.OPENAI_API_KEY && process.env.AI_BASE_URL);
  if (name === "ollama") return Boolean(process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL);
  if (name === "huggingface")
    return Boolean(process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_MODEL);
  return name === "mock" || name === "local";
}

export function getAIProvider(): AIProvider {
  const selected = activeAIProviderName();
  if (selected === "mock") return { ...localAIProvider, name: "mock" };
  if (selected === "openai")
    return isExternalAIConfigured("openai")
      ? createRemoteAIProvider("openai-compatible")
      : localAIProvider;
  if (
    ["groq", "gemini", "openai-compatible", "ollama", "huggingface"].includes(selected) &&
    isExternalAIConfigured(selected)
  ) {
    return createRemoteAIProvider(
      selected as "groq" | "gemini" | "openai-compatible" | "ollama" | "huggingface"
    );
  }
  return localAIProvider;
}
