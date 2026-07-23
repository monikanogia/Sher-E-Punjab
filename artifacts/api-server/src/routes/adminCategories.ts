import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { invalidatePublicMenuCache } from "../lib/publicMenuCache.js";
import { CreateCategoryBody, UpdateCategoryParams, UpdateCategoryBody, DeleteCategoryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/admin/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.displayOrder);
    res.json(cats);
  } catch (err) {
    _req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/categories", async (req: Request, res: Response) => {
  try {
    const parsed = CreateCategoryBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [cat] = await db.insert(categoriesTable).values(parsed.data).returning();
    invalidatePublicMenuCache();
    res.status(201).json(cat);
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/categories/:id", async (req: Request, res: Response) => {
  try {
    const paramsParsed = UpdateCategoryParams.safeParse(req.params);
    const bodyParsed = UpdateCategoryBody.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const [cat] = await db
      .update(categoriesTable)
      .set(bodyParsed.data)
      .where(eq(categoriesTable.id, Number(paramsParsed.data.id)))
      .returning();
    if (!cat) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    invalidatePublicMenuCache();
    res.json(cat);
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/categories/:id", async (req: Request, res: Response) => {
  try {
    const parsed = DeleteCategoryParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(parsed.data.id)));
    invalidatePublicMenuCache();
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
