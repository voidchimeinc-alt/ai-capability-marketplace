import {
  benchmarks,
  benchmarkResults,
  builders,
  companyProjects,
  exampleStacks,
  projectApplications,
  tools,
  useCases,
} from "@/data/seed";
import type {
  BenchmarkChallenge,
  BenchmarkResult,
  Builder,
  CompanyProject,
  AiStack,
  ProjectApplication,
  ToolEntity,
  UseCase,
} from "@/types/domain";

export interface CatalogStore {
  listTools(filters?: {
    kind?: string;
    category?: string;
    q?: string;
    useCase?: string;
  }): ToolEntity[];
  getToolBySlug(slug: string): ToolEntity | null;
  getToolsByIds(ids: string[]): ToolEntity[];
  listUseCases(): UseCase[];
  getUseCaseBySlug(slug: string): UseCase | null;
  listBuilders(filters?: { q?: string; capability?: string; availability?: string }): Builder[];
  getBuilderBySlug(slug: string): Builder | null;
  listBenchmarks(): BenchmarkChallenge[];
  getBenchmarkBySlug(slug: string): BenchmarkChallenge | null;
  listBenchmarkResults(benchmarkId?: string): BenchmarkResult[];
  listProjects(filters?: { status?: string; q?: string }): CompanyProject[];
  getProjectBySlug(slug: string): CompanyProject | null;
  listApplications(projectId?: string): ProjectApplication[];
  listStacks(): AiStack[];
  search(query: string): {
    tools: ToolEntity[];
    builders: Builder[];
    useCases: UseCase[];
    projects: CompanyProject[];
  };
}

function normalize(s: string) {
  return s.toLowerCase();
}

function matchesQuery(haystack: string, q: string) {
  return normalize(haystack).includes(normalize(q));
}

export const seedCatalog: CatalogStore = {
  listTools(filters = {}) {
    return tools.filter((tool) => {
      if (filters.kind && tool.kind !== filters.kind) return false;
      if (filters.category && normalize(tool.category) !== normalize(filters.category)) return false;
      if (filters.useCase && !tool.useCaseSlugs.includes(filters.useCase)) return false;
      if (filters.q) {
        const blob = [
          tool.name,
          tool.shortDescription,
          tool.category,
          ...tool.tags,
          ...tool.bestFor,
          ...tool.bestUseCases,
        ].join(" ");
        if (!matchesQuery(blob, filters.q)) return false;
      }
      return true;
    });
  },

  getToolBySlug(slug) {
    return tools.find((t) => t.slug === slug) ?? null;
  },

  getToolsByIds(ids) {
    const set = new Set(ids);
    return tools.filter((t) => set.has(t.id));
  },

  listUseCases() {
    return useCases;
  },

  getUseCaseBySlug(slug) {
    return useCases.find((u) => u.slug === slug) ?? null;
  },

  listBuilders(filters = {}) {
    return builders.filter((b) => {
      if (filters.availability && b.availability !== filters.availability) return false;
      if (filters.capability) {
        const cap = normalize(filters.capability);
        const hit = [...b.capabilities, ...b.specializations, ...b.stack].some((x) =>
          matchesQuery(x, cap),
        );
        if (!hit) return false;
      }
      if (filters.q) {
        const blob = [b.name, b.title, b.bio, ...b.capabilities, ...b.stack, ...b.specializations].join(
          " ",
        );
        if (!matchesQuery(blob, filters.q)) return false;
      }
      return true;
    });
  },

  getBuilderBySlug(slug) {
    return builders.find((b) => b.slug === slug) ?? null;
  },

  listBenchmarks() {
    return benchmarks;
  },

  getBenchmarkBySlug(slug) {
    return benchmarks.find((b) => b.slug === slug) ?? null;
  },

  listBenchmarkResults(benchmarkId) {
    return benchmarkId
      ? benchmarkResults.filter((r) => r.benchmarkId === benchmarkId)
      : benchmarkResults;
  },

  listProjects(filters = {}) {
    return companyProjects.filter((p) => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.q) {
        const blob = [p.title, p.problem, p.desiredOutcome, p.industry, ...p.requiredCapabilities].join(
          " ",
        );
        if (!matchesQuery(blob, filters.q)) return false;
      }
      return true;
    });
  },

  getProjectBySlug(slug) {
    return companyProjects.find((p) => p.slug === slug) ?? null;
  },

  listApplications(projectId) {
    return projectId
      ? projectApplications.filter((a) => a.projectId === projectId)
      : projectApplications;
  },

  listStacks() {
    return exampleStacks;
  },

  search(query) {
    const q = query.trim();
    if (!q) {
      return { tools: [], builders: [], useCases: [], projects: [] };
    }
    return {
      tools: this.listTools({ q }).slice(0, 8),
      builders: this.listBuilders({ q }).slice(0, 6),
      useCases: this.listUseCases().filter((u) =>
        matchesQuery([u.name, u.problemStatement, ...u.exampleQueries].join(" "), q),
      ).slice(0, 6),
      projects: this.listProjects({ q }).slice(0, 4),
    };
  },
};

export function getCatalog(): CatalogStore {
  // Future: DATA_SOURCE=supabase adapter
  return seedCatalog;
}
