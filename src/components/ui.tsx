import { motion, useInView } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  italic,
  copy,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  copy?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <Reveal>
        <p className="eyebrow mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "font-display text-4xl sm:text-5xl leading-[1.05] font-medium tracking-tight",
            dark ? "text-ivory" : "text-ink"
          )}
        >
          {title}{" "}
          {italic && <em className="font-light gold-text">{italic}</em>}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={0.16}>
          <p className={cn("mt-5 text-[15px] leading-relaxed", dark ? "text-ivory/60" : "text-ink-soft")}>
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Star rating ---------------- */
export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={0} />;
        if (i === full && half) return <StarHalf key={i} size={size} fill="currentColor" strokeWidth={0} />;
        return <Star key={i} size={size} className="text-line" fill="currentColor" strokeWidth={0} />;
      })}
    </span>
  );
}

/* ---------------- Genre / filter chip ---------------- */
export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300",
        active
          ? "border-forest bg-forest text-ivory shadow-lux"
          : "border-line bg-white text-ink-soft hover:border-gold hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
