import { Link, useSearch } from "wouter";
import { useGetPublicSettings, useListFeaturedDishes } from "@workspace/api-client-react";
import { Utensils, Clock, MapPin, QrCode, ChevronRight, Leaf, Flame } from "lucide-react";
import { RestaurantBanner } from "../components/RestaurantBanner";

export default function Landing() {
  const search = useSearch();
  const tableId = new URLSearchParams(search).get("table") ?? "";
  const settings = useGetPublicSettings();
  const featured = useListFeaturedDishes();
  const menuHref = tableId ? `/menu?table=${tableId}` : "/menu";

  const restaurantName = settings.data?.restaurantName ?? "Spice Garden";
  const openingHours = settings.data?.openingHours ?? "Mon-Sun: 11AM - 11PM";
  const isOpen = settings.data?.isOpen ?? true;

  return (
    <div style={{
      background: "#f5efe6", display: "flex", flexDirection: "column", minHeight: "100vh"  // ← warm cream page background
    }}>
      {/* Hero — RestaurantBanner unchanged */}
      <RestaurantBanner />

      {/* Info strip — deep pine green (matches reference top bar) */}
      <div style={{
        background: "linear-gradient(180deg, #0d2018 0%, #0a1a10 100%)",
        borderTop: "1px solid rgba(93,160,105,0.25)",
        borderBottom: "1px solid rgba(93,160,105,0.25)"
      }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap justify-center items-center gap-5 text-xs">
          {/* Timing */}
          <div className="flex items-center gap-2" style={{ color: "rgba(212,160,50,0.85)", letterSpacing: ".08em", fontFamily: "'Cinzel', serif" }}>
            <Clock className="h-3.5 w-3.5" style={{ color: "#d4a032" }} />
            <span>09:00 AM – 11:30 PM</span>
          </div>

          <div className="w-1 h-1 rounded-full opacity-30" style={{ background: "#d4a032" }} />

          {/* Table / Welcome */}
          <div className="flex items-center gap-2" style={{ color: "rgba(212,160,50,0.85)", letterSpacing: ".08em", fontFamily: "'Cinzel', serif" }}>
            <span>🪑</span>
            <span>{tableId ? `Table ${tableId} — Welcome!` : "Welcome to Sher-E-Punjab"}</span>
          </div>

          <div className="w-1 h-1 rounded-full opacity-30" style={{ background: "#d4a032" }} />

          {/* Open status */}
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-400" : "bg-red-400"}`}
              style={{ boxShadow: isOpen ? "0 0 6px #4ade80" : "0 0 6px #f87171" }} />
            <span style={{ color: isOpen ? "rgba(74,222,128,0.9)" : "rgba(248,113,113,0.9)", fontFamily: "'Cinzel', serif", letterSpacing: ".08em" }}>
              {isOpen ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Chef's Specials — cream background */}
      <div className="max-w-4xl mx-auto px-4 py-12" style={{ background: "transparent", flex: 1 }}>

        {/* Section heading — dark brown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1"
            style={{ fontFamily: "'Cinzel', serif", color: "#2b1d17", letterSpacing: ".06em" }}>
            Chef's Specials
          </h2>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", color: "#8a7060", fontSize: "1rem" }}>
            Our most loved dishes, handpicked for you
          </p>
        </div>

        {/* Cards */}
        {featured.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden h-64"
                style={{ background: "#ede6d8" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.isArray(featured.data) && featured.data.length > 0 ? (
              featured.data.slice(0, 6).map((dish) => (
                <Link
                  key={dish.id}
                  href={menuHref}
                  data-testid={`card-featured-${dish.id}`}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "#fffaf4",
                    border: "1px solid #e8dece",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
                  }}
                >
                  {/* Image area */}
                  <div className="relative h-40 overflow-hidden"
                    style={{ background: "#ede6d8" }}>
                    {dish.imageUrl ? (
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <span style={{ fontSize: "2rem", color: "#c5b49a" }}>🍽️</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: ".55rem", letterSpacing: ".2em", color: "#b0a090", textTransform: "uppercase" }}>
                          Sher-E-Punjab
                        </span>
                      </div>
                    )}

                    {/* Veg/NonVeg badge */}
                    <div className="absolute top-2 left-2">
                      {dish.isVeg ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: "rgba(240,255,240,0.95)", color: "#2e7d32", border: "1px solid #4caf50" }}>
                          <Leaf className="h-3 w-3" /> Veg
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: "rgba(255,240,240,0.95)", color: "#c62828", border: "1px solid #e53935" }}>
                          <Flame className="h-3 w-3" /> Non-Veg
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="p-3" style={{ background: "#fffaf4", borderTop: "1px solid #f0e8d8" }}>
                    <p className="font-semibold text-sm line-clamp-1"
                      style={{ fontFamily: "'Cinzel', serif", color: "#2b1d17", fontSize: ".78rem", letterSpacing: ".04em" }}>
                      {dish.name}
                    </p>
                    <p className="font-bold mt-1"
                      style={{ color: "#c9a35f", fontFamily: "'Cinzel', serif", fontSize: ".82rem" }}>
                      ₹{dish.price}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
                <span style={{ fontSize: "2.5rem", opacity: 0.3 }}>🍽️</span>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: ".8rem", letterSpacing: ".12em", color: "#a89080", textTransform: "uppercase" }}>
                  Menu being updated
                </p>
              </div>
            )}
          </div>
        )}

        {/* View Full Menu button — dark brown */}
        <div className="text-center mt-10">
          <Link
            href={menuHref}
            data-testid="link-full-menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base hover:scale-105 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #2b1d17 0%, #4a3428 100%)",
              color: "#f5efe6",
              fontFamily: "'Cinzel', serif",
              letterSpacing: ".1em",
              boxShadow: "0 4px 20px rgba(43,29,23,0.25)"
            }}
          >
            View Full Menu
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer — cream with top border */}
      <footer style={{
        background: "#f5efe6",
        borderTop: "1px solid rgba(180,160,130,0.35)",
        marginTop: "0",
        paddingBottom: "env(safe-area-inset-bottom, 0px)"
      }}>
        <div className="w-full px-6 py-5 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {/* Left — copyright */}
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: ".7rem", letterSpacing: ".14em", color: "#8a7060" }}>
            © 1990 Sher-E-Punjab, Jaipur
          </p>

          {/* Right — developer info */}
          <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: ".75rem" }}>
            <span style={{ color: "#8a7060", fontFamily: "sans-serif" }}>Built by</span>
            <span style={{ color: "#4a3428", fontWeight: 600, fontFamily: "sans-serif" }}>Monika Nogia</span>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a35f", display: "inline-block" }} />
            <span style={{ color: "#c0b0a0" }}>·</span>
            <a
              href="https://wa.me/919314199992"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: "#2e7d32", fontFamily: "sans-serif", fontSize: ".75rem" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact
            </a>
            <span style={{ color: "#c0b0a0" }}>·</span>
            <a
              href="mailto:monikanogia@gmail.com"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "#8a7060", fontFamily: "sans-serif", fontSize: ".75rem" }}
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}