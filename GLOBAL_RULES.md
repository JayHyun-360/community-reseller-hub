# [Project Name]: Global Rules

## 1. Tech Stack & Environment

- **Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **Backend:** Supabase (PostgreSQL).
- **Auth:** Google OAuth, GitHub OAuth.
- **Deployment:** Vercel (Production) and GitHub (Version Control).

## 2. Security: The "Circuit Breaker" Pattern

- **CRITICAL:** To prevent infinite recursion and 5-second hangs, NEVER write an RLS policy that queries `public.profiles` to check a user's role.
- **MANDATORY:** Always use JWT metadata for role checks: `(auth.jwt() ->> 'role') = '[role_name]'`.
- **STAMPING:** Roles must be synced from the database to `auth.users` metadata via a PostgreSQL trigger.

## 3. Database & Visual Roles

- **Database Roles:** Define application-specific roles in the database. Use role-based access control for permissions.
- **Visual Roles (Trust Tiers):** Optional display-only reputation labels derived from metrics (e.g., trustScore, karma, reputation). Separate from actual database roles.
- **Guest Logic:** Unauthenticated users can explore as guests. Registration offers role-based account creation.

## 4. Development Standards

- Use `@supabase/ssr` for all session management.
- Directory Structure: `@/lib/supabase` for clients, `@/components` for UI, `@/app` for routing.
- Follow the existing component/page structure.
- Use TypeScript for type safety.
