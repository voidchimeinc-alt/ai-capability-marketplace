import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/db/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const catalog = getCatalog();

  const staticRoutes = ["", "/ai/tools", "/ai/compare", "/ai/recommend", "/ai/use-cases", "/arena", "/network", "/projects", "/search"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    }),
  );

  const tools = catalog.listTools().map((t) => ({
    url: `${base}/ai/tools/${t.slug}`,
    lastModified: new Date(),
  }));
  const builders = catalog.listBuilders().map((b) => ({
    url: `${base}/builders/${b.slug}`,
    lastModified: new Date(),
  }));
  const benchmarks = catalog.listBenchmarks().map((b) => ({
    url: `${base}/ai/benchmarks/${b.slug}`,
    lastModified: new Date(),
  }));
  const projects = catalog.listProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...tools, ...builders, ...benchmarks, ...projects];
}
