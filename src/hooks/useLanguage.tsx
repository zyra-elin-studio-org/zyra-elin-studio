import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type T } from "@/translations";

interface Ctx { lang: Lang; t: T; toggle: () => void; setLang: (l: Lang) => void; }
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("bn");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("ze-lang") as Lang | null) : null;
    if (stored === "en" || stored === "bn") setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ze-lang", lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggle = () => setLang((l) => (l === "en" ? "bn" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
