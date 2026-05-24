import logoSrc from "@/assets/logo.jpeg";

export function Logo({ size = 40, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className="grid place-items-center overflow-hidden rounded-full ring-1 ring-gold/30"
        style={{ width: size, height: size, boxShadow: "var(--shadow-gold)" }}
      >
        <img src={logoSrc} alt="Zyra Elin Studio" className="h-full w-full object-cover" />
      </span>
      {withWordmark && (
        <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
          Zyra Elin Studio
        </span>
      )}
    </span>
  );
}
