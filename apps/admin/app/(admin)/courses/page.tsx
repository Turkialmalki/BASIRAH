import Link from "next/link";
import { supabaseAdmin } from "../../../src/lib/supabaseServer";
import { StatusBadge } from "../../../src/components/StatusBadge";
import { createCourse } from "./actions";

export const dynamic = "force-dynamic";

async function getCourses() {
  const client = supabaseAdmin();
  const { data, error } = await client
    .from("courses")
    .select("id, slug, title_ar, status, estimated_minutes, categories(slug)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as {
    id: string;
    slug: string;
    title_ar: string;
    status: string;
    estimated_minutes: number;
    categories: unknown;
  }[];
}

async function getCategories() {
  const client = supabaseAdmin();
  const { data } = await client.from("categories").select("slug, title_ar").order("title_ar");
  return (data ?? []) as { slug: string; title_ar: string }[];
}

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([getCourses(), getCategories()]);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Courses</h1>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 mb-8">
        {courses.length === 0 && <div className="p-5 text-sm text-neutral-500">No courses yet — create one below.</div>}
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.id}`}
            className="flex items-center justify-between p-4 hover:bg-neutral-50"
          >
            <div>
              <div className="font-medium text-neutral-900" dir="rtl">
                {c.title_ar}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {c.slug} · {(c.categories as unknown as { slug: string } | null)?.slug ?? "no category"} · {c.estimated_minutes}m
              </div>
            </div>
            <StatusBadge status={c.status as string} />
          </Link>
        ))}
      </div>

      <details className="bg-white border border-neutral-200 rounded-xl p-5">
        <summary className="text-sm font-semibold text-neutral-700 cursor-pointer">+ New course</summary>
        <form action={createCourse} className="flex flex-col gap-3 mt-4 max-w-sm">
          <input name="slug" placeholder="slug (e.g. new-course)" required className="border border-neutral-200 rounded-lg px-3 py-2 text-sm" />
          <input name="title_ar" placeholder="العنوان بالعربي" dir="rtl" required className="border border-neutral-200 rounded-lg px-3 py-2 text-sm" />
          <select name="category_slug" className="border border-neutral-200 rounded-lg px-3 py-2 text-sm">
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.title_ar} ({cat.slug})
              </option>
            ))}
          </select>
          <input
            name="estimated_minutes"
            type="number"
            defaultValue={5}
            min={1}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-neutral-900 text-white rounded-lg py-2 text-sm font-medium">
            Create draft
          </button>
        </form>
      </details>
    </div>
  );
}
