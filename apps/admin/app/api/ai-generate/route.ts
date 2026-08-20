import { NextResponse, type NextRequest } from "next/server";
import { runLessonGenerationPipeline, PlaceholderLessonGenerator } from "@basirah/ai";
import { supabaseAdmin } from "../../../src/lib/supabaseServer";

/**
 * `courses.slug` is meant to be a stable, URL-safe identifier (matches
 * the 3 hand-authored showcase courses: "what-is-inflation", not
 * "وش-يعني-التضخم؟") — deep links, analytics, and App Store review all
 * expect ASCII here. Prompts are Arabic-first, so this doesn't attempt
 * transliteration; it derives a Latin slug from the classified category
 * plus a short random suffix instead.
 */
function slugify(category: string): string {
  const base = category.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "ai-lesson";
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Admin-triggered AI Content Studio generation (spec §22-24). Cookie
 * auth is enforced by middleware.ts on every non-API path, but Next.js
 * route handlers under /api aren't covered by that matcher — so this
 * checks the same cookie directly. The result is ALWAYS a `draft`
 * course; human review before publish is mandatory (spec §24), enforced
 * the same way `scripts/seedCourses.ts`-published content is — nothing
 * here sets `status: 'published'`.
 */
export async function POST(request: NextRequest) {
  const session = request.cookies.get("basirah_admin_session")?.value;
  if (session !== process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { prompt } = await request.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "missing prompt" }, { status: 400 });
  }

  const client = supabaseAdmin();

  const { data: generation, error: insertError } = await client
    .from("ai_generations")
    .insert({ prompt, status: "classifying" })
    .select("id")
    .single();
  if (insertError || !generation) {
    return NextResponse.json({ error: insertError?.message ?? "failed to create ai_generations row" }, { status: 500 });
  }

  const result = await runLessonGenerationPipeline(prompt, new PlaceholderLessonGenerator());

  if (!result.ok || !result.chapters || !result.outline) {
    await client
      .from("ai_generations")
      .update({ status: "failed", error_message: result.error ?? "unknown pipeline failure", completed_at: new Date().toISOString() })
      .eq("id", generation.id);
    return NextResponse.json({ error: result.error, stageReached: result.stageReached }, { status: 422 });
  }

  const { data: category } = await client.from("categories").select("id").eq("slug", result.outline.category).maybeSingle();

  const { data: course, error: courseError } = await client
    .from("courses")
    .insert({
      slug: slugify(result.outline.category),
      title_ar: result.outline.title,
      category_id: category?.id ?? null,
      estimated_minutes: Math.max(2, Math.round(result.chapters.reduce((n, c) => n + c.scenes.reduce((m, s) => m + s.duration, 0), 0) / 60)),
      status: "draft",
      is_ai_generated: true,
    })
    .select("id")
    .single();
  if (courseError || !course) {
    await client
      .from("ai_generations")
      .update({ status: "failed", error_message: courseError?.message ?? "failed to create draft course", completed_at: new Date().toISOString() })
      .eq("id", generation.id);
    return NextResponse.json({ error: courseError?.message }, { status: 500 });
  }

  for (const chapter of result.chapters) {
    const { data: chapterRow, error: chapterError } = await client
      .from("chapters")
      .insert({ course_id: course.id, order: chapter.order, title_ar: chapter.title.ar })
      .select("id")
      .single();
    if (chapterError || !chapterRow) continue;

    await client.from("scenes").insert(
      chapter.scenes.map((scene, i) => ({
        id: scene.id,
        chapter_id: chapterRow.id,
        order: i,
        type: scene.type,
        duration_seconds: scene.duration,
        payload: scene,
      }))
    );
  }

  await client
    .from("ai_generations")
    .update({
      status: "ready",
      resulting_course_id: course.id,
      sources: result.sources ?? [],
      completed_at: new Date().toISOString(),
    })
    .eq("id", generation.id);

  return NextResponse.json({ ok: true, courseId: course.id, generationId: generation.id });
}
