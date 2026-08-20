# Dev scripts

Run against a running Supabase instance (`supabase start` for local, or a
real project's URL once one is configured). All read `SUPABASE_URL` +
a key from the environment — never hardcode credentials here.

- **`seedCourses.ts`** (needs `SUPABASE_SERVICE_ROLE_KEY`) — publishes the
  3 showcase courses from `src/content/courses/` into `courses` /
  `chapters` / `scenes`. Idempotent — re-running replaces each course's
  chapters/scenes. Stands in for the admin CMS's publish flow (Phase 6).
- **`verifyContentQueries.ts`** (needs `SUPABASE_ANON_KEY`) — sanity-checks
  `fetchPublishedCourses` / `fetchCourseWithChapters` against real data.
- **`verifyProgressWrites.ts`** (needs `SUPABASE_ANON_KEY`) — signs in
  anonymously and confirms `upsertSceneProgress` / `touchStreak` /
  `insertSavedInsight` actually write rows (this is what caught the
  missing `handle_new_user` trigger — see migration 0004).

```bash
SUPABASE_URL=http://127.0.0.1:55321 \
SUPABASE_SERVICE_ROLE_KEY=<from `supabase start`> \
npx tsx scripts/seedCourses.ts
```
