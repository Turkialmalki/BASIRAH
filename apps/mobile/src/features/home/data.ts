/**
 * Placeholder home-feed content. Structurally mirrors what `courses` +
 * `categories` queries will return once Supabase is wired (Phase 5) and
 * the 3 showcase courses exist (Phase 4) — titles below are the ones this
 * build command specifies for those courses; everything else here is
 * representative filler, clearly not final catalog content.
 */
export type HomeCourseCard = {
  slug: string;
  title: string;
  categoryLabel: string;
  minutes: number;
};

export const DAILY_BASIRAH: HomeCourseCard = {
  slug: "power-of-small-habits",
  title: "قوة العادات الصغيرة",
  categoryLabel: "تطوير الذات",
  minutes: 8,
};

export const CURATED_FOR_YOU: HomeCourseCard[] = [
  { slug: "what-is-inflation", title: "وش يعني التضخم؟", categoryLabel: "المال", minutes: 6 },
  { slug: "vision-2030", title: "كيف تعمل رؤية السعودية 2030؟", categoryLabel: "السعودية", minutes: 9 },
  { slug: "power-of-small-habits", title: "قوة العادات الصغيرة", categoryLabel: "تطوير الذات", minutes: 8 },
];

export const SECTIONS: { title: string; items: HomeCourseCard[] }[] = [
  {
    title: "الأكثر تعلماً اليوم",
    items: [
      { slug: "what-is-inflation", title: "وش يعني التضخم؟", categoryLabel: "المال", minutes: 6 },
      { slug: "vision-2030", title: "رؤية السعودية 2030", categoryLabel: "السعودية", minutes: 9 },
    ],
  },
  {
    title: "كتب في 10 دقائق",
    items: [
      { slug: "power-of-small-habits", title: "قوة العادات الصغيرة", categoryLabel: "تطوير الذات", minutes: 8 },
    ],
  },
  {
    title: "افهم المال",
    items: [
      { slug: "what-is-inflation", title: "وش يعني التضخم؟", categoryLabel: "المال", minutes: 6 },
    ],
  },
  {
    title: "افهم السعودية",
    items: [
      { slug: "vision-2030", title: "كيف تعمل رؤية السعودية 2030؟", categoryLabel: "السعودية", minutes: 9 },
    ],
  },
  {
    title: "طوّر مسيرتك",
    items: [
      { slug: "power-of-small-habits", title: "قوة العادات الصغيرة", categoryLabel: "تطوير الذات", minutes: 8 },
    ],
  },
];
