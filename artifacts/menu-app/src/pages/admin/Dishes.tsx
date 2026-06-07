import { useState } from "react";
import { Link } from "wouter";
import {
  useAdminListDishes, useAdminListCategories, useCreateDish, useUpdateDish,
  useDeleteDish, useToggleDishStock, getAdminListDishesQueryKey
} from "@workspace/api-client-react";
import type { Dish, CreateDishBody } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, Pencil, Trash2, Utensils, Leaf, Flame, Star, X
} from "lucide-react";

const EMPTY_FORM: Omit<CreateDishBody, "isVeg" | "isAvailable" | "isFeatured"> & {
  isVeg: boolean; isAvailable: boolean; isFeatured: boolean
} = {
  name: "", description: "", price: 0, halfPrice: undefined,
  fullPrice: undefined, isVeg: true, isAvailable: true,
  isFeatured: false, imageUrl: "", categoryId: 0,
};

export default function AdminDishes() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const headers = { Authorization: `Bearer ${token}` };

  const dishes = useAdminListDishes({ request: { headers } });
  const cats = useAdminListCategories({ request: { headers } });

  const createMutation = useCreateDish({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListDishesQueryKey() }) } });
  const updateMutation = useUpdateDish({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListDishesQueryKey() }) } });
  const deleteMutation = useDeleteDish({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListDishesQueryKey() }) } });
  const toggleMutation = useToggleDishStock({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListDishesQueryKey() }) } });

  const [showForm, setShowForm] = useState(false);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [filterCat, setFilterCat] = useState<number | "all">("all");

  const openAdd = () => {
    setEditDish(null);
    setForm({ ...EMPTY_FORM, categoryId: cats.data?.[0]?.id ?? 0 });
    setShowForm(true);
  };

  const openEdit = (dish: Dish) => {
    setEditDish(dish);
    setForm({
      name: dish.name,
      description: dish.description ?? "",
      price: dish.price,
      halfPrice: dish.halfPrice ?? undefined,
      fullPrice: dish.fullPrice ?? undefined,
      isVeg: dish.isVeg,
      isAvailable: dish.isAvailable,
      isFeatured: dish.isFeatured,
      imageUrl: dish.imageUrl ?? "",
      categoryId: dish.categoryId,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.categoryId) return;

    // Strong validation: fullPrice required, > 0
    const finalFullPrice = form.fullPrice ?? editDish?.fullPrice;

    // Base price jo API ke 'price' field me jayega:
    // - hammesha full price hi rakhenge taaki old clients consistent rahein
   if (!finalFullPrice || finalFullPrice <= 0) {
    alert("Please enter a valid Full Price");
    return;
  }

    const payload: CreateDishBody = {
      ...form,
     description: form.description || null,
    imageUrl: form.imageUrl || null,
    price: finalFullPrice, // Base price
    halfPrice: form.halfPrice ?? undefined,
    fullPrice: Number(finalFullPrice),
    };

    if (editDish) {
      updateMutation.mutate(
        { id: editDish.id, data: payload },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditDish(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            setShowForm(false);
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this dish?")) return;
    deleteMutation.mutate({ id });
  };

  const filteredDishes = (dishes.data ?? []).filter(
    (d) => filterCat === "all" || d.categoryId === filterCat
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" data-testid="link-back-admin" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground flex-1">Dishes</h1>
          <button
            onClick={openAdd}
            data-testid="button-add-dish"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add Dish
          </button>
        </div>

        {/* Category filter */}
        {(cats.data ?? []).length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterCat("all")}
              data-testid="filter-all"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${filterCat === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
            >
              All
            </button>
            {(cats.data ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                data-testid={`filter-cat-${cat.id}`}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${filterCat === cat.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dish form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-card rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editDish ? "Edit Dish" : "Add New Dish"}</h2>
              <button onClick={() => setShowForm(false)} data-testid="button-close-form" className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Dish Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                  data-testid="input-dish-name"
                  placeholder="e.g. Butter Chicken"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base resize-none"
                  data-testid="input-dish-description"
                  rows={2}
                  placeholder="Brief description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">

                <div className="grid grid-cols-2 gap-4">
                  {/* FULL PRICE (required) */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      Full Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={form.fullPrice ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fullPrice:
                            e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                      data-testid="input-dish-full-price"
                      min={0}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Ye hi default full plate price hai (aur old clients ke liye bhi yahi use hoga).
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      Category *
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                      data-testid="select-dish-category"
                    >
                      <option value={0}>Select...</option>
                      {(cats.data ?? []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* HALF PRICE (optional) */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      Half Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.halfPrice ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          halfPrice:
                            e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                      data-testid="input-dish-half-price"
                      min={0}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional hai, nai diya to sirf full plate dikhegi.
                    </p>
                  </div>

                  {/* RIGHT SIDE helper / empty space */}
                  <div className="flex items-end">
                    <p className="text-xs text-muted-foreground">
                      Tip: Agar sirf full plate chahiye to sirf Full Price bharo, Half empty chhod do.
                    </p>
                  </div>
                </div>




                

              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl ?? ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                  data-testid="input-dish-image"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "isVeg", label: "Vegetarian", active: form.isVeg, color: "bg-green-500" },
                  { key: "isAvailable", label: "In Stock", active: form.isAvailable, color: "bg-blue-500" },
                  { key: "isFeatured", label: "Chef's Special", active: form.isFeatured, color: "bg-amber-500" },
                ].map((toggle) => (
                  <button
                    key={toggle.key}
                    onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key as keyof typeof form] })}
                    data-testid={`toggle-${toggle.key}`}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${form[toggle.key as keyof typeof form] ? `${toggle.color} text-white border-transparent` : "border-border text-muted-foreground hover:border-primary"}`}
                  >
                    {toggle.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={isPending || !form.name.trim() || !form.categoryId}
                data-testid="button-save-dish"
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg"
              >
                {isPending ? "Saving..." : editDish ? "Update Dish" : "Add Dish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
        {dishes.isLoading ? (
          [...Array(5)].map((_, i) => <div key={i} className="animate-pulse bg-muted rounded-2xl h-24" />)
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Utensils className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No dishes yet</p>
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <div key={dish.id} data-testid={`dish-row-${dish.id}`} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground">{dish.name}</span>
                  {dish.isVeg ? <Leaf className="h-4 w-4 text-green-600 flex-shrink-0" /> : <Flame className="h-4 w-4 text-red-600 flex-shrink-0" />}
                  {dish.isFeatured && <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-primary font-semibold">₹{dish.price}</p>
                <p className="text-xs text-muted-foreground">{dish.categoryName}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Stock toggle */}
                <button
                  onClick={() => toggleMutation.mutate({ id: dish.id })}
                  data-testid={`toggle-stock-${dish.id}`}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${dish.isAvailable ? "bg-green-500" : "bg-muted-foreground/30"}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${dish.isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <button
                  onClick={() => openEdit(dish)}
                  data-testid={`button-edit-dish-${dish.id}`}
                  className="p-2.5 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  data-testid={`button-delete-dish-${dish.id}`}
                  className="p-2.5 rounded-xl border border-destructive/30 hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

