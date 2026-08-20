import type { SceneType } from "@basirah/content-schema";

/**
 * Starting-point JSON for "+ Add scene" per type — every scene still
 * needs an `id` (generated at creation time, not here) and a real
 * `accessibility.label`, but this gets an editor to a valid, saveable
 * scene in one click instead of starting from an empty object.
 */
export const SCENE_DEFAULTS: Record<SceneType, Record<string, unknown>> = {
  textReveal: { lines: [{ ar: "نص جديد" }], style: "heading2" },
  visualMetaphor: { caption: { ar: "وصف الرمز البصري" }, metaphorKey: "placeholder", asset: { kind: "illustration", ref: "placeholder", altText: "وصف الصورة" } },
  comparison: { left: { label: { ar: "الخيار الأول" } }, right: { label: { ar: "الخيار الثاني" } } },
  timeline: { events: [{ date: "2020", label: { ar: "حدث" } }, { date: "2024", label: { ar: "حدث آخر" } }] },
  numberCounter: { from: 0, to: 100, suffix: "%" },
  barChart: { bars: [{ label: { ar: "أ" }, value: 10 }, { label: { ar: "ب" }, value: 20 }] },
  lineChart: { series: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },
  pieChart: { slices: [{ label: { ar: "أ" }, value: 40 }, { label: { ar: "ب" }, value: 60 }] },
  processFlow: { steps: [{ label: { ar: "خطوة 1" } }, { label: { ar: "خطوة 2" } }] },
  causeEffect: { cause: { label: { ar: "السبب" } }, effect: { label: { ar: "النتيجة" } } },
  beforeAfter: {
    before: { label: { ar: "قبل" }, asset: { kind: "illustration", ref: "placeholder", altText: "قبل" } },
    after: { label: { ar: "بعد" }, asset: { kind: "illustration", ref: "placeholder", altText: "بعد" } },
  },
  map: { markers: [] },
  saudiMap: { highlightedRegions: [], markers: [] },
  character: { characterKey: "default", dialogue: { ar: "..." }, emotion: "neutral" },
  quote: { quote: { ar: "اقتباس" } },
  stack: { items: [{ label: { ar: "عنصر" } }] },
  network: { nodes: [{ id: "a", label: { ar: "أ" } }, { id: "b", label: { ar: "ب" } }], edges: [{ from: "a", to: "b" }] },
  calendar: { highlightedDays: [1], totalDays: 365 },
  money: { amountHalalas: 10000, basket: [] },
  compoundGrowth: { principal: 1, ratePercent: 1, periods: 365 },
  decisionTree: { prompt: { ar: "سؤال؟" }, branches: [{ label: { ar: "خيار 1" }, leadsTo: "a" }, { label: { ar: "خيار 2" }, leadsTo: "b" }] },
  slider: { prompt: { ar: "اسحب" }, min: 0, max: 100, step: 1, defaultValue: 50, unit: "" },
  dragInteraction: {
    prompt: { ar: "رتّب" },
    items: [{ id: "1", label: { ar: "عنصر 1" } }, { id: "2", label: { ar: "عنصر 2" } }],
    targets: [{ id: "t1", label: { ar: "هدف 1" } }],
    correctMapping: { "1": "t1" },
  },
  tapInteraction: { prompt: { ar: "اضغط" }, asset: { kind: "illustration", ref: "placeholder", altText: "صورة" }, hotspots: [] },
  multipleChoice: {
    question: { ar: "سؤال؟" },
    options: [{ id: "a", label: { ar: "خيار أ" } }, { id: "b", label: { ar: "خيار ب" } }],
    correctOptionId: "a",
    correctFeedback: { ar: "صحيح 👏" },
    incorrectFeedback: { ar: "قريب — حاول مرة ثانية." },
  },
  trueFalse: { statement: { ar: "عبارة" }, correctAnswer: true, correctFeedback: { ar: "صح" }, incorrectFeedback: { ar: "خطأ" } },
  reflection: { prompt: { ar: "شاركنا رأيك" }, maxLength: 280, allowReminder: false },
  summary: { heading: { ar: "خلاصة" }, bullets: [{ ar: "نقطة أولى" }] },
  flashcard: { front: { ar: "سؤال" }, back: { ar: "جواب" } },
  completion: { heading: { ar: "تم 👌" }, statsShown: [] },
};

export const SCENE_TYPES = Object.keys(SCENE_DEFAULTS) as SceneType[];
