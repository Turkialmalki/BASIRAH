"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../../src/lib/supabaseServer";

export async function createChapter(courseId: string, formData: FormData) {
  const client = supabaseAdmin();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  if (!titleAr) throw new Error("title_ar is required");

  const { count } = await client.from("chapters").select("id", { count: "exact", head: true }).eq("course_id", courseId);
  const { error } = await client.from("chapters").insert({ course_id: courseId, order: count ?? 0, title_ar: titleAr });
  if (error) throw error;
  revalidatePath(`/courses/${courseId}`);
}

export async function deleteChapter(courseId: string, chapterId: string) {
  const client = supabaseAdmin();
  const { error } = await client.from("chapters").delete().eq("id", chapterId);
  if (error) throw error;
  revalidatePath(`/courses/${courseId}`);
}
