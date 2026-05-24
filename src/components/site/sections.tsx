import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteSettings, waLink } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { ContactForm } from "@/components/site/ContactForm";
import { Lightbox, type LightboxVideo } from "@/components/site/Lightbox";

export function Hero() {
  const { t } = useLanguage();
  const { data: s } = useSiteSettings();
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-6 pt-24" style={{ background: "var(--gradient-hero)" }}>
      <div className="orb float-slow h-96 w-96 bg-gold/40" style={{ top: "10%", right: "-5%" }} />
      <div className="orb float-slow h-80 w-80 bg-teal/30" style={{ bottom: "10%", left: "-5%", animationDelay: "2s" }} />
      <div className="orb float-slow h-72 w-72 bg-rose/30" style={{ top: "40%", left: "20%", animationDelay: "4s" }} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="glass inline-block rounded-full px-4 py-1.5 text-xs font-medium text-gold">
          {t.hero.badge}
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-display text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">
          <span className="block text-foreground">{t.hero.line1}</span>
          <span className="shimmer mt-2 block">{t.hero.line2}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t.hero.sub}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/portfolio" className="rounded-full bg-gold-gradient px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90" style={{ boxShadow: "var(--shadow-gold)" }}>
            {t.hero.cta1}
          </Link>
          <a href={s ? waLink(s.whatsapp) : "#"} target="_blank" rel="noreferrer" className="rounded-full border border-gold/40 px-7 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10">
            {t.hero.cta2}
          </a>
        </motion.div>
      </div>
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">↓</div>
    </section>
  );
}

