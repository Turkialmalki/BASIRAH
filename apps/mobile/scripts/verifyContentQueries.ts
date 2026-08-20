import { createBasirahClient, fetchPublishedCourses, fetchCourseWithChapters } from "@basirah/database";

async function main() {
  const client = createBasirahClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const courses = await fetchPublishedCourses(client);
  console.log(
    "published courses:",
    courses.map((c) => `${c.slug} (${c.categorySlug}, ${c.estimatedMinutes}m)`)
  );
  const full = await fetchCourseWithChapters(client, "what-is-inflation");
  console.log("what-is-inflation chapters:", full?.chapters.length, "first scene type:", full?.chapters[0]?.scenes[0]?.type);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
