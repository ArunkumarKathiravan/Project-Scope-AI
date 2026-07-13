import type { AIProvider } from "@/lib/ai/provider";
import { analyseLocally, generateQueries } from "@/lib/search/query-generator";
import { calculateSimilarity } from "@/lib/scoring/similarity";
export const localAIProvider: AIProvider = {
  name: "local",
  configured: true,
  async analyseIdea(input) {
    return analyseLocally(input);
  },
  async generateSearchQueries(analysis) {
    return generateQueries(analysis);
  },
  async compareProject(project, result) {
    return calculateSimilarity(project, result);
  }
};
