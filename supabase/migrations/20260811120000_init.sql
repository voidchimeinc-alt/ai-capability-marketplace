-- AI Workbench initial schema (Supabase / PostgreSQL)
-- Apply via Supabase SQL editor or CLI. Seed adapter works without this in MVP.

create extension if not exists "pgcrypto";

create type public.entity_kind as enum (
  'model', 'application', 'agent', 'developer_tool', 'automation',
  'infrastructure', 'api', 'framework'
);

create type public.editorial_status as enum ('draft', 'reviewed', 'published', 'seed_demo');
create type public.verification_status as enum (
  'self_reported', 'client_verified', 'platform_verified', 'unverified'
);
create type public.pricing_model as enum (
  'free', 'freemium', 'paid', 'usage', 'enterprise', 'unknown'
);
create type public.deployment_model as enum ('cloud', 'api', 'local', 'hybrid', 'unknown');
create type public.user_role as enum ('explorer', 'company', 'builder', 'vendor', 'admin');
create type public.project_status as enum ('open', 'reviewing', 'shortlisted', 'hired', 'closed');
create type public.application_status as enum ('applied', 'shortlisted', 'rejected', 'hired');
create type public.engagement_type as enum ('fixed', 'hourly', 'retainer', 'advisory', 'poc');
create type public.availability_status as enum ('available', 'limited', 'booked');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role public.user_role not null default 'explorer',
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  industry text,
  size_band text,
  website text,
  created_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  kind public.entity_kind not null,
  category text not null,
  short_description text not null,
  best_for text[] not null default '{}',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  best_use_cases text[] not null default '{}',
  avoid_when text[] not null default '{}',
  capabilities jsonb not null default '{}',
  personality jsonb,
  pricing_model public.pricing_model not null default 'unknown',
  pricing_notes text not null default 'Unknown',
  has_api boolean,
  deployment public.deployment_model not null default 'unknown',
  integrations text[] not null default '{}',
  website_url text,
  tags text[] not null default '{}',
  source text,
  source_url text,
  last_verified_at timestamptz,
  pricing_verified_at timestamptz,
  confidence text not null default 'low',
  editorial_status public.editorial_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.use_cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  problem_statement text not null,
  industry_hints text[] not null default '{}',
  desired_outcomes text[] not null default '{}',
  recommended_capability_weights jsonb not null default '{}',
  example_queries text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.tool_use_cases (
  tool_id uuid references public.tools(id) on delete cascade,
  use_case_id uuid references public.use_cases(id) on delete cascade,
  primary key (tool_id, use_case_id)
);

create table public.benchmarks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  task_description text not null,
  input_summary text not null,
  expected_output_summary text not null,
  evaluation_criteria text[] not null default '{}',
  methodology text not null,
  evaluator text not null,
  source text not null,
  execution_date date,
  created_at timestamptz not null default now()
);

create table public.benchmark_results (
  id uuid primary key default gen_random_uuid(),
  benchmark_id uuid not null references public.benchmarks(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  score numeric,
  notes text not null default '',
  execution_date date,
  is_estimated boolean not null default true,
  unique (benchmark_id, tool_id)
);

create table public.builders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  slug text unique not null,
  name text not null,
  title text not null,
  location text,
  timezone text,
  availability public.availability_status not null default 'available',
  specializations text[] not null default '{}',
  capabilities text[] not null default '{}',
  stack text[] not null default '{}',
  experience_years numeric,
  hourly_rate_usd numeric,
  pricing_notes text not null default 'Unknown',
  preferred_project_types text[] not null default '{}',
  bio text not null default '',
  trust jsonb not null default '{}',
  moderation_status text not null default 'pending',
  source text,
  editorial_status public.editorial_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.builder_projects (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.builders(id) on delete cascade,
  slug text not null,
  title text not null,
  problem text not null,
  solution text not null,
  technologies text[] not null default '{}',
  role text not null,
  complexity text not null,
  outcome text not null,
  verification_status public.verification_status not null default 'self_reported',
  demo_url text,
  unique (builder_id, slug)
);

create table public.company_projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  slug text unique not null,
  title text not null,
  problem text not null,
  desired_outcome text not null,
  industry text,
  company_size text,
  required_capabilities text[] not null default '{}',
  preferred_technology text[] not null default '{}',
  budget_range text,
  timeline text,
  engagement_type public.engagement_type not null default 'fixed',
  status public.project_status not null default 'open',
  created_at timestamptz not null default now()
);

create table public.project_applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.company_projects(id) on delete cascade,
  builder_id uuid not null references public.builders(id) on delete cascade,
  pitch text not null,
  proposed_rate text,
  status public.application_status not null default 'applied',
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id uuid not null,
  author_id uuid references public.profiles(id) on delete set null,
  rating numeric,
  body text,
  moderation_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table public.ai_stacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  slug text not null,
  name text not null,
  use_case_slug text,
  components jsonb not null default '[]',
  estimated_monthly_software_cost text not null default 'Unknown',
  estimated_implementation_cost text not null default 'Unknown',
  builder_id uuid references public.builders(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  context jsonb not null,
  results jsonb not null,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan text not null,
  status text not null default 'inactive',
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.company_projects(id) on delete set null,
  amount_cents integer,
  currency text default 'USD',
  status text not null default 'pending',
  provider text,
  created_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  website text,
  claimed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  properties jsonb not null default '{}',
  user_id uuid,
  session_id text,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity_type text,
  entity_id text,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  subject_type text not null,
  subject_id text not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index tools_kind_idx on public.tools(kind);
create index tools_category_idx on public.tools(category);
create index builders_availability_idx on public.builders(availability);
create index company_projects_status_idx on public.company_projects(status);
create index analytics_events_name_idx on public.analytics_events(event_name);
create index analytics_events_created_idx on public.analytics_events(created_at);
