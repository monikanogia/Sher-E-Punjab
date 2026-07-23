import { pgTable, serial, text, integer, boolean, numeric, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const dishesTable = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  halfPrice: numeric("half_price", { precision: 10, scale: 2 }),
  fullPrice: numeric("full_price", { precision: 10, scale: 2 }),
  isVeg: boolean("is_veg").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
}, (table) => [
  index("dishes_category_id_idx").on(table.categoryId),
  index("dishes_available_category_idx").on(table.isAvailable, table.categoryId),
  index("dishes_featured_available_idx").on(table.isFeatured, table.isAvailable),
]);

export const insertDishSchema = createInsertSchema(dishesTable).omit({ id: true });
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishesTable.$inferSelect;


