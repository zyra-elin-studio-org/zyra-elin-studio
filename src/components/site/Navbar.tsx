import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t, lang, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/portfolio", label: t.nav.portfolio },
    { to: "/pricing", label: t.nav.pricing },
    { to: "/faq", label: t.nav.faq },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "glass-strong border-b border-border/40 py-3" : "bg-transparent py-5"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/"><Logo withWordmark /></Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="group relative text-sm text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-gold" }} activeOptions={{ exact: l.to === "/" }}>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-gradient transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button onClick={toggle} aria-label="Toggle language" className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-gold/40 hover:text-foreground">
            {lang === "en" ? "বাং" : "EN"}
          </button>
          <Link to="/contact" className="hidden rounded-full bg-gold-gradient px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:inline-block" style={{ boxShadow: "var(--shadow-gold)" }}>
            {t.nav.book}
          </Link>
          <button className="grid h-9 w-9 place-items-center rounded-md border border-border lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span className="block h-0.5 w-4 bg-foreground" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong mx-6 mt-3 rounded-2xl p-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground" activeProps={{ className: "text-gold" }} activeOptions={{ exact: l.to === "/" }}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="mt-2 block rounded-lg bg-gold-gradient px-3 py-2 text-center text-sm font-semibold text-primary-foreground">{t.nav.book}</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