export function Stats() {
  const { t } = useLanguage();
  const items = [
    { num: "50+", label: t.stats.brands }, { num: "100+", label: t.stats.videos },
    { num: "2", label: t.stats.langs }, { num: "24/7", label: t.stats.available },
  ];
  return (
    <section className="relative px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div key={it.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="glass gradient-border rounded-2xl p-6 text-center">
            <div className="font-display text-4xl font-bold text-gold-gradient">{it.num}</div>
            <div className="mt-2 text-sm text-muted-foreground">{it.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative px-6 py-24">
      <div className="orb h-64 w-64 bg-gold/20" style={{ top: "20%", left: "-5%" }} />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
          <div className="relative grid h-full place-items-center overflow-hidden rounded-full border-2 border-gold/30 bg-card" style={{ boxShadow: "var(--shadow-gold)" }}>
            <img src={new URL("@/assets/logo.jpeg", import.meta.url).href} alt="Zyra Elin" className="h-full w-full object-cover" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">{t.about.label}</span>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t.about.heading}</h2>
          <p className="mt-5 text-muted-foreground">{t.about.body}</p>
          <ul className="mt-6 space-y-3">
            {t.about.points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-gold-gradient text-[10px] font-bold text-primary-foreground">✓</span>
                <span className="text-sm text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.services.heading}</h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-gold-gradient" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{t.services.sub}</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass gradient-border group rounded-2xl p-7 transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/10 text-3xl ring-1 ring-gold/20">{s.icon}</div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface VideoRow { id: string; title_en: string; title_bn: string; video_url: string; thumbnail_url: string | null; category: string }

export function Portfolio() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState<LightboxVideo | null>(null);
  const { data: videos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("id,title_en,title_bn,video_url,thumbnail_url,category").order("sort_order").order("created_at", { ascending: false });
      return (data ?? []) as VideoRow[];
    },
  });

  return (
    <section id="portfolio" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.portfolio.heading}</h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-gold-gradient" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{t.portfolio.sub}</p>
        </div>

        {!videos || videos.length === 0 ? (
          <div className="glass mt-12 rounded-2xl p-12 text-center text-muted-foreground">{t.portfolio.empty}</div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => {
              const title = lang === "bn" && v.title_bn ? v.title_bn : v.title_en;
              return (
                <button
                  key={v.id}
                  onClick={() => setActive({ url: v.video_url, title })}
                  className="glass gradient-border group block overflow-hidden rounded-2xl text-left transition hover:-translate-y-1"
                >
                  <div className="relative aspect-video bg-secondary">
                    {v.thumbnail_url
                      ? <img src={v.thumbnail_url} alt={title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                      : <div className="grid h-full w-full place-items-center text-4xl text-muted-foreground">▶</div>}
                    <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-2xl text-primary-foreground" style={{ boxShadow: "var(--shadow-gold)" }}>▶</span>
                    </div>
                    <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold backdrop-blur">{v.category}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{title}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <Lightbox video={active} onClose={() => setActive(null)} />
    </section>
  );
}

export function WhyAI() {
  const { t } = useLanguage();
  return (
    <section className="relative px-6 py-24">
      <div className="orb h-80 w-80 bg-teal/20" style={{ bottom: "10%", right: "-5%" }} />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.why.heading}</h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-gold-gradient" />
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.why.items.map((it, i) => (
            <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass gradient-border rounded-2xl p-7">
              <div className="text-4xl">{it.icon}</div>
              <h3 className="mt-4 font-display text-xl font-semibold text-gold-gradient">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const { t } = useLanguage();
  const { data: s } = useSiteSettings();
  return (
    <section id="pricing" className="relative px-6 py-24">
      <div className="orb h-72 w-72 bg-gold/20" style={{ top: "10%", right: "-10%" }} />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.pricing.heading}</h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-gold-gradient" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{t.pricing.sub}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.pricing.plans.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`glass gradient-border relative flex flex-col rounded-2xl p-7 ${p.featured ? "ring-2 ring-gold" : ""}`}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  {t.pricing.popular}
                </span>
              )}
              <div className="text-xs font-semibold uppercase tracking-widest text-gold">{p.name}</div>
              <div className="mt-4 font-display text-4xl font-bold text-gold-gradient">{p.price}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.period}</div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 grid h-4 w-4 flex-none place-items-center rounded-full bg-gold-gradient text-[9px] font-bold text-primary-foreground">✓</span>
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <a href={s ? waLink(s.whatsapp) : "#"} target="_blank" rel="noreferrer"
                className={`mt-7 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${p.featured ? "bg-gold-gradient text-primary-foreground hover:opacity-90" : "border border-gold/40 text-gold hover:bg-gold/10"}`}
                style={p.featured ? { boxShadow: "var(--shadow-gold)" } : undefined}>
                {t.pricing.cta}
              </a>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">{t.pricing.note}</p>
      </div>
    </section>
  );
}

export function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.faq.heading}</h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-gold-gradient" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{t.faq.sub}</p>
        </div>
        <div className="mt-12 space-y-3">
          {t.faq.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="glass gradient-border overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-gold/5"
                >
                  <span className="font-display text-base font-semibold text-foreground sm:text-lg">{it.q}</span>
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full bg-gold/10 text-gold transition ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border/40 px-6 py-4 text-sm" style={{ color: "#B0B8C4", lineHeight: 1.8 }}>
                    <FAQAnswer text={it.a} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useLanguage();
  const { data: s } = useSiteSettings();
  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.contact.heading}</h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-gold-gradient" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{t.contact.sub}</p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {s && (
              <>
                <a href={waLink(s.whatsapp)} target="_blank" rel="noreferrer" className="glass gradient-border block rounded-2xl p-5 transition hover:-translate-y-0.5">
                  <div className="text-xs uppercase tracking-wider text-[#25D366]">WhatsApp</div>
                  <div className="mt-1 font-display text-lg">{s.whatsapp}</div>
                </a>
                <a href={s.facebook} target="_blank" rel="noreferrer" className="glass gradient-border block rounded-2xl p-5 transition hover:-translate-y-0.5">
                  <div className="text-xs uppercase tracking-wider text-[#4267B2]">Facebook</div>
                  <div className="mt-1 font-display text-lg">{s.facebook_page}</div>
                </a>
                <a href={`mailto:${s.email}`} className="glass gradient-border block rounded-2xl p-5 transition hover:-translate-y-0.5">
                  <div className="text-xs uppercase tracking-wider text-gold">Email</div>
                  <div className="mt-1 font-display text-lg">{s.email}</div>
                </a>
              </>
            )}
            <div className="glass rounded-2xl p-4 text-center text-sm text-gold">{t.contact.responseTime}</div>
          </div>
          <div className="lg:col-span-3"><ContactForm /></div>
        </div>
      </div>
    </section>
  );
}
