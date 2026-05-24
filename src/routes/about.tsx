import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { About, WhyAI, Stats } from "@/components/site/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zyra Elin — AI Brand Presenter from Bangladesh" },
      { name: "description", content: "Meet Zyra Elin: Bangladesh's first fully AI-driven digital brand presenter, fluent in Bangla and English." },
      { property: "og:title", content: "About Zyra Elin Studio" },
      { property: "og:description", content: "Where AI meets human warmth — Bangladesh's premier AI brand presenter." },
    ],
  }),
  component: () => (
    <SiteShell>
      <div className="pt-20" />
      <About />
      <Stats />
      <WhyAI />
    </SiteShell>
  ),
});
