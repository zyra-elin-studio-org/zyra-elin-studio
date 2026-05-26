## Plan

1. Add a database migration to restore API access to the `user_roles` table.
   - Grant signed-in users permission to read their own roles.
   - Grant full backend access for admin/server operations.
   - Keep existing row-level security rules in place.

2. Harden the frontend auth role check.
   - Update the auth hook so it handles role-query errors explicitly instead of silently treating them as “not admin”.
   - Ensure loading only finishes after the admin-role lookup completes.

3. Validate the admin flow end to end.
   - Confirm `palash.chowdury02@gmail.com` still has the `admin` role.
   - Re-test login and `/admin` access so the page opens instead of showing “Access denied”.

## Root cause

The admin account already has the `admin` role in the database, but the app currently cannot read the `user_roles` table through the normal app API because that table is missing explicit grants. The UI then falls back to `isAdmin = false`, which is why you are signed in but still blocked.

## Technical details

- Table affected: `public.user_roles`
- Current problem: row-level rules exist, but API grants are missing
- App file likely to update: `src/hooks/useAuth.tsx`
- Expected result after fix: successful sign-in + admin dashboard access for your email