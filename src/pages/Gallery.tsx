import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Camera, ChevronLeft, ChevronRight, Clapperboard, Play, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, Reveal } from "@/components/ui";
import { GALLERY, type GalleryItem } from "@/lib/data";
import type { Navigate } from "@/lib/nav";
import { cn } from "@/utils/cn";

const CATS = ["Weddings", "Corporate", "Private Parties", "Venues & Clubs"] as const;
type Tab = "all" | "photos" | "videos";

export default function Gallery({ navigate }: { navigate: Navigate }) {
  const [tab, setTab] = useState<Tab>("all");
  const [cat, setCat] = useState("");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GALLERY.filter((it) => {
      if (tab === "photos" && it.type !== "photo") return false;
      if (tab === "videos" && it.type !== "video") return false;
      if (cat && it.category !== cat) return false;
      if (q && ![it.title, it.band, it.genre, it.location].some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [tab, cat, query]);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (d: number) => setLightbox((cur) => (cur === null ? null : (cur + d + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  const counts = useMemo(
    () => ({
      photos: GALLERY.filter((g) => g.type === "photo").length,
      videos: GALLERY.filter((g) => g.type === "video").length,
    }),
    []
  );

  const active: GalleryItem | null = lightbox !== null ? items[lightbox] ?? null : null;

  return (
    <div className="pt-40 sm:pt-44 pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">The gallery</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-medium tracking-tight text-ink">
            Hear them <em className="font-light gold-text">before you book them</em>
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
            Real footage and photography from real Encore events — weddings, galas and dancefloors across Australia.
            Every clip is a band you can book today.
          </p>
        </Reveal>

        {/* controls */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex rounded-full border border-line bg-white p-1.5 shadow-lux self-start">
              {(
                [
                  { key: "all", label: `All · ${GALLERY.length}`, icon: null },
                  { key: "photos", label: `Photos · ${counts.photos}`, icon: Camera },
                  { key: "videos", label: `Videos · ${counts.videos}`, icon: Clapperboard },
                ] as { key: Tab; label: string; icon: typeof Camera | null }[]
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setLightbox(null); }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-bold transition-colors",
                    tab === t.key ? "bg-forest text-ivory shadow-lux" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {t.icon && <t.icon size={14} />}
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search media, bands, cities…"
                className="input-lux !pl-11 !py-3.5"
                aria-label="Search the gallery"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip active={cat === ""} onClick={() => setCat("")}>All events</Chip>
            {CATS.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(cat === c ? "" : c)}>{c}</Chip>
            ))}
          </div>
        </Reveal>

        {/* masonry */}
        {items.length > 0 ? (
          <motion.div layout className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:balance]">
            <AnimatePresence>
              {items.map((it, i) => (
                <motion.button
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.03, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setLightbox(i)}
                  className="group relative mb-5 block w-full overflow-hidden rounded-[26px] border border-line shadow-lux text-left break-inside-avoid"
                >
                  <img
                    src={it.type === "video" ? it.poster : it.src}
                    alt={`${it.title} — ${it.band} performing at a ${it.category.toLowerCase()} in ${it.location}`}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  {it.type === "video" && (
                    <>
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/60 backdrop-blur px-2.5 py-1 text-[10.5px] font-bold text-ivory">
                        <Play size={9} fill="currentColor" /> {it.duration}
                      </span>
                      <span className="absolute inset-0 m-auto grid size-14 place-items-center rounded-full bg-ivory/90 text-ink opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                        <Play size={18} className="ml-0.5" fill="currentColor" />
                      </span>
                    </>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[14.5px] font-bold text-ivory">{it.title}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-soft">{it.band} · {it.location}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-gold/50 bg-white p-16 text-center">
            <h3 className="font-display text-2xl font-semibold text-ink">Nothing in the gallery matches that</h3>
            <p className="mt-2 text-[13.5px] text-ink-soft">Try a different search, or clear the event filter.</p>
            <button onClick={() => { setQuery(""); setCat(""); setTab("all"); }} className="mt-6 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-ivory hover:bg-forest transition-colors">
              Show everything
            </button>
          </div>
        )}
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 backdrop-blur-md p-4 sm:p-10"
            onClick={close}
          >
            <button onClick={close} aria-label="Close" className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-ivory hover:bg-white/25 transition-colors">
              <X size={19} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="absolute left-3 sm:left-6 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-ivory hover:bg-white/25 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="absolute right-3 sm:right-6 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-ivory hover:bg-white/25 transition-colors">
              <ChevronRight size={20} />
            </button>

            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-forest-deep shadow-lux-lg"
            >
              <div className="max-h-[62vh] bg-black grid place-items-center">
                {active.type === "video" ? (
                  <video src={active.src} poster={active.poster} controls autoPlay playsInline className="max-h-[62vh] w-full" />
                ) : (
                  <img src={active.src} alt={active.title} className="max-h-[62vh] w-full object-contain" />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <p className="font-display text-xl font-semibold text-ivory">{active.title}</p>
                  <p className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.16em] text-gold-soft">
                    {active.band} · {active.category} · {active.location}
                  </p>
                </div>
                <button
                  onClick={() => navigate({ route: "band", bandId: active.bandId })}
                  className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-3 text-[12.5px] font-bold text-forest-deep hover:bg-gold-soft transition-colors"
                >
                  Book {active.band} <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
