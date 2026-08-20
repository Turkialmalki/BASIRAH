/** Mirrors `supabase/seed/0001_categories.sql` — swap for a live query once Supabase is wired (Phase 5). */
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

export const LIBRARY_COURSES = [
  { slug: "power-of-small-habits", title: "قوة العادات الصغيرة", categorySlug: "self_development", minutes: 8 },
  { slug: "what-is-inflation", title: "وش يعني التضخم؟", categorySlug: "money", minutes: 6 },
  { slug: "vision-2030", title: "كيف تعمل رؤية السعودية 2030؟", categorySlug: "saudi", minutes: 9 },
] as const;
