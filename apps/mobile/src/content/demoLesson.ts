import type { Chapter, Scene } from "@basirah/content-schema";
import { scene } from "./helpers";

/**
 * A short engine smoke-test lesson — proves `LessonPlayer` plays a real
 * `Chapter[]` end to end across a representative spread of scene types.
 * This is NOT the "قوة العادات الصغيرة" showcase course from spec §13 —
 * that full production lesson (all 6 chapters, bespoke visual metaphors,
 * the 2→30 minute friction slider, saved commitment + reminder) is built
 * in Phase 4. Every object here is validated against `SceneSchema` at
 * module load so a malformed scene fails immediately, not at render time.
 */

const scenes: Scene[] = [
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000001",
    type: "textReveal",
    duration: 6,
    content: {
      lines: [{ ar: "العادة ما تبدأ بقرار كبير." }, { ar: "تبدأ بفعل صغير... يتكرر." }],
      style: "displayLarge",
    },
    accessibility: { label: "العادة ما تبدأ بقرار كبير، تبدأ بفعل صغير يتكرر." },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000002",
    type: "visualMetaphor",
    duration: 8,
    content: {
      caption: { ar: "القفزة الكبيرة تتعبك... السلالم الصغيرة توصلك." },
      metaphorKey: "huge-jump-to-stairs",
      asset: { kind: "illustration", ref: "placeholder", altText: "قفزة كبيرة تتحول إلى سلالم صغيرة" },
    },
    accessibility: { label: "قفزة كبيرة تتحول إلى سلالم صغيرة — رمز للتغيير التدريجي" },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000003",
    type: "numberCounter",
    duration: 5,
    content: { from: 0, to: 1, suffix: "%", caption: { ar: "تحسّن بسيط كل يوم... يتراكم." } },
    accessibility: { label: "الرقم يتزايد من صفر إلى واحد بالمئة" },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000004",
    type: "comparison",
    duration: 6,
    content: {
      left: { label: { ar: "تغيير كبير فجأة" } },
      right: { label: { ar: "تحسّن صغير يومي" } },
      caption: { ar: "الاتجاه أهم من السرعة." },
    },
    accessibility: { label: "مقارنة بين التغيير الكبير المفاجئ والتحسن الصغير اليومي" },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000005",
    type: "slider",
    duration: 10,
    content: {
      prompt: { ar: "كم دقيقة تقدر تبدأ فيها اليوم؟" },
      min: 2,
      max: 30,
      step: 1,
      defaultValue: 2,
      unit: " د",
    },
    interaction: { kind: "slider", required: true },
    accessibility: { label: "منزلق لاختيار عدد الدقائق من 2 إلى 30" },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000006",
    type: "multipleChoice",
    duration: 8,
    content: {
      question: { ar: "وش أهم من حجم الخطوة؟" },
      options: [
        { id: "a", label: { ar: "التكرار" } },
        { id: "b", label: { ar: "الحماس الأولي" } },
        { id: "c", label: { ar: "المكان" } },
      ],
      correctOptionId: "a",
      correctFeedback: { ar: "بالضبط 👏 التكرار هو اللي يبني العادة." },
      incorrectFeedback: { ar: "قريب — لكن التكرار هو اللي يثبّت العادة، مو الحماس." },
    },
    interaction: { kind: "choice", required: true },
    accessibility: { label: "سؤال اختيار من متعدد عن أهمية التكرار في بناء العادة" },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000007",
    type: "summary",
    duration: 6,
    content: {
      heading: { ar: "خلاصة" },
      bullets: [{ ar: "التغيير الصغير أسهل يستمر." }, { ar: "1% كل يوم يتراكم بسرعة." }, { ar: "ابدأ بأصغر خطوة ممكنة." }],
    },
    accessibility: { label: "ملخص: التغيير الصغير أسهل يستمر، والتراكم يصنع فرقاً كبيراً" },
  }),
  scene({
    id: "d1a1a1a1-0001-4000-8000-000000000008",
    type: "completion",
    duration: 4,
    content: { heading: { ar: "تم 👌" }, subheading: { ar: "أول بصيرة خلصتها اليوم." }, statsShown: ["minutes"] },
    accessibility: { label: "تهانينا، أكملت الدرس" },
  }),
];

export const DEMO_CHAPTER: Chapter = {
  id: "d1a1a1a1-0000-4000-8000-000000000000",
  order: 0,
  title: { ar: "قوة العادات الصغيرة — معاينة المحرك" },
  scenes,
};
