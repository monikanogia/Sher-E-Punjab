-- Run this SQL directly in Neon database console
-- https://console.neon.tech/

-- Ensure customer_menu_visits table exists with all required columns
CREATE TABLE IF NOT EXISTS customer_menu_visits (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  table_id TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('visit', 'qr_scan', 'profile_submitted')),
  event_day TEXT,
  session_id TEXT,
  user_agent_hash TEXT,
  source_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS customer_menu_visits_visitor_created_idx 
  ON customer_menu_visits(visitor_id, created_at);

CREATE INDEX IF NOT EXISTS customer_menu_visits_table_created_idx 
  ON customer_menu_visits(table_id, created_at);

CREATE INDEX IF NOT EXISTS customer_menu_visits_event_created_idx 
  ON customer_menu_visits(event_type, created_at);

-- Unique index for deduplication (allows NULL values)
CREATE UNIQUE INDEX IF NOT EXISTS customer_menu_visits_daily_event_dedup_idx 
  ON customer_menu_visits(visitor_id, table_id, event_type, event_day)
  WHERE event_day IS NOT NULL;

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'customer_menu_visits'
ORDER BY ordinal_position;

-- Test insert (replace with actual values)
INSERT INTO customer_menu_visits (visitor_id, name, phone, table_id, event_type, user_agent_hash)
VALUES ('test-uuid-123', 'Test User', '1234567890', '1', 'profile_submitted', 'test-hash')
RETURNING *;

-- Check if data was inserted
SELECT * FROM customer_menu_visits WHERE event_type = 'profile_submitted' ORDER BY created_at DESC LIMIT 5;
