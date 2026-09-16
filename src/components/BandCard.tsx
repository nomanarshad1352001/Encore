import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Play, Users } from "lucide-react";
import type { Band } from "@/lib/data";
import { fmtAUD } from "@/lib/data";
import { Stars } from "@/components/ui";
import type { Navigate } from "@/lib/nav";

export default function BandCard({ band, navigate, index = 0 }: { band: Band; navigate: Navigate; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-white border border-line shadow-lux hover:shadow-lux-lg transition-shadow duration-500 cursor-pointer"
      onClick={() => navigate({ route: "band", bandId: band.id })}
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={band.image}
          alt={`${band.name} — ${band.genres[0]} band for hire in ${band.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
        {band.badge && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-deep">
            <BadgeCheck size={12} />
            {band.badge}
          </span>
        )}
        <span className="absolute right-4 bottom-4 grid place-items-center size-11 rounded-full bg-ivory/95 text-ink opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400">
          <Play size={15} className="ml-0.5" fill="currentColor" />
        </span>
        <div className="absolute left-4 bottom-4 right-16 flex flex-wrap gap-1.5">
          {band.genres.map((g) => (
            <span key={g} className="rounded-full bg-ink/55 backdrop-blur px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ivory">
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[22px] leading-tight font-semibold text-ink group-hover:text-forest transition-colors">
              {band.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-faint">
              <MapPin size={12} className="text-gold" />
              {band.location}, {band.region}
              <span className="mx-1 text-line">·</span>
              <Users size={12} className="text-gold" />
              {band.members === 2 ? "Duo" : `${band.members}-piece`}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">From</p>
            <p className="font-display text-xl font-semibold text-ink tabular">{fmtAUD(band.priceFrom)}</p>
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft line-clamp-2">{band.tagline}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div className="flex items-center gap-2">
            <Stars rating={band.rating} />
            <span className="text-[12px] font-bold text-ink">{band.rating.toFixed(1)}</span>
            <span className="text-[12px] text-ink-faint">({band.reviewCount} verified)</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-gold-deep">
            View act
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
