import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { dishesTable, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  CreateDishBody,
  UpdateDishParams,
  UpdateDishBody,
  DeleteDishParams,
  ToggleDishStockParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.use(requireAdmin);

const selectWithCategory = () =>
  db
    .select({
      id: dishesTable.id,
      name: dishesTable.name,
      description: dishesTable.description,
      price: dishesTable.price,
      isVeg: dishesTable.isVeg,
      isAvailable: dishesTable.isAvailable,
      isFeatured: dishesTable.isFeatured,
      imageUrl: dishesTable.imageUrl,
      categoryId: dishesTable.categoryId,
      categoryName: categoriesTable.name,
    })
    .from(dishesTable)
    .leftJoin(categoriesTable, eq(dishesTable.categoryId, categoriesTable.id));

router.get("/admin/dishes", async (_req: Request, res: Response) => {
  try {
    const rows = await selectWithCategory();
    res.json(rows.map((r) => ({ ...r, price: Number(r.price) })));
  } catch (err) {
    _req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/dishes", async (req: Request, res: Response) => {
  try {
    const parsed = CreateDishBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { name, description, price, isVeg, isAvailable, isFeatured, imageUrl, categoryId } = parsed.data;
    const [dish] = await db
      .insert(dishesTable)
      .values({
        name,
        description: description ?? null,
        price: String(price),
        isVeg,
        isAvailable,
        isFeatured,
        imageUrl: imageUrl ?? null,
        categoryId,
      })
      .returning();
    res.status(201).json({ ...dish, price: Number(dish.price) });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/dishes/:id", async (req: Request, res: Response) => {
  try {
    const paramsParsed = UpdateDishParams.safeParse(req.params);
    const bodyParsed = UpdateDishBody.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const { name, description, price, isVeg, isAvailable, isFeatured, imageUrl, categoryId } = bodyParsed.data;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = String(price);
    if (isVeg !== undefined) updateData.isVeg = isVeg;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const [dish] = await db
      .update(dishesTable)
      .set(updateData)
      .where(eq(dishesTable.id, Number(paramsParsed.data.id)))
      .returning();
    if (!dish) {
      res.status(404).json({ error: "Dish not found" });
      return;
    }
    res.json({ ...dish, price: Number(dish.price) });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/dishes/:id", async (req: Request, res: Response) => {
  try {
    const parsed = DeleteDishParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    await db.delete(dishesTable).where(eq(dishesTable.id, Number(parsed.data.id)));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/dishes/:id/toggle-stock", async (req: Request, res: Response) => {
  try {
    const parsed = ToggleDishStockParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const [current] = await db.select().from(dishesTable).where(eq(dishesTable.id, Number(parsed.data.id)));
    if (!current) {
      res.status(404).json({ error: "Dish not found" });
      return;
    }
    const [dish] = await db
      .update(dishesTable)
      .set({ isAvailable: !current.isAvailable })
      .where(eq(dishesTable.id, Number(parsed.data.id)))
      .returning();
    res.json({ ...dish, price: Number(dish.price) });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
