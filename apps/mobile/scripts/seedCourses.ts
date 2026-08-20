/**
 * Publishes the 3 showcase courses (src/content/courses/) into Postgres —
 * courses / chapters / scenes rows, category-linked, status='published'.
 * Run against a local Supabase instance (`supabase start`) with the
 * service role key, which bypasses RLS for this admin-only write:
 *
 *   SUPABASE_URL=http://127.0.0.1:55321 \
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role from `supabase start`> \
 *   npx tsx scripts/seedCourses.ts
 *
 * This is a stand-in for the admin CMS's publish flow (Phase 6) — until
 * that exists, this script is how course content in src/content/courses/
 * gets into the database at all.
 */
import { createClient } from "@supabase/supabase-js";
import { COURSES } from "../src/content/registry";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// slug -> categories.slug (matches supabase/seed/0001_categories.sql) and a hand-set estimate (spec §9 home cards show this).
const COURSE_META: Record<string, { categorySlug: string; estimatedMinutes: number }> = {
  "power-of-small-habits": { categorySlug: "self_development", estimatedMinutes: 8 },
  "what-is-inflation": { categorySlug: "money", estimatedMinutes: 6 },
  "vision-2030": { categorySlug: "saudi", estimatedMinutes: 9 },
};

async function main() {
  for (const course of Object.values(COURSES)) {
    const meta = COURSE_META[course.slug];
    if (!meta) throw new Error(`No COURSE_META entry for slug "${course.slug}"`);

    const { data: category, error: categoryError } = await client
      .from("categories")
      .select("id")
      .eq("slug", meta.categorySlug)
      .single();
    if (categoryError || !category) throw new Error(`Category "${meta.categorySlug}" not found — run the category seed first.`);

    const { data: courseRow, error: courseError } = await client
      .from("courses")
      .upsert(
        {
          slug: course.slug,
          title_ar: course.title,
          category_id: category.id,
          estimated_minutes: meta.estimatedMinutes,
          status: "published",
          published_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (courseError || !courseRow) throw courseError ?? new Error("upsert courses returned no row");

    // Clear out any previously-seeded chapters (cascades to scenes) so re-running this script is idempotent.
    await client.from("chapters").delete().eq("course_id", courseRow.id);

    for (const chapter of course.chapters) {
      const { data: chapterRow, error: chapterError } = await client
        .from("chapters")
        .insert({ course_id: courseRow.id, order: chapter.order, title_ar: chapter.title.ar })
        .select("id")
        .single();
      if (chapterError || !chapterRow) throw chapterError ?? new Error("insert chapters returned no row");

      const sceneRows = chapter.scenes.map((scene, i) => ({
        // The row's primary key must match payload.id — the admin CMS's
        // scene editor validates that the JSON it saves still describes
        // the same scene it opened by comparing these two, and the
        // mobile renderer keys React lists off payload.id too. Letting
        // Postgres default this to a fresh gen_random_uuid() here would
        // silently diverge from the authored id (caught by the Playwright
        // CMS test — see docs/scene-engine.md).
        id: scene.id,
        chapter_id: chapterRow.id,
        order: i,
        type: scene.type,
        duration_seconds: scene.duration,
        payload: scene,
      }));
      const { error: sceneError } = await client.from("scenes").insert(sceneRows);
      if (sceneError) throw sceneError;
    }

    console.log(`✓ ${course.slug} — ${course.chapters.length} chapters, ${course.chapters.reduce((n, c) => n + c.scenes.length, 0)} scenes`);
  }
}

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
