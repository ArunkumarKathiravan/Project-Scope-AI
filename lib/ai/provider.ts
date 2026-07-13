import type { ProjectAnalysis, ProjectInput, SearchResult, SimilarityBreakdown } from "@/types";
export interface AIProvider {
  name: string;
  configured: boolean;
  analyseIdea(input: ProjectInput): Promise<ProjectAnalysis>;
  generateSearchQueries(analysis: ProjectAnalysis): Promise<string[]>;
  compareProject(project: ProjectAnalysis, result: SearchResult): Promise<SimilarityBreakdown>;
}
