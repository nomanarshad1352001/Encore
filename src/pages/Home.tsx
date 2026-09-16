import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarHeart,
  ChevronDown,
  CircleCheck,
  FileCheck2,
  Headset,
  PartyPopper,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";
import BandCard from "@/components/BandCard";
import { Reveal, SectionHeading, Stars } from "@/components/ui";
import { FAQS, GENRES, HOME_HERO_IMAGES, TESTIMONIALS, VENUES } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Navigate } from "@/lib/nav";

/* ================= HERO ================= */

function Hero({ navigate }: { navigate: Navigate }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-40 sm:pt-48 pb-10">
      {/* ambient washes */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-[560px] rounded-full bg-gold-mist blur-[140px] opacity-70" />
      <div className="pointer-events-none absolute top-64 -left-52 size-[480px] rounded-full bg-sand blur-[120px] opacity-80" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div style={{ y: yText }}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 backdrop-blur px-4 py-2"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 rounded-full bg-gold animate-pulse-ring" />
                <span className="relative inline-flex size-2 rounded-full bg-gold" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-deep">
                Australia's live entertainment agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-display text-[13.5vw] sm:text-7xl xl:text-[86px] leading-[0.98] font-medium tracking-tight text-ink"
            >
              Your night,
              <br />
              scored by a{" "}
              <em className="font-light gold-text">live band</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.24 }}
              className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft"
            >
              Encore hand-picks the country's finest wedding bands, jazz ensembles, party acts and DJ-sax duos —
              then makes booking them as easy as ordering dinner. Verified reviews, escrow-protected payments,
              and a 20% deposit holds your date.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.36 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => navigate({ route: "bands" })}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[14px] font-bold text-ivory shadow-lux-lg hover:bg-forest transition-colors duration-300"
              >
                Find your band
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => navigate({ route: "gallery" })}
                className="group inline-flex items-center gap-3 rounded-full border border-ink/15 bg-white px-6 py-4 text-[14px] font-bold text-ink hover:border-gold transition-colors duration-300"
              >
                <span className="grid place-items-center size-7 rounded-full bg-gold-mist text-gold-deep">
                  <Play size={11} fill="currentColor" />
                </span>
                Watch them live
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {[
                ["2,400+", "events delivered"],
                ["4.9/5", "from 640 verified reviews"],
                ["$8M+", "payments protected"],
              ].map(([n, l]) => (
                <div key={l} className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold text-ink tabular">{n}</span>
                  <span className="text-[11.5px] font-semibold text-ink-faint uppercase tracking-wider">{l}</span>
                </div>
              ))}
            </motion.div>

            {/* mobile hero image */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-10 md:hidden"
            >
              <img
                src={HOME_HERO_IMAGES.main}
                alt="Wedding guests celebrating under string lights with live band"
                className="h-56 w-full rounded-[28px] object-cover border-[5px] border-white shadow-lux-lg"
              />
            </motion.div>
          </motion.div>

          {/* collage */}
          <motion.div style={{ y: yImg }} className="relative h-[540px] hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 2.5 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 w-[68%] overflow-hidden rounded-[36px] border-[6px] border-white shadow-lux-lg"
            >
              <img src={HOME_HERO_IMAGES.main} alt="Wedding guests celebrating under string lights with live band" className="h-72 w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -3.5 }}
              transition={{ duration: 1.1, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-40 w-[46%] overflow-hidden rounded-[32px] border-[6px] border-white shadow-lux-lg animate-floaty"
              style={{ ["--r" as string]: "-3.5deg" }}
            >
              <img src={HOME_HERO_IMAGES.alt2} alt="Soul singer in red dress performing" className="h-64 w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-0 right-6 w-[52%] overflow-hidden rounded-[32px] border-[6px] border-white shadow-lux-lg"
            >
              <img src={HOME_HERO_IMAGES.alt1} alt="Couple's first dance at glamorous wedding reception" className="h-52 w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="absolute bottom-16 left-2 card-lux flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <Stars rating={5} size={13} />
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-ink">"The dancefloor never emptied"</p>
                <p className="text-ink-faint">640 verified reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* genre marquee */}
      <div className="relative mt-16 border-y border-line bg-white/60 backdrop-blur marquee-mask overflow-hidden py-3.5">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...GENRES, ...GENRES, ...GENRES].map((g, i) => (
            <button
              key={i}
              onClick={() => navigate({ route: "bands", genre: g })}
              className="flex items-center gap-10 text-[12px] font-bold uppercase tracking-[0.3em] text-ink-faint hover:text-gold-deep transition-colors"
            >
              {g}
              <Sparkles size={11} className="text-gold" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TRUST MARQUEE ================= */

function TrustBar() {
  return (
    <section className="py-12">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-ink-faint mb-7">
        The bands behind Australia's most-loved venues
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee-fast items-center gap-14 pr-14">
          {[...VENUES, ...VENUES].map((v, i) => (
            <span key={i} className="font-display text-xl sm:text-2xl font-medium italic text-ink/30 whitespace-nowrap">
              {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= HOW IT WORKS ================= */

const STEPS = [
  {
    n: "01",
    icon: CalendarHeart,
    title: "Tell us the occasion",
    copy: "Date, venue, vibe. Filter the roster by genre, city and budget — every act has live video so you can hear before you book.",
  },
  {
    n: "02",
    icon: Search,
    title: "Meet your shortlist",
    copy: "Compare packages side by side, read verified client reviews, and shortlist the bands that feel like you.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Secure it with 20%",
    copy: "A refundable-window deposit holds your date. Funds stay in escrow — released to the artist only after they play.",
  },
  {
    n: "04",
    icon: PartyPopper,
    title: "Take a bow",
    copy: "Your band handles production, logistics and run sheets with the venue. You just enjoy the bow at the end.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The booking flow"
          title="From first listen to"
          italic="final encore"
          copy="A booking flow designed with event planners — then refined by two thousand real bookings. Most enquiries become confirmed bookings in under a day."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl bg-white border border-line p-7 shadow-lux hover:shadow-lux-lg transition-all duration-500 hover:-translate-y-1.5">
                <span className="font-display text-[64px] leading-none font-light text-sand absolute -top-2 right-4 select-none transition-colors duration-500 group-hover:text-gold-soft">
                  {s.n}
                </span>
                <span className="grid place-items-center size-12 rounded-2xl bg-forest text-gold-soft">
                  <s.icon size={21} strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-display text-[21px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= FEATURED BANDS ================= */

function Featured({ navigate }: { navigate: Navigate }) {
  const { records } = useStore();
  const live = records.filter((r) => r.status === "live");
  const featured = live.filter((r) => r.featured).map((r) => r.band);
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Curated roster"
            title="This season's"
            italic="most-requested"
            copy="Every artist is auditioned live, fully insured, and re-reviewed after each performance. If they're on Encore, they're exceptional."
          />
          <Reveal delay={0.2}>
            <button
              onClick={() => navigate({ route: "bands" })}
              className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-[13px] font-bold text-ink hover:border-gold transition-colors"
            >
              Browse all {live.length} acts
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((b, i) => (
            <BandCard key={b.id} band={b} navigate={navigate} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= WHY ENCORE ================= */

function Why({ navigate }: { navigate: Navigate }) {
  const points = [
    { icon: ShieldCheck, title: "Escrow payment protection", copy: "Deposits and balances are held securely and released to artists only after the performance. Cards processed by a PCI-DSS Level 1 provider." },
    { icon: Star, title: "Verified reviews only", copy: "A review can only be written by a client with a completed, paid booking. No bought stars, no anonymous gripes." },
    { icon: BadgeDollarSign, title: "Transparent pricing", copy: "The price you see is the price you pay — GST, production and standard travel included. No booking fees, ever." },
    { icon: Headset, title: "Humans on call, 7 days", copy: "Real entertainment producers in Sydney answer in under an hour, and the Performance Guarantee covers every lineup." },
  ];
  return (
    <section className="py-24 sm:py-28 bg-forest relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-0 size-[420px] rounded-full bg-forest-soft blur-[120px] opacity-60" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-14 lg:grid-cols-2 items-center">
        <div>
          <SectionHeading
            align="left"
            dark
            eyebrow="Why Encore"
            title="The safest pair of hands"
            italic="in live music"
            copy="Ten years inside the industry taught us what goes wrong — so we engineered it out of the booking experience."
          />
          <div className="mt-10 space-y-7">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex gap-5">
                  <span className="shrink-0 grid place-items-center size-12 rounded-2xl bg-white/8 border border-gold-soft/25 text-gold-soft">
                    <p.icon size={20} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[15.5px] font-bold text-ivory">{p.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/55 max-w-md">{p.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <button
              onClick={() => navigate({ route: "bands" })}
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-gold-soft px-7 py-4 text-[13.5px] font-bold text-forest-deep hover:bg-ivory transition-colors"
            >
              Start browsing <ArrowRight size={15} />
            </button>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="relative overflow-hidden rounded-[40px] shadow-lux-lg border border-white/10">
            <img src={HOME_HERO_IMAGES.trust} alt="Romantic first dance on an illuminated dance floor" className="h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 rounded-3xl bg-ivory/95 backdrop-blur p-5 flex items-center gap-4">
              <span className="grid place-items-center size-11 rounded-full bg-forest text-gold-soft shrink-0">
                <FileCheck2 size={18} />
              </span>
              <div className="text-[12.5px] leading-snug">
                <p className="font-bold text-ink">Every booking contract-backed & insured</p>
                <p className="text-ink-soft mt-0.5">Public liability · equipment cover · performance guarantee</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */

function Testimonials() {
  return (
    <section id="reviews" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Verified client reviews"
          title="Nights people"
          italic="still talk about"
          copy="Every review below is tied to a completed, paid booking — that's the only way a review can exist on Encore."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="relative h-full flex flex-col rounded-[28px] bg-white border border-line p-7 shadow-lux">
                <span className="font-display text-7xl leading-[0.6] text-gold-soft select-none">"</span>
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-ink-soft">{t.quote}</blockquote>
                <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                  <img src={t.avatar} alt={t.name} className="size-12 rounded-full object-cover border-2 border-gold-mist" loading="lazy" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13.5px] font-bold text-ink truncate">{t.name}</p>
                      <CircleCheck size={14} className="text-forest shrink-0" />
                    </div>
                    <p className="text-[11.5px] text-ink-faint mt-0.5">{t.event}</p>
                    <div className="mt-1.5"><Stars rating={t.rating} size={11} /></div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 sm:py-28 bg-parchment/60 border-y border-line">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Good to know"
          title="Questions, answered"
          italic="honestly"
        />
        <div className="mt-12 space-y-3.5">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="overflow-hidden rounded-2xl bg-white border border-line shadow-lux">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-bold text-ink">{f.q}</span>
                  <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-gold-deep shrink-0">
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-[13.5px] leading-relaxed text-ink-soft">{f.a}</p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */

function Cta({ navigate }: { navigate: Navigate }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[44px] bg-forest-deep px-8 py-20 sm:px-16 text-center shadow-lux-lg">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[480px] rounded-full bg-forest-soft blur-[130px] opacity-70" />
            <p className="eyebrow !text-gold-soft relative">Dates for 2026 are filling</p>
            <h2 className="relative mt-5 font-display text-4xl sm:text-6xl font-medium text-ivory tracking-tight">
              Let's make it <em className="font-light gold-text">a night to remember</em>
            </h2>
            <p className="relative mx-auto mt-6 max-w-xl text-[14.5px] leading-relaxed text-ivory/60">
              Browse the roster, fall for a band, and hold your date in under five minutes.
              20% deposit. Zero booking fees. One unforgettable night.
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate({ route: "bands" })}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ivory px-8 py-4 text-[14px] font-bold text-forest-deep hover:bg-gold-soft transition-colors"
              >
                Find your band
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate({ route: "gallery" })}
                className="inline-flex items-center gap-2.5 rounded-full border border-ivory/25 px-8 py-4 text-[14px] font-bold text-ivory hover:border-gold-soft hover:text-gold-soft transition-colors"
              >
                <Play size={14} fill="currentColor" />
                Browse the gallery
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home({ navigate }: { navigate: Navigate }) {
  return (
    <>
      <Hero navigate={navigate} />
      <TrustBar />
      <HowItWorks />
      <Featured navigate={navigate} />
      <Why navigate={navigate} />
      <Testimonials />
      <Faq />
      <Cta navigate={navigate} />
    </>
  );
}
