import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { FAQ } from "@/components/site/sections";

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
  return (
    <SiteShell>
      <FAQ />
    </SiteShell>
  );
}
