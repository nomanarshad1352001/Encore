import { CalendarPlus, Check, Trash2, HandCoins, MessageSquareReply, Quote, Send, Star, X } from "lucide-react";
import { useState } from "react";
import { Field, Pill, SectionCard } from "@/panel/ui";
import { fmtAUD } from "@/lib/data";
import { useStore, type BandRecord } from "@/lib/store";
import { Stars } from "@/components/ui";
import { cn } from "@/utils/cn";

/* ================= 5 · AVAILABILITY ================= */

export function AvailabilityTab({ record }: { record: BandRecord }) {
  const { addBlock, removeBlock, notify, recordOf } = useStore();
  const [date, setDate] = useState("");
  const [note, setNote] = useState("Booked");
  const live = recordOf(record.band.id) ?? record;
  const sorted = [...live.availability].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="space-y-6">
      <SectionCard title="Block a date" sub="Blocked dates are excluded from availability checks in the booking flow">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
          <Field label="Date"><input type="date" className="input-lux" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Reason">
            <select className="input-lux cursor-pointer font-semibold" value={note} onChange={(e) => setNote(e.target.value)}>
              {["Booked", "Private function", "Personal leave", "Venue residency", "Touring"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <button
            onClick={() => {
              if (!date) return notify("Pick a date first");
              addBlock(record.band.id, date, note);
              setDate("");
              notify("Date blocked — availability updated everywhere");
            }}
            className="inline-flex h-[50px] items-center gap-2 rounded-2xl bg-forest px-6 text-[13px] font-bold text-ivory hover:bg-forest-deep transition-colors"
          >
            <CalendarPlus size={15} /> Block
          </button>
        </div>
      </SectionCard>

      <SectionCard title={`Blocked dates · ${sorted.length}`} sub="Toggling dates off restores them instantly">
        {sorted.length === 0 ? (
          <p className="text-[13.5px] text-ink-faint">No blocked dates — your calendar is fully open.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sorted.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-parchment/40 px-5 py-4">
                <div>
                  <p className="text-[13.5px] font-bold text-ink">{new Date(b.date).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-faint">{b.note}</p>
                </div>
                <button onClick={() => { removeBlock(record.band.id, b.id); notify("Date reopened"); }} className="grid size-9 place-items-center rounded-full border border-line bg-white text-blush hover:border-blush transition-colors" aria-label="Remove block">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ================= 6 · BOOKINGS ================= */

export function BookingsTab({ record }: { record: BandRecord }) {
  const { setBookingStatus, notify, recordOf } = useStore();
  const live = recordOf(record.band.id) ?? record;
  const pending = live.bookings.filter((b) => b.status === "pending");
  const confirmed = live.bookings.filter((b) => b.status === "confirmed");
  const past = live.bookings.filter((b) => b.status === "completed" || b.status === "declined");

  const Row = ({ id }: { id: string }) => {
    const b = live.bookings.find((x) => x.id === id)!;
    return (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-parchment/40 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold text-ink truncate">{b.client} — {b.eventType}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-faint">
            {b.location} · {new Date(b.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} · {b.packageName}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-sand">
              <div className={cn("h-full rounded-full", b.status === "declined" ? "bg-blush" : "bg-gold")} style={{ width: `${b.paidPct}%` }} />
            </div>
            <span className="text-[10.5px] font-bold text-ink-faint">{b.paidPct}% paid</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-semibold text-ink tabular">{fmtAUD(b.amount)}</p>
          <p className="flex items-center justify-end gap-1 text-[10.5px] font-bold text-gold-deep"><HandCoins size={11} /> payout {fmtAUD(b.payout)}</p>
        </div>
        {b.status === "pending" && (
          <div className="flex gap-2">
            <button onClick={() => { setBookingStatus(record.band.id, b.id, "confirmed"); notify("Booking confirmed — client invoiced for their 20% deposit"); }} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-[11.5px] font-bold text-ivory hover:bg-forest-deep transition-colors">
              <Check size={13} strokeWidth={3} /> Accept
            </button>
            <button onClick={() => { setBookingStatus(record.band.id, b.id, "declined"); notify("Enquiry declined — date released"); }} className="inline-flex items-center gap-1.5 rounded-full border border-blush/30 bg-white px-4 py-2.5 text-[11.5px] font-bold text-blush hover:bg-blush hover:text-white transition-colors">
              <X size={13} strokeWidth={3} /> Decline
            </button>
          </div>
        )}
        {b.status === "confirmed" && (
          <button onClick={() => { setBookingStatus(record.band.id, b.id, "completed"); notify("Marked complete — payout released from escrow"); }} className="rounded-full border border-line bg-white px-4 py-2.5 text-[11.5px] font-bold text-ink hover:border-gold transition-colors">
            Mark played
          </button>
        )}
        {b.status === "completed" && <Pill tone="green">paid out</Pill>}
        {b.status === "declined" && <Pill tone="red">declined</Pill>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionCard title={`Enquiries awaiting you · ${pending.length}`} sub="Accepting confirms the date and triggers the client's deposit invoice">
        {pending.length === 0 ? <p className="text-[13.5px] text-ink-faint">Inbox zero — beautifully done.</p> : <div className="space-y-3">{pending.map((b) => <Row key={b.id} id={b.id} />)}</div>}
      </SectionCard>
      <SectionCard title={`Upcoming confirmed · ${confirmed.length}`} sub="20% deposit held in escrow until you play">
        {confirmed.length === 0 ? <p className="text-[13.5px] text-ink-faint">No confirmed gigs on the calendar.</p> : <div className="space-y-3">{confirmed.map((b) => <Row key={b.id} id={b.id} />)}</div>}
      </SectionCard>
      <SectionCard title={`History · ${past.length}`} sub="Completed performances and released payouts">
        {past.length === 0 ? <p className="text-[13.5px] text-ink-faint">Your history will build here.</p> : <div className="space-y-3">{past.map((b) => <Row key={b.id} id={b.id} />)}</div>}
      </SectionCard>
    </div>
  );
}

/* ================= 7 · REVIEWS ================= */

export function ReviewsTab({ record }: { record: BandRecord }) {
  const { addReply, recordOf } = useStore();
  const live = recordOf(record.band.id) ?? record;
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <SectionCard title={`Client reviews · ${live.band.reviews.length}`} sub="Your replies publish beneath each review on your public profile">
        {live.band.reviews.length === 0 ? (
          <p className="text-[13.5px] text-ink-faint">Reviews from completed bookings will appear here.</p>
        ) : (
          <div className="space-y-5">
            {live.band.reviews.map((r) => {
              const existing = live.replies[r.id];
              const draft = drafts[r.id] ?? existing ?? "";
              return (
                <article key={r.id} className="rounded-2xl border border-line bg-parchment/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-forest font-display text-base font-semibold text-gold-soft">{r.author.charAt(0)}</span>
                      <div>
                        <p className="text-[13.5px] font-bold text-ink">{r.author}</p>
                        <p className="text-[11px] text-ink-faint">{r.eventType} · {r.date}</p>
                      </div>
                    </div>
                    <Stars rating={r.rating} size={12} />
                  </div>
                  <p className="mt-3.5 flex gap-2.5 text-[13px] leading-relaxed text-ink-soft"><Quote size={14} className="mt-0.5 shrink-0 text-gold-soft" fill="currentColor" />{r.text}</p>

                  {existing && (
                    <div className="mt-4 rounded-xl border-l-[3px] border-gold bg-white px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-gold-deep"><MessageSquareReply size={11} /> your reply — live on profile</p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{existing}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2.5">
                    <input
                      className="input-lux !py-3 text-[12.5px]"
                      placeholder={existing ? "Update your reply…" : "Write a public reply…"}
                      value={draft}
                      onChange={(e) => setDrafts({ ...drafts, [r.id]: e.target.value })}
                    />
                    <button
                      onClick={() => draft.trim().length > 3 && addReply(record.band.id, r.id, draft.trim())}
                      className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-forest px-5 text-[12px] font-bold text-ivory hover:bg-forest-deep transition-colors"
                    >
                      <Send size={13} /> {existing ? "Update" : "Reply"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 shadow-lux">
        <Star size={18} className="text-gold-deep" fill="currentColor" />
        <p className="text-[12.5px] leading-relaxed text-ink-soft">
          Only clients with completed, paid bookings can review you — Encore verifies every review before it publishes.
        </p>
      </div>
    </div>
  );
}
