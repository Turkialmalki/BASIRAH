import type { Chapter } from "@basirah/content-schema";
import { scene, type CourseContent } from "../helpers";

/**
 * "قوة العادات الصغيرة" — spec §13, the first full showcase course.
 * Original educational wording throughout; no book text reproduced (see
 * docs/database.md content_rights — this course's rights_status is
 * `original`).
 */

let n = 0;
const id = () => {
  n += 1;
  return `a1000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
};

const chapter1: Chapter = {
  id: id(),
  order: 0,
  title: { ar: "ليش التغيير صعب؟" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 5,
      content: { lines: [{ ar: "ليش التغيير صعب؟" }], style: "displayLarge" },
      accessibility: { label: "ليش التغيير صعب؟" },
    }),
    scene({
      id: id(),
      type: "visualMetaphor",
      duration: 7,
      content: {
        caption: { ar: "قفزة وحدة كبيرة تتعبك وتفشل...\nلكن سلالم صغيرة توصلك فعلاً." },
        metaphorKey: "huge-jump-to-stairs",
        asset: { kind: "illustration", ref: "huge-jump-to-stairs", altText: "شخص يحاول قفزة كبيرة، ثم نفس المسافة تتحول إلى سلالم صغيرة" },
      },
      accessibility: { label: "شخص يحاول قفزة كبيرة يفشل فيها، ثم نفس المسافة تتحول إلى سلالم صغيرة سهلة الصعود" },
    }),
    scene({
      id: id(),
      type: "textReveal",
      duration: 6,
      content: {
        lines: [{ ar: "عقلك يقاوم التغيير المفاجئ." }, { ar: "بس ما يقاوم خطوة صغيرة." }],
        style: "heading1",
      },
      accessibility: { label: "عقلك يقاوم التغيير المفاجئ، لكنه لا يقاوم خطوة صغيرة" },
    }),
  ],
};

const chapter2: Chapter = {
  id: id(),
  order: 1,
  title: { ar: "1% أفضل" },
  scenes: [
    scene({
      id: id(),
      type: "numberCounter",
      duration: 5,
      content: { from: 0, to: 1, suffix: "%", caption: { ar: "تحسّن بسيط... كل يوم." } },
      accessibility: { label: "الرقم يتزايد إلى واحد بالمئة، تحسن بسيط كل يوم" },
    }),
    scene({
      id: id(),
      type: "compoundGrowth",
      duration: 8,
      content: { principal: 1, ratePercent: 1, periods: 365, caption: { ar: "لو تحسّنت 1% يومياً... بعد سنة وحدة تكون قد 37 مرة أفضل تقريباً." } },
      accessibility: { label: "منحنى يوضح كيف يتراكم تحسن 1 بالمئة يومياً ليصبح 37 ضعفاً تقريباً خلال سنة" },
    }),
    scene({
      id: id(),
      type: "quote",
      duration: 5,
      content: { quote: { ar: "التراكم أقوى من الحماس." } },
      accessibility: { label: "التراكم أقوى من الحماس" },
    }),
  ],
};

const chapter3: Chapter = {
  id: id(),
  order: 2,
  title: { ar: "البيئة أقوى من الإرادة أحياناً" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 5,
      content: { lines: [{ ar: "البيئة أقوى من الإرادة... أحياناً." }], style: "displayLarge" },
      accessibility: { label: "البيئة أقوى من الإرادة أحياناً" },
    }),
    scene({
      id: id(),
      type: "beforeAfter",
      duration: 7,
      content: {
        before: { label: { ar: "جوالك جنبك، كتابك بعيد" }, asset: { kind: "illustration", ref: "room-before", altText: "غرفة والجوال قريب والكتاب بعيد" } },
        after: { label: { ar: "جوالك بعيد، كتابك جنبك" }, asset: { kind: "illustration", ref: "room-after", altText: "نفس الغرفة والجوال بعيد والكتاب قريب" } },
      },
      accessibility: { label: "مقارنة بين غرفة فيها الجوال قريب والكتاب بعيد، ونفس الغرفة بعد نقل الجوال بعيد ووضع الكتاب قريب" },
    }),
    scene({
      id: id(),
      type: "textReveal",
      duration: 6,
      content: {
        lines: [{ ar: "لما تسهّل الشيء الصح، وتصعّب الشيء الغلط..." }, { ar: "إرادتك ما تحتاج تشتغل بقوة." }],
        style: "heading1",
      },
      accessibility: { label: "تسهيل الشيء الصح وتصعيب الشيء الغلط يقلل الحاجة لقوة الإرادة" },
    }),
  ],
};

const chapter4: Chapter = {
  id: id(),
  order: 3,
  title: { ar: "اجعل البداية سهلة" },
  scenes: [
    scene({
      id: id(),
      type: "textReveal",
      duration: 4,
      content: { lines: [{ ar: "اجعل البداية سهلة." }], style: "displayLarge" },
      accessibility: { label: "اجعل البداية سهلة" },
    }),
    scene({
      id: id(),
      type: "slider",
      duration: 10,
      content: { prompt: { ar: "كم دقيقة تقدر تبدأ فيها اليوم؟" }, min: 2, max: 30, step: 1, defaultValue: 2, unit: " د" },
      interaction: { kind: "slider", required: true },
      accessibility: { label: "منزلق لاختيار عدد دقائق البداية من 2 إلى 30" },
    }),
    scene({
      id: id(),
      type: "textReveal",
      duration: 5,
      content: { lines: [{ ar: "ابدأ بأصغر نسخة من العادة." }, { ar: "لاحقاً... تكبر وحدها." }], style: "heading1" },
      accessibility: { label: "ابدأ بأصغر نسخة من العادة، لاحقاً تكبر وحدها" },
    }),
  ],
};

const chapter5: Chapter = {
  id: id(),
  order: 4,
  title: { ar: "اختبر فهمك" },
  scenes: [
    scene({
      id: id(),
      type: "multipleChoice",
      duration: 8,
      content: {
        question: { ar: "وش أهم في بناء عادة جديدة؟" },
        options: [
          { id: "a", label: { ar: "تكرار صغير يومي" } },
          { id: "b", label: { ar: "قوة الإرادة" } },
          { id: "c", label: { ar: "جدول مثالي من أول يوم" } },
        ],
        correctOptionId: "a",
        correctFeedback: { ar: "بالضبط 👏 التكرار الصغير هو اللي يبني العادة." },
        incorrectFeedback: { ar: "قريب — لكن التكرار الصغير اليومي أهم من الحماس أو الكمال." },
      },
      interaction: { kind: "choice", required: true },
      accessibility: { label: "سؤال: وش أهم في بناء عادة جديدة" },
    }),
    scene({
      id: id(),
      type: "trueFalse",
      duration: 6,
      content: {
        statement: { ar: "تغيير البيئة يقلل حاجتك لقوة الإرادة." },
        correctAnswer: true,
        correctFeedback: { ar: "صح 👏 البيئة تسهّل عليك القرار الصح تلقائياً." },
        incorrectFeedback: { ar: "الصحيح: تغيير البيئة فعلاً يقلل حاجتك لقوة الإرادة." },
      },
      interaction: { kind: "choice", required: true },
      accessibility: { label: "سؤال صح أو خطأ: تغيير البيئة يقلل الحاجة لقوة الإرادة" },
    }),
  ],
};

const chapter6: Chapter = {
  id: id(),
  order: 5,
  title: { ar: "التزامك" },
  scenes: [
    scene({
      id: id(),
      type: "reflection",
      duration: 15,
      content: {
        prompt: { ar: "وش عادة صغيرة تقدر تبدأها اليوم؟" },
        placeholder: { ar: "مثال: أقرأ صفحة وحدة قبل النوم" },
        maxLength: 200,
        allowReminder: true,
      },
      interaction: { kind: "textInput", required: true },
      accessibility: { label: "اكتب عادة صغيرة تقدر تبدأها اليوم" },
    }),
    scene({
      id: id(),
      type: "completion",
      duration: 4,
      content: { heading: { ar: "تم 👌" }, subheading: { ar: "بصيرتك الأولى خلصت. عادتك الصغيرة بدأت." }, statsShown: ["minutes"] },
      accessibility: { label: "تهانينا، أكملت درس قوة العادات الصغيرة" },
    }),
  ],
};

export const POWER_OF_SMALL_HABITS_COURSE: CourseContent = {
  slug: "power-of-small-habits",
  title: "قوة العادات الصغيرة",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6],
};
