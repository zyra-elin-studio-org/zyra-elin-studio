import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteSettings, waLink } from "@/hooks/useSiteSettings";
import presenterImage from "@/assets/zyra-elin-hero.jpeg";

const copy = {
  en: {
    badge: "🤖 Meet Zyra Elin — AI Brand Presenter",
    h1: "Your Brand's",
    h2: "Trusted Voice",
    p: "Zyra Elin is Bangladesh's first AI Digital Brand Presenter — creating ultra-realistic commercial videos, product reviews and brand campaigns that connect with real audiences and drive real results. Indistinguishable from a real human presenter.",
    f: [
      "Ultra-realistic — audiences cannot tell it's AI",
      "Available 24/7 — no scheduling, no delays",
      "70% more cost-effective than human models",
    ],
    cta1: "See My Work",
    cta2: "WhatsApp Us",
    role: "AI Brand Presenter • Bangladesh",
    aiBadge: "🤖 AI Generated",
  },
  bn: {
    badge: "🤖 Meet Zyra Elin — AI Brand Presenter",
    h1: "আপনার Brand-এর",
    h2: "বিশ্বস্ত কণ্ঠস্বর",
    p: "Zyra Elin — বাংলাদেশের প্রথম AI ডিজিটাল ব্র্যান্ড প্রেজেন্টার। Ultra-realistic ভিডিও কনটেন্ট তৈরি করে যা দর্শকের মনে পৌঁছায় এবং বিক্রি বাড়ায়।",
    f: [
      "Ultra-realistic — AI কিনা বোঝার উপায় নেই",
      "২৪/৭ উপলব্ধ — কোনো দেরি নেই",
      "Real Model-এর চেয়ে ৭০% কম খরচ",
    ],
    cta1: "আমার কাজ দেখুন",
    cta2: "WhatsApp করুন",
    role: "AI Brand Presenter • Bangladesh",
    aiBadge: "🤖 AI Generated",
  },
};

export default function PresenterSection() {
  const { lang } = useLanguage();
  const { data: s } = useSiteSettings();
  const c = copy[lang];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section
      className="relative w-full overflow-hidden px-6 py-20"
      style={{ background: "linear-gradient(180deg, #080C14 0%, #0E1420 100%)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[55fr_45fr]">
        {/* LEFT — text */}
        <motion.div
          variants={container}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          viewport={{ once: true, amount: 0.2 }}
          className="order-2 lg:order-1"
        >
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container}>
            <motion.span
              variants={fadeUp}
              className="glass inline-block rounded-full border border-gold/40 bg-transparent px-4 py-1.5 text-[13px] font-medium"
              style={{ color: "#D4A853" }}
            >
              {c.badge}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-6 font-display font-bold leading-tight"
              style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
            >
              <span className="block" style={{ color: "#F0F4FF" }}>{c.h1}</span>
              <span className="shimmer mt-1 block" style={{ color: "#D4A853" }}>{c.h2}</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[480px] text-[16px]"
              style={{ color: "#8892A4", lineHeight: 1.8 }}
            >
              {c.p}
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-7 space-y-4">
              {c.f.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span
                    className="grid h-7 w-7 flex-none place-items-center rounded-full border text-xs font-bold"
                    style={{ borderColor: "#D4A853", color: "#D4A853" }}
                  >
                    ✓
                  </span>
                  <span className="text-[15px]" style={{ color: "#B0B8C4" }}>{f}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/portfolio"
                className="rounded-lg px-8 py-3.5 text-center text-[15px] font-semibold transition hover:scale-[1.03] hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #D4A853 0%, #C9A882 100%)",
                  color: "#080C14",
                }}
              >
                {c.cta1}
              </Link>
              <a
                href={s ? waLink(s.whatsapp) : "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-[1.5px] px-8 py-3.5 text-center text-[15px] font-semibold transition hover:bg-[#D4A853] hover:text-[#080C14]"
                style={{ borderColor: "#D4A853", color: "#D4A853" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1.1 2.8 1.2 3 .1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                </svg>
                {c.cta2}
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT — image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          viewport={{ once: true, amount: 0.2 }}
          className="order-1 flex justify-center lg:order-2"
        >
          <div
            className="presenter-ring relative rounded-[24px] p-4"
            style={{
              border: "2px solid rgba(212, 168, 83, 0.3)",
              boxShadow: "0 0 40px rgba(212, 168, 83, 0.1)",
            }}
          >
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-[20px]">
              <img
                src={presenterImage}
                alt="Zyra Elin — AI Brand Presenter"
                className="block h-auto w-full rounded-[20px] object-cover"
              />

              {/* top-right AI badge */}
              <div
                className="absolute right-5 top-5 rounded-[20px] px-3.5 py-1.5 text-[11px] font-bold"
                style={{
                  background: "rgba(212, 168, 83, 0.15)",
                  border: "1px solid rgba(212, 168, 83, 0.4)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: "#D4A853",
                }}
              >
                {c.aiBadge}
              </div>

              {/* bottom overlay card */}
              <div
                className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3.5 rounded-2xl px-6 py-4"
                style={{
                  minWidth: 260,
                  background: "rgba(13, 17, 26, 0.85)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(212, 168, 83, 0.3)",
                }}
              >
                <span
                  className="presenter-dot block h-2.5 w-2.5 rounded-full"
                  style={{ background: "#3FB950", boxShadow: "0 0 8px #3FB950" }}
                />
                <div className="leading-tight">
                  <div className="font-display text-[16px] font-bold text-white">Zyra Elin</div>
                  <div className="text-[12px]" style={{ color: "#D4A853" }}>{c.role}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes presenter-ring-pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(212, 168, 83, 0.1); }
          50%      { box-shadow: 0 0 60px rgba(212, 168, 83, 0.28); }
        }
        .presenter-ring { animation: presenter-ring-pulse 3s ease-in-out infinite; }
        @keyframes presenter-dot-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.3); opacity: .6; }
        }
        .presenter-dot { animation: presenter-dot-pulse 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
