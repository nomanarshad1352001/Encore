import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarHeart,
  Check,
  CreditCard,
  Download,
  HandCoins,
  Landmark,
  Loader2,
  Lock,
  MapPin,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Stars } from "@/components/ui";
import { ADD_ONS, EVENT_TYPES, fmtAUD } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Navigate } from "@/lib/nav";
import { cn } from "@/utils/cn";

/* ================= helpers ================= */

const detectBrand = (num: string) => {
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "Amex";
  return "Card";
};

const luhnOk = (num: string) => {
  const d = num.replace(/\D/g, "");
  if (d.length < 13) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
};

const fmtCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

const STEPS = ["Event details", "Package & extras", "Your details", "Secure payment"] as const;

interface Form {
  bandId: string;
  packageId: string;
  eventType: string;
  date: string;
  location: string;
  guests: string;
  notes: string;
  addons: string[];
  name: string;
  email: string;
  phone: string;
  payPlan: "deposit" | "full";
  payMethod: "card" | "invoice";
  cardName: string;
  cardNum: string;
  expiry: string;
  cvc: string;
}

/* ================= main ================= */

export default function Booking({
  bandId,
  packageId,
  navigate,
}: {
  bandId?: string;
  packageId?: string;
  navigate: Navigate;
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [ref, setRef] = useState("");
  const [balancePaid, setBalancePaid] = useState(false);
  const [payingBalance, setPayingBalance] = useState(false);
  const [invoiceSent, setInvoiceSent] = useState(false);

  const { records } = useStore();
  const liveBands = records.filter((r) => r.status === "live").map((r) => r.band);

  const [f, setF] = useState<Form>(() => {
    const band = (bandId ? liveBands.find((b) => b.id === bandId) : undefined) ?? liveBands[0];
    return {
      bandId: band?.id ?? "",
      packageId: packageId && band?.packages.some((p) => p.id === packageId) ? packageId : band ? (band.packages.find((p) => p.popular)?.id ?? band.packages[0].id) : "",
      eventType: "Wedding",
      date: "",
      location: "",
      guests: "120",
      notes: "",
      addons: ["ao-song"],
      name: "",
      email: "",
      phone: "",
      payPlan: "deposit",
      payMethod: "card",
      cardName: "",
      cardNum: "",
      expiry: "",
      cvc: "",
    };
  });

  const band = liveBands.find((b) => b.id === f.bandId) ?? liveBands[0];
  const pkg = band ? band.packages.find((p) => p.id === f.packageId) ?? band.packages[0] : undefined;
  const addons = ADD_ONS.filter((a) => f.addons.includes(a.id));

  const subtotal = (pkg?.price ?? 0) + addons.reduce((s, a) => s + a.price, 0);
  const deposit = Math.round(subtotal * 0.2);
  const balance = subtotal - deposit;
  const dueNow = f.payPlan === "deposit" ? deposit : subtotal;

  const balanceDate = useMemo(() => {
    if (!f.date) return "14 days before your event";
    const d = new Date(f.date);
    d.setDate(d.getDate() - 14);
    return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }, [f.date]);

  if (!band || !pkg) {
    return (
      <div className="pt-48 pb-32 text-center px-6">
        <p className="font-display text-3xl text-ink">No acts are bookable right now.</p>
        <p className="mt-3 text-[14px] text-ink-soft">Every listing is currently paused — check back soon.</p>
        <button onClick={() => navigate({ route: "bands" })} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-ivory">Browse the roster</button>
      </div>
    );
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const today = new Date().toISOString().split("T")[0];

  /* -------- validation per step -------- */
  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!f.date) e.date = "Choose your event date";
      else if (f.date <= today) e.date = "Please pick a future date";
      if (!f.location.trim()) e.location = "Where's the celebration?";
      if (!f.guests || Number(f.guests) < 1) e.guests = "Guest estimate required";
    }
    if (s === 2) {
      if (f.name.trim().length < 2) e.name = "Your full name, please";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "A valid email is needed for the contract & receipts";
      if (f.phone.replace(/\D/g, "").length < 8) e.phone = "A valid phone number helps the band reach you";
    }
    if (s === 3 && f.payMethod === "card") {
      if (!luhnOk(f.cardNum)) e.cardNum = "Card number doesn't check out — try the demo card 4242 4242 4242 4242";
      if (f.cardName.trim().length < 2) e.cardName = "Name on card required";
      if (!/^\d{2}\/\d{2}$/.test(f.expiry)) e.expiry = "Format MM/YY";
      else {
        const [mm, yy] = f.expiry.split("/").map(Number);
        if (mm < 1 || mm > 12) e.expiry = "Invalid month";
        else if (new Date(2000 + yy, mm) < new Date()) e.expiry = "Card has expired";
      }
      if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "3–4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, 3)); };

  const pay = () => {
    if (!validate(3)) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setRef(`ENC-2026-${Math.floor(10000 + Math.random() * 89999)}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
  };

  const payBalance = () => {
    setPayingBalance(true);
    setTimeout(() => { setPayingBalance(false); setBalancePaid(true); }, 1600);
  };

  const brand = detectBrand(f.cardNum.replace(/\D/g, ""));

  /* ================= CONFIRMATION ================= */
  if (ref) {
    return (
      <div className="pt-40 sm:pt-44 pb-28 min-h-screen">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
              className="mx-auto grid size-24 place-items-center rounded-full bg-forest text-gold-soft shadow-lux-lg"
            >
              <PartyPopper size={38} />
            </motion.span>
            <p className="eyebrow mt-8">Booking confirmed</p>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl font-medium tracking-tight text-ink">
              The date is <em className="font-light gold-text">yours</em>
            </h1>
            <p className="mt-4 text-[15px] text-ink-soft">
              Booking reference <span className="font-bold text-ink tabular">{ref}</span> — contracts and your tax
              invoice are on their way to <span className="font-bold text-ink">{f.email}</span>.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* booking card */}
            <div className="rounded-[28px] border border-line bg-white p-7 shadow-lux">
              <div className="flex items-center gap-4">
                <img src={band.image} alt={band.name} className="size-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-display text-xl font-semibold text-ink">{band.name}</p>
                  <p className="text-[12px] font-semibold text-ink-faint">{pkg.name} package · {fmtAUD(pkg.price)}</p>
                </div>
                <Stars rating={band.rating} className="ml-auto" size={12} />
              </div>
              <div className="hairline my-5" />
              <dl className="space-y-3 text-[13px]">
                {[
                  ["Event", f.eventType],
                  ["Date", new Date(f.date).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Location", f.location],
                  ["Guests", `~${f.guests}`],
                  ["Extras", addons.length ? addons.map((a) => a.name).join(", ") : "None selected"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6">
                    <dt className="font-semibold text-ink-faint">{k}</dt>
                    <dd className="font-bold text-ink text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* payment schedule */}
            <div className="rounded-[28px] bg-forest p-7 text-ivory shadow-lux-lg">
              <p className="eyebrow !text-gold-soft">Payment schedule</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  <span className="grid size-9 place-items-center rounded-full bg-gold-soft text-forest-deep"><Check size={15} strokeWidth={3} /></span>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-bold">{f.payPlan === "full" ? "Paid in full" : "Deposit paid"} — {fmtAUD(dueNow)}</p>
                    <p className="text-[11.5px] text-ivory/55">Receipt {ref}-01 · held securely in escrow</p>
                  </div>
                </div>
                {f.payPlan === "deposit" && (
                  <div className="flex items-center gap-3.5">
                    <span className={cn("grid size-9 place-items-center rounded-full", balancePaid ? "bg-gold-soft text-forest-deep" : "bg-white/10 text-ivory/60 border border-dashed border-ivory/30")}>
                      {balancePaid ? <Check size={15} strokeWidth={3} /> : <HandCoins size={15} />}
                    </span>
                    <div className="flex-1">
                      <p className="text-[13.5px] font-bold">Balance — {fmtAUD(balance)}</p>
                      <p className="text-[11.5px] text-ivory/55">{balancePaid ? "Settled today. All done!" : `Auto-scheduled · ${balanceDate}`}</p>
                    </div>
                  </div>
                )}
              </div>
              {f.payPlan === "deposit" && !balancePaid && (
                <button
                  onClick={payBalance}
                  disabled={payingBalance}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-ivory py-3.5 text-[13px] font-bold text-forest-deep hover:bg-gold-soft transition-colors disabled:opacity-70"
                >
                  {payingBalance ? <><Loader2 size={15} className="animate-spin" /> Processing securely…</> : <>Pay balance now — {fmtAUD(balance)}</>}
                </button>
              )}
              {balancePaid && (
                <p className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 text-[13px] font-bold text-gold-soft">
                  <BadgeCheck size={15} /> Fully paid — no further payments due
                </p>
              )}
              <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-ivory/45">
                <Lock size={11} /> 256-bit SSL · PCI-DSS Level 1 · funds released after performance
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="mt-8 flex flex-wrap justify-center gap-3.5">
            <button
              onClick={() => { setInvoiceSent(true); }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-[13px] font-bold text-ink hover:border-gold transition-colors"
            >
              <Download size={14} /> {invoiceSent ? "Invoice emailed ✓" : "Tax invoice (GST)"}
            </button>
            <button
              onClick={() => navigate({ route: "band", bandId: band.id })}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-[13px] font-bold text-ink hover:border-gold transition-colors"
            >
              <Star size={14} /> Leave a review after the event
            </button>
            <button
              onClick={() => navigate({ route: "home" })}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13px] font-bold text-ivory hover:bg-forest transition-colors"
            >
              Back to Encore <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ================= FLOW ================= */
  return (
    <div className="pt-40 sm:pt-44 pb-28 min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <button onClick={() => navigate({ route: "band", bandId: band.id })} className="group inline-flex items-center gap-2 text-[13px] font-bold text-ink-soft hover:text-ink transition-colors">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> {band.name}
        </button>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl font-medium tracking-tight text-ink">
          Secure <em className="font-light gold-text">your date</em>
        </h1>

        {/* stepper */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[12px] font-bold transition-colors",
                  i === step ? "bg-forest text-ivory" : i < step ? "bg-gold-mist text-gold-deep" : "bg-white border border-line text-ink-faint"
                )}
              >
                <span className={cn("grid size-5 place-items-center rounded-full text-[10px]", i < step ? "bg-gold-deep text-white" : i === step ? "bg-white/20" : "bg-sand text-ink-soft")}>
                  {i < step ? <Check size={10} strokeWidth={4} /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-10" />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* ------------ form column ------------ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[28px] border border-line bg-white p-7 sm:p-9 shadow-lux"
            >
              {step === 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-3"><CalendarHeart size={21} className="text-gold-deep" /> The occasion</h2>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Your band</span>
                      <select value={f.bandId} onChange={(e) => {
                        const nb = liveBands.find((b) => b.id === e.target.value)!;
                        setF((s) => ({ ...s, bandId: nb.id, packageId: nb.packages.find((p) => p.popular)?.id ?? nb.packages[0].id }));
                      }} className="input-lux font-semibold cursor-pointer">
                        {liveBands.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.location}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Event type</span>
                      <select value={f.eventType} onChange={(e) => set("eventType", e.target.value)} className="input-lux font-semibold cursor-pointer">
                        {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Event date</span>
                      <input type="date" min={today} value={f.date} onChange={(e) => set("date", e.target.value)} className={cn("input-lux", errors.date && "error")} />
                      {errors.date && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.date}</span>}
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Guests (est.)</span>
                      <input type="number" min={1} value={f.guests} onChange={(e) => set("guests", e.target.value)} className={cn("input-lux", errors.guests && "error")} />
                      {errors.guests && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.guests}</span>}
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Venue / location</span>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                        <input value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Stones of the Yarra Valley, VIC" className={cn("input-lux !pl-10", errors.location && "error")} />
                      </div>
                      {errors.location && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.location}</span>}
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Anything we should know? (optional)</span>
                      <textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="First dance song, surprise moments, venue quirks…" className="input-lux resize-none" />
                    </label>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-3"><Sparkles size={20} className="text-gold-deep" /> Package & extras</h2>
                  <div className="mt-7 space-y-3.5">
                    {band.packages.map((p) => (
                      <button key={p.id} onClick={() => set("packageId", p.id)} className={cn(
                        "relative w-full rounded-2xl border p-5 text-left transition-all duration-300",
                        f.packageId === p.id ? "border-forest bg-forest/[0.04] shadow-lux" : "border-line hover:border-gold"
                      )}>
                        {p.popular && <span className="absolute -top-2.5 right-5 rounded-full bg-gold px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">Most booked</span>}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <span className={cn("grid size-6 place-items-center rounded-full border-2", f.packageId === p.id ? "border-forest bg-forest text-ivory" : "border-line text-transparent")}>
                              <Check size={12} strokeWidth={3.5} />
                            </span>
                            <div>
                              <p className="text-[14.5px] font-bold text-ink">{p.name}</p>
                              <p className="text-[11.5px] text-ink-faint">{p.tagline}</p>
                            </div>
                          </div>
                          <p className="font-display text-2xl font-semibold text-ink tabular">{fmtAUD(p.price)}</p>
                        </div>
                        {f.packageId === p.id && (
                          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 grid gap-1.5 sm:grid-cols-2 overflow-hidden">
                            {p.features.map((x) => (
                              <li key={x} className="flex items-start gap-2 text-[12px] text-ink-soft"><Check size={13} className="mt-0.5 shrink-0 text-forest" strokeWidth={3} />{x}</li>
                            ))}
                          </motion.ul>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-8 mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">Popular extras</p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {ADD_ONS.map((a) => {
                      const on = f.addons.includes(a.id);
                      return (
                        <button key={a.id} onClick={() => set("addons", on ? f.addons.filter((x) => x !== a.id) : [...f.addons, a.id])} className={cn(
                          "rounded-2xl border p-4 text-left transition-all duration-300",
                          on ? "border-gold bg-gold-mist/50" : "border-line hover:border-gold/60"
                        )}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[13px] font-bold text-ink">{a.name}</p>
                            <span className="text-[12px] font-bold text-gold-deep tabular">+{fmtAUD(a.price)}</span>
                          </div>
                          <p className="mt-1 text-[11.5px] leading-snug text-ink-faint">{a.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-3"><Users size={20} className="text-gold-deep" /> Your details</h2>
                  <p className="mt-2 text-[13px] text-ink-soft">The contract, receipts and event run sheet are all issued to these details.</p>
                  <div className="mt-7 grid gap-5">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Full name</span>
                      <input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Alexandra Rivera" className={cn("input-lux", errors.name && "error")} />
                      {errors.name && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.name}</span>}
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Email</span>
                      <input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={cn("input-lux", errors.email && "error")} />
                      {errors.email && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.email}</span>}
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Mobile</span>
                      <input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0412 345 678" className={cn("input-lux", errors.phone && "error")} />
                      {errors.phone && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.phone}</span>}
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-3"><CreditCard size={20} className="text-gold-deep" /> Secure payment</h2>

                  {/* plan toggle */}
                  <div className="mt-6 grid grid-cols-2 gap-2.5 rounded-2xl border border-line bg-parchment/60 p-2.5">
                    {([
                      { k: "deposit", label: "20% deposit", sub: `Pay ${fmtAUD(deposit)} today`, note: "Balance " + balanceDate },
                      { k: "full", label: "Pay in full", sub: `Pay ${fmtAUD(subtotal)} today`, note: "Nothing left to pay" },
                    ] as const).map((o) => (
                      <button key={o.k} onClick={() => set("payPlan", o.k)} className={cn(
                        "rounded-xl p-4 text-left transition-all duration-300",
                        f.payPlan === o.k ? "bg-forest text-ivory shadow-lux" : "bg-white text-ink hover:shadow-lux"
                      )}>
                        <p className="text-[13px] font-bold">{o.label}</p>
                        <p className={cn("mt-0.5 text-[11.5px]", f.payPlan === o.k ? "text-gold-soft" : "text-ink-soft")}>{o.sub}</p>
                        <p className={cn("text-[10.5px]", f.payPlan === o.k ? "text-ivory/50" : "text-ink-faint")}>{o.note}</p>
                      </button>
                    ))}
                  </div>

                  {/* method toggle */}
                  <div className="mt-5 flex gap-2.5">
                    {([
                      { k: "card", label: "Card", icon: CreditCard },
                      { k: "invoice", label: "Bank transfer", icon: Landmark },
                    ] as const).map((m) => (
                      <button key={m.k} onClick={() => set("payMethod", m.k)} className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-[12.5px] font-bold transition-colors",
                        f.payMethod === m.k ? "border-forest bg-forest/[0.05] text-forest" : "border-line text-ink-soft hover:border-gold"
                      )}>
                        <m.icon size={15} /> {m.label}
                      </button>
                    ))}
                  </div>

                  {f.payMethod === "card" ? (
                    <div className="mt-6 grid gap-4">
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Card number</span>
                        <div className="relative">
                          <input
                            inputMode="numeric"
                            value={f.cardNum}
                            onChange={(e) => set("cardNum", fmtCard(e.target.value))}
                            placeholder="4242 4242 4242 4242"
                            className={cn("input-lux !pr-16 tabular", errors.cardNum && "error")}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wider text-gold-deep">{f.cardNum ? brand : ""}</span>
                        </div>
                        {errors.cardNum && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.cardNum}</span>}
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Name on card</span>
                        <input value={f.cardName} onChange={(e) => set("cardName", e.target.value)} placeholder="A RIVERA" className={cn("input-lux", errors.cardName && "error")} />
                        {errors.cardName && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.cardName}</span>}
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Expiry</span>
                          <input inputMode="numeric" value={f.expiry} onChange={(e) => set("expiry", fmtExpiry(e.target.value))} placeholder="MM/YY" className={cn("input-lux tabular", errors.expiry && "error")} />
                          {errors.expiry && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.expiry}</span>}
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">CVC</span>
                          <input inputMode="numeric" value={f.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className={cn("input-lux tabular", errors.cvc && "error")} />
                          {errors.cvc && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{errors.cvc}</span>}
                        </label>
                      </div>
                      <p className="rounded-xl bg-gold-mist/60 border border-gold/30 px-4 py-3 text-[11.5px] font-semibold text-gold-deep">
                        Demo mode — use card 4242 4242 4242 4242 with any future expiry & CVC. No real charge is made.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-line bg-parchment/60 p-6 text-center">
                      <Building2 size={22} className="mx-auto text-forest" />
                      <p className="mt-3 text-[13.5px] font-bold text-ink">We'll email a tax invoice with BSB & account details</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">Your date is held for 72 hours while the transfer clears. A reminder goes out at 48 hours — after that the date is released automatically.</p>
                    </div>
                  )}
                </div>
              )}

              {/* nav buttons */}
              <div className="mt-9 flex items-center justify-between gap-4 border-t border-line pt-6">
                {step > 0 ? (
                  <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-[13px] font-bold text-ink-soft hover:border-gold hover:text-ink transition-colors">
                    <ArrowLeft size={15} /> Back
                  </button>
                ) : (
                  <button onClick={() => navigate({ route: "band", bandId: band.id })} className="inline-flex items-center gap-2 text-[13px] font-bold text-ink-faint hover:text-ink">
                    <ArrowLeft size={14} /> Band profile
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={next} className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[13px] font-bold text-ivory hover:bg-forest transition-colors">
                    Continue <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button onClick={pay} disabled={processing} className="inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 text-[13px] font-bold text-ivory shadow-lux hover:bg-forest-deep transition-colors disabled:opacity-70">
                    {processing ? (
                      <><Loader2 size={15} className="animate-spin" /> Processing — do not close…</>
                    ) : f.payMethod === "card" ? (
                      <><Lock size={14} /> Pay {fmtAUD(dueNow)} securely</>
                    ) : (
                      <>Confirm & email invoice</>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ------------ summary column ------------ */}
          <div className="lg:sticky lg:top-32 space-y-5">
            <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-lux">
              <div className="relative h-44">
                <img src={band.image} alt={band.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="font-display text-2xl font-semibold text-ivory">{band.name}</p>
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-gold-soft">{band.genres.join(" · ")} — {band.location}</p>
                </div>
              </div>
              <div className="p-6">
                <dl className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between"><dt className="text-ink-faint font-semibold">{pkg.name} package</dt><dd className="font-bold tabular">{fmtAUD(pkg.price)}</dd></div>
                  {addons.map((a) => (
                    <div key={a.id} className="flex justify-between"><dt className="text-ink-faint font-semibold">{a.name}</dt><dd className="font-bold tabular">{fmtAUD(a.price)}</dd></div>
                  ))}
                  <div className="flex justify-between text-[12px]"><dt className="text-ink-faint">Booking fee</dt><dd className="font-bold text-forest">Free</dd></div>
                </dl>
                <div className="hairline my-4" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">Total (GST incl.)</p>
                    <p className="font-display text-3xl font-semibold text-ink tabular">{fmtAUD(subtotal)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold-deep">Due today</p>
                    <p className="font-display text-xl font-semibold text-gold-deep tabular">{fmtAUD(dueNow)}</p>
                  </div>
                </div>
                {f.date && (
                  <p className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-faint">
                    <CalendarHeart size={12} className="text-gold" />
                    {f.eventType} · {new Date(f.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} · ~{f.guests} guests
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-line bg-parchment/60 p-5 space-y-3.5">
              {[
                [ShieldCheck, "Escrow protection — artists paid after they play"],
                [Lock, "256-bit SSL · PCI-DSS Level 1 processing"],
                [Download, "Instant contract & GST tax invoice"],
                [Sparkles, "Free date changes up to 90 days out"],
              ].map(([Icon, text]) => (
                <p key={text as string} className="flex items-start gap-3 text-[12px] font-semibold text-ink-soft">
                  <Icon size={14} className="mt-0.5 shrink-0 text-forest" /> {text as string}
                </p>
              ))}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Visa", "Mastercard", "Amex", "Apple Pay"].map((p) => (
                  <span key={p} className="rounded-md border border-line bg-white px-2 py-1 text-[9.5px] font-bold tracking-wide text-ink-soft">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
