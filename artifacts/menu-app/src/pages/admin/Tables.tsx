import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  useListTables, useCreateTable, useDeleteTable, getListTablesQueryKey
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import QRCode from "qrcode";
import { ArrowLeft, Plus, Trash2, QrCode, Download, Table2, X } from "lucide-react";

interface QRModal {
  tableNumber: string;
  label: string | null | undefined;
  dataUrl: string;
}

export default function AdminTables() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const headers = { Authorization: `Bearer ${token}` };

  const tables = useListTables({ request: { headers } });
  const createMutation = useCreateTable({
    request: { headers },
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListTablesQueryKey() }) }
  });
  const deleteMutation = useDeleteTable({
    request: { headers },
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListTablesQueryKey() }) }
  });

  const [newTable, setNewTable] = useState({ tableNumber: "", label: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [qrModal, setQrModal] = useState<QRModal | null>(null);

  const handleCreate = () => {
    if (!newTable.tableNumber.trim()) return;
    createMutation.mutate({ data: { tableNumber: newTable.tableNumber.trim(), label: newTable.label || null } }, {
      onSuccess: () => { setNewTable({ tableNumber: "", label: "" }); setShowAdd(false); }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this table?")) return;
    deleteMutation.mutate({ id });
  };

  const showQR = async (tableNumber: string, label: string | null | undefined) => {
    const menuUrl = `${window.location.origin}/menu?table=${tableNumber}`;
    const dataUrl = await QRCode.toDataURL(menuUrl, { width: 300, margin: 2, color: { dark: "#1a1a1a", light: "#ffffff" } });
    setQrModal({ tableNumber, label, dataUrl });
  };

  const downloadQR = () => {
    if (!qrModal) return;
    const a = document.createElement("a");
    a.href = qrModal.dataUrl;
    a.download = `table-${qrModal.tableNumber}-qr.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" data-testid="link-back-admin" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground flex-1">QR Codes & Tables</h1>
          <button
            onClick={() => setShowAdd(true)}
            data-testid="button-add-table"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add Table
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Add form */}
        {showAdd && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-foreground text-lg">Add New Table</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-foreground mb-1.5 text-sm">Table Number *</label>
                <input
                  type="text"
                  placeholder="e.g. T7"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                  data-testid="input-table-number"
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1.5 text-sm">Label (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Window Seat"
                  value={newTable.label}
                  onChange={(e) => setNewTable({ ...newTable, label: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-base"
                  data-testid="input-table-label"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                data-testid="button-save-table"
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {createMutation.isPending ? "Adding..." : "Add Table"}
              </button>
              <button onClick={() => setShowAdd(false)} data-testid="button-cancel-table" className="px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {tables.isLoading ? (
          [...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-muted rounded-2xl h-24" />)
        ) : (tables.data ?? []).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Table2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No tables yet</p>
            <p className="text-sm">Add your first table to generate QR codes</p>
          </div>
        ) : (
          (tables.data ?? []).map((table) => (
            <div key={table.id} data-testid={`table-row-${table.id}`} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary text-lg">{table.tableNumber}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-lg">{table.tableNumber}</p>
                {table.label && <p className="text-sm text-muted-foreground">{table.label}</p>}
                <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                  /menu?table={table.tableNumber}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => showQR(table.tableNumber, table.label)}
                  data-testid={`button-qr-${table.id}`}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/20 transition-colors"
                >
                  <QrCode className="h-4 w-4" /> QR
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  data-testid={`button-delete-table-${table.id}`}
                  className="p-2.5 rounded-xl border border-destructive/30 hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setQrModal(null)} />
          <div className="relative bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <button
              onClick={() => setQrModal(null)}
              data-testid="button-close-qr"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-bold text-xl text-foreground mb-1">Table {qrModal.tableNumber}</h2>
            {qrModal.label && <p className="text-muted-foreground text-sm mb-4">{qrModal.label}</p>}
            <div className="my-6 flex justify-center">
              <img
                src={qrModal.dataUrl}
                alt={`QR for table ${qrModal.tableNumber}`}
                data-testid="img-qr-code"
                className="w-64 h-64 rounded-2xl shadow-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-5 font-mono break-all">
              {window.location.origin}/menu?table={qrModal.tableNumber}
            </p>
            <button
              onClick={downloadQR}
              data-testid="button-download-qr"
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
            >
              <Download className="h-5 w-5" />
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
