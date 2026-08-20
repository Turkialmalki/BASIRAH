import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Typed query/mutation helpers used by the mobile app's progress-writing
 * paths (spec §5 Progress, §20 Streak, §18 Saved Insights). Each function
 * takes the caller's Supabase client so it works the same whether the
 * caller is signed in normally or as a guest (anonymous sign-in, spec
 * §27) — RLS's `auth.uid() = user_id` policies do the actual gatekeeping.
 */

export async function upsertSceneProgress(
  client: SupabaseClient,
  params: { userId: string; sceneId: string; interactionResponse?: unknown }
) {
  return client.from("user_scene_progress").upsert(
    {
      user_id: params.userId,
      scene_id: params.sceneId,
      completed_at: new Date().toISOString(),
      interaction_response: params.interactionResponse ?? null,
    },
    { onConflict: "user_id,scene_id" }
  );
}

export async function upsertCourseProgress(
  client: SupabaseClient,
  params: { userId: string; courseId: string; status: "in_progress" | "completed"; lastChapterId?: string }
) {
  const now = new Date().toISOString();
  return client.from("user_course_progress").upsert(
    {
      user_id: params.userId,
      course_id: params.courseId,
      status: params.status,
      last_chapter_id: params.lastChapterId ?? null,
      started_at: now,
      completed_at: params.status === "completed" ? now : null,
      updated_at: now,
    },
    { onConflict: "user_id,course_id" }
  );
}

/**
 * Advances the streak counter at most once per calendar day. Reads the
 * existing row first (rather than a blind upsert) because "current streak"
 * depends on whether today is a continuation (yesterday), a fresh start
 * (gap), or a no-op (already logged today) — logic a single upsert can't
 * express.
 */
export async function touchStreak(client: SupabaseClient, params: { userId: string; minutesLearned: number }) {
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await client
    .from("streaks")
    .select("current_streak_days, longest_streak_days, last_active_date, total_minutes_learned, total_lessons_completed")
    .eq("user_id", params.userId)
    .maybeSingle();

  if (!existing) {
    return client.from("streaks").insert({
      user_id: params.userId,
      current_streak_days: 1,
      longest_streak_days: 1,
      last_active_date: today,
      total_minutes_learned: params.minutesLearned,
      total_lessons_completed: 1,
    });
  }

  if (existing.last_active_date === today) {
    // already logged today — just accumulate minutes, don't bump the streak
    return client
      .from("streaks")
      .update({ total_minutes_learned: existing.total_minutes_learned + params.minutesLearned, updated_at: new Date().toISOString() })
      .eq("user_id", params.userId);
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const isConsecutive = existing.last_active_date === yesterday;
  const nextStreak = isConsecutive ? existing.current_streak_days + 1 : 1;

  return client
    .from("streaks")
    .update({
      current_streak_days: nextStreak,
      longest_streak_days: Math.max(nextStreak, existing.longest_streak_days),
      last_active_date: today,
      total_minutes_learned: existing.total_minutes_learned + params.minutesLearned,
      total_lessons_completed: existing.total_lessons_completed + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", params.userId);
}

export async function insertSavedInsight(
  client: SupabaseClient,
  params: { userId: string; kind: "quote" | "visual" | "lesson"; sceneId?: string; courseId?: string; snapshot: unknown }
) {
  return client.from("saved_insights").insert({
    user_id: params.userId,
    kind: params.kind,
    scene_id: params.sceneId ?? null,
    course_id: params.courseId ?? null,
    snapshot: params.snapshot,
  });
}
