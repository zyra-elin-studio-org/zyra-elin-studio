import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Services, WhyAI } from "@/components/site/sections";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Zyra Elin Studio" },
      { name: "description", content: "Brand promotion, product reviews, fashion, food, tech and content creation by an AI digital presenter." },
      { property: "og:title", content: "Services — Zyra Elin Studio" },
      { property: "og:description", content: "Six ways to put Zyra Elin to work for your brand." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLanguage();
  return (
    <SiteShell>
      <PageHeader eyebrow={t.nav.services} title={t.services.heading} sub={t.services.sub} />
      <Services />
      <WhyAI />
    </SiteShell>
  );
}
