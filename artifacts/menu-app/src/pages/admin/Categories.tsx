import { useState } from "react";
import { Link } from "wouter";
import {
  useAdminListCategories, useCreateCategory, useUpdateCategory,
  useDeleteCategory, getAdminListCategoriesQueryKey
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react";

interface EditState {
  id: number | null;
  name: string;
  displayOrder: string;
}

export default function AdminCategories() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const headers = { Authorization: `Bearer ${token}` };

  const categories = useAdminListCategories({ request: { headers } });
  const createMutation = useCreateCategory({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListCategoriesQueryKey() }) } });
  const updateMutation = useUpdateCategory({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListCategoriesQueryKey() }) } });
  const deleteMutation = useDeleteCategory({ request: { headers }, mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListCategoriesQueryKey() }) } });

  const [edit, setEdit] = useState<EditState | null>(null);
  const [newCat, setNewCat] = useState({ name: "", displayOrder: "" });
  const [showAdd, setShowAdd] = useState(false);

  const handleCreate = () => {
    if (!newCat.name.trim()) return;
    createMutation.mutate({ data: { name: newCat.name.trim(), displayOrder: Number(newCat.displayOrder) || 0 } }, {
      onSuccess: () => { setNewCat({ name: "", displayOrder: "" }); setShowAdd(false); }
    });
  };

  const handleUpdate = () => {
    if (!edit || !edit.name.trim()) return;
    updateMutation.mutate({ id: edit.id!, data: { name: edit.name.trim(), displayOrder: Number(edit.displayOrder) || 0 } }, {
      onSuccess: () => setEdit(null)
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this category? All its dishes will also be affected.")) return;
    deleteMutation.mutate({ id });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" data-testid="link-back-admin" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Categories</h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            data-testid="button-add-category"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {/* Add form */}
        {showAdd && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-foreground">New Category</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Category name"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-new-category-name"
                autoFocus
              />
              <input
                type="number"
                placeholder="Order"
                value={newCat.displayOrder}
                onChange={(e) => setNewCat({ ...newCat, displayOrder: e.target.value })}
                className="w-20 px-3 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-new-category-order"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                data-testid="button-save-new-category"
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {createMutation.isPending ? "Saving..." : "Save Category"}
              </button>
              <button onClick={() => setShowAdd(false)} data-testid="button-cancel-new-category" className="px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {categories.isLoading ? (
          [...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-muted rounded-2xl h-20" />)
        ) : (categories.data ?? []).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No categories yet</p>
            <p className="text-sm">Add your first category above</p>
          </div>
        ) : (
          (categories.data ?? []).map((cat) => (
            <div key={cat.id} data-testid={`category-row-${cat.id}`} className="bg-card border border-border rounded-2xl p-4">
              {edit?.id === cat.id ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={edit.name}
                      onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                      data-testid={`input-edit-category-name-${cat.id}`}
                      autoFocus
                    />
                    <input
                      type="number"
                      value={edit.displayOrder}
                      onChange={(e) => setEdit({ ...edit, displayOrder: e.target.value })}
                      className="w-20 px-3 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                      data-testid={`input-edit-category-order-${cat.id}`}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                      data-testid={`button-save-category-${cat.id}`}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <Check className="h-5 w-5" /> Save
                    </button>
                    <button onClick={() => setEdit(null)} data-testid={`button-cancel-category-${cat.id}`} className="px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-lg">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">Display order: {cat.displayOrder}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEdit({ id: cat.id, name: cat.name, displayOrder: String(cat.displayOrder) })}
                      data-testid={`button-edit-category-${cat.id}`}
                      className="p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                    >
                      <Pencil className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      data-testid={`button-delete-category-${cat.id}`}
                      className="p-3 rounded-xl border border-destructive/30 hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
