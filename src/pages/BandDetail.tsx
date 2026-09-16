import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  CircleCheck,
  MapPin,
  Music2,
  Play,
  Quote,
  Send,
  ShieldCheck,
  Star,
  Timer,
  Truck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal, Stars } from "@/components/ui";
import { fmtAUD, type Review } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Navigate } from "@/lib/nav";
import { cn } from "@/utils/cn";

/* ------------- review form ------------- */
function ReviewForm({ onSubmit }: { onSubmit: (r: Review) => void }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [evt, setEvt] = useState("");
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!name.trim() || !evt.trim() || text.trim().length < 12) {
      setErr("Please add your name, event details and a review of at least a sentence.");
      return;
    }
    onSubmit({
      id: "local-" + Date.now(),
      author: name.trim(),
      eventType: evt.trim(),
      date: "Just now",
      rating,
      text: text.trim(),
      verified: false,
      pending: true,
    });
    setName(""); setEvt(""); setText(""); setErr(""); setRating(5);
  };

  return (
    <div className="rounded-3xl border border-line bg-parchment/50 p-6 sm:p-7">
      <h3 className="font-display text-xl font-semibold text-ink">Played your event? Leave a review</h3>
      <p className="mt-1 text-[12.5px] text-ink-faint">Reviews are linked to completed Encore bookings before publishing.</p>
      <div className="mt-5 flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
            className="transition-transform hover:scale-125"
          >
            <Star size={26} strokeWidth={0} fill="currentColor" className={(hover || rating) >= n ? "text-gold" : "text-line"} />
          </button>
        ))}
        <span className="ml-2 text-[13px] font-bold text-ink-soft">{["", "Poor", "Fair", "Good", "Great", "Exceptional"][hover || rating]}</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-lux" />
        <input value={evt} onChange={(e) => setEvt(e.target.value)} placeholder="Event — e.g. Wedding, Hunter Valley" className="input-lux" />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How was the band? The dancefloor? The communication?"
        rows={3}
        className="input-lux mt-3 resize-none"
      />
      {err && <p className="mt-2 text-[12.5px] font-semibold text-blush">{err}</p>}
      <button onClick={submit} className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-[13px] font-bold text-ivory hover:bg-forest-deep transition-colors">
        <Send size={14} /> Submit for verification
      </button>
    </div>
  );
}

