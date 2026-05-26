import { Link } from "wouter";
import { useGetAdminStats } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  UtensilsCrossed, Tag, CheckCircle, XCircle, Star, Table2,
  ChevronRight, Settings, List, PlusCircle, QrCode, LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const stats = useGetAdminStats({ request: { headers: { Authorization: `Bearer ${token}` } } });

  const statCards = [
    { label: "Total Dishes", value: stats.data?.totalDishes ?? 0, icon: UtensilsCrossed, color: "text-primary", bg: "bg-primary/10" },
    { label: "Categories", value: stats.data?.totalCategories ?? 0, icon: Tag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Stock", value: stats.data?.inStock ?? 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Out of Stock", value: stats.data?.outOfStock ?? 0, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Chef's Specials", value: stats.data?.featuredDishes ?? 0, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Tables", value: stats.data?.totalTables ?? 0, icon: Table2, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const quickLinks = [
    { href: "/admin/categories", label: "Manage Categories", icon: Tag, desc: "Add, edit, reorder categories" },
    { href: "/admin/dishes", label: "Manage Dishes", icon: List, desc: "CRUD dishes, toggle stock" },
    { href: "/admin/tables", label: "QR Codes", icon: QrCode, desc: "Generate & download table QR codes" },
    { href: "/admin/settings", label: "Settings", icon: Settings, desc: "Restaurant name, WhatsApp, hours" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--app-font-serif)" }}>
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Manage your restaurant</p>
          </div>
          <button
            onClick={logout}
            data-testid="button-logout"
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Stats */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Overview</h2>
          {stats.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statCards.map((card) => (
                <div key={card.label} data-testid={`stat-${card.label.toLowerCase().replace(/ /g, "-")}`} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-admin-${link.href.replace("/admin/", "")}`}
                className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">{link.label}</p>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* View menu link */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-foreground">Customer Menu Preview</p>
            <p className="text-sm text-muted-foreground">See the menu as customers see it</p>
          </div>
          <Link
            href="/menu?table=T1"
            data-testid="link-preview-menu"
            target="_blank"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="h-4 w-4" />
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
