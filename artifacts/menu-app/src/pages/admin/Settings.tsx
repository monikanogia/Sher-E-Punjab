import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  useGetAdminSettings, useUpdateSettings, getGetAdminSettingsQueryKey
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Check } from "lucide-react";

export default function AdminSettings() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const headers = { Authorization: `Bearer ${token}` };

  const settings = useGetAdminSettings({ request: { headers } });
  const updateMutation = useUpdateSettings({
    request: { headers },
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAdminSettingsQueryKey() }) }
  });

  const [form, setForm] = useState({
    restaurantName: "", whatsappNumber: "", openingHours: "",
    isOpen: true, logoUrl: "", accentColor: "#e85d04",
    upiId: "",         // ← ADD
    upiQrUrl: "",
  });
  const [saved, setSaved] = useState(false);

  // useEffect(() => {
  //   if (settings.data) {
  //     setForm({
  //       restaurantName: settings.data.restaurantName,
  //       whatsappNumber: settings.data.whatsappNumber,
  //       openingHours: settings.data.openingHours ?? "",
  //       isOpen: settings.data.isOpen,
  //       logoUrl: settings.data.logoUrl ?? "",
  //       accentColor: settings.data.accentColor ?? "#e85d04",
  //       upiId: settings.data.upiId ?? "",        // ← ADD
  //     upiQrUrl: settings.data.upiQrUrl ?? "",
  //     });
  //   }
  // }, [settings.data]);

  // Settings.tsx: useEffect (line ~30)
  useEffect(() => {
    if (settings.data) {
      const data = settings.data as any;  // ← TEMPORARY FIX
      setForm({
        restaurantName: data.restaurantName,
        whatsappNumber: data.whatsappNumber,
        openingHours: data.openingHours ?? "",
        isOpen: data.isOpen,
        logoUrl: data.logoUrl ?? "",
        accentColor: data.accentColor ?? "#e85d04",
        upiId: data.upiId ?? "",        // ← Now works!
        upiQrUrl: data.upiQrUrl ?? "",  // ← Now works!
      });
    }
  }, [settings.data]);

  // const handleSave = () => {
  //   updateMutation.mutate({
  //     data: {
  //       ...form,
  //       openingHours: form.openingHours || null,
  //       logoUrl: form.logoUrl || null,
  //       accentColor: form.accentColor || null,
  //     }
  //   }, {
  //     onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  //   });
  // };

  const handleSave = () => {
  updateMutation.mutate({
  data: {
    ...form,
    openingHours: form.openingHours || null,
    logoUrl: form.logoUrl || null,
    accentColor: form.accentColor || null,
    upiId: form.upiId || null,
    upiQrUrl: form.upiQrUrl || null,
  }
});
};

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" data-testid="link-back-admin" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground flex-1">Settings</h1>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            data-testid="button-save-settings"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : updateMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {settings.isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse bg-muted rounded-2xl h-20" />)}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {/* Restaurant Name */}
            <div className="p-5">
              <label className="block font-bold text-foreground text-lg mb-1.5">Restaurant Name</label>
              <input
                type="text"
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-restaurant-name"
                placeholder="My Restaurant"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="p-5">
              <label className="block font-bold text-foreground text-lg mb-1">WhatsApp Number</label>
              <p className="text-sm text-muted-foreground mb-2">Include country code, no spaces or dashes (e.g. 919876543210)</p>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-whatsapp-number"
                placeholder="919876543210"
              />
            </div>

            {/* Opening Hours */}
            <div className="p-5">
              <label className="block font-bold text-foreground text-lg mb-1.5">Opening Hours</label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-opening-hours"
                placeholder="Mon-Sun: 11AM - 11PM"
              />
            </div>

            {/* Logo URL */}
            <div className="p-5">
              <label className="block font-bold text-foreground text-lg mb-1.5">Logo URL</label>
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-logo-url"
                placeholder="https://..."
              />
            </div>

            {/* Restaurant Open/Closed */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-lg">Restaurant Status</p>
                  <p className="text-sm text-muted-foreground">
                    Currently: <span className={form.isOpen ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {form.isOpen ? "Open" : "Closed"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setForm({ ...form, isOpen: !form.isOpen })}
                  data-testid="toggle-is-open"
                  className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors ${form.isOpen ? "bg-green-500" : "bg-muted-foreground/30"}`}
                >
                  <span className={`inline-block h-7 w-7 rounded-full bg-white shadow-md transform transition-transform ${form.isOpen ? "translate-x-8" : "translate-x-1"}`} />
                </button>
              </div>
            </div>


            {/* UPI ID */}
            <div className="p-5">
              <label className="block font-bold text-foreground text-lg mb-1">UPI ID</label>
              <p className="text-sm text-muted-foreground mb-2">
                e.g. sherpunjab@paytm or 9876543210@upi
              </p>
              <input
                type="text"
                value={form.upiId ?? ""}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-upi-id"
                placeholder="yourname@upi"
              />
            </div>

            {/* UPI QR Code URL */}
            <div className="p-5">
              <label className="block font-bold text-foreground text-lg mb-1">UPI QR Code URL</label>
              <p className="text-sm text-muted-foreground mb-2">
                QR image ka URL paste karo (ya public/upi-qr.png daal kar /upi-qr.png likho)
              </p>
              <input
                type="text"
                value={form.upiQrUrl ?? ""}
                onChange={(e) => setForm({ ...form, upiQrUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                data-testid="input-upi-qr-url"
                placeholder="https://... ya /upi-qr.png"
              />
            </div>
          </div>
        )}

        {updateMutation.isError && (
          <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm font-medium">
            Failed to save settings. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
