# Fix Customer Profile Submission Issue

## Problem
Customer profile submission failing with error: "We could not save your details"

## Root Cause Analysis

### Backend Validation (analytics.ts)
```typescript
const profileSchema = z.object({
  visitorId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,19}$/),
  tableId: z.string().trim().min(1).max(100).optional(),
});
```

### Phone Normalization
```typescript
const phone = normalizePhone(parsed.data.phone); // Removes non-digits
if (phone.length < 8 || phone.length > 15) {
  return 400 error
}
```

### Test Case
- Input: `7229991661` (10 digits)
- After normalization: `7229991661` (10 digits)
- Validation: Should PASS (8-15 digits)

## Possible Issues

### 1. Database Table Missing/Outdated
The `customer_menu_visits` table might not exist or is missing columns.

**Solution:**
```bash
cd lib/db
pnpm drizzle-kit push
```

### 2. Unique Constraint Violation
The unique index might be blocking duplicate submissions:
```sql
UNIQUE INDEX customer_menu_visits_daily_event_dedup_idx 
  ON (visitor_id, table_id, event_type, event_day)
```

For `profile_submitted` events, `event_day` is NULL, so duplicates should be allowed.

### 3. CORS/Network Issue
Frontend on Vercel, Backend on Render - CORS might be blocking.

**Check backend CORS config:**
```typescript
app.use(cors({ origin: true, credentials: true }));
```

## Debug Steps

### Step 1: Check Render Logs
```
1. Go to Render Dashboard
2. Select service
3. View Logs
4. Look for:
   - "Invalid profile submission"
   - "Customer profile submission failed"
   - Database errors
```

### Step 2: Test Backend Directly
```bash
curl -X POST https://sher-e-punjab-1aqj.onrender.com/api/analytics/profile \
  -H "Content-Type: application/json" \
  -d '{
    "visitorId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Kartik",
    "phone": "7229991661",
    "tableId": "1"
  }'
```

**Expected Response:**
```json
{"ok": true}
```

**If 400 Error:**
```json
{"error": "Invalid request body", "details": [...]}
```

**If 500 Error:**
```json
{"error": "Unable to save profile"}
```

### Step 3: Check Database Schema
```sql
-- Connect to Neon database
-- Run:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'customer_menu_visits';
```

**Required columns:**
- id (serial)
- visitor_id (text, NOT NULL)
- name (text, nullable)
- phone (text, nullable)
- table_id (text, nullable)
- event_type (text, NOT NULL)
- event_day (text, nullable)
- user_agent_hash (text, nullable)
- created_at (timestamp, NOT NULL)

## Quick Fix

### Option 1: Run Migration on Render
```bash
# Add to Render Build Command:
cd ../.. && pnpm install && cd lib/db && pnpm drizzle-kit push && cd ../../artifacts/api-server && pnpm run build
```

### Option 2: Manual Database Fix
```sql
-- Connect to Neon database
-- Ensure table exists:
CREATE TABLE IF NOT EXISTS customer_menu_visits (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  table_id TEXT,
  event_type TEXT NOT NULL,
  event_day TEXT,
  session_id TEXT,
  user_agent_hash TEXT,
  source_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes:
CREATE INDEX IF NOT EXISTS customer_menu_visits_visitor_created_idx 
  ON customer_menu_visits(visitor_id, created_at);

CREATE INDEX IF NOT EXISTS customer_menu_visits_table_created_idx 
  ON customer_menu_visits(table_id, created_at);

CREATE INDEX IF NOT EXISTS customer_menu_visits_event_created_idx 
  ON customer_menu_visits(event_type, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS customer_menu_visits_daily_event_dedup_idx 
  ON customer_menu_visits(visitor_id, table_id, event_type, event_day);
```

### Option 3: Add Better Error Handling
Update frontend to show specific error:

```typescript
// In Menu.tsx handleProfileSubmit:
try {
  await submitProfile(name, phone, tableId);
  // success
} catch (error) {
  if (error.message.includes('400')) {
    setProfileError("Invalid phone number format. Please enter 8-20 digits.");
  } else if (error.message.includes('429')) {
    setProfileError("Too many attempts. Please wait a minute and try again.");
  } else {
    setProfileError("We could not save your details. You can still close this form and view the menu.");
  }
}
```

## Testing Checklist

- [ ] Backend endpoint responds to curl test
- [ ] Database table exists with all columns
- [ ] Indexes are created
- [ ] CORS allows Vercel origin
- [ ] Render logs show no errors
- [ ] Frontend successfully submits profile
- [ ] Data appears in database
- [ ] Data appears in developer analytics

## Next Steps

1. Check Render logs for exact error
2. Test backend endpoint directly with curl
3. Verify database schema
4. Run migration if needed
5. Test from frontend again
