"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../src/lib/supabaseServer";

export async function createCourse(formData: FormData) {
  const client = supabaseAdmin();
  const slug = String(formData.get("slug") ?? "").trim();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  const categorySlug = String(formData.get("category_slug") ?? "");
  const estimatedMinutes = Number(formData.get("estimated_minutes") ?? 5);

  if (!slug || !titleAr) throw new Error("slug and title_ar are required");

  const { data: category } = await client.from("categories").select("id").eq("slug", categorySlug).maybeSingle();

  const { data: course, error } = await client
    .from("courses")
    .insert({
      slug,
      title_ar: titleAr,
      category_id: category?.id ?? null,
      estimated_minutes: estimatedMinutes,
      status: "draft",
    })
    .select("id")
    .single();
  if (error) throw error;

  revalidatePath("/courses");
  redirect(`/courses/${course.id}`);
}

export async function setCourseStatus(courseId: string, status: "draft" | "in_review" | "published" | "archived") {
  const client = supabaseAdmin();
  const { error } = await client
    .from("courses")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null })
    .eq("id", courseId);
  if (error) throw error;
  revalidatePath("/courses");
  revalidatePath("/review");
  revalidatePath(`/courses/${courseId}`);
}
