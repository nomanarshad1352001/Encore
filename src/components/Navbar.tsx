import { AnimatePresence, motion, useScroll } from "framer-motion";
import { CalendarCheck, ChevronDown, LayoutDashboard, LogOut, Menu, Music4, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useStore } from "@/lib/store";
import type { Navigate, ViewState } from "@/lib/nav";

const LINKS: { label: string; route: ViewState["route"]; hint?: string }[] = [
  { label: "Find a band", route: "bands" },
  { label: "How it works", route: "home", hint: "how-it-works" },
  { label: "Gallery", route: "gallery" },
  { label: "Reviews", route: "home", hint: "reviews" },
  { label: "FAQ", route: "home", hint: "faq" },
];

export default function Navbar({ view, navigate }: { view: ViewState; navigate: Navigate }) {
  const { user, logout, notify } = useStore();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 24)), [scrollY]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const go = (route: ViewState["route"], hint?: string) => {
    setOpen(false);
    setMenu(false);
    if (hint) {
      navigate({ route });
      setTimeout(() => document.getElementById(hint)?.scrollIntoView({ behavior: "smooth" }), 120);
    } else {
      navigate({ route });
    }
  };

  const dashRoute = user?.role === "admin" ? "console" : "panel";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="bg-forest text-ivory/90 text-center text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase py-2 px-4">
          Now booking the Summer '26 / '27 season — dates held with a 20% deposit
        </div>
        <header
          className={cn(
            "transition-all duration-500 border-b",
            scrolled ? "bg-ivory/90 backdrop-blur-xl border-line shadow-lux" : "bg-transparent border-transparent"
          )}
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16 sm:h-[72px]">
            <button onClick={() => navigate({ route: "home" })} className="flex items-center gap-2.5 group">
              <span className="grid place-items-center size-9 rounded-full bg-forest text-gold-soft transition-transform duration-500 group-hover:rotate-[20deg]">
                <Music4 size={17} strokeWidth={2.2} />
              </span>
              <span className="font-display text-[26px] leading-none font-semibold tracking-tight text-ink">
                Encore
                <span className="ml-1.5 align-middle inline-block rounded-full border border-gold/50 px-1.5 py-px text-[9px] font-body font-bold tracking-[0.2em] text-gold-deep -translate-y-0.5">
                  AU
                </span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              {LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => go(l.route, l.hint)}
                  className={cn(
                    "link-sweep text-[13.5px] font-semibold tracking-wide transition-colors",
                    view.route === l.route && !l.hint ? "text-gold-deep" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => go("bands")}
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-ivory pl-4 pr-5 py-2.5 text-[13px] font-bold tracking-wide hover:bg-forest transition-colors duration-300 shadow-lux"
              >
                <CalendarCheck size={15} />
                Book a band
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenu((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-line bg-white pl-1.5 pr-3 py-1.5 shadow-lux hover:border-gold transition-colors"
                  >
                    <span className={cn("grid size-8 place-items-center rounded-full text-[12px] font-bold", user.role === "admin" ? "bg-gold-mist text-gold-deep" : "bg-forest text-gold-soft")}>
                      {user.name.charAt(0)}
                    </span>
                    <span className="hidden sm:block text-[12px] font-bold text-ink max-w-24 truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={13} className={cn("text-ink-faint transition-transform", menu && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {menu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22 }}
                        className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-lux-lg"
                      >
                        <div className="border-b border-line bg-parchment/50 px-5 py-4">
                          <p className="text-[13px] font-bold text-ink">{user.name}</p>
                          <p className="text-[11px] text-ink-faint">{user.email}</p>
                          <span className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]", user.role === "admin" ? "bg-gold-mist text-gold-deep" : "bg-forest/10 text-forest")}>
                            {user.role === "admin" ? <ShieldCheck size={10} /> : <Music4 size={10} />}
                            {user.role === "admin" ? "Platform admin" : "Artist account"}
                          </span>
                        </div>
                        <button onClick={() => go(dashRoute)} className="flex w-full items-center gap-3 px-5 py-3.5 text-[13px] font-semibold text-ink hover:bg-parchment transition-colors">
                          <LayoutDashboard size={15} className="text-gold-deep" />
                          {user.role === "admin" ? "Admin Console" : "Artist Panel"}
                        </button>
                        <button
                          onClick={() => { logout(); go("home"); notify("Signed out — see you at the next show"); }}
                          className="flex w-full items-center gap-3 border-t border-line px-5 py-3.5 text-[13px] font-semibold text-blush hover:bg-blush/5 transition-colors"
                        >
                          <LogOut size={15} /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => go("login")}
                  className={cn(
                    "hidden sm:inline-flex link-sweep text-[13px] font-bold tracking-wide transition-colors",
                    view.route === "login" ? "text-gold-deep" : "text-ink-soft hover:text-ink"
                  )}
                >
                  Artist login
                </button>
              )}

              <button
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden grid place-items-center size-10 rounded-full border border-line bg-white text-ink"
                aria-label="Menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-28 z-40 lg:hidden rounded-3xl bg-white border border-line shadow-lux-lg p-3"
          >
            {LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.route, l.hint)}
                className="w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-ink hover:bg-parchment transition-colors"
              >
                {l.label}
              </button>
            ))}
            {user ? (
              <button onClick={() => go(dashRoute)} className="w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-forest hover:bg-parchment transition-colors">
                {user.role === "admin" ? "Admin Console" : "Artist Panel"} ({user.name.split(" ")[0]})
              </button>
            ) : (
              <button onClick={() => go("login")} className="w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-gold-deep hover:bg-parchment transition-colors">
                Artist login
              </button>
            )}
            <button
              onClick={() => go("bands")}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-forest text-ivory px-4 py-4 text-[15px] font-bold"
            >
              <CalendarCheck size={16} /> Book a band
            </button>
            {user && (
              <button
                onClick={() => { logout(); go("home"); notify("Signed out"); }}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-blush/30 text-blush px-4 py-4 text-[15px] font-bold"
              >
                <LogOut size={15} /> Sign out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
