import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Contact } from "@/components/site/sections";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zyra Elin Studio" },
      { name: "description", content: "Get in touch with Zyra Elin Studio. WhatsApp, Facebook, email — usually replies within 2 hours." },
      { property: "og:title", content: "Contact — Zyra Elin Studio" },
      { property: "og:description", content: "Tell us about your brand — we'll usually reply within 2 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLanguage();
  return (
    <SiteShell>
      <PageHeader eyebrow={t.nav.contact} title={t.contact.heading} sub={t.contact.sub} />
      <Contact />
    </SiteShell>
  );
}
