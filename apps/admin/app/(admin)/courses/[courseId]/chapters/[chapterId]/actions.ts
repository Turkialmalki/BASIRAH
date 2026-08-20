"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { SceneSchema, type SceneType } from "@basirah/content-schema";
import { supabaseAdmin } from "../../../../../../src/lib/supabaseServer";
import { SCENE_DEFAULTS } from "../../../../../../src/lib/sceneDefaults";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createScene(courseId: string, chapterId: string, type: SceneType): Promise<ActionResult> {
  const client = supabaseAdmin();
  const draft = {
    id: randomUUID(),
    type,
    duration: 5,
    content: SCENE_DEFAULTS[type],
    accessibility: { label: "وصف يُقرأ لقارئ الشاشة" },
  };

  const parsed = SceneSchema.safeParse(draft);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };

  const { count } = await client.from("scenes").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId);

  const { error } = await client.from("scenes").insert({
    chapter_id: chapterId,
    order: count ?? 0,
    type: parsed.data.type,
    duration_seconds: parsed.data.duration,
    payload: parsed.data,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
  return { ok: true };
}

export async function updateScene(courseId: string, chapterId: string, sceneId: string, rawJson: string): Promise<ActionResult> {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch {
    return { ok: false, error: "Invalid JSON." };
  }

  const parsed = SceneSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n") };
  }
  if (parsed.data.id !== sceneId) {
    return { ok: false, error: "Scene id in JSON doesn't match the scene being edited." };
  }

  const client = supabaseAdmin();
  const { error } = await client
    .from("scenes")
    .update({ type: parsed.data.type, duration_seconds: parsed.data.duration, payload: parsed.data, updated_at: new Date().toISOString() })
    .eq("id", sceneId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
  return { ok: true };
}

export async function deleteScene(courseId: string, chapterId: string, sceneId: string): Promise<void> {
  const client = supabaseAdmin();
  await client.from("scenes").delete().eq("id", sceneId);
  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
}

export async function duplicateScene(courseId: string, chapterId: string, sceneId: string): Promise<void> {
  const client = supabaseAdmin();
  const { data: original } = await client.from("scenes").select("payload, order").eq("id", sceneId).single();
  if (!original) return;

  const { count } = await client.from("scenes").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId);
  const clonedPayload = { ...(original.payload as Record<string, unknown>), id: randomUUID() };
  const parsed = SceneSchema.parse(clonedPayload); // re-validate the clone (defensive; the original was already valid)

  await client.from("scenes").insert({
    chapter_id: chapterId,
    order: count ?? 0,
    type: parsed.type,
    duration_seconds: parsed.duration,
    payload: parsed,
  });
  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
}

/** Swaps this scene's `order` with its immediate neighbor — the simplest correct reorder primitive for a linear list. */
export async function moveScene(courseId: string, chapterId: string, sceneId: string, direction: "up" | "down"): Promise<void> {
  const client = supabaseAdmin();
  const { data: scenes } = await client.from("scenes").select("id, order").eq("chapter_id", chapterId).order("order", { ascending: true });
  if (!scenes) return;

  const index = scenes.findIndex((s: { id: string }) => s.id === sceneId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= scenes.length) return;

  const a = scenes[index];
  const b = scenes[swapWith];
  if (!a || !b) return;
  await Promise.all([
    client.from("scenes").update({ order: b.order }).eq("id", a.id),
    client.from("scenes").update({ order: a.order }).eq("id", b.id),
  ]);
  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
}
