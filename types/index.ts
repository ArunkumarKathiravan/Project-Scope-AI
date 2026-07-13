export const categories = [
  "Electronics",
  "Embedded Systems",
  "Internet of Things",
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Robotics",
  "Renewable Energy",
  "Agriculture",
  "Healthcare",
  "Education",
  "Cybersecurity",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other"
] as const;
export const projectLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Final-Year Project",
  "Research Project",
  "Commercial Product"
] as const;
export const searchSourceOptions = ["github", "youtube", "web", "github-youtube", "all"] as const;

export type ProjectCategory = (typeof categories)[number];
export type ProjectLevel = (typeof projectLevels)[number];
export type SearchSourceOption = (typeof searchSourceOptions)[number];
export type ProviderName = "github" | "youtube" | "web" | "ai";
export type ProviderState =
  | "Configured"
  | "Not configured"
  | "Invalid"
  | "Operational"
  | "Rate limited"
  | "Unavailable"
  | "Limited";
export type ResultSource = "github" | "youtube" | "web";

export interface ProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  level: ProjectLevel;
  technologies: string[];
  components: string[];
  sources: SearchSourceOption;
}

export interface ProjectAnalysis {
  originalTitle: string;
  improvedTitle: string;
  summary: string;
  category: ProjectCategory;
  level: ProjectLevel;
  keywords: string[];
  technologies: string[];
  components: string[];
  intendedUsers: string[];
  problem: string;
  expectedOutput: string;
  generatedQueries: string[];
}

export interface SimilarityBreakdown {
  total: number;
  semantic: number;
  title: number;
  keyword: number;
  technology: number;
  component: number;
  category: number;
  sourceContent: number;
  classification:
    | "Exact or Near-Exact Match"
    | "Highly Similar"
    | "Related Project"
    | "Weakly Related"
    | "No Strong Match Found";
  confidence: "High" | "Medium" | "Low";
  matchingFeatures: string[];
  missingFeatures: string[];
  differentFeatures: string[];
  explanation: string;
}

export interface SearchResult {
  id: string;
  source: ResultSource;
  title: string;
  description: string;
  url: string;
  author?: string;
  authorUrl?: string;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  language?: string;
  topics?: string[];
  stars?: number;
  forks?: number;
  openIssues?: number;
  license?: string;
  archived?: boolean;
  isFork?: boolean;
  defaultBranch?: string;
  readmeSummary?: string;
  viewCount?: number;
  duration?: string;
  resultType?: string;
  domain?: string;
  similarity: SimilarityBreakdown;
  metadata?: Record<string, string | number | boolean | string[] | undefined>;
}

export interface ProviderOutcome {
  provider: ProviderName;
  ok: boolean;
  configured: boolean;
  message: string;
  count: number;
}

export interface ImprovementSuggestions {
  basic: string[];
  intermediate: string[];
  advanced: string[];
  alternativeTitles: string[];
  suggestedTechnologies: string[];
  suggestedComponents: string[];
  safety: string[];
  privacy: string[];
  futureScope: string[];
  academicTopics: string[];
}

export interface SearchResponse {
  id: string;
  searchedAt: string;
  analysis: ProjectAnalysis;
  results: SearchResult[];
  outcomes: ProviderOutcome[];
  improvements: ImprovementSuggestions;
  demoMode: boolean;
  disclaimer: string;
}

export interface SavedItem {
  id: string;
  savedAt: string;
  note: string;
  result: SearchResult;
  project: ProjectAnalysis;
}
export interface HistoryItem {
  id: string;
  searchedAt: string;
  input: ProjectInput;
  response: SearchResponse;
}
