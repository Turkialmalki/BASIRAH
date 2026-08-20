import type { Chapter } from "@basirah/content-schema";
import { scene, type CourseContent } from "../helpers";

/** "وش يعني التضخم؟" — spec §14, second showcase course. Saudi-flavored examples, MSA for the precise definition. */

let n = 0;
const id = () => {
  n += 1;
  return `b2000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
};

const BASKET_ITEMS = [
  { label: { ar: "خبز" } },
  { label: { ar: "حليب" } },
  { label: { ar: "بيض" } },
  { label: { ar: "بنزين" } },
  { label: { ar: "أرز" } },
];

const chapter1: Chapter = {
  id: id(),
  order: 0,
  title: { ar: "وش يعني التضخم؟" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 4,
      content: { lines: [{ ar: "وش يعني التضخم؟" }], style: "displayLarge" },
      accessibility: { label: "وش يعني التضخم؟" },
    }),
    scene({
      id: id(),
      type: "money",
      duration: 6,
      content: { amountHalalas: 10000, basket: BASKET_ITEMS, caption: { ar: "قبل سنوات... 100 ريال تشتري هذي كلها." } },
      accessibility: { label: "محفظة فيها 100 ريال وسلة فيها خمس سلع كاملة" },
    }),
    scene({
      id: id(),
      type: "money",
      duration: 6,
      content: {
        amountHalalas: 10000,
        basket: BASKET_ITEMS.slice(0, 3),
        caption: { ar: "اليوم... نفس المية ريال تشتري أقل." },
      },
      accessibility: { label: "نفس المية ريال، لكن السلة الآن فيها سلع أقل" },
    }),
    scene({
      id: id(),
      type: "quote",
      duration: 5,
      content: { quote: { ar: "فلوسك ما نقصت...\nلكن الأشياء اللي تقدر تشتريها نقصت." } },
      accessibility: { label: "فلوسك ما نقصت، لكن الأشياء اللي تقدر تشتريها نقصت" },
    }),
  ],
};

const chapter2: Chapter = {
  id: id(),
  order: 1,
  title: { ar: "التعريف الدقيق" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 7,
      content: {
        lines: [
          { ar: "التضخّم هو ارتفاعٌ عامٌّ ومستمرٌّ في أسعار السلع والخدمات، يقلّل القوة الشرائية للنقود بمرور الوقت." },
        ],
        style: "heading2",
      },
      accessibility: { label: "التضخم هو ارتفاع عام ومستمر في أسعار السلع والخدمات، يقلل القوة الشرائية للنقود بمرور الوقت" },
    }),
    scene({
      id: id(),
      type: "barChart",
      duration: 7,
      content: {
        title: { ar: "مؤشر الأسعار عبر السنوات (100 = مستوى الأساس)" },
        bars: [
          { label: { ar: "2015" }, value: 100 },
          { label: { ar: "2018" }, value: 112 },
          { label: { ar: "2021" }, value: 128 },
          { label: { ar: "2024" }, value: 145 },
        ],
      },
      accessibility: { label: "رسم بياني يوضح ارتفاع مؤشر الأسعار من 100 عام 2015 إلى 145 عام 2024" },
    }),
  ],
};

const salaryScene = scene({
  id: id(),
  type: "slider",
  duration: 8,
  content: { prompt: { ar: "كم راتبك الشهري؟" }, min: 2000, max: 30000, step: 500, defaultValue: 8000, unit: " ريال" },
  interaction: { kind: "slider", required: true },
  accessibility: { label: "منزلق لاختيار الراتب الشهري" },
});
const rateScene = scene({
  id: id(),
  type: "slider",
  duration: 8,
  content: { prompt: { ar: "توقع معدل التضخم السنوي" }, min: 1, max: 10, step: 1, defaultValue: 3, unit: "%" },
  interaction: { kind: "slider", required: true },
  accessibility: { label: "منزلق لاختيار معدل التضخم السنوي المتوقع" },
});
const yearsScene = scene({
  id: id(),
  type: "slider",
  duration: 8,
  content: { prompt: { ar: "بعد كم سنة؟" }, min: 1, max: 20, step: 1, defaultValue: 10, unit: " سنة" },
  interaction: { kind: "slider", required: true },
  accessibility: { label: "منزلق لاختيار عدد السنوات" },
});

const chapter3: Chapter = {
  id: id(),
  order: 2,
  title: { ar: "جرّب المحاكي" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 4,
      content: { lines: [{ ar: "جرّب بنفسك." }], style: "displayLarge" },
      accessibility: { label: "جرب بنفسك" },
    }),
    salaryScene,
    rateScene,
    yearsScene,
    scene({
      id: id(),
      type: "money",
      duration: 8,
      content: {
        amountHalalas: 800000,
        basket: [
          { label: { ar: "إيجار" } },
          { label: { ar: "أكل" } },
          { label: { ar: "مواصلات" } },
          { label: { ar: "تسوق" } },
          { label: { ar: "ادخار" } },
          { label: { ar: "ترفيه" } },
        ],
        itemsLostAtFullErosion: 6,
        computedFrom: {
          salarySceneId: salaryScene.id,
          inflationRateSceneId: rateScene.id,
          yearsSceneId: yearsScene.id,
        },
        caption: { ar: "هذي القوة الشرائية الحقيقية لراتبك، بنفس الفترة والمعدل اللي اخترتهم." },
      },
      accessibility: { label: "القوة الشرائية الحقيقية للراتب بعد المدة والمعدل اللي اخترهم المستخدم" },
    }),
  ],
};

const chapter4: Chapter = {
  id: id(),
  order: 3,
  title: { ar: "اختبر فهمك" },
  scenes: [
    scene({
      id: id(),
      type: "multipleChoice",
      duration: 8,
      content: {
        question: { ar: "التضخم يعني إن..." },
        options: [
          { id: "a", label: { ar: "أسعار الأشياء ترتفع بمرور الوقت" } },
          { id: "b", label: { ar: "راتبك ينقص فعلياً كل شهر" } },
          { id: "c", label: { ar: "البنوك تطبع فلوس أقل" } },
        ],
        correctOptionId: "a",
        correctFeedback: { ar: "بالضبط 👏 الأسعار ترتفع، وقوتك الشرائية تنخفض." },
        incorrectFeedback: { ar: "قريب — التضخم يعني ارتفاع الأسعار عموماً، مو نقص الراتب نفسه." },
      },
      interaction: { kind: "choice", required: true },
      accessibility: { label: "سؤال: التضخم يعني إن...؟" },
    }),
    scene({
      id: id(),
      type: "completion",
      duration: 4,
      content: { heading: { ar: "تم 👌" }, subheading: { ar: "صرت تفهم التضخم أفضل من قبل." }, statsShown: ["minutes"] },
      accessibility: { label: "تهانينا، أكملت درس وش يعني التضخم" },
    }),
  ],
};

export const WHAT_IS_INFLATION_COURSE: CourseContent = {
  slug: "what-is-inflation",
  title: "وش يعني التضخم؟",
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
