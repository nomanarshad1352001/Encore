import { motion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardList,
  Gauge,
  HandCoins,
  PenLine,
  Plus,
  Search,
  Star,
  Trash2,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ListingEditor, AddActModal } from "@/panel/ArtistPanel";
import { BarChart, Modal, Pill, SectionCard, StatCard } from "@/panel/ui";
import { Stars } from "@/components/ui";
import { fmtAUD } from "@/lib/data";
import { useStore, type BandRecord } from "@/lib/store";
import type { Navigate } from "@/lib/nav";
import { cn } from "@/utils/cn";

const CONSOLE_TABS = [
  { key: "overview", label: "Platform Overview", icon: Gauge },
  { key: "artists", label: "Artists", icon: Users },
  { key: "bookings", label: "Bookings", icon: ClipboardList },
  { key: "reviews", label: "Reviews", icon: Star },
] as const;

type ConsoleTab = (typeof CONSOLE_TABS)[number]["key"];

/* ---- inline base-price editor: writes straight through to the live roster price ---- */
function PriceEditor({ record }: { record: BandRecord }) {
  const { savePackage } = useStore();
  const base = [...record.band.packages].sort((a, b) => a.price - b.price)[0];
  const [v, setV] = useState(String(base?.price ?? 0));

  useEffect(() => setV(String(base?.price ?? 0)), [base?.price]);

  const commit = () => {
    const n = Number(v);
    if (!base || !n || n === base.price) return;
    savePackage(record.band.id, { ...base, price: Math.max(300, n) });
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[12px] text-ink-faint">$</span>
      <input
        value={v}
        onChange={(e) => setV(e.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="w-24 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] font-bold text-ink tabular outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
        aria-label="Base price override"
      />
    </div>
  );
}

function MiniFlag({ active, onClick, title, icon: Icon, activeClass }: { active: boolean; onClick: () => void; title: string; icon: typeof Star; activeClass: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition-all",
        active ? activeClass : "border-line bg-white text-ink-faint hover:border-gold hover:text-ink"
      )}
    >
      <Icon size={11} strokeWidth={2.5} fill={active && Icon === Star ? "currentColor" : "none"} />
      {title}
    </button>
  );
}

