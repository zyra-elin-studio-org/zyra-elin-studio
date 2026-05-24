import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Pricing, FAQ } from "@/components/site/sections";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Zyra Elin Studio" },
      { name: "description", content: "Simple, transparent pricing for AI brand presenter videos in Bangladesh." },
      { property: "og:title", content: "Pricing — Zyra Elin Studio" },
      { property: "og:description", content: "Starter, Brand and Enterprise plans for AI presenter content." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { t } = useLanguage();
  return (
    <SiteShell>
      <PageHeader eyebrow={t.nav.pricing} title={t.pricing.heading} sub={t.pricing.sub} />
      <Pricing />
      <FAQ />
    </SiteShell>
  );
}
