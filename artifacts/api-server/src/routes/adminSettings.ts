import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/admin/settings", async (_req: Request, res: Response) => {
  try {
    const [settings] = await db.select().from(settingsTable).limit(1);
    if (!settings) {
      const [created] = await db
        .insert(settingsTable)
        .values({
          restaurantName: "My Restaurant",
          whatsappNumber: "919999999999",
          isOpen: true,
        })
        .returning();
      res.json(created);
      return;
    }
    res.json(settings);
  } catch (err) {
    _req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/settings", async (req: Request, res: Response) => {
  try {
    const parsed = UpdateSettingsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [existing] = await db.select().from(settingsTable).limit(1);
    let settings;
    if (!existing) {
      const [created] = await db
        .insert(settingsTable)
        .values({
          restaurantName: parsed.data.restaurantName ?? "My Restaurant",
          whatsappNumber: parsed.data.whatsappNumber ?? "919999999999",
          isOpen: parsed.data.isOpen ?? true,
          ...parsed.data,
        })
        .returning();
      settings = created;
    } else {
      const [updated] = await db
        .update(settingsTable)
        .set(parsed.data)
        .where(eq(settingsTable.id, existing.id))
        .returning();
      settings = updated;
    }
    res.json(settings);
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
