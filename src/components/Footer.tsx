import { ArrowUpRight, Lock, Music4 } from "lucide-react";
import type { Navigate } from "@/lib/nav";
import { GENRES } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Footer({ navigate }: { navigate: Navigate }) {
  const liveId = useStore().records.find((r) => r.status === "live")?.band.id;
  return (
    <footer className="bg-forest-deep text-ivory">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <button onClick={() => navigate({ route: "home" })} className="flex items-center gap-2.5">
              <span className="grid place-items-center size-9 rounded-full bg-gold-soft/15 text-gold-soft">
                <Music4 size={17} />
              </span>
              <span className="font-display text-3xl font-semibold tracking-tight">Encore</span>
            </button>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/55">
              Australia's curated live entertainment agency. Every artist auditioned, every payment protected, every
              review verified — from first enquiry to final encore.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-ivory/45">
              <Lock size={12} className="text-gold-soft" />
              256-bit SSL · PCI-DSS Level 1
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Visa", "Mastercard", "Amex", "Apple Pay", "Bank transfer"].map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-ivory/15 bg-white/5 px-2.5 py-1.5 text-[10.5px] font-bold tracking-wide text-ivory/70"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="eyebrow !text-gold-soft mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-ivory/65">
              {[
                { label: "Browse all bands", fn: () => navigate({ route: "bands" }) },
                { label: "Photo & video gallery", fn: () => navigate({ route: "gallery" }) },
                { label: "How booking works", fn: () => navigate({ route: "home" }) },
                { label: "Secure checkout", fn: () => navigate({ route: "booking", bandId: liveId }) },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={l.fn} className="group inline-flex items-center gap-1.5 hover:text-gold-soft transition-colors">
                    {l.label}
                    <ArrowUpRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow !text-gold-soft mb-5">By genre</h4>
            <ul className="space-y-3 text-sm text-ivory/65">
              {GENRES.slice(0, 6).map((g) => (
                <li key={g}>
                  <button
                    onClick={() => navigate({ route: "bands", genre: g })}
                    className="hover:text-gold-soft transition-colors"
                  >
                    {g} bands for hire
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow !text-gold-soft mb-5">By city</h4>
            <ul className="space-y-3 text-sm text-ivory/65">
              {["Sydney", "Melbourne", "Brisbane", "Perth", "Gold Coast", "Hunter Valley"].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => navigate({ route: "bands", query: c })}
                    className="hover:text-gold-soft transition-colors"
                  >
                    Wedding bands in {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline my-10 opacity-40" />

        <p className="text-[12px] leading-relaxed text-ivory/35 max-w-4xl">
          Encore is Australia's trusted marketplace for live band hire — connecting award-winning wedding bands, jazz
          ensembles, string quartets, party bands and DJ-sax acts with couples, planners and brands across Sydney,
          Melbourne, Brisbane, Perth, Adelaide and regional Australia. Every artist is auditioned and insured; every
          payment is protected by escrow and PCI-DSS Level 1 processing; every review is written by a verified client.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-ivory/40">
          <p>© 2026 Encore Entertainment Pty Ltd · ABN 12 345 678 901 · Made with love in Sydney</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-ivory/70 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-ivory/70 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-ivory/70 cursor-pointer transition-colors">Artist login</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
