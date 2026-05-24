import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxVideo {
  url: string;
  title: string;
}

function toEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    // Facebook
    if (u.hostname.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
    }
    return null;
  } catch {
    return null;
  }
}

export function Lightbox({ video, onClose }: { video: LightboxVideo | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [video, onClose]);

  const embed = video ? toEmbed(video.url) : null;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center bg-background/90 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/30 bg-card"
            style={{ boxShadow: "var(--shadow-gold)" }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground transition hover:bg-gold hover:text-primary-foreground"
            >
              ✕
            </button>
            <div className="aspect-video w-full bg-black">
              {embed ? (
                <iframe
                  src={embed}
                  title={video.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <video src={video.url} controls autoPlay className="h-full w-full" />
              )}
            </div>
            <div className="border-t border-border/50 px-5 py-3 font-display text-sm text-foreground/90">
              {video.title}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
