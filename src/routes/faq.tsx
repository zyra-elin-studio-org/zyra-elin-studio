import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { FAQ } from "@/components/site/sections";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Zyra Elin Studio" },
      { name: "description", content: "Answers to common questions about Zyra Elin, Bangladesh's first AI digital brand presenter." },
      { property: "og:title", content: "FAQ — Zyra Elin Studio" },
      { property: "og:description", content: "Everything you need to know before booking an AI presenter video." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const { t } = useLanguage();
  return (
    <SiteShell>
      <PageHeader eyebrow={t.nav.faq} title={t.faq.heading} sub={t.faq.sub} />
      <FAQ />
    </SiteShell>
  );
}
