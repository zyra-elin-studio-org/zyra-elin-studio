# Plan

## What I will fix

1. Repair the admin auth flow so `/admin` only decides access after the role check is fully finished.
2. Replace the fragile client-only admin lookup with a more reliable server-backed role check path.
3. Reset the admin account password to `MyWeb@1234`.
4. Validate the full sign-in path after the changes.

## Why the current setup is failing

- Your backend is healthy.
- The admin user exists and already has the `admin` role.
- Login itself is succeeding.
- The current failure is in the app’s admin authorization flow after login.
- The `useAuth` hook currently mixes session hydration and async role lookup in a way that can leave `/admin` seeing `isAdmin = false` at the wrong moment.
- The `/admin` route also performs navigation directly during render, which is brittle and can produce incorrect access outcomes.

## Implementation steps

### 1) Harden auth state loading
- Update `src/hooks/useAuth.tsx` so loading stays true until both session restore and admin-role resolution are complete.
- Remove timing-sensitive behavior around `setTimeout` and make role loading deterministic.
- Ensure auth state changes cannot briefly mark a real admin as non-admin during first load.

### 2) Fix the admin route guard
- Update `src/routes/admin.tsx` so it does not navigate during render.
- Make the route wait for auth resolution cleanly before showing either the dashboard or the access denied state.
- Keep the current UI, only fix the logic.

### 3) Add a trustworthy admin check path
- Introduce a server-backed admin verification using the authenticated user context instead of relying only on a browser-side table read.
- This avoids silent client-side failures and makes the admin decision more reliable across refreshes and deployments.
- I will also check `src/start.ts` wiring so authenticated server calls can carry the signed-in user token correctly.

### 4) Reset the admin password
- Set the initial password for `palash.chowdury02@gmail.com` to `MyWeb@1234`.
- Keep the account ready for immediate sign-in.

### 5) Validate end to end
- Confirm the admin email can log in.
- Confirm the role check returns admin.
- Confirm `/admin` opens the dashboard instead of “Access denied”.

## Technical details

Files likely to change:
- `src/hooks/useAuth.tsx`
- `src/routes/admin.tsx`
- `src/start.ts`
- one small new server function file for admin verification

Backend change:
- reset password for the existing admin user only

## Expected result

After this, you should be able to sign in with:
- Email: `palash.chowdury02@gmail.com`
- Password: `MyWeb@1234`

And the admin dashboard should open normally instead of showing “Access denied”.
