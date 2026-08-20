import type { LessonGenerator, ModerationResult, Outline, SourceRef } from "../pipeline";

/**
 * Deterministic, template-based `LessonGenerator` — no live model calls
 * (this build's explicit scope decision: ship the full pipeline
 * architecture now, wire a real model in later without touching
 * `runLessonGenerationPipeline`). Content is honestly generic —
 * reflection prompts built from the user's own words, not invented
 * facts presented as authoritative, since a template has no way to
 * verify anything it "knows."
 */
export class PlaceholderLessonGenerator implements LessonGenerator {
  private static CATEGORY_KEYWORDS: Record<string, string[]> = {
    money: ["مال", "استثمار", "تضخم", "راتب", "money", "invest", "inflation"],
    psychology: ["نفس", "سلوك", "عادة", "habit", "psychology", "behavior"],
    leadership: ["قيادة", "leadership", "إدارة", "manage"],
    technology: ["تقنية", "ذكاء", "برمجة", "tech", "ai", "software"],
    history: ["تاريخ", "history"],
    self_development: ["تطوير", "ذات", "نمو", "growth", "development"],
    entrepreneurship: ["ريادة", "مشروع", "startup", "entrepreneur"],
    saudi: ["السعودية", "رؤية", "2030", "saudi", "vision"],
    health: ["صحة", "رياضة", "health", "fitness"],
    philosophy: ["فلسفة", "philosophy"],
  };

  async classifyTopic(prompt: string): Promise<{ category: string; confidence: number }> {
    const lower = prompt.toLowerCase();
    let best = { category: "self_development", confidence: 0.3 };
    for (const [category, keywords] of Object.entries(PlaceholderLessonGenerator.CATEGORY_KEYWORDS)) {
      const hits = keywords.filter((k) => lower.includes(k)).length;
      if (hits > 0) {
        const confidence = Math.min(0.95, 0.5 + hits * 0.15);
        if (confidence > best.confidence) best = { category, confidence };
      }
    }
    return best;
  }

  async retrieveSources(_prompt: string, _category: string): Promise<SourceRef[]> {
    // Honest placeholder: no live retrieval means no sources to cite —
    // fabricating URLs here would be worse than an empty list.
    return [];
  }

  async buildFactualOutline(prompt: string, category: string): Promise<Outline> {
    return {
      category,
      title: prompt,
      learningObjectives: [`تفهم فكرة "${prompt}" بشكل أوضح`, "تربطها بحياتك اليومية"],
      chapterTitles: [prompt, "زاوية أعمق", "وش نطبّق؟"],
    };
  }

  async generateArabicExplanation(outline: Outline, chapterTitle: string, chapterIndex: number): Promise<string[]> {
    if (chapterIndex === 0) {
      return [`سؤال اليوم: ${outline.title}`, "خلنا نفكر فيه خطوة بخطوة."];
    }
    if (chapterIndex === outline.chapterTitles.length - 1) {
      return ["أهم شي إنك تربط الفكرة بحياتك اليومية.", "جرّب تطبّق جزء بسيط منها اليوم."];
    }
    return [`هذا الموضوع مرتبط بمجال ${outline.category}،`, "وفهمه يبني عليه مفاهيم ثانية كثيرة."];
  }

  async generateQuiz(outline: Outline) {
    return {
      question: `وش أهم فكرة نتعلمها عن: ${outline.title}؟`,
      options: ["فهمها يفتح زاوية تفكير جديدة", "ما لها علاقة بحياتنا", "معلومة نظرية بس"],
      correctIndex: 0,
    };
  }

  private static BANNED = ["كراهية", "عنف صريح", "hate speech", "explicit violence"];

  async moderate(text: string): Promise<ModerationResult> {
    const lower = text.toLowerCase();
    const reasons = PlaceholderLessonGenerator.BANNED.filter((w) => lower.includes(w));
    return { flagged: reasons.length > 0, reasons };
  }
}
