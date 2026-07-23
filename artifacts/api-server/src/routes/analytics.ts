import { createHash } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { db, customerMenuVisitsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();
const VISITOR_ID = z.string().uuid();
const TABLE_ID = z.string().trim().min(1).max(100).optional();
const eventSchema = z.object({
  visitorId: VISITOR_ID,
  eventType: z.enum(["visit", "qr_scan"]),
  tableId: TABLE_ID,
  sourcePath: z.string().startsWith("/").max(500).optional(),
});
const profileSchema = z.object({
  visitorId: VISITOR_ID,
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,19}$/),
  tableId: TABLE_ID,
});

const requests = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;

function publicRateLimit(req: Request, res: Response, next: () => void) {
  const key = createHash("sha256").update(req.ip ?? "unknown").digest("hex");
  const now = Date.now();
  const entry = requests.get(key);
  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    next();
    return;
  }
  if (entry.count >= RATE_LIMIT) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  entry.count += 1;
  next();
}

function eventDay(now = new Date()) {
  return now.toISOString().slice(0, 10);
}
function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}
function userAgentHash(req: Request) {
  const ua = req.get("user-agent") ?? "";
  return ua ? createHash("sha256").update(ua).digest("hex") : null;
}

router.post("/analytics/events", publicRateLimit, async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success || (parsed.data.eventType === "qr_scan" && !parsed.data.tableId)) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { visitorId, eventType, tableId, sourcePath } = parsed.data;
  try {
    // A visit without a table is intentionally not deduplicated by the DB's
    // nullable unique index semantics; QR scans are deduplicated per day.
    const day = eventType === "qr_scan" ? eventDay() : null;
    if (day && tableId) {
      const existing = await db.select({ id: customerMenuVisitsTable.id }).from(customerMenuVisitsTable)
        .where(and(eq(customerMenuVisitsTable.visitorId, visitorId), eq(customerMenuVisitsTable.tableId, tableId), eq(customerMenuVisitsTable.eventType, eventType), eq(customerMenuVisitsTable.eventDay, day))).limit(1);
      if (existing.length) {
        res.status(204).end();
        return;
      }
    }
    await db.insert(customerMenuVisitsTable).values({
      visitorId, eventType, tableId: tableId ?? null, sourcePath: sourcePath ?? null,
      eventDay: day, userAgentHash: userAgentHash(req),
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Customer analytics event failed");
    res.status(500).json({ error: "Unable to record event" });
  }
});

router.post("/analytics/profile", publicRateLimit, async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.errors, body: req.body }, "Invalid profile submission");
    res.status(400).json({ error: "Invalid request body", details: parsed.error.errors });
    return;
  }
  const { visitorId, name, tableId } = parsed.data;
  const phone = normalizePhone(parsed.data.phone);
  if (phone.length < 8 || phone.length > 15) {
    req.log.warn({ phone: parsed.data.phone, normalized: phone }, "Invalid phone length");
    res.status(400).json({ error: "Phone number must be 8-15 digits" });
    return;
  }
  try {
    await db.insert(customerMenuVisitsTable).values({
      visitorId, name, phone, tableId: tableId ?? null, eventType: "profile_submitted",
      userAgentHash: userAgentHash(req),
    });
    req.log.info({ visitorId, name, tableId }, "Profile submitted successfully");
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err, visitorId, name }, "Customer profile submission failed");
    res.status(500).json({ error: "Unable to save profile" });
  }
});

export default router;
