import { useQuery } from "@tanstack/react-query";
import { fetchPublishedCourses, fetchCourseWithChapters, type PublishedCourseSummary, type CourseWithChapters } from "@basirah/database";
import { supabase } from "../lib/supabase";
import { COURSES } from "../content/registry";

/** Published courses from Supabase; falls back to the local registry (as summaries) when no backend is configured or the query fails. */
export function useOnlineCourses() {
  return useQuery<PublishedCourseSummary[]>({
    queryKey: ["courses", "published"],
    queryFn: async () => {
      if (!supabase) throw new Error("no supabase client configured");
      return fetchPublishedCourses(supabase);
    },
    // local content always has real, validated data — a good, honest fallback rather than an empty state.
    placeholderData: Object.values(COURSES).map((c) => ({
      id: c.slug,
      slug: c.slug,
      titleAr: c.title,
      categorySlug: null,
      estimatedMinutes: c.chapters.reduce((n, ch) => n + ch.scenes.reduce((m, s) => m + s.duration, 0), 0) / 60,
    })),
    retry: false,
  });
}

/** A single course's chapters/scenes — Supabase first, local registry fallback. */
export function useOnlineCourse(slug: string | undefined) {
  return useQuery<CourseWithChapters | null>({
    queryKey: ["course", slug],
    queryFn: async () => {
      if (!slug) return null;
      if (supabase) {
        const fromDb = await fetchCourseWithChapters(supabase, slug);
        if (fromDb) return fromDb;
      }
      const local = COURSES[slug];
      return local ? { id: local.slug, slug: local.slug, titleAr: local.title, chapters: local.chapters } : null;
    },
    enabled: !!slug,
    retry: false,
  });
}
