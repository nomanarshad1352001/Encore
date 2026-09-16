import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { BANDS, type Band, type BandPackage } from "@/lib/data";

/* ------------------------------------------------------------------
   ENCORE — shared reactive store (no DB; in-memory + localStorage)
   The storefront, Artist Panel and Admin Console all read and write
   this single source of truth, so every change reflects everywhere.
------------------------------------------------------------------- */

export type Role = "artist" | "admin";

export interface User {
  role: Role;
  name: string;
  email: string;
  bandId: string | null;
}

export interface AvailabilityBlock {
  id: string;
  date: string;
  note: string;
}

export interface PanelBooking {
  id: string;
  client: string;
  eventType: string;
  location: string;
  date: string;
  packageName: string;
  amount: number;
  payout: number;
  status: "pending" | "confirmed" | "completed" | "declined";
  paidPct: number;
}

export interface BandRecord {
  band: Band;
  status: "live" | "paused";
  verified: boolean;
  featured: boolean;
  views: number;
  availability: AvailabilityBlock[];
  bookings: PanelBooking[];
  replies: Record<string, string>;
}

export interface NewBandInput {
  name: string;
  tagline: string;
  genre: string;
  location: string;
  region: string;
  members: number;
  image: string;
  price: number;
}

/* ---------------- demo credentials ---------------- */

export const DEMO_ARTIST = { email: "artist@encore.au", pass: "encore123", name: "Jordan Blake", bandId: "the-velvet-hour" };
export const DEMO_ADMIN = { email: "admin@encore.au", pass: "encore123", name: "Priya Nair (Platform)" };

/* ---------------- image pool for media picker / new acts ---------------- */

export const MEDIA_POOL: string[] = [
  "https://images.pexels.com/photos/9002789/pexels-photo-9002789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/8043850/pexels-photo-8043850.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/8044071/pexels-photo-8044071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/7095834/pexels-photo-7095834.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/28540198/pexels-photo-28540198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/26835494/pexels-photo-26835494.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/9005510/pexels-photo-9005510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/442540/pexels-photo-442540.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/17116018/pexels-photo-17116018.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/19943363/pexels-photo-19943363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/8043988/pexels-photo-8043988.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/8044081/pexels-photo-8044081.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/2990830/pexels-photo-2990830.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/16118368/pexels-photo-16118368.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
];

const DEFAULT_VIDEO = {
  src: "https://videos.pexels.com/video-files/29179781/12600174_3840_2160_25fps.mp4",
  poster: "https://images.pexels.com/videos/29179781/artist-tools-music-29179781.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  title: "Performance reel — recorded live",
  duration: "0:18",
};

/* ---------------- seed generation (deterministic) ---------------- */

const CLIENTS = ["Charlotte W.", "Meridian Group", "Jess & Rowan F.", "Daniel K.", "Margaret H.", "Sofia C.", "Westbrook Events", "Georgia & Liam H."];
const LOCATIONS = ["Centennial Parklands", "Crown Melbourne", "Adams Peak, Hunter Valley", "The Calile Hotel", "Private estate, Bowral", "GOMA Brisbane", "Palladium at Crown", "Fig Tree, Byron Bay"];

function seedBookings(band: Band, i: number): PanelBooking[] {
  const popular = band.packages.find((p) => p.popular) ?? band.packages[0];
  const premium = band.packages[band.packages.length - 1];
  const base = band.packages[0];
  const mk = (
    n: number,
    pkgName: string,
    amount: number,
    status: PanelBooking["status"],
    date: string,
    paidPct: number
  ): PanelBooking => ({
    id: `sb-${band.id}-${n}`,
    client: CLIENTS[(i + n) % CLIENTS.length],
    eventType: n % 3 === 0 ? "Corporate event" : n % 3 === 1 ? "Wedding" : "Private party",
    location: LOCATIONS[(i * 2 + n) % LOCATIONS.length],
    date,
    packageName: pkgName,
    amount,
    payout: Math.round(amount * 0.9),
    status,
    paidPct,
  });
  return [
    mk(1, popular.name, popular.price, "pending", "2026-04-11", 0),
    mk(2, popular.name, popular.price, "confirmed", "2026-03-07", 20),
    mk(3, premium.name, premium.price, "confirmed", "2026-02-14", 20),
    mk(4, popular.name, popular.price, "completed", "2025-11-22", 100),
    mk(5, base.name, base.price, "completed", "2025-09-13", 100),
    mk(6, base.name, base.price, "completed", "2025-06-28", 100),
  ];
}

