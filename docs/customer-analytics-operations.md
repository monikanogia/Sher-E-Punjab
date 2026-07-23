# Customer analytics operations

## Required environment configuration

Configure these values only in the deployment secret manager / CI-CD variables:

- `DEVELOPER_ANALYTICS_TOTP_SECRET`: Base32 secret configured in the developer's authenticator app.
- `DEVELOPER_ANALYTICS_SESSION_SECRET`: High-entropy server-only secret used to sign the short-lived developer session.
- `DATABASE_URL`: Protected database connection string.

Never commit any of these values. Use protected, masked CI/CD variables and encrypt production database backups.

## Retention

Customer profile submissions include optional personal data. Run the following scheduled PostgreSQL job daily to delete profile records older than 90 days:

```sql
DELETE FROM customer_menu_visits
WHERE event_type = 'profile_submitted'
  AND created_at < now() - interval '90 days';
```

The application deliberately stores no raw IP addresses. Browser visitor IDs are random UUIDs and user-agent values are stored only as hashes.

## Database deployment

Apply the Drizzle schema before deploying the API:

```sh
pnpm --filter @workspace/db push
```

Review the generated schema change in a non-production environment first. Ensure analytics backups are encrypted and access is restricted.

## Verification checklist

1. Set both developer environment variables.
2. Load `/menu?table=T1`; confirm a welcome modal appears once per 24 hours.
3. Submit an accepted name and numeric phone; confirm the menu header welcomes the customer on revisit.
4. Retry the same QR URL; verify daily QR scan deduplication in the dashboard.
5. Visit `/developer/analytics`; verify invalid codes are rejected and valid TOTP code grants a short-lived session.
6. Verify existing `/admin` login and APIs continue to operate.
