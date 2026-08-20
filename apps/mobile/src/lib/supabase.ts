import { createBasirahClient } from "@basirah/database";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * `null` when the app hasn't been configured with a Supabase project yet
 * (no `.env` / `EXPO_PUBLIC_SUPABASE_URL`). Every caller checks for this
 * and falls back to local content/mock data instead of crashing — see
 * `useOnlineCourses`, the lesson route, and `useSession`. This is what
 * lets the app run standalone during development before a backend
 * exists, and is also the seam a hosted Supabase project drops into: set
 * the two env vars and every one of those fallbacks starts hitting real
 * data with no code changes.
 */
export const supabase: SupabaseClient | null = url && anonKey ? createBasirahClient(url, anonKey) : null;
