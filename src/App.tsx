import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ROUTE_TITLES, type Navigate, type ViewState } from "@/lib/nav";
import { StoreProvider, useStore } from "@/lib/store";
import ArtistPanel from "@/panel/ArtistPanel";
import AdminConsole from "@/pages/AdminConsole";
import BandDetail from "@/pages/BandDetail";
import Bands from "@/pages/Bands";
import Booking from "@/pages/Booking";
import Gallery from "@/pages/Gallery";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

function Shell() {
  const [view, setView] = useState<ViewState>({ route: "home" });
  const { user, records, toast } = useStore();

  const navigate: Navigate = useCallback((next) => {
    setView((v) => ({ bandId: undefined, genre: undefined, query: undefined, packageId: undefined, ...v, ...next }));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    let title = ROUTE_TITLES[view.route];
    if (view.route === "band" && view.bandId) {
      const b = records.find((r) => r.band.id === view.bandId)?.band;
      if (b) title = `${b.name} — ${b.genres[0]} band for hire in ${b.location} | Encore`;
    }
    if (view.route === "bands" && view.genre) title = `${view.genre} bands for hire | Encore`;
    document.title = title;
  }, [view, records]);

  return (
    <div className="grain min-h-screen">
      <Navbar view={view} navigate={navigate} />

      <main key={view.route + (view.bandId ?? "")}>
        {view.route === "home" && <Home navigate={navigate} />}
        {view.route === "bands" && <Bands view={view} navigate={navigate} />}
        {view.route === "band" && <BandDetail bandId={view.bandId ?? "the-velvet-hour"} navigate={navigate} />}
        {view.route === "gallery" && <Gallery navigate={navigate} />}
        {view.route === "booking" && <Booking bandId={view.bandId} packageId={view.packageId} navigate={navigate} />}
        {view.route === "login" && <Login navigate={navigate} />}
        {view.route === "panel" &&
          (user?.role === "artist" ? (
            <ArtistPanel navigate={navigate} />
          ) : (
            <Login navigate={navigate} note="The Artist Panel requires an artist account — use the artist demo below." />
          ))}
        {view.route === "console" &&
          (user?.role === "admin" ? (
            <AdminConsole navigate={navigate} />
          ) : (
            <Login navigate={navigate} note="The Admin Console requires a platform admin account — use the admin demo below." />
          ))}
      </main>

      <Footer navigate={navigate} />

      {/* global toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
          >
            <p className="flex items-center gap-2.5 rounded-full bg-forest px-5 py-3.5 text-[12.5px] font-bold text-ivory shadow-lux-lg whitespace-nowrap">
              <CircleCheck size={15} className="text-gold-soft" /> {toast}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
