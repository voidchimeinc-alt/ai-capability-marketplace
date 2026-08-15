import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-md space-y-6 rounded-[2rem] border border-[var(--border)] bg-white/80 p-8">
        <h1 className="display text-4xl">Create account</h1>
        <p className="text-sm text-[var(--muted)]">
          {configured
            ? "Choose your role. Full auth actions land with admin + builder onboarding."
            : "Configure Supabase env vars to enable account creation."}
        </p>
        <form className="grid gap-3">
          <select className="h-12 rounded-2xl border border-[var(--border-strong)] px-4" defaultValue="explorer">
            <option value="explorer">AI Explorer</option>
            <option value="company">Company / Buyer</option>
            <option value="builder">AI Builder</option>
          </select>
          <input type="email" placeholder="Email" className="h-12 rounded-2xl border border-[var(--border-strong)] px-4" />
          <input type="password" placeholder="Password" className="h-12 rounded-2xl border border-[var(--border-strong)] px-4" />
          <button type="button" className="h-12 rounded-full bg-[var(--accent)] text-sm font-medium text-white">
            Create account
          </button>
        </form>
        <ButtonLink href="/auth/login" variant="ghost" className="w-full">
          Already have an account?
        </ButtonLink>
      </div>
    </Container>
  );
}
