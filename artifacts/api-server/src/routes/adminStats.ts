import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { categoriesTable, dishesTable, tablesTable } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/admin/stats", async (_req: Request, res: Response) => {
  try {
    const [{ total: totalDishes }] = await db.select({ total: count() }).from(dishesTable);
    const [{ total: totalCategories }] = await db.select({ total: count() }).from(categoriesTable);
    const [{ total: inStock }] = await db
      .select({ total: count() })
      .from(dishesTable)
      .where(eq(dishesTable.isAvailable, true));
    const [{ total: featuredDishes }] = await db
      .select({ total: count() })
      .from(dishesTable)
      .where(and(eq(dishesTable.isFeatured, true), eq(dishesTable.isAvailable, true)));
    const [{ total: totalTables }] = await db.select({ total: count() }).from(tablesTable);

    res.json({
      totalDishes: Number(totalDishes),
      totalCategories: Number(totalCategories),
      inStock: Number(inStock),
      outOfStock: Number(totalDishes) - Number(inStock),
      featuredDishes: Number(featuredDishes),
      totalTables: Number(totalTables),
    });
  } catch (err) {
    _req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
