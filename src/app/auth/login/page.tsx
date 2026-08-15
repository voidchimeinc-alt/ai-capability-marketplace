import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-md space-y-6 rounded-[2rem] border border-[var(--border)] bg-white/80 p-8">
        <h1 className="display text-4xl">Sign in</h1>
        <p className="text-sm text-[var(--muted)]">
          {configured
            ? "Supabase Auth is configured. Email auth UI wires in next iteration."
            : "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth."}
        </p>
        <form className="grid gap-3">
          <input
            type="email"
            placeholder="Email"
            className="h-12 rounded-2xl border border-[var(--border-strong)] px-4"
          />
          <input
            type="password"
            placeholder="Password"
            className="h-12 rounded-2xl border border-[var(--border-strong)] px-4"
          />
          <button type="button" className="h-12 rounded-full bg-[var(--accent)] text-sm font-medium text-white">
            Continue
          </button>
        </form>
        <ButtonLink href="/auth/signup" variant="ghost" className="w-full">
          Need an account? Sign up
        </ButtonLink>
      </div>
    </Container>
  );
}
