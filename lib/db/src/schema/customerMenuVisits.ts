import { index, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Append-only, privacy-conscious customer menu analytics events. IP addresses
 * are deliberately not stored; browser visitor IDs are random UUIDs.
 */
export const customerMenuVisitsTable = pgTable(
  "customer_menu_visits",
  {
    id: serial("id").primaryKey(),
    visitorId: text("visitor_id").notNull(),
    name: text("name"),
    phone: text("phone"),
    tableId: text("table_id"),
    eventType: text("event_type", {
      enum: ["visit", "qr_scan", "profile_submitted"],
    }).notNull(),
    // Used only for one-event-per-visitor/table/day deduplication. It is set
    // by the server, never accepted from the client.
    eventDay: text("event_day"),
    sessionId: text("session_id"),
    userAgentHash: text("user_agent_hash"),
    sourcePath: text("source_path"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("customer_menu_visits_visitor_created_idx").on(table.visitorId, table.createdAt),
    index("customer_menu_visits_table_created_idx").on(table.tableId, table.createdAt),
    index("customer_menu_visits_event_created_idx").on(table.eventType, table.createdAt),
    uniqueIndex("customer_menu_visits_daily_event_dedup_idx").on(
      table.visitorId,
      table.tableId,
      table.eventType,
      table.eventDay,
    ),
  ],
);

export type CustomerMenuVisit = typeof customerMenuVisitsTable.$inferSelect;
export type InsertCustomerMenuVisit = typeof customerMenuVisitsTable.$inferInsert;
