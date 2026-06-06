import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { categoriesTable, dishesTable, settingsTable } from "@workspace/db";
import { eq, and, ilike } from "drizzle-orm";
import { ListDishesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/menu/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.displayOrder);
    const dishes = await db.select().from(dishesTable);

    const result = categories.map((cat) => ({
      ...cat,
      dishes: dishes.filter((d) => d.categoryId === cat.id),
    }));

    res.json(result);
  } catch (err) {
    _req.log.error({ err }, "Failed to list menu categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/dishes", async (req: Request, res: Response) => {
  try {
    const parsed = ListDishesQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    let query = db
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

    const conditions = [];
    if (params.search) {
      conditions.push(ilike(dishesTable.name, `%${params.search}%`));
    }
    if (params.isVeg !== undefined) {
      conditions.push(eq(dishesTable.isVeg, params.isVeg));
    }
    if (params.categoryId) {
      conditions.push(eq(dishesTable.categoryId, Number(params.categoryId)));
    }

    const rows = conditions.length > 0 ? await query.where(and(...conditions)) : await query;

    const result = rows.map((r) => ({
      ...r,
      price: Number(r.price),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list dishes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/settings", async (_req: Request, res: Response) => {
  try {
    const [settings] = await db.select().from(settingsTable).limit(1);
    if (!settings) {
      res.json({
        restaurantName: "My Restaurant",
        logoUrl: null,
        whatsappNumber: "919999999999",
        openingHours: null,
        isOpen: true,
        accentColor: null,
      });
      return;
    }
    res.json({
      restaurantName: settings.restaurantName,
      logoUrl: settings.logoUrl ?? null,
      whatsappNumber: settings.whatsappNumber,
      openingHours: settings.openingHours ?? null,
      isOpen: settings.isOpen,
      accentColor: settings.accentColor ?? null,
    });
  } catch (err) {
    _req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/featured", async (_req: Request, res: Response) => {
  try {
    const rows = await db
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
      .leftJoin(categoriesTable, eq(dishesTable.categoryId, categoriesTable.id))
      .where(and(eq(dishesTable.isFeatured, true), eq(dishesTable.isAvailable, true)));

    const result = rows.map((r) => ({ ...r, price: Number(r.price) }));
    res.json(result);
  } catch (err) {
    _req.log.error({ err }, "Failed to list featured dishes");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;



/*import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { categoriesTable, dishesTable, settingsTable } from "@workspace/db";
import { eq, and, ilike } from "drizzle-orm";
import { ListDishesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/menu/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.displayOrder);
    const dishes = await db.select().from(dishesTable);

    const result = categories.map((cat) => ({
      ...cat,
      dishes: dishes.filter((d) => d.categoryId === cat.id),
    }));

    res.json(result);
  } catch (err) {
    _req.log.error({ err }, "Failed to list menu categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/dishes", async (req: Request, res: Response) => {
  try {
    const parsed = ListDishesQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    let query = db
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

    const conditions = [];
    if (params.search) {
      conditions.push(ilike(dishesTable.name, `%${params.search}%`));
    }
    if (params.isVeg !== undefined) {
      conditions.push(eq(dishesTable.isVeg, params.isVeg));
    }
    if (params.categoryId) {
      conditions.push(eq(dishesTable.categoryId, Number(params.categoryId)));
    }

    const rows = conditions.length > 0 ? await query.where(and(...conditions)) : await query;

    const result = rows.map((r) => ({
      ...r,
      price: Number(r.price),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list dishes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/settings", async (_req: Request, res: Response) => {
  try {
    const [settings] = await db.select().from(settingsTable).limit(1);
    if (!settings) {
      res.json({
        restaurantName: "My Restaurant",
        logoUrl: null,
        whatsappNumber: "919999999999",
        openingHours: null,
        isOpen: true,
        accentColor: null,
      });
      return;
    }
    res.json({
      restaurantName: settings.restaurantName,
      logoUrl: settings.logoUrl ?? null,
      whatsappNumber: settings.whatsappNumber,
      openingHours: settings.openingHours ?? null,
      isOpen: settings.isOpen,
      accentColor: settings.accentColor ?? null,
    });
  } catch (err) {
    _req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/featured", async (_req: Request, res: Response) => {
  try {
    const rows = await db
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
      .leftJoin(categoriesTable, eq(dishesTable.categoryId, categoriesTable.id))
      .where(and(eq(dishesTable.isFeatured, true), eq(dishesTable.isAvailable, true)));

    const result = rows.map((r) => ({ ...r, price: Number(r.price) }));
    res.json(result);
  } catch (err) {
    _req.log.error({ err }, "Failed to list featured dishes");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;*/
