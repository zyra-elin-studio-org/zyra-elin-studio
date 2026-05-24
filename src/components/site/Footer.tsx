import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteSettings, waLink } from "@/hooks/useSiteSettings";

export function Footer() {
  const { t } = useLanguage();
  const { data: s } = useSiteSettings();
  return (
    <footer className="relative border-t border-border/60 bg-background">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gold-gradient" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient font-display text-base font-bold text-primary-foreground">ZE</span>
            <span className="font-display text-lg font-semibold">Zyra Elin Studio</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t.footer.tag}</p>
          <div className="mt-5 flex gap-3">
            {s && <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-gold/40 hover:text-gold">f</a>}
            {s && <a href={waLink(s.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-gold/40 hover:text-gold">W</a>}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">{t.footer.quick}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#home" className="hover:text-foreground">{t.nav.home}</a></li>
            <li><a href="#about" className="hover:text-foreground">{t.nav.about}</a></li>
            <li><a href="#services" className="hover:text-foreground">{t.nav.services}</a></li>
            <li><a href="#portfolio" className="hover:text-foreground">{t.nav.portfolio}</a></li>
            <li><a href="#contact" className="hover:text-foreground">{t.nav.contact}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">{t.footer.services}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {t.services.items.slice(0, 5).map((i) => <li key={i.title}>{i.title}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">{t.footer.contactCol}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{s?.whatsapp}</li>
            <li>{s?.email}</li>
            <li>{s?.facebook_page}</li>
            <li className="pt-3"><Link to="/login" className="text-xs opacity-50 hover:opacity-100">Admin login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Zyra Elin Studio. {t.footer.rights} <span className="ml-2">{t.footer.powered}</span>
      </div>
    </footer>
  );
}
