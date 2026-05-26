import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { tablesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { CreateTableBody, DeleteTableParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/admin/tables", async (_req: Request, res: Response) => {
  try {
    const tables = await db.select().from(tablesTable).orderBy(tablesTable.id);
    res.json(tables);
  } catch (err) {
    _req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/tables", async (req: Request, res: Response) => {
  try {
    const parsed = CreateTableBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [table] = await db.insert(tablesTable).values(parsed.data).returning();
    res.status(201).json(table);
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/tables/:id", async (req: Request, res: Response) => {
  try {
    const parsed = DeleteTableParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    await db.delete(tablesTable).where(eq(tablesTable.id, Number(parsed.data.id)));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
