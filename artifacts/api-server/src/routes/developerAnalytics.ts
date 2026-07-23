import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// Public endpoint - no authentication required
router.get("/developer/analytics", async (req, res) => {
  try {
    const rows = await db.execute(sql`
      SELECT
        COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'visit')::int AS "uniqueWebsiteVisitors",
        COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'qr_scan')::int AS "uniqueQrScanners",
        COUNT(*) FILTER (WHERE event_type = 'qr_scan')::int AS "uniqueQrScans",
        COUNT(*) FILTER (WHERE event_type = 'profile_submitted')::int AS "profileSubmissions",
        COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'visit' AND created_at >= date_trunc('day', now()))::int AS "todayWebsiteVisitors",
        COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'qr_scan' AND created_at >= date_trunc('day', now()))::int AS "todayQrScanners",
        COUNT(*) FILTER (WHERE event_type = 'profile_submitted' AND created_at >= date_trunc('day', now()))::int AS "todayProfileSubmissions",
        COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'visit' AND created_at >= now() - interval '7 days')::int AS "weekWebsiteVisitors",
        COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'qr_scan' AND created_at >= now() - interval '7 days')::int AS "weekQrScanners",
        COUNT(*) FILTER (WHERE event_type = 'profile_submitted' AND created_at >= now() - interval '7 days')::int AS "weekProfileSubmissions"
      FROM customer_menu_visits
    `);
    const scans = await db.execute(sql`SELECT table_id AS "tableId", COUNT(DISTINCT visitor_id)::int AS "uniqueScans" FROM customer_menu_visits WHERE event_type = 'qr_scan' GROUP BY table_id ORDER BY "uniqueScans" DESC`);
    const profiles = await db.execute(sql`SELECT name, phone, table_id AS "tableId", created_at AS "submittedAt" FROM customer_menu_visits WHERE event_type = 'profile_submitted' ORDER BY created_at DESC LIMIT 500`);
    const metrics = rows.rows[0] ?? {};
    req.log.info({ event: "developer_analytics_access" }, "Developer analytics accessed");
    res.json({ uniqueWebsiteVisitors: metrics.uniqueWebsiteVisitors ?? 0, uniqueQrScanners: metrics.uniqueQrScanners ?? 0, uniqueQrScans: metrics.uniqueQrScans ?? 0, profileSubmissions: metrics.profileSubmissions ?? 0, today: { uniqueWebsiteVisitors: metrics.todayWebsiteVisitors ?? 0, uniqueQrScanners: metrics.todayQrScanners ?? 0, profileSubmissions: metrics.todayProfileSubmissions ?? 0 }, last7Days: { uniqueWebsiteVisitors: metrics.weekWebsiteVisitors ?? 0, uniqueQrScanners: metrics.weekQrScanners ?? 0, profileSubmissions: metrics.weekProfileSubmissions ?? 0 }, scansByTable: scans.rows, customerProfiles: profiles.rows });
  } catch (err) { req.log.error({ err }, "Developer analytics query failed"); res.status(500).json({ error: "Unable to load analytics" }); }
});

export default router;