function seedAvailability(i: number): AvailabilityBlock[] {
  const days = ["2026-02-21", "2026-03-14", "2026-03-28", "2026-04-18"];
  const notes = ["Booked — wedding", "Private function", "Booked — corporate", "Personal leave"];
  return days.slice(i % 3, (i % 3) + 3).map((d, k) => ({ id: `av-${i}-${k}`, date: d, note: notes[(i + k) % notes.length] }));
}

function seed(): BandRecord[] {
  return BANDS.map((band, i) => ({
    band: { ...band, packages: band.packages.map((p) => ({ ...p, features: [...p.features] })), gallery: [...band.gallery], bio: [...band.bio], setlist: [...band.setlist], reviews: band.reviews.map((r) => ({ ...r })) },
    status: "live",
    verified: true,
    featured: !!band.featured,
    views: 1240 + i * 777,
    availability: seedAvailability(i),
    bookings: seedBookings(band, i),
    replies: { [band.reviews[0]?.id ?? "r-x"]: "Thank you so much — nights like these are exactly why we do it. It was an honour to be part of your celebration." },
  }));
}

/* ---------------- context ---------------- */

interface StoreApi {
  user: User | null;
  records: BandRecord[];
  liveRecords: BandRecord[];
  toast: string | null;
  recordOf: (id: string) => BandRecord | undefined;
  login: (email: string, pass: string) => { ok: boolean; role?: Role; error?: string };
  logout: () => void;
  notify: (msg: string) => void;
  resetDemo: () => void;
  updateBand: (id: string, patch: Partial<Band>) => void;
  addBand: (input: NewBandInput) => string;
  removeBand: (id: string) => void;
  setStatus: (id: string, s: BandRecord["status"]) => void;
  setFeatured: (id: string, v: boolean) => void;
  setVerified: (id: string, v: boolean) => void;
  savePackage: (bandId: string, pkg: BandPackage) => void;
  removePackage: (bandId: string, pkgId: string) => void;
  addGalleryImage: (bandId: string, src: string) => void;
  removeGalleryImage: (bandId: string, src: string) => void;
  setCover: (bandId: string, src: string) => void;
  addBlock: (bandId: string, date: string, note: string) => void;
  removeBlock: (bandId: string, blockId: string) => void;
  setBookingStatus: (bandId: string, bookingId: string, s: PanelBooking["status"]) => void;
  addReply: (bandId: string, reviewId: string, text: string) => void;
  removeReview: (bandId: string, reviewId: string) => void;
}

const StoreCtx = createContext<StoreApi | null>(null);

