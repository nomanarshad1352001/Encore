import { motion } from "framer-motion";
import { ChevronDown, Music4, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import BandCard from "@/components/BandCard";
import { Chip, Reveal } from "@/components/ui";
import { EVENT_TYPES, GENRES, REGIONS } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Navigate, ViewState } from "@/lib/nav";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "rating", label: "Highest rated" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

const BUDGETS = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under $2,500", min: 0, max: 2500 },
  { label: "$2,500 – $4,500", min: 2500, max: 4500 },
  { label: "$4,500+", min: 4500, max: Infinity },
];

export default function Bands({ view, navigate }: { view: ViewState; navigate: Navigate }) {
  const [query, setQuery] = useState(view.query ?? "");
  const [genre, setGenre] = useState(view.genre ?? "");
  const [region, setRegion] = useState("");
  const [eventType, setEventType] = useState("");
  const [budget, setBudget] = useState(0);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const { records } = useStore();

  const results = useMemo(() => {
    const live = records.filter((r) => r.status === "live");
    const feat = (id: string) => live.find((r) => r.band.id === id)?.featured ?? false;
    let list = live.map((r) => r.band);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.genres.some((g) => g.toLowerCase().includes(q)) ||
          b.tagline.toLowerCase().includes(q)
      );
    }
    if (genre) list = list.filter((b) => b.genres.includes(genre));
    if (region) list = list.filter((b) => b.region === region);
    const bgt = BUDGETS[budget];
    list = list.filter((b) => b.priceFrom < bgt.max && b.priceFrom >= (bgt.min === 0 ? 0 : bgt.min - 1));
    // event type: every band plays everything in this demo, but strings/jazz suit weddings etc.
    if (eventType === "Venue / residency") list = list.filter((b) => b.genres.includes("DJ & Live Sax") || b.genres.includes("Party & Covers") || b.genres.includes("Jazz & Swing"));
    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "price-asc":
        list.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      default:
        list.sort((a, b) => Number(feat(b.id)) - Number(feat(a.id)) || b.rating * b.reviewCount - a.rating * a.reviewCount);
    }
    return list;
  }, [records, query, genre, region, budget, sort, eventType]);

  const activeFilters = [genre, region, eventType, budget > 0 ? BUDGETS[budget].label : ""].filter(Boolean).length;

  const reset = () => {
    setQuery("");
    setGenre("");
    setRegion("");
    setEventType("");
    setBudget(0);
    setSort("recommended");
  };

  return (
    <div className="pt-40 sm:pt-44 pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* header */}
        <Reveal>
          <p className="eyebrow">The roster</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-medium tracking-tight text-ink">
            Find the band <em className="font-light gold-text">your night deserves</em>
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] text-ink-soft leading-relaxed">
            Auditioned, insured and review-verified artists across Australia. Watch them live, compare packages,
            then hold your date with a 20% deposit.
          </p>
        </Reveal>

        {/* search + sort bar */}
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, genre or city — try 'jazz' or 'Sydney'…"
                className="input-lux !pl-11 !py-4"
                aria-label="Search bands"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="lg:hidden inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-5 py-4 text-[13px] font-bold text-ink"
              >
                <SlidersHorizontal size={15} />
                Filters {activeFilters > 0 && <span className="grid place-items-center size-5 rounded-full bg-gold text-white text-[10px]">{activeFilters}</span>}
              </button>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="input-lux appearance-none !py-4 !pr-10 font-semibold text-[13px] cursor-pointer"
                  aria-label="Sort results"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* genre chips */}
        <Reveal delay={0.18}>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip active={genre === ""} onClick={() => setGenre("")}>All genres</Chip>
            {GENRES.map((g) => (
              <Chip key={g} active={genre === g} onClick={() => setGenre(genre === g ? "" : g)}>
                {g}
              </Chip>
            ))}
          </div>
        </Reveal>

        {/* secondary filters */}
        <div className={`${showFilters ? "grid" : "hidden"} lg:grid mt-4 grid-cols-2 sm:grid-cols-4 gap-3`}>
          {[
            { label: "Region", value: region, set: setRegion, options: ["Anywhere", ...REGIONS] },
            { label: "Event type", value: eventType, set: setEventType, options: ["Any event", ...EVENT_TYPES] },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select
                value={f.value || f.options[0]}
                onChange={(e) => f.set(e.target.value === f.options[0] ? "" : e.target.value)}
                className="input-lux appearance-none !py-3.5 !pr-9 text-[13px] font-semibold cursor-pointer"
                aria-label={f.label}
              >
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            </div>
          ))}
          <div className="relative col-span-2">
            <select
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="input-lux appearance-none !py-3.5 !pr-9 text-[13px] font-semibold cursor-pointer"
              aria-label="Budget"
            >
              {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          </div>
        </div>

        {/* result meta */}
        <div className="mt-10 flex items-center justify-between">
          <motion.p key={results.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] font-semibold text-ink-faint">
            <span className="text-ink font-bold">{results.length}</span> {results.length === 1 ? "act" : "acts"} available
            {genre && <> in <span className="text-gold-deep">{genre}</span></>}
          </motion.p>
          {activeFilters > 0 && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-blush hover:text-ink transition-colors">
              <X size={13} /> Clear all filters
            </button>
          )}
        </div>

        {/* grid */}
        {results.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((b, i) => (
              <BandCard key={b.id} band={b} navigate={navigate} index={i} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-3xl border border-dashed border-gold/50 bg-white p-16 text-center">
            <span className="mx-auto grid place-items-center size-14 rounded-full bg-gold-mist text-gold-deep">
              <Music4 size={22} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">No bands match that mix</h3>
            <p className="mt-2 text-[13.5px] text-ink-soft">Try widening the budget or clearing a filter — the roster changes seasonally.</p>
            <button onClick={reset} className="mt-6 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-ivory hover:bg-forest transition-colors">
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
