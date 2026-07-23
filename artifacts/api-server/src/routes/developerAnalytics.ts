import { createHash } from "node:crypto";
import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { authenticator } from "otplib";
import { db, customerMenuVisitsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();
const SESSION_COOKIE = "developer_analytics_session";
const SESSION_TTL_SECONDS = 15 * 60;
const loginSchema = z.object({ code: z.string().regex(/^\d{6}$/) });
const attempts = new Map<string, { failures: number; lockedUntil: number }>();

function sessionSecret() {
  const secret = process.env.DEVELOPER_ANALYTICS_SESSION_SECRET;
  if (!secret) throw new Error("DEVELOPER_ANALYTICS_SESSION_SECRET must be configured");
  return secret;
}
function totpSecret() {
  const secret = process.env.DEVELOPER_ANALYTICS_TOTP_SECRET;
  if (!secret) throw new Error("DEVELOPER_ANALYTICS_TOTP_SECRET must be configured");
  return secret;
}
function attemptKey(req: Request) {
  return createHash("sha256").update(req.ip ?? "unknown").digest("hex");
}
function requireDeveloper(req: Request, res: Response, next: () => void) {
  try {
    jwt.verify(req.cookies?.[SESSION_COOKIE], sessionSecret(), { audience: "developer-analytics" });
    next();
  } catch {
    res.status(401).json({ error: "Developer authentication required" });
  }
}

router.post("/developer/auth/totp", (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  const key = attemptKey(req);
  const record = attempts.get(key);
  if (record?.lockedUntil && record.lockedUntil > Date.now()) {
    res.status(429).json({ error: "Too many invalid attempts. Try again later." }); return;
  }
  if (!authenticator.check(parsed.data.code, totpSecret())) {
    const failures = (record?.failures ?? 0) + 1;
    attempts.set(key, { failures, lockedUntil: failures >= 5 ? Date.now() + 15 * 60_000 : 0 });
    res.status(401).json({ error: "Invalid authenticator code" }); return;
  }
  attempts.delete(key);
  const token = jwt.sign({ scope: "developer-analytics" }, sessionSecret(), { expiresIn: SESSION_TTL_SECONDS, audience: "developer-analytics" });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    maxAge: SESSION_TTL_SECONDS * 1000, path: "/api/developer",
  });
  res.status(204).end();
});

router.post("/developer/auth/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/developer" });
  res.status(204).end();
});

router.get("/developer/analytics", requireDeveloper, async (req, res) => {
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
