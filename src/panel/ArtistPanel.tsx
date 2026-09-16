import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  CalendarDays,
  Check,
  ClipboardList,
  ExternalLink,
  Images,
  LayoutDashboard,
  PauseCircle,
  PenLine,
  PlayCircle,
  Plus,
  Star,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Field, Modal, Pill, SectionCard, StatCard, Toggle, BarChart } from "@/panel/ui";
import { AvailabilityTab, BookingsTab, ReviewsTab } from "@/panel/MoreTabs";
import { GENRES, REGIONS, fmtAUD, type Band, type BandPackage } from "@/lib/data";
import { MEDIA_POOL, useStore, type BandRecord } from "@/lib/store";
import type { Navigate } from "@/lib/nav";
import { cn } from "@/utils/cn";

/* ================= LISTING EDITOR (shared with Admin Console) ================= */

function draftFrom(b: Band) {
  return {
    name: b.name,
    tagline: b.tagline,
    location: b.location,
    region: b.region,
    members: String(b.members),
    lineup: b.lineup,
    travelNote: b.travelNote,
    genres: [...b.genres],
    vibes: b.vibes.join(", "),
    bio: b.bio.join("\n\n"),
    setlist: b.setlist.join(", "),
  };
}

export function ListingEditor({ record }: { record: BandRecord }) {
  const { updateBand, notify } = useStore();
  const [d, setD] = useState(() => draftFrom(record.band));
  const [err, setErr] = useState("");

  useEffect(() => {
    setD(draftFrom(record.band));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.band.id]);

  const save = () => {
    if (d.name.trim().length < 2) return setErr("A band name is required.");
    if (d.genres.length === 0) return setErr("Select at least one genre.");
    const members = Math.max(1, Number(d.members) || 1);
    updateBand(record.band.id, {
      name: d.name.trim(),
      tagline: d.tagline.trim(),
      location: d.location.trim(),
      region: d.region,
      members,
      lineup: d.lineup.trim() || `${members}-piece lineup`,
      travelNote: d.travelNote.trim(),
      genres: d.genres,
      vibes: d.vibes.split(",").map((s) => s.trim()).filter(Boolean),
      bio: d.bio.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      setlist: d.setlist.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setErr("");
    notify("Listing published — changes are live on the site right now");
  };

  const cls = "input-lux";

  return (
    <SectionCard
      title="Listing & profile"
      sub="Everything here publishes instantly to your public page, the roster and search."
      actions={<Pill tone="green"><Check size={11} strokeWidth={3.5} /> synced live</Pill>}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Act name"><input className={cls} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} /></Field>
        <Field label="Tagline"><input className={cls} value={d.tagline} onChange={(e) => setD({ ...d, tagline: e.target.value })} /></Field>
        <Field label="Home city"><input className={cls} value={d.location} onChange={(e) => setD({ ...d, location: e.target.value })} /></Field>
        <Field label="Region">
          <select className={cn(cls, "cursor-pointer font-semibold")} value={d.region} onChange={(e) => setD({ ...d, region: e.target.value })}>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Musicians"><input className={cls} type="number" min={1} value={d.members} onChange={(e) => setD({ ...d, members: e.target.value })} /></Field>
        <Field label="Lineup description"><input className={cls} value={d.lineup} onChange={(e) => setD({ ...d, lineup: e.target.value })} /></Field>
        <div className="sm:col-span-2">
          <Field label="Travel policy"><input className={cls} value={d.travelNote} onChange={(e) => setD({ ...d, travelNote: e.target.value })} /></Field>
        </div>
        <div className="sm:col-span-2">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Genres (tap to toggle)</span>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setD({ ...d, genres: d.genres.includes(g) ? d.genres.filter((x) => x !== g) : [...d.genres, g] })}
                className={cn(
                  "rounded-full border px-4 py-2 text-[12px] font-bold transition-all",
                  d.genres.includes(g) ? "border-forest bg-forest text-ivory" : "border-line bg-white text-ink-soft hover:border-gold"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <Field label="Vibes (comma separated)" hint="Shown as mood tags on your profile"><input className={cls} value={d.vibes} onChange={(e) => setD({ ...d, vibes: e.target.value })} /></Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Bio (blank line = new paragraph)"><textarea rows={5} className={cn(cls, "resize-none leading-relaxed")} value={d.bio} onChange={(e) => setD({ ...d, bio: e.target.value })} /></Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Signature setlist (comma separated)"><textarea rows={2} className={cn(cls, "resize-none")} value={d.setlist} onChange={(e) => setD({ ...d, setlist: e.target.value })} /></Field>
        </div>
      </div>

      {err && <p className="mt-4 rounded-xl border border-blush/25 bg-blush/5 px-4 py-3 text-[12px] font-semibold text-blush">{err}</p>}

      <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
        <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-[13px] font-bold text-ivory shadow-lux hover:bg-forest-deep transition-colors">
          <Check size={15} strokeWidth={3} /> Publish changes
        </button>
        <span className="text-[11.5px] font-semibold text-ink-faint">Pushes live to roster, profile, search & booking</span>
      </div>
    </SectionCard>
  );
}

/* ================= ADD ACT MODAL (shared with Admin Console) ================= */

export function AddActModal({ onClose, onCreated }: { onClose: () => void; onCreated?: (id: string) => void }) {
  const { addBand, notify } = useStore();
  const [f, setF] = useState({ name: "", tagline: "", genre: GENRES[0], location: "", region: "NSW", members: "4", price: "2500", image: MEDIA_POOL[2] });

  const create = () => {
    if (f.name.trim().length < 2) return notify("Give the act a name first");
    const id = addBand({
      name: f.name.trim(),
      tagline: f.tagline.trim() || `Live ${f.genre.toLowerCase()} for events across Australia`,
      genre: f.genre,
      location: f.location.trim() || "Sydney",
      region: f.region,
      members: Math.max(1, Number(f.members) || 1),
      image: f.image,
      price: Math.max(300, Number(f.price) || 1000),
    });
    notify(`"${f.name.trim()}" is live on the roster`);
    onCreated?.(id);
    onClose();
  };

  return (
    <Modal title="Add a new act" sub="Creates a live listing immediately — refine every detail afterwards." onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Act name"><input className="input-lux" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. The Paper Cranes" /></Field>
        <Field label="Tagline"><input className="input-lux" value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} placeholder="One line that sells the act" /></Field>
        <Field label="Genre">
          <select className="input-lux cursor-pointer font-semibold" value={f.genre} onChange={(e) => setF({ ...f, genre: e.target.value })}>{GENRES.map((g) => <option key={g}>{g}</option>)}</select>
        </Field>
        <Field label="Home city"><input className="input-lux" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Sydney" /></Field>
        <Field label="Region">
          <select className="input-lux cursor-pointer font-semibold" value={f.region} onChange={(e) => setF({ ...f, region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Musicians"><input className="input-lux" type="number" min={1} value={f.members} onChange={(e) => setF({ ...f, members: e.target.value })} /></Field>
          <Field label="From price (AUD)"><input className="input-lux" type="number" min={300} step={50} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></Field>
        </div>
        <div className="sm:col-span-2">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Cover image</span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {MEDIA_POOL.map((src) => (
              <button key={src} onClick={() => setF({ ...f, image: src })} className={cn("overflow-hidden rounded-xl border-2 transition-all", f.image === src ? "border-forest scale-[1.03] shadow-lux" : "border-transparent opacity-70 hover:opacity-100")}>
                <img src={src} alt="" className="h-14 w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={create} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-4 text-[14px] font-bold text-ivory hover:bg-forest-deep transition-colors">
        <Plus size={16} /> Create live listing
      </button>
    </Modal>
  );
}

/* ================= TABS ================= */

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, desc: "Performance & activity" },
  { key: "listing", label: "Listing & Profile", icon: PenLine, desc: "Edit your public page" },
  { key: "media", label: "Media Manager", icon: Images, desc: "Photos, cover & video" },
  { key: "packages", label: "Packages & Pricing", icon: BadgeDollarSign, desc: "Live price control" },
  { key: "availability", label: "Availability", icon: CalendarDays, desc: "Block & open dates" },
  { key: "bookings", label: "Bookings", icon: ClipboardList, desc: "Enquiries & payouts" },
  { key: "reviews", label: "Reviews", icon: Star, desc: "Reply to clients" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function OverviewTab({ record, setTab }: { record: BandRecord; setTab: (t: TabKey) => void }) {
  const active = record.bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
  const revenue = active.reduce((s, b) => s + b.payout, 0);
  const upcoming = record.bookings.filter((b) => b.status === "confirmed").length;
  const pending = record.bookings.filter((b) => b.status === "pending").length;

  const byMonth = new Map<string, number>();
  [...active].sort((a, b) => (a.date < b.date ? -1 : 1)).forEach((b) => {
    const key = new Date(b.date).toLocaleDateString("en-AU", { month: "short" });
    byMonth.set(key, (byMonth.get(key) ?? 0) + b.payout);
  });
  const chart = [...byMonth.entries()].map(([label, value]) => ({ label, value }));

  const health = [
    { ok: record.band.gallery.length >= 3, label: "3+ gallery photos", tab: "media" as TabKey },
    { ok: record.band.packages.length >= 2, label: "2+ bookable packages", tab: "packages" as TabKey },
    { ok: record.band.bio.join(" ").length > 120, label: "Full-length bio", tab: "listing" as TabKey },
    { ok: record.band.reviews.length >= 2, label: "2+ client reviews", tab: "reviews" as TabKey },
    { ok: record.availability.length > 0, label: "Availability up to date", tab: "availability" as TabKey },
    { ok: !!record.band.video, label: "Performance video reel", tab: "media" as TabKey },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BadgeDollarSign} label="Earnings (90% payout)" value={fmtAUD(revenue)} sub="confirmed + completed" />
        <StatCard icon={CalendarDays} label="Upcoming gigs" value={String(upcoming)} sub={pending > 0 ? `${pending} enquiries awaiting you` : "inbox clear"} tone={pending > 0 ? "gold" : "light"} />
        <StatCard icon={Images} label="Profile views" value={record.views.toLocaleString()} sub="last 90 days" />
        <StatCard icon={Star} label="Rating" value={record.band.rating.toFixed(1)} sub={`${record.band.reviewCount} verified reviews`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Payout timeline" sub="Your 90% share of confirmed & completed bookings">
          {chart.length ? <BarChart data={chart} /> : <p className="text-[13px] text-ink-faint">Confirmed bookings will chart here.</p>}
        </SectionCard>

        <SectionCard title="Listing health" sub="Complete every item to rank higher in search">
          <ul className="space-y-3">
            {health.map((h) => (
              <li key={h.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-ink-soft">
                  <span className={cn("grid size-5.5 size-6 place-items-center rounded-full", h.ok ? "bg-forest/10 text-forest" : "bg-gold-mist text-gold-deep")}>
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {h.label}
                </span>
                {!h.ok && (
                  <button onClick={() => setTab(h.tab)} className="text-[11.5px] font-bold text-gold-deep hover:text-ink transition-colors">Fix →</button>
                )}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Recent activity" sub="Bookings and events in chronological order">
        <ul className="divide-y divide-line">
          {[...record.bookings].sort((a, b) => (a.date < b.date ? 1 : -1)).map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
              <div>
                <p className="text-[13.5px] font-bold text-ink">{b.client} — {b.eventType}</p>
                <p className="mt-0.5 text-[11.5px] text-ink-faint">{b.location} · {new Date(b.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} · {b.packageName}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-[15px] font-semibold text-ink tabular">{fmtAUD(b.payout)}</span>
                {b.status === "pending" && <Pill tone="gold">enquiry</Pill>}
                {b.status === "confirmed" && <Pill tone="green">confirmed</Pill>}
                {b.status === "completed" && <Pill tone="grey">completed</Pill>}
                {b.status === "declined" && <Pill tone="red">declined</Pill>}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function MediaTab({ record }: { record: BandRecord }) {
  const { addGalleryImage, removeGalleryImage, setCover, notify } = useStore();
  const [picker, setPicker] = useState(false);
  const pool = MEDIA_POOL.filter((src) => !record.band.gallery.some((g) => g.src === src) && src !== record.band.image);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Cover image"
        sub="Shown on roster cards, search results and your profile header"
        actions={<button onClick={() => setPicker(true)} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-[12px] font-bold text-ink hover:border-gold transition-colors"><Plus size={14} /> Add photos</button>}
      >
        <div className="overflow-hidden rounded-2xl border border-line">
          <img src={record.band.image} alt={record.band.name} className="h-56 w-full object-cover" />
        </div>
      </SectionCard>

      <SectionCard title="Gallery" sub={`${record.band.gallery.length} photos live on your profile — hover any image for actions`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {record.band.gallery.map((g) => (
            <div key={g.src} className="group relative overflow-hidden rounded-2xl border border-line">
              <img src={g.src} alt={g.alt} className="h-40 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-ink/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => setCover(record.band.id, g.src)} className="rounded-full bg-ivory px-4 py-2 text-[11px] font-bold text-ink hover:bg-gold-soft transition-colors">Set as cover</button>
                <button onClick={() => { removeGalleryImage(record.band.id, g.src); notify("Photo removed from your live profile"); }} className="grid size-9 place-items-center rounded-full bg-ivory text-blush hover:bg-blush hover:text-white transition-colors" aria-label="Remove photo">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setPicker(true)} className="grid h-40 place-items-center rounded-2xl border-2 border-dashed border-gold/40 text-gold-deep hover:border-gold hover:bg-gold-mist/40 transition-all">
            <span className="flex flex-col items-center gap-2 text-[12px] font-bold"><Plus size={20} /> Add photo</span>
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Performance reel" sub="Video players on your profile and gallery placements">
        <div className="flex items-center gap-5">
          <video src={record.band.video.src} poster={record.band.video.poster} muted loop playsInline preload="none" className="h-36 w-64 rounded-2xl object-cover border border-line" />
          <div>
            <p className="text-[14px] font-bold text-ink">{record.band.video.title}</p>
            <p className="mt-1 text-[12px] text-ink-faint">Duration {record.band.video.duration} · click to preview on your live profile</p>
            <button onClick={() => notify("Video reel swaps are handled by your curator in this demo")} className="mt-3 rounded-full border border-line bg-white px-5 py-2.5 text-[12px] font-bold text-ink hover:border-gold transition-colors">Request new reel</button>
          </div>
        </div>
      </SectionCard>

      {picker && (
        <Modal title="Media library" sub="Curated, licensed photography — click to add to your live profile" onClose={() => setPicker(false)} wide>
          {pool.length === 0 ? (
            <p className="text-[13.5px] text-ink-faint">Every library photo is already on your profile.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pool.map((src) => (
                <button
                  key={src}
                  onClick={() => { addGalleryImage(record.band.id, src); notify("Photo added to your live profile"); setPicker(false); }}
                  className="group relative overflow-hidden rounded-2xl border border-line"
                >
                  <img src={src} alt="" className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute inset-0 grid place-items-center bg-forest/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full bg-ivory px-4 py-2 text-[11px] font-bold text-forest-deep">Add to profile</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function PackagesTab({ record }: { record: BandRecord }) {
  const { savePackage, removePackage } = useStore();
  const [editing, setEditing] = useState<BandPackage | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState("2500");
  const [features, setFeatures] = useState("");
  const [popular, setPopular] = useState(false);

  const openEdit = (p?: BandPackage) => {
    if (p) {
      setEditing(p); setName(p.name); setTagline(p.tagline); setPrice(String(p.price)); setFeatures(p.features.join("\n")); setPopular(!!p.popular);
    } else {
      setEditing({ id: `${record.band.id}-p${Date.now()}`, name: "", tagline: "", price: 0, features: [] });
      setName(""); setTagline(""); setPrice(String(record.band.priceFrom)); setFeatures("2 × 45-minute sets\nFull PA & lighting included"); setPopular(false);
    }
  };

  const save = () => {
    if (!editing || name.trim().length < 2) return;
    savePackage(record.band.id, {
      ...editing,
      name: name.trim(),
      tagline: tagline.trim() || "Performance package",
      price: Math.max(300, Number(price) || 300),
      features: features.split("\n").map((s) => s.trim()).filter(Boolean),
      popular,
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Packages & pricing"
        sub="Price changes update the roster card, your profile and the checkout — instantly"
        actions={<button onClick={() => openEdit()} className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[12px] font-bold text-ivory hover:bg-forest-deep transition-colors"><Plus size={14} /> New package</button>}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {record.band.packages.map((p) => (
            <div key={p.id} className="relative rounded-2xl border border-line bg-parchment/40 p-5">
              {p.popular && <span className="absolute -top-2.5 right-5"><Pill tone="gold">most booked</Pill></span>}
              <p className="text-[15px] font-bold text-ink">{p.name}</p>
              <p className="text-[11.5px] text-ink-faint">{p.tagline}</p>
              <p className="mt-3 font-display text-3xl font-semibold text-ink tabular">{fmtAUD(p.price)}</p>
              <ul className="mt-3.5 space-y-1.5">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[11.5px] text-ink-soft"><Check size={12} className="mt-0.5 shrink-0 text-forest" strokeWidth={3} />{f}</li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 rounded-full border border-line bg-white py-2.5 text-[11.5px] font-bold text-ink hover:border-gold transition-colors">Edit</button>
                <button onClick={() => removePackage(record.band.id, p.id)} className="grid size-10 place-items-center rounded-full border border-line bg-white text-blush hover:border-blush transition-colors" aria-label="Delete package">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl bg-gold-mist/50 border border-gold/30 px-4 py-3 text-[11.5px] font-semibold text-gold-deep">
          Your roster "from {fmtAUD(record.band.priceFrom)}" price is recalculated automatically from your cheapest package.
        </p>
      </SectionCard>

      {editing && (
        <Modal title={editing.features.length ? "Edit package" : "New package"} sub="Saves publish straight to your listing & checkout" onClose={() => setEditing(null)}>
          <div className="grid gap-4">
            <Field label="Package name"><input className="input-lux" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Signature" /></Field>
            <Field label="Tagline"><input className="input-lux" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. The full experience" /></Field>
            <Field label="Price (AUD, GST incl.)"><input className="input-lux" type="number" min={300} step={50} value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
            <Field label="Inclusions (one per line)"><textarea rows={5} className="input-lux resize-none" value={features} onChange={(e) => setFeatures(e.target.value)} /></Field>
            <Toggle on={popular} onChange={setPopular} labelOn="Marked 'Most booked'" labelOff="Standard package" />
          </div>
          <button onClick={save} className="mt-6 w-full rounded-2xl bg-forest py-3.5 text-[13.5px] font-bold text-ivory hover:bg-forest-deep transition-colors">
            Save & publish
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= SHELL ================= */

export default function ArtistPanel({ navigate }: { navigate: Navigate }) {
  const { user, recordOf, setStatus, removeBand, notify } = useStore();
  const [tab, setTab] = useState<TabKey>("overview");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const record = recordOf(user?.bandId ?? "");

  if (!record) {
    return (
      <div className="pt-48 pb-32 text-center px-6">
        <p className="font-display text-3xl text-ink">Your listing was removed.</p>
        <p className="mt-3 text-[14px] text-ink-soft">Sign in again or reset the demo data from the login page.</p>
        <button onClick={() => navigate({ route: "login" })} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-ivory">Back to sign in</button>
      </div>
    );
  }

  const live = record.status === "live";

  return (
    <div className="pt-32 sm:pt-36 pb-24 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        {/* header */}
        <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-line bg-white p-5 sm:p-6 shadow-lux">
          <img src={record.band.image} alt={record.band.name} className="size-14 sm:size-16 rounded-2xl object-cover border border-line" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink truncate">{record.band.name}</h1>
              {record.verified ? <Pill tone="forest"><Check size={10} strokeWidth={4} /> verified</Pill> : <Pill tone="gold">awaiting verification</Pill>}
              {record.featured && <Pill tone="gold">featured</Pill>}
            </div>
            <p className="mt-1 text-[12.5px] font-semibold text-ink-faint">Artist Panel · {user?.name} · {record.band.location}, {record.band.region}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Toggle
              on={live}
              onChange={(v) => setStatus(record.band.id, v ? "live" : "paused")}
              labelOn="listing live"
              labelOff="paused"
            />
            <button onClick={() => navigate({ route: "band", bandId: record.band.id })} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-[12px] font-bold text-ink hover:border-gold transition-colors">
              <ExternalLink size={13} /> View profile
            </button>
            <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-[12px] font-bold text-ink hover:border-gold transition-colors">
              <Plus size={13} /> New act
            </button>
            <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 rounded-full border border-blush/30 bg-blush/5 px-4 py-2.5 text-[12px] font-bold text-blush hover:bg-blush hover:text-white transition-colors">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {!live && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/40 bg-gold-mist/60 px-5 py-4">
            <PauseCircle size={18} className="text-gold-deep" />
            <p className="text-[13px] font-semibold text-ink">
              Your listing is <b>paused</b> — hidden from the roster, search and booking across the site. Flip the switch above to go live again.
            </p>
          </motion.div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] items-start">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-28 flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-300 lg:w-full",
                  tab === t.key ? "bg-forest text-ivory shadow-lux" : "bg-white border border-line text-ink-soft hover:border-gold hover:text-ink"
                )}
              >
                <t.icon size={17} className={tab === t.key ? "text-gold-soft" : "text-gold-deep"} />
                <span>
                  <span className="block text-[12.5px] font-bold leading-tight">{t.label}</span>
                  <span className={cn("hidden lg:block text-[10.5px] mt-0.5", tab === t.key ? "text-ivory/50" : "text-ink-faint")}>{t.desc}</span>
                </span>
              </button>
            ))}
            <div className="hidden lg:block mt-4 rounded-2xl bg-forest p-4 text-ivory">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-soft"><PlayCircle size={13} /> live sync</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ivory/60">Every save in this panel publishes instantly to the storefront customers see.</p>
            </div>
          </aside>

          {/* content */}
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {tab === "overview" && <OverviewTab record={record} setTab={setTab} />}
            {tab === "listing" && <ListingEditor record={record} />}
            {tab === "media" && <MediaTab record={record} />}
            {tab === "packages" && <PackagesTab record={record} />}
            {tab === "availability" && <AvailabilityTab record={record} />}
            {tab === "bookings" && <BookingsTab record={record} />}
            {tab === "reviews" && <ReviewsTab record={record} />}
          </motion.div>
        </div>
      </div>

      {showAdd && <AddActModal onClose={() => setShowAdd(false)} />}

      {confirmDelete && (
        <Modal title="Delete this listing?" sub="This removes the act from the roster, search, gallery and booking — immediately." onClose={() => setConfirmDelete(false)}>
          <div className="flex gap-3.5 rounded-2xl border border-blush/25 bg-blush/5 p-4">
            <TriangleAlert size={20} className="shrink-0 text-blush" />
            <p className="text-[13px] leading-relaxed text-ink-soft">
              <b className="text-ink">{record.band.name}</b> and its packages, photos, availability and {record.bookings.length} booking records will be permanently removed from the demo store.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => setConfirmDelete(false)} className="rounded-2xl border border-line py-3.5 text-[13px] font-bold text-ink hover:border-gold transition-colors">Keep listing</button>
            <button
              onClick={() => { removeBand(record.band.id); navigate({ route: "home" }); notify("Listing deleted — storefront updated"); }}
              className="rounded-2xl bg-blush py-3.5 text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
            >
              Delete forever
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
