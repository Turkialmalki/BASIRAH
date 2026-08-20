/**
 * Thin Supabase client factory shared by mobile + admin. Generated row
 * types (`generated.types.ts`) are produced by `pnpm gen:types` once the
 * Supabase project is linked; do not hand-edit that file.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createBasirahClient(url: string, anonKey: string): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "createBasirahClient: missing Supabase url/anonKey — check EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}
