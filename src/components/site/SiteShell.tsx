import type { ReactNode } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="relative">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="relative px-6 pb-8 pt-32" style={{ background: "var(--gradient-hero)" }}>
      <div className="orb h-72 w-72 bg-gold/30" style={{ top: "20%", right: "-5%" }} />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-widest text-gold">{eyebrow}</span>}
        <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">{title}</h1>
        <div className="mx-auto mt-4 h-0.5 w-20 bg-gold-gradient" />
        {sub && <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}
