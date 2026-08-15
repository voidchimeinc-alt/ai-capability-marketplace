type AnalyticsEvent =
  | "search"
  | "tool_view"
  | "comparison_create"
  | "benchmark_view"
  | "recommendation_request"
  | "builder_profile_view"
  | "project_create"
  | "project_application"
  | "hire_success";

export async function track(
  eventName: AnalyticsEvent,
  properties: Record<string, unknown> = {},
) {
  // Foundation: structured event capture. Wire to warehouse later.
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", eventName, properties);
  }
}
