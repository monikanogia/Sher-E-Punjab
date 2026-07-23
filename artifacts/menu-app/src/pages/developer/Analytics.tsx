import { useQuery } from "@tanstack/react-query";

type AnalyticsSummary = {
  uniqueWebsiteVisitors: number;
  uniqueQrScanners: number;
  qrScans: number;
  scansByTable: { tableId: string; uniqueScans: number }[];
};

export default function DeveloperAnalytics() {
  const analytics = useQuery<AnalyticsSummary>({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/summary");
      if (!response.ok) throw new Error(`Unable to load analytics (${response.status})`);
      return response.json();
    },
    refetchInterval: 60_000,
  });

  if (analytics.isLoading) return <main className="min-h-screen bg-background p-8">Loading analytics…</main>;
  if (analytics.isError || !analytics.data) {
    return <main className="min-h-screen bg-background p-8"><p>Unable to load analytics data. Please try again later.</p></main>;
  }

  const data = analytics.data;
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Developer Analytics</h1>
          <p className="text-sm text-muted-foreground">Website and QR menu activity. Refreshes every minute.</p>
        </header>
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["Website visitors", data.uniqueWebsiteVisitors],
            ["Unique QR scanners", data.uniqueQrScanners],
            ["QR scans", data.qrScans],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>
        <section className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold">QR scans by table</h2>
          {data.scansByTable.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No QR scans recorded yet.</p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Table</th><th className="pb-2">Unique scans</th></tr></thead>
              <tbody>{data.scansByTable.map((row) => <tr key={row.tableId} className="border-t border-border"><td className="py-2">{row.tableId}</td><td className="py-2">{row.uniqueScans}</td></tr>)}</tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