function OverviewTab({ records }: { records: BandRecord[] }) {
  const live = records.filter((r) => r.status === "live");
  const allBookings = records.flatMap((r) => r.bookings);
  const gmv = allBookings.filter((b) => b.status !== "declined").reduce((s, b) => s + b.amount, 0);
  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const avgRating = records.length ? records.reduce((s, r) => s + r.band.rating, 0) / records.length : 0;

  const byMonth = new Map<string, number>();
  allBookings
    .filter((b) => b.status !== "declined")
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .forEach((b) => {
      const key = new Date(b.date).toLocaleDateString("en-AU", { month: "short" });
      byMonth.set(key, (byMonth.get(key) ?? 0) + b.amount);
    });
  const chart = [...byMonth.entries()].map(([label, value]) => ({ label, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={HandCoins} label="Marketplace GMV" value={fmtAUD(gmv)} sub="all live & past bookings" tone="dark" />
        <StatCard icon={Users} label="Artists live" value={`${live.length}/${records.length}`} sub={`${records.length - live.length} paused`} />
        <StatCard icon={ClipboardList} label="Pending enquiries" value={String(pendingCount)} sub={pendingCount > 0 ? "needs artist action" : "inbox clear"} tone={pendingCount > 0 ? "gold" : "light"} />
        <StatCard icon={Star} label="Avg. platform rating" value={avgRating.toFixed(2)} sub="across every act" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Gross booking value" sub="Monthly confirmed, completed and pending revenue across the platform">
          {chart.length ? <BarChart data={chart} /> : <p className="text-[13px] text-ink-faint">No revenue yet.</p>}
        </SectionCard>
        <SectionCard title="Needs attention" sub="Pending items across the marketplace">
          <ul className="space-y-3">
            {pendingCount === 0 && <li className="text-[13px] text-ink-faint">All enquiries handled. The pipeline is clean.</li>}
            {records.flatMap((r) =>
              r.bookings.filter((b) => b.status === "pending").map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold-mist/50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-bold text-ink">{b.client} → {r.band.name}</p>
                    <p className="text-[11px] text-ink-faint">{b.eventType} · {new Date(b.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} · {fmtAUD(b.amount)}</p>
                  </div>
                  <Pill tone="gold">pending</Pill>
                </li>
              ))
            )}
            {records.filter((r) => !r.verified).map((r) => (
              <li key={r.band.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-parchment/50 px-4 py-3">
                <p className="truncate text-[12.5px] font-bold text-ink">{r.band.name}</p>
                <Pill tone="grey">awaiting verification</Pill>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function ArtistsTab({ navigate }: { navigate: Navigate }) {
  const { records, setStatus, setFeatured, setVerified, removeBand, notify } = useStore();
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const rows = useMemo(
    () => records.filter((r) => r.band.name.toLowerCase().includes(q.toLowerCase()) || r.band.location.toLowerCase().includes(q.toLowerCase())),
    [records, q]
  );

  const editRecord = records.find((r) => r.band.id === editId);
  const deleteRecord = records.find((r) => r.band.id === deleteId);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search artists or cities…" className="input-lux !pl-10 !py-3" />
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-[12.5px] font-bold text-ivory hover:bg-forest-deep transition-colors">
          <Plus size={14} /> Add artist
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((r) => (
          <motion.div key={r.band.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-lux">
            <img src={r.band.image} alt={r.band.name} className="size-14 rounded-xl object-cover border border-line" />
            <div className="min-w-40 flex-1">
              <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                {r.band.name}
                {r.status === "paused" && <Pill tone="gold">paused</Pill>}
              </p>
              <p className="mt-0.5 text-[11.5px] text-ink-faint">{r.band.genres.join(" · ")} — {r.band.location}, {r.band.region}</p>
            </div>
            <div className="min-w-28">
              <p className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-faint">Site "from" price</p>
              <PriceEditor record={r} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <MiniFlag active={r.status === "live"} onClick={() => setStatus(r.band.id, r.status === "live" ? "paused" : "live")} title={r.status === "live" ? "Live" : "Paused"} icon={BadgeCheck} activeClass="border-forest bg-forest/[0.07] text-forest" />
              <MiniFlag active={r.verified} onClick={() => setVerified(r.band.id, !r.verified)} title="Verified" icon={BadgeCheck} activeClass="border-gold bg-gold-mist text-gold-deep" />
              <MiniFlag active={r.featured} onClick={() => { setFeatured(r.band.id, !r.featured); notify(r.featured ? "Removed from homepage featured" : "Now featured on the homepage"); }} title="Featured" icon={Star} activeClass="border-gold bg-gold-mist text-gold-deep" />
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setEditId(r.band.id)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-[11.5px] font-bold text-ink hover:border-gold transition-colors">
                <PenLine size={12} /> Edit listing
              </button>
              <button onClick={() => setDeleteId(r.band.id)} className="grid size-10 place-items-center rounded-full border border-line bg-white text-blush hover:border-blush transition-colors" aria-label="Delete artist">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
        {rows.length === 0 && <p className="rounded-2xl border border-dashed border-gold/40 bg-white p-10 text-center text-[13px] text-ink-faint">No artists match that search.</p>}
      </div>

      {editRecord && (
        <Modal title={`Edit — ${editRecord.band.name}`} sub="Admin edits publish instantly to the storefront and the artist's panel" onClose={() => setEditId(null)} wide>
          <ListingEditor record={editRecord} />
        </Modal>
      )}

      {showAdd && <AddActModal onClose={() => setShowAdd(false)} onCreated={(id) => navigate({ route: "band", bandId: id })} />}

      {deleteRecord && (
        <Modal title="Remove artist?" sub="Deletes the listing, packages, media and booking history from every surface" onClose={() => setDeleteId(null)}>
          <div className="flex gap-3.5 rounded-2xl border border-blush/25 bg-blush/5 p-4">
            <TriangleAlert size={20} className="shrink-0 text-blush" />
            <p className="text-[13px] leading-relaxed text-ink-soft">
              <b className="text-ink">{deleteRecord.band.name}</b> will disappear from the roster, gallery, featured sections, checkout and their artist panel — instantly. Restore anytime via “Reset demo data” on the login page.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => setDeleteId(null)} className="rounded-2xl border border-line py-3.5 text-[13px] font-bold text-ink hover:border-gold transition-colors">Cancel</button>
            <button onClick={() => { removeBand(deleteRecord.band.id); setDeleteId(null); notify("Artist removed — all surfaces updated"); }} className="rounded-2xl bg-blush py-3.5 text-[13px] font-bold text-white hover:opacity-90 transition-opacity">
              Delete artist
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BookingsTab() {
  const { records, setBookingStatus, notify } = useStore();
  const [filter, setFilter] = useState("");
  const all = records.flatMap((r) => r.bookings.map((b) => ({ ...b, bandName: r.band.name, bandId: r.band.id })));
  const shown = filter ? all.filter((b) => b.status === filter) : all;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["", "pending", "confirmed", "completed", "declined"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn("whitespace-nowrap rounded-full border px-4 py-2 text-[12px] font-bold capitalize transition-all", filter === s ? "border-forest bg-forest text-ivory" : "border-line bg-white text-ink-soft hover:border-gold")}>
            {s || "All"} ({s ? all.filter((b) => b.status === s).length : all.length})
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-lux">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-ink">{b.client} → {b.bandName}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-faint">{b.eventType} · {b.location} · {new Date(b.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} · {b.packageName} · {b.paidPct}% paid</p>
            </div>
            <p className="font-display text-lg font-semibold text-ink tabular">{fmtAUD(b.amount)}</p>
            {b.status === "pending" ? (
              <div className="flex gap-2">
                <button onClick={() => { setBookingStatus(b.bandId, b.id, "confirmed"); notify("Booking confirmed on behalf of artist"); }} className="rounded-full bg-forest px-4 py-2 text-[11px] font-bold text-ivory">Approve</button>
                <button onClick={() => { setBookingStatus(b.bandId, b.id, "declined"); notify("Enquiry declined"); }} className="rounded-full border border-blush/30 px-4 py-2 text-[11px] font-bold text-blush">Decline</button>
              </div>
            ) : b.status === "confirmed" ? <Pill tone="green">confirmed</Pill> : b.status === "completed" ? <Pill tone="grey">completed</Pill> : <Pill tone="red">declined</Pill>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab() {
  const { records, removeReview } = useStore();
  const all = records.flatMap((r) => r.band.reviews.map((rv) => ({ ...rv, bandName: r.band.name, bandId: r.band.id, hasReply: !!r.replies[rv.id] })));
  return (
    <div className="space-y-3">
      {all.length === 0 && <p className="rounded-2xl border border-dashed border-gold/40 bg-white p-10 text-center text-[13px] text-ink-faint">No reviews to moderate.</p>}
      {all.map((r) => (
        <div key={r.id} className="flex flex-wrap items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-lux">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest font-display text-base font-semibold text-gold-soft">{r.author.charAt(0)}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="text-[13.5px] font-bold text-ink">{r.author}</p>
              <Stars rating={r.rating} size={11} />
              <span className="text-[11px] text-ink-faint">on <b className="text-ink">{r.bandName}</b> · {r.date}</span>
              {r.hasReply && <Pill tone="grey">artist replied</Pill>}
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{r.text}</p>
          </div>
          <button onClick={() => removeReview(r.bandId, r.id)} className="grid size-10 place-items-center rounded-full border border-line text-blush hover:border-blush transition-colors" aria-label="Remove review">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminConsole({ navigate }: { navigate: Navigate }) {
  const { records, user } = useStore();
  const [tab, setTab] = useState<ConsoleTab>("overview");

  return (
    <div className="pt-32 sm:pt-36 pb-24 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-wrap items-center gap-4 rounded-[28px] bg-forest p-5 sm:p-6 shadow-lux-lg">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/10 font-display text-2xl font-semibold text-gold-soft">P</span>
          <div className="flex-1">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ivory">Admin Console</h1>
            <p className="mt-1 text-[12.5px] font-semibold text-ivory/55">Signed in as {user?.name} · full marketplace control · changes publish live</p>
          </div>
          <button onClick={() => navigate({ route: "bands" })} className="rounded-full border border-ivory/25 px-5 py-2.5 text-[12px] font-bold text-ivory hover:border-gold-soft hover:text-gold-soft transition-colors">
            View storefront →
          </button>
        </div>

        <div className="mt-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 shadow-lux [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CONSOLE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-[12.5px] font-bold transition-all",
                tab === t.key ? "bg-forest text-ivory shadow-lux" : "text-ink-soft hover:text-ink"
              )}
            >
              <t.icon size={15} className={tab === t.key ? "text-gold-soft" : "text-gold-deep"} />
              {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mt-6">
          {tab === "overview" && <OverviewTab records={records} />}
          {tab === "artists" && <ArtistsTab navigate={navigate} />}
          {tab === "bookings" && <BookingsTab />}
          {tab === "reviews" && <ReviewsTab />}
        </motion.div>
      </div>
    </div>
  );
}
