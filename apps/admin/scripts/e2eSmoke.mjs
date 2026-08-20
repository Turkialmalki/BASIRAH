#!/usr/bin/env node
/**
 * Real end-to-end smoke test — a headless browser driving the actual
 * admin CMS UI against a running instance (`pnpm dev` or `next start`)
 * and a real Supabase project: login → open a course → open its first
 * chapter → edit a scene's JSON → save → confirm the save banner appears.
 *
 * This is what caught a real bug during Phase 6 (see docs/scene-engine.md
 * "A real bug this caught"): `scenes.id` diverging from `payload.id` in
 * the seed script, which no amount of `tsc`/`SceneSchema.parse` checking
 * could have found because they never exercise the actual save round-trip
 * through the running app.
 *
 * Usage:
 *   ADMIN_URL=http://localhost:3000 ADMIN_ACCESS_CODE=<code> node scripts/e2eSmoke.mjs
 *
 * Requires `playwright` + a downloaded browser (not a project dependency
 * by default — install ad hoc: `npx -p playwright playwright install chromium`).
 */
import { chromium } from "playwright";

const ADMIN_URL = process.env.ADMIN_URL ?? "http://localhost:3000";
const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE;

if (!ADMIN_ACCESS_CODE) {
  console.error("Missing ADMIN_ACCESS_CODE env var.");
  process.exit(1);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(ADMIN_URL, { waitUntil: "networkidle" });
  await page.fill('input[name="code"]', ADMIN_ACCESS_CODE);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  console.log("✓ login worked, landed on", page.url());

  await page.goto(`${ADMIN_URL}/courses`, { waitUntil: "networkidle" });
  const courseLink = page.locator('a[href^="/courses/"]').first();
  await courseLink.waitFor({ state: "visible", timeout: 10000 });
  await courseLink.click();
  await page.waitForURL(/\/courses\/[a-f0-9-]+$/, { timeout: 10000 });
  console.log("✓ opened course detail:", page.url());

  const chapterLink = page.locator('a[href*="/chapters/"]').first();
  await chapterLink.waitFor({ state: "visible", timeout: 10000 });
  await chapterLink.click();
  await page.waitForURL(/\/chapters\/[a-f0-9-]+$/, { timeout: 10000 });
  console.log("✓ opened chapter editor:", page.url());

  const firstScene = page.locator("aside button, div.w-64 button").nth(1);
  await firstScene.waitFor({ state: "visible", timeout: 10000 });
  await firstScene.click();

  const textarea = page.locator("textarea");
  await textarea.waitFor({ state: "visible", timeout: 5000 });
  // Round-trip the JSON unchanged — this alone is enough to prove the
  // save path (parse -> SceneSchema.parse -> id match -> Postgres write).
  const original = await textarea.inputValue();
  await textarea.fill(original);
  await page.click("button:has-text('Save scene')");
  await page.waitForSelector("text=Saved", { timeout: 8000 });
  console.log("✓ scene save round-trip confirmed");

  await browser.close();
  console.log("ALL CHECKS PASSED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
