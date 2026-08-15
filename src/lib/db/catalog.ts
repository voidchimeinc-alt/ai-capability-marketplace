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
import { getUseCasesForBuilder } from "@/data/seed/builder-use-cases";
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

function enrichBuilder(builder: Builder): Builder {
  return {
    ...builder,
    useCaseSlugs: builder.useCaseSlugs?.length
      ? builder.useCaseSlugs
      : getUseCasesForBuilder(builder.id),
    moderationStatus: builder.moderationStatus ?? "approved",
  };
}

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
  listBuilders(filters?: {
    q?: string;
    capability?: string;
    technology?: string;
    useCase?: string;
    availability?: string;
    location?: string;
    projectType?: string;
  }): Builder[];
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
    return builders.map(enrichBuilder).filter((b) => {
      if (filters.availability && b.availability !== filters.availability) return false;
      if (filters.capability) {
        const cap = normalize(filters.capability);
        const hit = [...b.capabilities, ...b.specializations, ...b.stack, b.title].some((x) =>
          matchesQuery(x, cap),
        );
        if (!hit) return false;
      }
      if (filters.technology) {
        const tech = normalize(filters.technology);
        const hit = [...b.stack, ...b.projects.flatMap((p) => p.technologies)].some((x) =>
          matchesQuery(x, tech),
        );
        if (!hit) return false;
      }
      if (filters.useCase) {
        const uc = normalize(filters.useCase);
        const slugHit = (b.useCaseSlugs ?? []).some((s) => matchesQuery(s, uc));
        const textHit = [...b.specializations, ...b.preferredProjectTypes, b.bio].some((x) =>
          matchesQuery(x, uc),
        );
        if (!slugHit && !textHit) return false;
      }
      if (filters.location) {
        const loc = normalize(filters.location);
        if (!matchesQuery(b.location, loc) && !matchesQuery(b.timezone, loc)) return false;
      }
      if (filters.projectType) {
        const pt = normalize(filters.projectType);
        const hit = b.preferredProjectTypes.some((x) => matchesQuery(x, pt));
        if (!hit) return false;
      }
      if (filters.q) {
        const blob = [
          b.name,
          b.title,
          b.bio,
          b.location,
          b.timezone,
          ...b.capabilities,
          ...b.stack,
          ...b.specializations,
          ...(b.useCaseSlugs ?? []),
          ...b.preferredProjectTypes,
        ].join(" ");
        const terms = filters.q
          .toLowerCase()
          .split(/[\s,/|]+/)
          .filter((t) => t.length > 1);
        const hit = terms.length
          ? terms.some((term) => matchesQuery(blob, term))
          : matchesQuery(blob, filters.q);
        if (!hit) return false;
      }
      return true;
    });
  },

  getBuilderBySlug(slug) {
    const builder = builders.find((b) => b.slug === slug);
    return builder ? enrichBuilder(builder) : null;
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
