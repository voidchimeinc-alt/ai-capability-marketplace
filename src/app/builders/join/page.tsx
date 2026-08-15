import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the AI Network",
};

export default function JoinBuilderPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">{brand.products.network.name}</p>
        <h1 className="display text-5xl">Show what you built.</h1>
        <p className="text-lg text-[var(--muted)]">
          Create a capability profile focused on proof of work. Certificates are optional. Outcomes are not.
        </p>
      </div>
      <div className="mt-10 max-w-xl space-y-4 rounded-[2rem] border border-[var(--border)] bg-white/70 p-8">
        <p className="text-[var(--muted)]">
          Builder onboarding will use Supabase Auth. Until then, explore seed builder profiles and the network directory.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/auth/signup">Create account</ButtonLink>
          <ButtonLink href="/network" variant="subtle">
            Browse builders
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
