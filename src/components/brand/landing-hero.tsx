"use client";

import { motion } from "motion/react";
import { PitonMark } from "@/components/brand/piton-mark";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const problemExamples = [
  {
    label: "Reduce customer support costs",
    href: "/ai/recommend?problem=reduce-customer-support-costs",
    prompt:
      "I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.",
  },
  {
    label: "Automate recruitment",
    href: "/ai/recommend?problem=automate-recruitment",
    prompt: "I want to automate recruitment screening without turning hiring into a black box.",
  },
  {
    label: "Build an AI sales assistant",
    href: "/ai/recommend?problem=build-ai-sales-assistant",
    prompt: "I want an AI sales assistant that researches accounts and drafts outreach for human review.",
  },
  {
    label: "Analyse documents",
    href: "/ai/recommend?problem=analyse-documents",
    prompt: "I want to analyse contracts and long documents for risks and structured answers.",
  },
  {
    label: "Automate finance",
    href: "/ai/recommend?problem=automate-finance",
    prompt: "I want to automate finance operations like invoice classification with strong controls.",
  },
  {
    label: "Build internal knowledge search",
    href: "/ai/recommend?problem=internal-knowledge-search",
    prompt: "I want internal knowledge search with grounded answers and citations.",
  },
  {
    label: "Automate workflows",
    href: "/ai/recommend?problem=automate-workflows",
    prompt: "I want to automate brittle manual workflows across our existing tools.",
  },
  {
    label: "Generate marketing content",
    href: "/ai/recommend?problem=generate-marketing-content",
    prompt: "I want to generate on-brand marketing content drafts faster with human review.",
  },
  {
    label: "Build an AI agent",
    href: "/ai/recommend?problem=build-ai-agent",
    prompt: "I want to build an AI agent that can complete multi-step tool-use workflows.",
  },
];

export function LandingHero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function submitProblem(text: string) {
    const q = text.trim();
    if (!q) return;
    router.push(`/ai/recommend?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 atmosphere grain" aria-hidden />
      <Container className="relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="space-y-8">
          <motion.p
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45 }}
            className="eyebrow inline-flex items-center gap-2.5"
          >
            <PitonMark className="h-5 w-auto text-[var(--brand-ink)]" />
            {brand.name}
          </motion.p>

          <motion.h1
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.04 }}
            className="display max-w-3xl text-5xl text-[var(--foreground)] sm:text-6xl lg:text-7xl"
          >
            Find the right AI.
            <br />
            Find the right people.
            <br />
            <span className="text-[var(--accent)]">Build the right thing.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="max-w-xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl"
          >
            {brand.description}
          </motion.p>

          <motion.div
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="flex flex-wrap items-center gap-3"
          >
            <ButtonLink href={brand.cta.primary.href} size="lg">
              {brand.cta.primary.label}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={brand.cta.secondary.href} variant="subtle" size="lg">
              {brand.cta.secondary.label}
            </ButtonLink>
            <ButtonLink href={brand.cta.tertiary.href} variant="ghost" size="lg">
              {brand.cta.tertiary.label}
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-[var(--border-strong)] bg-white/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8">
            <p className="eyebrow mb-3">Primary experience</p>
            <h2 className="display mb-2 text-3xl sm:text-4xl">What are you trying to accomplish?</h2>
            <p className="mb-5 text-sm text-[var(--muted)]">
              Describe the outcome in plain language. Optional context comes next.
            </p>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                submitProblem(prompt);
              }}
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder='e.g. "I want to automate customer support but keep humans involved for complex cases."'
                className="w-full resize-y rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
              >
                Find My AI Stack
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {problemExamples.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setPrompt(item.prompt);
                      router.push(item.href);
                    }}
                    className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-left text-xs text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-white focus-ring"
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  href="/ai/recommend"
                  className="rounded-full border border-transparent px-3 py-1.5 text-xs text-[var(--muted)] underline-offset-2 hover:underline focus-ring"
                >
                  Something else
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
