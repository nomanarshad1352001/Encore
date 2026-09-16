import { motion, AnimatePresence } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/* ------- form field wrapper ------- */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-[11px] text-ink-faint">{hint}</span>}
      {error && <span className="mt-1.5 block text-[11.5px] font-semibold text-blush">{error}</span>}
    </label>
  );
}

/* ------- toggle switch ------- */
export function Toggle({ on, onChange, labelOn, labelOff }: { on: boolean; onChange: (v: boolean) => void; labelOn?: string; labelOff?: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-2 py-1.5 pr-4 text-[11.5px] font-bold transition-all duration-300",
        on ? "border-forest bg-forest/[0.06] text-forest" : "border-line bg-white text-ink-faint hover:border-gold"
      )}
    >
      <span className={cn("relative h-5 w-9 rounded-full transition-colors duration-300", on ? "bg-forest" : "bg-sand")}>
        <motion.span layout className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow", on ? "right-0.5" : "left-0.5")} />
      </span>
      {on ? labelOn ?? "On" : labelOff ?? "Off"}
    </button>
  );
}

/* ------- stat card ------- */
export function StatCard({ icon: Icon, label, value, sub, tone = "light" }: { icon: LucideIcon; label: string; value: string; sub?: string; tone?: "light" | "dark" | "gold" }) {
  return (
    <div
      className={cn(
        "rounded-[22px] border p-5",
        tone === "dark" ? "border-forest-soft bg-forest text-ivory" : tone === "gold" ? "border-gold/40 bg-gold-mist/60" : "border-line bg-white shadow-lux"
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-[10.5px] font-bold uppercase tracking-[0.16em]", tone === "dark" ? "text-ivory/55" : "text-ink-faint")}>{label}</span>
        <span className={cn("grid size-8 place-items-center rounded-xl", tone === "dark" ? "bg-white/10 text-gold-soft" : "bg-parchment text-forest")}>
          <Icon size={15} />
        </span>
      </div>
      <p className={cn("mt-3 font-display text-[28px] leading-none font-semibold tabular", tone === "dark" ? "text-ivory" : "text-ink")}>{value}</p>
      {sub && <p className={cn("mt-1.5 text-[11px] font-semibold", tone === "dark" ? "text-gold-soft" : "text-gold-deep")}>{sub}</p>}
    </div>
  );
}

/* ------- status pill ------- */
export function Pill({ tone, children }: { tone: "green" | "gold" | "red" | "grey" | "forest"; children: ReactNode }) {
  const styles = {
    green: "bg-forest/10 text-forest border-forest/25",
    gold: "bg-gold-mist text-gold-deep border-gold/30",
    red: "bg-blush/10 text-blush border-blush/25",
    grey: "bg-parchment text-ink-soft border-line",
    forest: "bg-forest text-gold-soft border-forest",
  } as const;
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]", styles[tone])}>{children}</span>;
}

/* ------- modal ------- */
export function Modal({ title, sub, onClose, children, wide }: { title: string; sub?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm p-0 sm:p-6" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={cn("max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] sm:rounded-[28px] border border-line bg-ivory shadow-lux-lg", wide ? "sm:max-w-3xl" : "sm:max-w-lg")}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-ivory/95 backdrop-blur px-6 sm:px-8 py-5">
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
              {sub && <p className="mt-1 text-[12px] text-ink-faint">{sub}</p>}
            </div>
            <button onClick={onClose} className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-soft hover:text-ink hover:border-gold transition-colors" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="px-6 sm:px-8 py-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------- section card ------- */
export function SectionCard({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[26px] border border-line bg-white shadow-lux overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 sm:px-7 py-5">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          {sub && <p className="mt-0.5 text-[12px] text-ink-faint">{sub}</p>}
        </div>
        {actions}
      </div>
      <div className="p-6 sm:p-7">{children}</div>
    </section>
  );
}

/* ------- mini bar chart (CSS) ------- */
export function BarChart({ data, dark }: { data: { label: string; value: number }[]; dark?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3 sm:gap-5">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(6, (d.value / max) * 132)}px` }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={cn("w-full max-w-14 rounded-t-xl", dark ? "bg-gold-soft" : "bg-gradient-to-t from-forest to-forest-soft")}
          />
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", dark ? "text-ivory/50" : "text-ink-faint")}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
