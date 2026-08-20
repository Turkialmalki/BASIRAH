/**
 * Mirrors `supabase/seed/0001_categories.sql` — category *labels/colors*
 * still live here since Supabase doesn't have a `color_token` UI mapping
 * to fetch. Course *listings* now come from `useOnlineCourses`
 * (Supabase, with `src/content/registry.ts` as its own local fallback) —
 * see `app/(tabs)/explore.tsx`.
 */
export const CATEGORIES = [
  { slug: "money", label: "المال والاستثمار", colorToken: "categoryMoney" },
  { slug: "psychology", label: "النفس والسلوك", colorToken: "categoryPsychology" },
  { slug: "leadership", label: "القيادة", colorToken: "categoryLeadership" },
  { slug: "technology", label: "التقنية والذكاء الاصطناعي", colorToken: "categoryTech" },
  { slug: "history", label: "التاريخ", colorToken: "categoryHistory" },
  { slug: "self_development", label: "تطوير الذات", colorToken: "categoryGrowth" },
  { slug: "entrepreneurship", label: "ريادة الأعمال", colorToken: "categoryEntrepreneurship" },
  { slug: "saudi", label: "السعودية", colorToken: "categorySaudi" },
  { slug: "health", label: "الصحة", colorToken: "categoryGrowth" },
  { slug: "philosophy", label: "الفلسفة", colorToken: "categoryPsychology" },
] as const;
