import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Portfolio } from "@/components/site/sections";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Zyra Elin Studio" },
      { name: "description", content: "Selected AI-presenter videos: brand promos, product reviews, fashion, food and tech." },
      { property: "og:title", content: "Portfolio — Zyra Elin Studio" },
      { property: "og:description", content: "A taste of what Zyra Elin can do for your brand." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <SiteShell>
      <Portfolio />
    </SiteShell>
  );
}
