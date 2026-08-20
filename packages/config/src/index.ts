import { z } from "zod";

/** Validated environment contract shared by mobile + admin (public/client-safe vars only). */
export const PublicEnv = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  EXPO_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  EXPO_PUBLIC_REVENUECAT_IOS_KEY: z.string().min(1).optional(),
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: z.string().min(1).optional(),
});
export type PublicEnv = z.infer<typeof PublicEnv>;

export function loadPublicEnv(source: Record<string, string | undefined>): PublicEnv {
  return PublicEnv.parse(source);
}
