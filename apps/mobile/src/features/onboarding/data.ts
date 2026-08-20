/**
 * Onboarding option lists (spec §8, screens 03-05). Interest slugs match
 * `categories.slug` in the Supabase seed so selections map directly onto
 * `preferences.interests` without a translation layer.
 */
export const INTEREST_OPTIONS = [
  { slug: "money", label: "المال والاستثمار" },
  { slug: "psychology", label: "النفس والسلوك" },
  { slug: "leadership", label: "القيادة" },
  { slug: "technology", label: "التقنية والذكاء الاصطناعي" },
  { slug: "history", label: "التاريخ" },
  { slug: "self_development", label: "تطوير الذات" },
  { slug: "entrepreneurship", label: "ريادة الأعمال" },
  { slug: "saudi", label: "السعودية" },
] as const;

export const GOAL_OPTIONS = [
  { slug: "career", label: "تطوير مسيرتي" },
  { slug: "money", label: "إدارة أموالي" },
  { slug: "knowledge", label: "توسيع معرفتي" },
  { slug: "startup", label: "بناء مشروع" },
  { slug: "habit", label: "اكتساب عادة تعلم" },
  { slug: "curiosity", label: "الفضول فقط" },
] as const;

export const DAILY_TARGET_OPTIONS = [
  { minutes: 5, label: "5 دقائق" },
  { minutes: 10, label: "10 دقائق" },
  { minutes: 15, label: "15 دقيقة" },
  { minutes: 20, label: "20 دقيقة" },
] as const;

export type InterestSlug = (typeof INTEREST_OPTIONS)[number]["slug"];
export type GoalSlug = (typeof GOAL_OPTIONS)[number]["slug"];