/* ------------- main page ------------- */
export default function BandDetail({ bandId, navigate }: { bandId: string; navigate: Navigate }) {
  const { recordOf } = useStore();
  const record = recordOf(bandId);
  const band = record?.band;
  const paused = record?.status === "paused";
  const replies = record?.replies ?? {};
  const [reviews, setReviews] = useState<Review[]>(band?.reviews ?? []);
  const [pkg, setPkg] = useState<string | undefined>(band?.packages.find((p) => p.popular)?.id);
  const [tab, setTab] = useState<"all" | "photos" | "video">("all");

  const ratingDist = useMemo(() => [86, 11, 2, 1, 0], []);
  if (!band) {
    return (
      <div className="pt-48 pb-32 text-center">
        <p className="font-display text-3xl text-ink">That band has left the stage.</p>
        <button onClick={() => navigate({ route: "bands" })} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-ivory">Back to the roster</button>
      </div>
    );
  }

  const selected = band.packages.find((p) => p.id === pkg);

  return (
    <div className="pt-36 sm:pt-40 pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <button onClick={() => navigate({ route: "bands" })} className="group inline-flex items-center gap-2 text-[13px] font-bold text-ink-soft hover:text-ink transition-colors">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> All bands
        </button>

        {/* ---------- hero ---------- */}
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-end">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              {band.badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-soft">
                  <BadgeCheck size={12} /> {band.badge}
                </span>
              )}
              {band.genres.map((g) => (
                <span key={g} className="rounded-full border border-gold/40 bg-gold-mist/60 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-gold-deep">{g}</span>
              ))}
            </div>
            <h1 className="mt-5 font-display text-5xl sm:text-7xl font-medium tracking-tight text-ink leading-[0.98]">{band.name}</h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">{band.tagline}. Based in {band.location}, performing Australia-wide.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-semibold text-ink-soft">
              <span className="flex items-center gap-2"><Stars rating={band.rating} /> <b className="text-ink">{band.rating.toFixed(1)}</b> · {band.reviewCount} verified reviews</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold" /> {band.location}, {band.region}</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-gold" /> {band.lineup}</span>
              <span className="flex items-center gap-1.5"><Timer size={14} className="text-gold" /> Replies within 1 hr</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card-lux rounded-[28px] p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">Packages from</p>
                  <p className="font-display text-4xl font-semibold text-ink tabular">{fmtAUD(band.priceFrom)}</p>
                </div>
                <p className="text-right text-[11.5px] leading-snug text-ink-faint">GST incl. · no booking fees<br />from {fmtAUD(Math.round(band.priceFrom * 0.2))} deposit</p>
              </div>
              <div className="hairline my-5" />
              <button
                onClick={() => navigate({ route: "booking", bandId: band.id, packageId: pkg })}
                disabled={paused}
                className={cn(
                  "group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ink py-4 text-[14px] font-bold text-ivory transition-colors",
                  paused ? "cursor-not-allowed opacity-40" : "hover:bg-forest"
                )}
              >
                <CalendarCheck size={16} />
                {paused ? "Bookings paused" : `Check date & book ${selected ? `— ${selected.name}` : ""}`}
                {!paused && <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />}
              </button>
              {paused && (
                <p className="mt-3 rounded-xl border border-gold/40 bg-gold-mist/60 px-4 py-3 text-[11.5px] font-semibold text-gold-deep text-center">
                  This act is taking a break — their listing is paused and not taking new bookings.
                </p>
              )}
              <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-ink-faint">
                <ShieldCheck size={13} className="text-forest" /> 20% deposit holds your date · escrow protected
              </p>
            </div>
          </Reveal>
        </div>

        {/* ---------- media ---------- */}
        <div className="mt-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-ink">Watch & browse</h2>
            <div className="flex gap-2">
              {(["all", "photos", "video"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[12px] font-bold capitalize transition-colors",
                    tab === t ? "bg-forest text-ivory" : "border border-line bg-white text-ink-soft hover:border-gold"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {(tab === "all" || tab === "video") && (
              <Reveal className="lg:row-span-2">
                <div className="group relative h-full min-h-[340px] overflow-hidden rounded-[32px] border border-line shadow-lux cursor-pointer" onClick={(e) => {
                  const v = e.currentTarget.querySelector("video");
                  if (v) v.paused ? v.play() : v.pause();
                }}>
                  <video src={band.video.src} poster={band.video.poster} muted loop playsInline preload="none" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-ivory/90 text-ink transition-transform group-hover:scale-110 pointer-events-none">
                    <Play size={20} className="ml-1" fill="currentColor" />
                  </span>
                  <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                    <p className="text-[15px] font-bold text-ivory">{band.video.title}</p>
                    <p className="text-[11.5px] text-ivory/70 mt-0.5">Live performance reel · {band.video.duration}</p>
                  </div>
                </div>
              </Reveal>
            )}
            {tab !== "video" &&
              band.gallery.map((g, i) => (
                <Reveal key={g.src} delay={i * 0.06}>
                  <div className="group overflow-hidden rounded-[32px] border border-line shadow-lux">
                    <img src={g.src} alt={g.alt} loading="lazy" className="h-64 w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06]" />
                  </div>
                </Reveal>
              ))}
          </div>
        </div>

        {/* ---------- about + setlist ---------- */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink">About the act</h2>
            {band.bio.map((p, i) => (
              <p key={i} className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">{p}</p>
            ))}
            <div className="mt-8 flex flex-wrap gap-6 rounded-3xl border border-line bg-white p-6 shadow-lux">
              {[
                [`${band.eventsPlayed}+`, "events played"],
                [`${band.members}`, "musicians"],
                ["48 hrs", "quote turnaround"],
                ["100%", "on-time arrival"],
              ].map(([n, l]) => (
                <div key={l as string}>
                  <p className="font-display text-2xl font-semibold text-ink tabular">{n}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint mt-1">{l}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-[12.5px] font-semibold text-ink-faint">
              <Truck size={14} className="text-gold" /> {band.travelNote}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-[28px] bg-forest p-7 sm:p-8 text-ivory h-full">
              <h2 className="font-display text-2xl font-semibold">Signature setlist</h2>
              <p className="mt-1.5 text-[12px] text-ivory/55">A taste — full repertoire runs to 300+ songs with requests welcome.</p>
              <ul className="mt-6 space-y-3.5">
                {band.setlist.map((s, i) => (
                  <li key={s} className="flex items-center gap-3.5 border-b border-white/8 pb-3.5 text-[14px] font-semibold">
                    <span className="grid place-items-center size-8 rounded-full bg-white/8 text-gold-soft shrink-0"><Music2 size={13} /></span>
                    {s}
                    <span className="ml-auto font-display italic text-ivory/30 text-sm">0{i + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ---------- packages ---------- */}
        <div className="mt-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink">Packages & pricing</h2>
            <p className="mt-2 text-[14px] text-ink-soft">Transparent, GST-inclusive pricing. Choose a package and secure your date in minutes.</p>
          </Reveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {band.packages.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <button
                  onClick={() => setPkg(p.id)}
                  className={cn(
                    "relative h-full w-full rounded-[28px] border p-7 text-left transition-all duration-400",
                    pkg === p.id ? "border-forest bg-forest text-ivory shadow-lux-lg -translate-y-1" : "border-line bg-white shadow-lux hover:-translate-y-1 hover:shadow-lux-lg"
                  )}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-white">
                      Most booked
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[22px] font-semibold">{p.name}</h3>
                      <p className={cn("mt-0.5 text-[12px]", pkg === p.id ? "text-ivory/60" : "text-ink-faint")}>{p.tagline}</p>
                    </div>
                    <span className={cn("grid place-items-center size-6 rounded-full border-2 transition-colors", pkg === p.id ? "border-gold-soft bg-gold-soft text-forest" : "border-line text-transparent")}>
                      <Check size={13} strokeWidth={3.5} />
                    </span>
                  </div>
                  <p className="mt-5 font-display text-[40px] leading-none font-semibold tabular">{fmtAUD(p.price)}</p>
                  <p className={cn("mt-1 text-[11px] font-semibold", pkg === p.id ? "text-ivory/55" : "text-ink-faint")}>
                    {fmtAUD(Math.round(p.price * 0.2))} deposit today
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className={cn("flex items-start gap-2.5 text-[12.5px] leading-snug", pkg === p.id ? "text-ivory/80" : "text-ink-soft")}>
                        <CircleCheck size={14} className={cn("mt-0.5 shrink-0", pkg === p.id ? "text-gold-soft" : "text-forest")} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-gold/40 bg-gold-mist/50 p-6">
              <p className="text-[13.5px] font-semibold text-ink">
                Selected: <span className="font-bold">{selected?.name}</span> — {selected && fmtAUD(selected.price)} ·{" "}
                {selected && fmtAUD(Math.round(selected.price * 0.2))} deposit
              </p>
              <button
                onClick={() => navigate({ route: "booking", bandId: band.id, packageId: pkg })}
                disabled={paused}
                className={cn("group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[13px] font-bold text-ivory transition-colors", paused ? "cursor-not-allowed opacity-40" : "hover:bg-forest")}
              >
                {paused ? "Bookings paused" : "Continue to secure booking"}
                {!paused && <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </Reveal>
        </div>

        {/* ---------- reviews ---------- */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink">Client reviews</h2>
            <div className="mt-6 flex items-end gap-4">
              <p className="font-display text-7xl font-semibold text-ink leading-none tabular">{band.rating.toFixed(1)}</p>
              <div className="pb-1.5">
                <Stars rating={band.rating} size={16} />
                <p className="mt-1.5 text-[12px] font-semibold text-ink-faint">{band.reviewCount} verified reviews</p>
              </div>
            </div>
            <div className="mt-7 space-y-2.5">
              {ratingDist.map((pct, i) => (
                <div key={i} className="flex items-center gap-3 text-[12px] font-bold text-ink-soft">
                  <span className="w-3 tabular">{5 - i}</span>
                  <Star size={11} fill="currentColor" strokeWidth={0} className="text-gold" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gold"
                    />
                  </div>
                  <span className="w-9 text-right text-ink-faint tabular">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-8"><ReviewForm onSubmit={(r) => setReviews((rs) => [r, ...rs])} /></div>
          </Reveal>

          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {reviews.map((r) => (
                <motion.article
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-lux"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid place-items-center size-11 rounded-full bg-parchment font-display text-lg font-semibold text-forest">
                        {r.author.charAt(0)}
                      </span>
                      <div>
                        <p className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
                          {r.author}
                          {r.verified && <CircleCheck size={14} className="text-forest" />}
                        </p>
                        <p className="text-[11.5px] text-ink-faint mt-0.5">{r.eventType} · {r.date}</p>
                      </div>
                    </div>
                    <Stars rating={r.rating} size={13} />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Quote size={16} className="shrink-0 text-gold-soft mt-0.5" fill="currentColor" />
                    <p className="text-[13.5px] leading-relaxed text-ink-soft">{r.text}</p>
                  </div>
                  {r.pending && (
                    <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-mist px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-gold-deep">
                      <Timer size={11} /> Pending booking verification
                    </p>
                  )}
                  {replies[r.id] && (
                    <div className="mt-4 rounded-xl border-l-[3px] border-gold bg-parchment/70 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-deep">{band.name} replied</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{replies[r.id]}</p>
                    </div>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- bottom CTA ---------- */}
        <Reveal className="mt-20">
          <div className="relative overflow-hidden rounded-[36px] bg-forest-deep px-8 py-14 text-center shadow-lux-lg">
            <p className="eyebrow !text-gold-soft">Ready when you are</p>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-medium text-ivory">
              {band.name}, <em className="font-light gold-text">at your event</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] text-ivory/60">
              Dates are first-come, first-served — a 20% refundable-window deposit locks yours in today.
            </p>
            <button
              onClick={() => navigate({ route: "booking", bandId: band.id, packageId: pkg })}
              disabled={paused}
              className={cn("mt-8 inline-flex items-center gap-2.5 rounded-full bg-ivory px-8 py-4 text-[14px] font-bold text-forest-deep transition-colors", paused ? "cursor-not-allowed opacity-50" : "hover:bg-gold-soft")}
            >
              <CalendarCheck size={16} /> {paused ? "Bookings currently paused" : "Check availability & book"}
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
