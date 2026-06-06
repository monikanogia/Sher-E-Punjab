import { pgTable, serial, text, integer, boolean, numeric } from "drizzle-orm/pg-core";
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
});

export const insertDishSchema = createInsertSchema(dishesTable).omit({ id: true });
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishesTable.$inferSelect;




/*import { pgTable, serial, text, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const dishesTable = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isVeg: boolean("is_veg").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
});

export const insertDishSchema = createInsertSchema(dishesTable).omit({ id: true });
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishesTable.$inferSelect;
*/
