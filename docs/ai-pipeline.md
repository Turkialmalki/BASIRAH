# Basirah — AI Lesson Generation Pipeline

Implements spec §22-24: `User Prompt → classify topic → retrieve
trustworthy sources → create factual outline → generate Arabic
explanation → generate scene plan → validate JSON schema → moderation →
render visual lesson (as a DRAFT)`.

## Architecture

`packages/ai/src/pipeline.ts` exports `runLessonGenerationPipeline(prompt,
generator)` — the orchestration is written against a `LessonGenerator`
interface, not any specific model provider:

```ts
interface LessonGenerator {
  classifyTopic(prompt): Promise<{ category; confidence }>;
  retrieveSources(prompt, category): Promise<SourceRef[]>;
  buildFactualOutline(prompt, category): Promise<Outline>;
  generateArabicExplanation(outline, chapterTitle, chapterIndex): Promise<string[]>;
  generateQuiz(outline): Promise<{ question; options; correctIndex }>;
  moderate(text): Promise<{ flagged; reasons }>;
}
```

**Scope decision for this build:** `PlaceholderLessonGenerator`
(`generators/placeholder.ts`) implements this with deterministic
templates — keyword-based category classification, an outline built
from the user's own prompt text, and reflection-style Arabic copy. No
live model calls. This was a deliberate choice (the user was asked
whether to wire a real Anthropic key or ship the full architecture with
a placeholder, and chose the placeholder) — a real model-backed
generator implementing the same interface is a drop-in swap; nothing in
`runLessonGenerationPipeline` or the admin route needs to change.

The placeholder is also deliberately honest about what it is: it never
fabricates "facts" or invented citations. `retrieveSources` returns an
empty array rather than made-up URLs, and the generated copy is framed
as reflection prompts built from the user's own words, not authoritative
claims a template has no way to verify.

## Where it runs

`apps/admin/app/api/ai-generate/route.ts` — an admin-authenticated
(same cookie as the rest of the CMS) Next.js route handler:

1. Insert an `ai_generations` row (`status: 'classifying'`)
2. Run the pipeline
3. On success: create a `courses` row with **`status: 'draft'`** (never
   `'published'` — human review is mandatory, spec §24, enforced the
   same way as `scripts/seedCourses.ts`-published content: nothing in
   this path ever sets `published`), plus its `chapters`/`scenes`,
   validated against `SceneSchema` the same way hand-authored content is
4. Update `ai_generations` to `status: 'ready'` with `resulting_course_id`
5. On failure at any stage: `status: 'failed'` + `error_message`,
   nothing partially written stays in a courses row (the DB writes only
   happen after the full pipeline succeeds)

The admin UI (`/ai-generator`) is a simple prompt box that calls this
route and redirects straight to `/courses/[id]` for review.

## A real bug this caught

The first version of the scene-id generator (`stableId` in
`pipeline.ts`) embedded the literal string `"ai00"` into what was
supposed to be a hex segment of a UUID — invalid, but `tsc` had no way
to catch it (it's a runtime string-format bug, not a type error). It
surfaced the moment the endpoint was actually called against the real
hosted database: `SceneSchema.parse()` correctly rejected it with a Zod
`invalid_string` / `uuid` error. Fixed by generating all 32 hex
characters from a proper hash function instead of splicing in
non-hex literals — verified by re-running the exact same request end to
end (draft course created, chapters/scenes correct, confirmed invisible
to the public `status='published'` query, then cleaned up).
