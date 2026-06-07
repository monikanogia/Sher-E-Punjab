import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("restaurant_settings", {
  id: serial("id").primaryKey(),
  restaurantName: text("restaurant_name").notNull().default("My Restaurant"),
  logoUrl: text("logo_url"),
  whatsappNumber: text("whatsapp_number").notNull().default("919999999999"),
  openingHours: text("opening_hours"),
  isOpen: boolean("is_open").notNull().default(true),
  accentColor: text("accent_color"),
  upiId: text("upi_id"),              // ← ADD THIS
  upiQrUrl: text("upi_qr_url"),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type RestaurantSettings = typeof settingsTable.$inferSelect;
