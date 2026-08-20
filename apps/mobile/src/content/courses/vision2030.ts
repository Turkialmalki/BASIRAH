import type { Chapter } from "@basirah/content-schema";
import { scene, type CourseContent } from "../helpers";

/**
 * "كيف تعمل رؤية السعودية 2030؟" — spec §15, third showcase course.
 * Informational, not persuasive: general public facts (launch year, the
 * three official pillars, publicly known flagship projects) plus one
 * explicitly-labeled illustrative (not official-statistics) chart. Sources
 * cited in `sources` below, mirroring `content_rights`/`sources` on the
 * `courses` table (spec §25/§26).
 */

let n = 0;
const id = () => {
  n += 1;
  return `c3000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
};

const chapter1: Chapter = {
  id: id(),
  order: 0,
  title: { ar: "ليش رؤية 2030؟" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 4,
      content: { lines: [{ ar: "كيف تعمل رؤية السعودية 2030؟" }], style: "displayLarge" },
      accessibility: { label: "كيف تعمل رؤية السعودية 2030؟" },
    }),
    scene({
      id: id(),
      type: "textReveal",
      duration: 7,
      content: {
        lines: [{ ar: "رؤية السعودية 2030 خطة وطنية أُطلقت عام 2016، هدفها تنويع مصادر الدخل وتقليل اعتماد الاقتصاد على النفط." }],
        style: "heading2",
      },
      accessibility: { label: "رؤية السعودية 2030 خطة وطنية أطلقت عام 2016 لتنويع مصادر الدخل وتقليل الاعتماد على النفط" },
    }),
    scene({
      id: id(),
      type: "timeline",
      duration: 8,
      content: {
        title: { ar: "أهم المحطات" },
        events: [
          { date: "2016", label: { ar: "إطلاق رؤية السعودية 2030" } },
          { date: "2017", label: { ar: "الإعلان عن مشروع نيوم" } },
          { date: "2021", label: { ar: "إطلاق برنامج التخصيص لتوسيع دور القطاع الخاص" } },
          { date: "2030", label: { ar: "الهدف الزمني لتحقيق أهداف الرؤية" } },
        ],
      },
      accessibility: { label: "خط زمني لأهم محطات رؤية السعودية 2030 من 2016 إلى 2030" },
    }),
  ],
};

const chapter2: Chapter = {
  id: id(),
  order: 1,
  title: { ar: "ثلاثة محاور" },
  scenes: [
    scene({
      id: id(),
      type: "stack",
      duration: 7,
      content: {
        title: { ar: "الرؤية تقوم على ثلاثة محاور رئيسية" },
        items: [{ label: { ar: "مجتمع حيوي" } }, { label: { ar: "اقتصاد مزدهر" } }, { label: { ar: "وطن طموح" } }],
      },
      accessibility: { label: "ثلاثة محاور رئيسية: مجتمع حيوي، اقتصاد مزدهر، وطن طموح" },
    }),
    scene({
      id: id(),
      type: "saudiMap",
      duration: 8,
      content: {
        title: { ar: "مشاريع كبرى حول المملكة" },
        highlightedRegions: ["tabuk", "riyadh", "makkah", "eastern"],
        markers: [
          { region: "tabuk", label: { ar: "نيوم" } },
          { region: "riyadh", label: { ar: "مشروع القدية" } },
          { region: "makkah", label: { ar: "توسعة جدة" } },
          { region: "eastern", label: { ar: "توسعة الصناعات" } },
        ],
      },
      accessibility: { label: "خريطة توضح مواقع مشاريع كبرى: نيوم في تبوك، القدية في الرياض، توسعة جدة في مكة، وتوسعة الصناعات في المنطقة الشرقية" },
    }),
  ],
};

const chapter3: Chapter = {
  id: id(),
  order: 2,
  title: { ar: "تنويع الاقتصاد" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 6,
      content: { lines: [{ ar: "جزء كبير من الرؤية يركّز على قطاعات غير نفطية." }], style: "heading2" },
      accessibility: { label: "جزء كبير من الرؤية يركز على قطاعات غير نفطية" },
    }),
    scene({
      id: id(),
      type: "barChart",
      duration: 7,
      content: {
        title: { ar: "أمثلة على قطاعات مستهدفة بالتنويع (تمثيل توضيحي وليس بيانات رسمية)" },
        bars: [
          { label: { ar: "السياحة" }, value: 70 },
          { label: { ar: "الترفيه" }, value: 60 },
          { label: { ar: "التقنية" }, value: 80 },
          { label: { ar: "الصناعة" }, value: 75 },
        ],
      },
      accessibility: { label: "رسم توضيحي غير رسمي لأمثلة على قطاعات مستهدفة بالتنويع الاقتصادي" },
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
        question: { ar: "وش الهدف الأساسي من رؤية السعودية 2030؟" },
        options: [
          { id: "a", label: { ar: "تنويع مصادر الاقتصاد وتقليل الاعتماد على النفط" } },
          { id: "b", label: { ar: "زيادة إنتاج النفط" } },
          { id: "c", label: { ar: "تقليل عدد السكان" } },
        ],
        correctOptionId: "a",
        correctFeedback: { ar: "بالضبط 👏 التنويع الاقتصادي هو المحور الأساسي." },
        incorrectFeedback: { ar: "الصحيح: الهدف الأساسي هو تنويع الاقتصاد وتقليل الاعتماد على النفط." },
      },
      interaction: { kind: "choice", required: true },
      accessibility: { label: "سؤال: وش الهدف الأساسي من رؤية السعودية 2030؟" },
    }),
    scene({
      id: id(),
      type: "completion",
      duration: 4,
      content: { heading: { ar: "تم 👌" }, subheading: { ar: "صار عندك فكرة أوضح عن رؤية 2030." }, statsShown: ["minutes"] },
      accessibility: { label: "تهانينا، أكملت درس رؤية السعودية 2030" },
    }),
  ],
};

export const VISION_2030_COURSE: CourseContent = {
  slug: "vision-2030",
  title: "كيف تعمل رؤية السعودية 2030؟",
  chapters: [chapter1, chapter2, chapter3, chapter4],
  sources: [
    { title: "الموقع الرسمي لرؤية السعودية 2030", url: "https://www.vision2030.gov.sa" },
  ],
};
