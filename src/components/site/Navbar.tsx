import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t, lang, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: Array<{ href: string; label: string }> = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#portfolio", label: t.nav.portfolio },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "glass-strong border-b border-border/40 py-3" : "bg-transparent py-5"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient font-display text-base font-bold text-primary-foreground shadow-gold" style={{ boxShadow: "var(--shadow-gold)" }}>ZE</span>
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">Zyra Elin Studio</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative text-sm text-muted-foreground transition hover:text-foreground">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-gradient transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button onClick={toggle} aria-label="Toggle language" className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-gold/40 hover:text-foreground">
            {lang === "en" ? "বাং" : "EN"}
          </button>
          <a href="#contact" className="hidden rounded-full bg-gold-gradient px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:inline-block" style={{ boxShadow: "var(--shadow-gold)" }}>
            {t.nav.book}
          </a>
          <button className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span className="block h-0.5 w-4 bg-foreground" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong mx-6 mt-3 rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground">{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={() => setOpen(false)} className="mt-2 block rounded-lg bg-gold-gradient px-3 py-2 text-center text-sm font-semibold text-primary-foreground">{t.nav.book}</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
