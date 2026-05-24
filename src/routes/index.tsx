import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero, Stats, About, Services, WhyAI } from "@/components/site/sections";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zyra Elin Studio — Bangladesh's First AI Digital Brand Presenter" },
      { name: "description", content: "Premium AI-driven brand presenter from Bangladesh. Product reviews, brand promos, fashion, food and tech content — fluent in Bangla and English." },
      { property: "og:title", content: "Zyra Elin Studio — AI Digital Brand Presenter" },
      { property: "og:description", content: "Smart content. Real results. Bangladesh's first AI brand presenter." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLanguage();
  return (
    <SiteShell>
      <Hero />
      <Stats />
      <About />
      <Services />
      <WhyAI />
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/30 bg-card p-10 text-center" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-gold)" }}>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t.cta.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{t.cta.sub}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="rounded-full bg-gold-gradient px-7 py-3 text-sm font-semibold text-primary-foreground" style={{ boxShadow: "var(--shadow-gold)" }}>{t.cta.primary}</Link>
            <Link to="/pricing" className="rounded-full border border-gold/40 px-7 py-3 text-sm font-semibold text-gold hover:bg-gold/10">{t.nav.pricing}</Link>
          </div>
        </div>
      </motion.section>
    </SiteShell>
  );
}
