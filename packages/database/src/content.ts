import type { SupabaseClient } from "@supabase/supabase-js";
import { SceneSchema, type Chapter } from "@basirah/content-schema";

export interface PublishedCourseSummary {
  id: string;
  slug: string;
  titleAr: string;
  categorySlug: string | null;
  estimatedMinutes: number;
}

/** Published courses for Home/Library — replaces the local mock lists in each feature's data.ts. */
export async function fetchPublishedCourses(client: SupabaseClient): Promise<PublishedCourseSummary[]> {
  const { data, error } = await client
    .from("courses")
    .select("id, slug, title_ar, estimated_minutes, categories(slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    titleAr: row.title_ar as string,
    // Without generated DB types, Supabase can't know `courses -> categories`
    // is a to-one join, but at runtime (confirmed against the local
    // instance) it returns a single object, not an array.
    categorySlug: (row.categories as unknown as { slug: string } | null)?.slug ?? null,
    estimatedMinutes: row.estimated_minutes as number,
  }));
}

export interface CourseWithChapters {
  id: string;
  slug: string;
  titleAr: string;
  chapters: Chapter[];
}

/**
 * Loads a full course by slug — chapters + scenes, with every scene
 * re-validated against `SceneSchema` on the way out (defensive: a scene
 * edited directly in Studio, or corrupted in transit, fails loudly here
 * instead of crashing the renderer on an unrecognized shape).
 */
export async function fetchCourseWithChapters(
  client: SupabaseClient,
  slug: string
): Promise<CourseWithChapters | null> {
  const { data: course, error: courseError } = await client
    .from("courses")
    .select("id, slug, title_ar")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (courseError) throw courseError;
  if (!course) return null;

  const { data: chapterRows, error: chapterError } = await client
    .from("chapters")
    .select("id, order, title_ar, scenes(id, order, payload)")
    .eq("course_id", course.id)
    .order("order", { ascending: true });
  if (chapterError) throw chapterError;

  const chapters: Chapter[] = (chapterRows ?? []).map((ch) => {
    const scenes = ((ch.scenes as { id: string; order: number; payload: unknown }[]) ?? [])
      .sort((a, b) => a.order - b.order)
      .map((s) => SceneSchema.parse(s.payload));
    return { id: ch.id as string, order: ch.order as number, title: { ar: ch.title_ar as string }, scenes };
  });

  return { id: course.id as string, slug: course.slug as string, titleAr: course.title_ar as string, chapters };
}
