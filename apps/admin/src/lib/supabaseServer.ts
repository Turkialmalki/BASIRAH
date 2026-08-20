import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — server-side only (`server-only` import
 * throws at build time if any client component tries to pull this in).
 * Every admin mutation runs through this; the service role bypasses RLS,
 * which is why write access to the CMS is gated by the admin auth check
 * in `auth.ts`/`middleware.ts` instead of RLS policies.
 */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — set them in apps/admin/.env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
