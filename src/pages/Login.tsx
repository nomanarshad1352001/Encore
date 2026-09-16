import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn, Mail, Music4, RotateCcw, ShieldCheck, Star, Users } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui";
import { DEMO_ADMIN, DEMO_ARTIST, useStore } from "@/lib/store";
import type { Navigate } from "@/lib/nav";
import { cn } from "@/utils/cn";

export default function Login({ navigate, note }: { navigate: Navigate; note?: string }) {
  const { login, notify, resetDemo } = useStore();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(note ?? "");
  const [busy, setBusy] = useState(false);

  const attempt = (e?: string, p?: string) => {
    setBusy(true);
    setErr("");
    setTimeout(() => {
      const res = login(e ?? email, p ?? pass);
      setBusy(false);
      if (res.ok && res.role) {
        notify(`Welcome back — signed in as ${res.role === "admin" ? "Platform Admin" : "Artist"}`);
        navigate({ route: res.role === "admin" ? "console" : "panel" });
      } else {
        setErr(res.error ?? "Sign in failed");
      }
    }, 650);
  };

  return (
    <div className="min-h-screen pt-36 sm:pt-40 pb-24 grid lg:grid-cols-2 items-stretch">
      {/* left brand panel */}
      <div className="relative hidden lg:block m-6 mr-0 overflow-hidden rounded-[40px]">
        <img
          src="https://images.pexels.com/photos/8043852/pexels-photo-8043852.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600"
          alt="Singer performing into a vintage microphone"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/45 to-forest-deep/20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center size-10 rounded-full bg-gold-soft/15 text-gold-soft border border-gold-soft/30">
              <Music4 size={18} />
            </span>
            <span className="font-display text-2xl font-semibold text-ivory">Encore for Artists</span>
          </div>
          <div>
            <Reveal>
              <h2 className="font-display text-5xl leading-[1.02] font-medium text-ivory">
                Run your act like<br /><em className="font-light gold-text">a headline business</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-ivory/65">
                One dashboard for your listing, pricing, media, availability, bookings, payouts and reviews —
                every change publishes to the Encore marketplace instantly.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex gap-8">
                {[
                  ["7", "studio tools"],
                  ["1 hr", "avg. enquiry response"],
                  ["90%", "artist payout share"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-3xl font-semibold text-gold-soft tabular">{n}</p>
                    <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ivory/50">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="flex items-center justify-center px-5 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
          <p className="eyebrow">Secure sign in</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
            Welcome <em className="font-light gold-text">back</em>
          </h1>
          <p className="mt-3 text-[14px] text-ink-soft">
            Artists manage their act in the <b>Artist Panel</b>; the platform team works from the <b>Admin Console</b>.
          </p>

          <div className="mt-8 rounded-[26px] border border-line bg-white p-7 shadow-lux">
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Email</span>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  onKeyDown={(e) => e.key === "Enter" && attempt()}
                  placeholder="you@band.com.au"
                  className="input-lux !pl-10"
                />
              </div>
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                <input
                  type={show ? "text" : "password"}
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(""); }}
                  onKeyDown={(e) => e.key === "Enter" && attempt()}
                  placeholder="••••••••"
                  className="input-lux !pl-10 !pr-11"
                />
                <button onClick={() => setShow((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink" aria-label="Toggle password visibility">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {err && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-blush/25 bg-blush/5 px-4 py-3 text-[12px] font-semibold text-blush">
                {err}
              </motion.p>
            )}

            <button
              onClick={() => attempt()}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ink py-4 text-[14px] font-bold text-ivory shadow-lux hover:bg-forest transition-colors disabled:opacity-70"
            >
              <LogIn size={16} /> {busy ? "Checking credentials…" : "Sign in"}
            </button>

            <div className="my-6 flex items-center gap-4 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              <span className="h-px flex-1 bg-line" /> demo access <span className="h-px flex-1 bg-line" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail(DEMO_ARTIST.email); setPass(DEMO_ARTIST.pass); attempt(DEMO_ARTIST.email, DEMO_ARTIST.pass); }}
                className="group rounded-2xl border border-line bg-parchment/60 p-4 text-left transition-all hover:border-forest hover:shadow-lux"
              >
                <Users size={16} className="text-forest" />
                <p className="mt-2 text-[12.5px] font-bold text-ink">Artist demo</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-ink-faint break-all">{DEMO_ARTIST.email}<br />{DEMO_ARTIST.pass}</p>
              </button>
              <button
                onClick={() => { setEmail(DEMO_ADMIN.email); setPass(DEMO_ADMIN.pass); attempt(DEMO_ADMIN.email, DEMO_ADMIN.pass); }}
                className="group rounded-2xl border border-line bg-parchment/60 p-4 text-left transition-all hover:border-gold hover:shadow-lux"
              >
                <Star size={16} className="text-gold-deep" />
                <p className="mt-2 text-[12.5px] font-bold text-ink">Admin demo</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-ink-faint break-all">{DEMO_ADMIN.email}<br />{DEMO_ADMIN.pass}</p>
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
              <ShieldCheck size={13} className="text-forest" /> Demo only — no real authentication
            </p>
            <button onClick={resetDemo} className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold text-gold-deep hover:text-ink transition-colors")}>
              <RotateCcw size={12} /> Reset demo data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
