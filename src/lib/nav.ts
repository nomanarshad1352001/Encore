export type Route = "home" | "bands" | "band" | "gallery" | "booking" | "login" | "panel" | "console";

export interface ViewState {
  route: Route;
  bandId?: string;
  genre?: string;
  query?: string;
  packageId?: string;
}

export type Navigate = (v: Partial<ViewState> & { route: Route }) => void;

export const ROUTE_TITLES: Record<Route, string> = {
  home: "Encore — Hire Australia's Finest Live Bands",
  bands: "Browse Bands — Encore | Live Band Hire Australia",
  band: "Band Profile — Encore",
  gallery: "Live Gallery — Photos & Videos | Encore",
  booking: "Secure Booking — Encore",
  login: "Artist Sign In — Encore",
  panel: "Artist Panel — Encore",
  console: "Admin Console — Encore",
};