const LS_KEY = "encore-store-v2";
const LS_USER = "encore-user-v2";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BandRecord[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as BandRecord[];
    } catch { /* ignore */ }
    return seed();
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(LS_USER);
      if (raw) return JSON.parse(raw) as User;
    } catch { /* ignore */ }
    return null;
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(records)); } catch { /* ignore */ }
  }, [records]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
      else localStorage.removeItem(LS_USER);
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const liveRecords = useMemo(() => records.filter((r) => r.status === "live"), [records]);
  const recordOf = (id: string) => records.find((r) => r.band.id === id);

  const mutate = (id: string, fn: (r: BandRecord) => BandRecord) =>
    setRecords((rs) => rs.map((r) => (r.band.id === id ? fn(r) : r)));

  const reprice = (band: Band): Band => ({
    ...band,
    priceFrom: band.packages.length ? Math.min(...band.packages.map((p) => p.price)) : band.priceFrom,
  });

  const api: StoreApi = {
    user,
    records,
    liveRecords,
    toast,
    recordOf,

    login: (email, pass) => {
      const e = email.trim().toLowerCase();
      if (e === DEMO_ARTIST.email && pass === DEMO_ARTIST.pass) {
        if (!recordOf(DEMO_ARTIST.bandId)) return { ok: false, error: "Demo artist listing was deleted — reset demo data below." };
        setUser({ role: "artist", name: DEMO_ARTIST.name, email: DEMO_ARTIST.email, bandId: DEMO_ARTIST.bandId });
        return { ok: true, role: "artist" };
      }
      if (e === DEMO_ADMIN.email && pass === DEMO_ADMIN.pass) {
        setUser({ role: "admin", name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, bandId: null });
        return { ok: true, role: "admin" };
      }
      return { ok: false, error: "Those details don't match an account. Use the demo credentials below." };
    },

    logout: () => setUser(null),
    notify: (msg) => setToast(msg),

    resetDemo: () => {
      localStorage.removeItem(LS_KEY);
      setRecords(seed());
      setToast("Demo data restored to its original state");
    },

    updateBand: (id, patch) => {
      mutate(id, (r) => ({ ...r, band: reprice({ ...r.band, ...patch }) }));
    },

    addBand: (input) => {
      const id = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + Math.floor(100 + Math.random() * 900);
      const pkg: BandPackage = {
        id: id + "-p1",
        name: "Essential",
        tagline: "The core performance",
        price: input.price,
        features: ["2 × 45-minute live sets", "Full PA & lighting included", "Up to 4 hours on site", "Professional, insured musicians"],
      };
      const band: Band = {
        id,
        name: input.name,
        tagline: input.tagline,
        genres: [input.genre],
        vibes: ["New act"],
        location: input.location,
        region: input.region,
        travelNote: "Travel quoted per event",
        priceFrom: input.price,
        rating: 5,
        reviewCount: 0,
        eventsPlayed: 0,
        lineup: `${input.members}-piece lineup`,
        members: input.members,
        image: input.image,
        gallery: [{ src: input.image, alt: input.name }],
        video: DEFAULT_VIDEO,
        bio: [input.tagline + "."],
        setlist: ["Requests welcome — tailored setlists for every event"],
        packages: [pkg],
        reviews: [],
      };
      setRecords((rs) => [
        ...rs,
        { band, status: "live", verified: false, featured: false, views: 0, availability: [], bookings: [], replies: {} },
      ]);
      return id;
    },

    removeBand: (id) => {
      if (records.length <= 1) {
        setToast("The marketplace needs at least one artist — deletion blocked");
        return;
      }
      setRecords((rs) => rs.filter((r) => r.band.id !== id));
      if (user?.bandId === id) setUser(null);
    },

    setStatus: (id, s) => {
      mutate(id, (r) => ({ ...r, status: s }));
      setToast(s === "live" ? "Listing is live — visible across the site" : "Listing paused — hidden from the roster & booking");
    },
    setFeatured: (id, v) => mutate(id, (r) => ({ ...r, featured: v })),
    setVerified: (id, v) => mutate(id, (r) => ({ ...r, verified: v })),

    savePackage: (bandId, pkg) => {
      mutate(bandId, (r) => {
        const exists = r.band.packages.some((p) => p.id === pkg.id);
        const packages = exists ? r.band.packages.map((p) => (p.id === pkg.id ? pkg : p)) : [...r.band.packages, pkg];
        return { ...r, band: reprice({ ...r.band, packages }) };
      });
      setToast("Package saved — pricing updated across the site");
    },

    removePackage: (bandId, pkgId) => {
      const rec = recordOf(bandId);
      if (rec && rec.band.packages.length <= 1) {
        setToast("A listing needs at least one package");
        return;
      }
      mutate(bandId, (r) => ({ ...r, band: reprice({ ...r.band, packages: r.band.packages.filter((p) => p.id !== pkgId) }) }));
    },

    addGalleryImage: (bandId, src) => {
      mutate(bandId, (r) => (r.band.gallery.some((g) => g.src === src) ? r : { ...r, band: { ...r.band, gallery: [...r.band.gallery, { src, alt: `${r.band.name} performance photo` }] } }));
    },

    removeGalleryImage: (bandId, src) => {
      mutate(bandId, (r) => ({ ...r, band: { ...r.band, gallery: r.band.gallery.filter((g) => g.src !== src) } }));
    },

    setCover: (bandId, src) => {
      mutate(bandId, (r) => ({ ...r, band: { ...r.band, image: src } }));
      setToast("Cover image updated across the site");
    },

    addBlock: (bandId, date, note) => {
      mutate(bandId, (r) => ({ ...r, availability: [...r.availability, { id: `av-${Date.now()}`, date, note }] }));
    },

    removeBlock: (bandId, blockId) => {
      mutate(bandId, (r) => ({ ...r, availability: r.availability.filter((b) => b.id !== blockId) }));
    },

    setBookingStatus: (bandId, bookingId, s) => {
      mutate(bandId, (r) => ({
        ...r,
        bookings: r.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: s, paidPct: s === "confirmed" ? 20 : s === "completed" ? 100 : s === "declined" ? 0 : b.paidPct } : b
        ),
      }));
    },

    addReply: (bandId, reviewId, text) => {
      mutate(bandId, (r) => ({ ...r, replies: { ...r.replies, [reviewId]: text } }));
      setToast("Reply published under the review");
    },

    removeReview: (bandId, reviewId) => {
      mutate(bandId, (r) => ({
        ...r,
        band: { ...r.band, reviews: r.band.reviews.filter((rv) => rv.id !== reviewId), reviewCount: Math.max(0, r.band.reviewCount - 1) },
      }));
      setToast("Review removed — listing updated");
    },
  };

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
