import { useState, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import { useListCategories, useListDishes, useGetPublicSettings } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import {
  Search, ShoppingCart, X, Plus, Minus, Phone, Leaf, Flame,
  ChevronDown, ChevronUp, Utensils, MessageCircle, Star
} from "lucide-react";
import type { Dish } from "@workspace/api-client-react";
import type { DishVariant } from "@/contexts/CartContext";

export default function Menu() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tableId = params.get("table") ?? "1";

  const [searchQuery, setSearchQuery] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // ✅ 
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const cartRef = useRef<HTMLDivElement>(null);

  const categories = useListCategories();
  const settings = useGetPublicSettings();
  console.log("🔥 MERI SETTINGS:", settings.data);
  const { data: dishes } = useListDishes({
    search: searchQuery || undefined,
    isVeg: vegFilter === "veg" ? true : vegFilter === "nonveg" ? false : undefined,
  }, { query: { queryKey: ["dishes", searchQuery, vegFilter] } });

  const { items, addItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const whatsappNumber = settings.data?.whatsappNumber ?? "919999999999";
  const restaurantName = settings.data?.restaurantName ?? "Restaurant";

  useEffect(() => {
    if (categories.data && expandedCategories.size === 0) {
      setExpandedCategories(new Set(categories.data.map((c) => c.id)));
    }
  }, [categories.data]);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getQtyInCart = (dishId: number, variant: DishVariant) =>
    items.find((i) => i.dishId === dishId && i.variant === variant)?.quantity ??
    0;

  const placeOrder = () => {
    if (items.length === 0) return;
    const lines = items.map((i) => `${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`).join("\n");
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const msg = `New Order - Table ${tableId}\n--------------------\n${lines}\n--------------------\nTotal: ₹${total}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const callWaiter = () => {
    const msg = `Table ${tableId} needs assistance.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const filteredDishes = (catDishes: Dish[]) => {
    return catDishes.filter((d) => {
      if (!d.isAvailable) return false;
      if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (vegFilter === "veg" && !d.isVeg) return false;
      if (vegFilter === "nonveg" && d.isVeg) return false;
      return true;
    });
  };



  const allFilteredDishes = dishes ?? [];

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-bold text-lg text-foreground" style={{ fontFamily: "var(--app-font-serif)" }}>
                {restaurantName}
              </h1>
              <p className="text-xs text-muted-foreground">Table {tableId}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={callWaiter}
                data-testid="button-call-waiter"
                className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-2 rounded-full text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Waiter
              </button>

              <button
                onClick={() => setPayOpen(true)}
                className="flex items-center gap-1.5 text-white px-3 py-2 rounded-full text-xs font-semibold transition-colors shadow-sm"
                style={{ background: "#1a3a26" }}
              >
                💳 Pay Now
              </button>

              <button
                onClick={() => setCartOpen(true)}
                data-testid="button-open-cart"
                className="relative bg-primary text-primary-foreground p-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
              data-testid="input-search"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {[["all", "All"], ["veg", "Veg"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setVegFilter(val as typeof vegFilter)}
                data-testid={`button-filter-${val}`}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${vegFilter === val
                  ? val === "veg"
                    ? "bg-green-500 text-white border-green-500"
                    : val === "nonveg"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
              >
                {val === "veg" && <Leaf className="h-3 w-3" />}
                {/* val === "nonveg" && <Flame className="h-3 w-3" /> */}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {searchQuery ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">{allFilteredDishes.length} results for "{searchQuery}"</p>
            <div className="space-y-3">
              {allFilteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  qtyDefault={getQtyInCart(dish.id, "DEFAULT")}
                  qtyHalf={getQtyInCart(dish.id, "HALF")}
                  qtyFull={getQtyInCart(dish.id, "FULL")}
                  addItem={addItem}
                  updateQuantity={updateQuantity}
                />
              ))}
              {allFilteredDishes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Utensils className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No dishes found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl h-32" />
              ))
            ) : (
              (categories.data ?? []).map((cat) => {
                const catDishes = filteredDishes(cat.dishes ?? []);
                return (
                  <div key={cat.id} id={`category-${cat.id}`} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      data-testid={`button-category-${cat.id}`}
                      className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground text-lg" style={{ fontFamily: "var(--app-font-serif)" }}>
                          {cat.name}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {catDishes.length} items
                        </span>
                      </div>
                      {expandedCategories.has(cat.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {expandedCategories.has(cat.id) && (
                      <div className="divide-y divide-border">
                        {catDishes.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-muted-foreground">No items available</p>
                        ) : (
                          catDishes.map((dish) => (
                            <DishCard
                              key={dish.id}
                              dish={dish}
                              qtyDefault={getQtyInCart(dish.id, "DEFAULT")}
                              qtyHalf={getQtyInCart(dish.id, "HALF")}
                              qtyFull={getQtyInCart(dish.id, "FULL")}
                              addItem={addItem}
                              updateQuantity={updateQuantity}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
        {/* ── Sticky Developer Footer ── */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-sm border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2">
            <span className="text-[10px] text-muted-foreground">Built by</span>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-foreground">Monika Nogia</span>
              <a
                href="https://moonshot.scaler.com/s/sl/X4yOaaZYHy"
                target="_blank"
                rel="noopener noreferrer"
                title="View Certification"
                className="w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] font-bold hover:opacity-80 transition-opacity flex-shrink-0"
              >
                i
              </a>
            </div>

            <span className="text-muted-foreground text-[10px]">·</span>

            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-green-600 font-semibold hover:text-green-700 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.522 5.84L.054 23.5l5.818-1.522A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 0 1-5.001-1.371l-.36-.214-3.714.972.991-3.617-.235-.372A9.79 9.79 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
              </svg>
              Contact
            </a>

            <span className="text-muted-foreground text-[10px]">·</span>

            <a
              href="mailto:nogiamonika2005@gmail.com"
              className="text-[10px] text-primary font-semibold hover:opacity-70 transition-opacity"
            >
              Email
            </a>
          </div>
        </div>

      </div>

      {/* Floating cart summary */}
      {totalItems > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 max-w-2xl mx-auto">
          <button
            onClick={() => setCartOpen(true)}
            data-testid="button-view-cart"
            className="w-full bg-primary text-primary-foreground rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg px-2.5 py-1 text-sm font-bold">{totalItems}</div>
              <span className="font-semibold">View Cart</span>
            </div>
            <span className="font-bold text-lg">₹{totalPrice}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div ref={cartRef} className="bg-card rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-foreground">Your Cart</h2>
                <p className="text-sm text-muted-foreground">Table {tableId}</p>
              </div>
              <button onClick={() => setCartOpen(false)} data-testid="button-close-cart" className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.dishId}-${item.variant}`}
                  data-testid={`cart-item-${item.dishId}-${item.variant.toLowerCase()}`}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-sm text-primary font-medium">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.dishId, item.variant, item.quantity - 1)
                      }
                      data-testid={`button-decrease-${item.dishId}-${item.variant.toLowerCase()}`}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.dishId, item.variant, item.quantity + 1)
                      }
                      data-testid={`button-increase-${item.dishId}-${item.variant.toLowerCase()}`}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-foreground w-16 text-right">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg text-foreground">Total</span>
                  <span className="font-bold text-2xl text-primary">₹{totalPrice}</span>
                </div>
                <button
                  onClick={placeOrder}
                  data-testid="button-place-order"
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-600 transition-colors shadow-lg mb-3"
                >
                  <MessageCircle className="h-6 w-6" />
                  Place Order via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  data-testid="button-clear-cart"
                  className="w-full border border-border text-muted-foreground py-3 rounded-2xl font-medium hover:bg-muted transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {payOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setPayOpen(false)} />

          {/* Sheet */}
          <div className="relative bg-card rounded-t-3xl overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-foreground">Pay Now</h2>
                <p className="text-xs text-muted-foreground">Table {tableId}</p>
              </div>
              <button onClick={() => setPayOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-6 flex flex-col items-center gap-6">

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground font-medium">Scan & Pay</p>
                <div className="p-3 bg-white rounded-2xl border border-border shadow-sm">
                  <img
                    src={settings.data?.upiQrUrl ?? "/upi-qr.png"}
                    alt="UPI QR Code"
                    className="w-52 h-52 object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  PhonePe · GPay · Paytm · Any UPI App
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* UPI Deep Link Button */}
              <a
                href={`upi://pay?pa=${settings.data?.upiId ?? ""}&pn=${encodeURIComponent(restaurantName)}&cu=INR`}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base shadow-lg"
                style={{ background: "#1a3a26" }}
              >
                📲 Open UPI App to Pay
              </a>

              <p className="text-xs text-center text-muted-foreground px-4">
                UPI ID: <span className="font-semibold text-foreground">{settings.data?.upiId ?? "Not set"}</span>
              </p>
            </div>
          </div>
        </div>
      )}


      {/* ── Category Quick-Nav Button ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-orange-500 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold" style={{ background: "#1a3a26" }}

      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Menu
      </button>

      {/* ── Category Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Sheet */}
          <div className="relative bg-card rounded-t-3xl max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="font-bold text-xl text-foreground">Categories</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {(categories.data ?? []).map((cat) => {
                const count = filteredDishes(cat.dishes ?? []).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setDrawerOpen(false);
                      // category expand karo agar band hai
                      setExpandedCategories((prev) => {
                        const next = new Set(prev);
                        next.add(cat.id);
                        return next;
                      });
                      setTimeout(() => {
                        const el = document.getElementById(`category-${cat.id}`);
                        if (el) {
                          const headerOffset = 130; // sticky header ki height
                          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                          window.scrollTo({
                            top: elementPosition - headerOffset,
                            behavior: "smooth",
                          });
                        }
                      }, 150);
                    }}
                    className="text-left px-4 py-3 rounded-xl border border-border hover:bg-orange-50 hover:border-orange-300 transition-all"
                  >
                    <p className="font-semibold text-foreground text-sm leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {count} items
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

function DishCard({
  dish,
  qtyDefault,
  qtyHalf,
  qtyFull,
  addItem,
  updateQuantity,
}: {
  dish: Dish;
  qtyDefault: number;
  qtyHalf: number;
  qtyFull: number;
  addItem: (d: {
    id: number;
    name: string;
    price: number;
    variant?: DishVariant;
  }) => void;
  updateQuantity: (id: number, variant: DishVariant, qty: number) => void;
}) {
  const hasHalf = dish.halfPrice != null;
  const hasFull = dish.fullPrice != null;

  // fallback old behaviour ke liye
  const showDefault = !hasHalf && !hasFull;

  return (
    <div
      data-testid={`card-dish-${dish.id}`}
      className="flex gap-4 p-4 hover:bg-muted/20 transition-colors"
    >
      {/* Dish info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {dish.isVeg ? (
            <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
            </div>
          )}
          {dish.isFeatured && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Star className="h-2.5 w-2.5" /> Chef&apos;s Special
            </span>
          )}
        </div>
        <h3 className="font-semibold text-foreground text-sm leading-tight">
          {dish.name}
        </h3>
        {dish.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {dish.description}
          </p>
        )}

        {/* Prices + controls */}
        <div className="mt-2 space-y-1">
          {hasHalf && (
            <VariantRow
              label="Half"
              price={dish.halfPrice as number}
              qty={qtyHalf}
              onAdd={() =>
                addItem({
                  id: dish.id,
                  name: `${dish.name} (Half)`,
                  price: dish.halfPrice as number,
                  variant: "HALF",
                })
              }
              onChangeQty={(newQty) =>
                updateQuantity(dish.id, "HALF", newQty)
              }
            />
          )}

          {hasFull && (
            <VariantRow
              label="Full"
              price={dish.fullPrice as number}
              qty={qtyFull}
              onAdd={() =>
                addItem({
                  id: dish.id,
                  name: `${dish.name} (Full)`,
                  price: dish.fullPrice as number,
                  variant: "FULL",
                })
              }
              onChangeQty={(newQty) =>
                updateQuantity(dish.id, "FULL", newQty)
              }
            />
          )}

          {showDefault && (
            <VariantRow
              label={undefined}
              price={dish.price}
              qty={qtyDefault}
              onAdd={() =>
                addItem({
                  id: dish.id,
                  name: dish.name,
                  price: dish.price,
                  variant: "DEFAULT",
                })
              }
              onChangeQty={(newQty) =>
                updateQuantity(dish.id, "DEFAULT", newQty)
              }
            />
          )}
        </div>
      </div>

      {/* Image */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <div className="w-24 h-20 rounded-xl overflow-hidden bg-muted relative">
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Utensils className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VariantRow({
  label,
  price,
  qty,
  onAdd,
  onChangeQty,
}: {
  label?: string;
  price: number;
  qty: number;
  onAdd: () => void;
  onChangeQty: (qty: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-baseline gap-2">
        <p className="font-bold text-primary text-sm">₹{price}</p>
        {label && (
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
        )}
      </div>
      {qty === 0 ? (
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-[11px] font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          ADD
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onChangeQty(qty - 1)}
            className="w-7 h-7 rounded-lg border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="font-bold text-primary text-sm w-4 text-center">
            {qty}
          </span>
          <button
            onClick={() => onChangeQty(qty + 1)}
            className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
