import { Link } from "wouter";
import { useGetPublicSettings, useListFeaturedDishes } from "@workspace/api-client-react";
import { Utensils, Clock, MapPin, QrCode, ChevronRight, Leaf, Flame } from "lucide-react";

export default function Landing() {
  const settings = useGetPublicSettings();
  const featured = useListFeaturedDishes();

  const restaurantName = settings.data?.restaurantName ?? "Spice Garden";
  const openingHours = settings.data?.openingHours ?? "Mon-Sun: 11AM - 11PM";
  const isOpen = settings.data?.isOpen ?? true;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(22 90% 52%) 0%, hsl(30 95% 45%) 100%)",
          minHeight: "60vh",
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
            <Utensils className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
            {restaurantName}
          </h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${isOpen ? "bg-green-500/20 text-green-100 border border-green-400/30" : "bg-red-500/20 text-red-100 border border-red-400/30"
            }`}>
            <div className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
            {isOpen ? "Open Now" : "Currently Closed"}
          </div>
          <Link
            href="/menu"
            data-testid="link-view-menu"
            className="inline-flex items-center gap-3 bg-white text-primary font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <QrCode className="h-5 w-5" />
            Browse Menu
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{openingHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Scan QR at your table to order</span>
          </div>
        </div>
      </div>

      {/* Featured dishes */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
          Chef's Specials
        </h2>
        <p className="text-muted-foreground mb-8">Our most loved dishes, handpicked for you</p>

        {featured.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden bg-muted h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.isArray(featured.data) && featured.data.length > 0 ? (
              featured.data.slice(0, 6).map((dish) => (
                <Link
                  key={dish.id}
                  href="/menu"
                  data-testid={`card-featured-${dish.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="relative h-40 overflow-hidden bg-muted">
                    {dish.imageUrl ? (
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Utensils className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      {dish.isVeg ? (
                        <span className="bg-green-100 text-green-700 border border-green-300 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                          <Leaf className="h-3 w-3" /> Veg
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 border border-red-300 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                          <Flame className="h-3 w-3" /> Non-Veg
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground line-clamp-1">{dish.name}</p>
                    <p className="text-primary font-bold text-sm mt-1">₹{dish.price}</p>
                  </div>
                </Link>
              ))
            ) : (
            <p className="col-span-full text-center text-muted-foreground">No featured dishes available.</p>
        )}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/menu"
            data-testid="link-full-menu"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            View Full Menu
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border text-center text-muted-foreground text-sm py-6 mt-8">
        <p>Scan the QR code at your table to order directly via WhatsApp</p>
        <p className="mt-1">
          <Link href="/admin/login" className="text-primary hover:underline">Admin Login</Link>
        </p>
      </div>
    </div>
  );
}
