import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tablesTable = pgTable("restaurant_tables", {
  id: serial("id").primaryKey(),
  tableNumber: text("table_number").notNull().unique(),
  label: text("label"),
});

export const insertTableSchema = createInsertSchema(tablesTable).omit({ id: true });
export type InsertTable = z.infer<typeof insertTableSchema>;
export type RestaurantTable = typeof tablesTable.$inferSelect;
