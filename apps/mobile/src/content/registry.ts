import type { CourseContent } from "./helpers";
import { POWER_OF_SMALL_HABITS_COURSE } from "./courses/powerOfSmallHabits";
import { WHAT_IS_INFLATION_COURSE } from "./courses/whatIsInflation";
import { VISION_2030_COURSE } from "./courses/vision2030";

/**
 * In-app course registry, keyed by slug — stands in for a `courses` +
 * `chapters` + `scenes` Supabase query until Phase 5 wires real data
 * loading. The 3 showcase courses from spec §13-15 live here in full.
 */
export const COURSES: Record<string, CourseContent> = {
  [POWER_OF_SMALL_HABITS_COURSE.slug]: POWER_OF_SMALL_HABITS_COURSE,
  [WHAT_IS_INFLATION_COURSE.slug]: WHAT_IS_INFLATION_COURSE,
  [VISION_2030_COURSE.slug]: VISION_2030_COURSE,
};

export function getCourseBySlug(slug: string | undefined): CourseContent | undefined {
  if (!slug) return undefined;
  return COURSES[slug];
}
