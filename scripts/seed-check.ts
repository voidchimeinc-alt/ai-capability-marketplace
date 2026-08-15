import { getCatalog } from "../src/lib/db/catalog";

const catalog = getCatalog();
const tools = catalog.listTools();
const builders = catalog.listBuilders();
const useCases = catalog.listUseCases();

if (!tools.length || !builders.length || !useCases.length) {
  console.error("Seed catalog incomplete");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      tools: tools.length,
      builders: builders.length,
      useCases: useCases.length,
      benchmarks: catalog.listBenchmarks().length,
      projects: catalog.listProjects().length,
    },
    null,
    2,
  ),
);
