"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const problemExamples = [
  { label: "Reduce customer support costs", href: "/ai/recommend?problem=reduce-customer-support-costs" },
  { label: "Automate recruitment", href: "/ai/recommend?problem=automate-recruitment" },
  { label: "Build an AI sales assistant", href: "/ai/recommend?problem=build-ai-sales-assistant" },
  { label: "Analyse documents", href: "/ai/recommend?problem=analyse-documents" },
  { label: "Automate finance", href: "/ai/recommend?problem=automate-finance" },
  { label: "Build internal knowledge search", href: "/ai/recommend?problem=internal-knowledge-search" },
  { label: "Automate workflows", href: "/ai/recommend?problem=automate-workflows" },
  { label: "Generate marketing content", href: "/ai/recommend?problem=generate-marketing-content" },
  { label: "Build an AI agent", href: "/ai/recommend?problem=build-ai-agent" },
  { label: "Something else", href: "/ai/recommend" },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 atmosphere grain" />
      <Container className="relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow inline-flex items-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            {brand.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="display max-w-3xl text-5xl text-[var(--foreground)] sm:text-6xl lg:text-7xl"
          >
            Find the right AI.
            <br />
            Find the right people.
            <br />
            <span className="text-[var(--accent)]">Build the right thing.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl"
          >
            {brand.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-[var(--border-strong)] bg-white/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8">
            <p className="eyebrow mb-3">What are you trying to accomplish?</p>
            <h2 className="display mb-6 text-3xl sm:text-4xl">I have a business problem.</h2>
            <div className="grid gap-2">
              {problemExamples.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl border border-transparent bg-[var(--background)] px-4 py-3 text-sm transition hover:border-[var(--border-strong)] hover:bg-white focus-ring"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
