import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../../src/lib/supabaseServer";
import { StatusBadge } from "../../../../src/components/StatusBadge";
import { DeleteButton } from "../../../../src/components/DeleteButton";
import { setCourseStatus } from "../actions";
import { createChapter, deleteChapter } from "./actions";

export const dynamic = "force-dynamic";

async function getCourse(courseId: string) {
  const client = supabaseAdmin();
  const { data: course } = await client.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (!course) return null;

  const { data: chapters } = await client
    .from("chapters")
    .select("id, order, title_ar, scenes(id)")
    .eq("course_id", courseId)
    .order("order", { ascending: true });

  return {
    course,
    chapters: (chapters ?? []) as { id: string; order: number; title_ar: string; scenes: unknown[] }[],
  };
}

const STATUSES = ["draft", "in_review", "published", "archived"] as const;

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const result = await getCourse(courseId);
  if (!result) notFound();
  const { course, chapters } = result;

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/courses" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Courses
      </Link>

      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900" dir="rtl">
            {course.title_ar}
          </h1>
          <div className="text-xs text-neutral-500 mt-1">{course.slug}</div>
        </div>
        <StatusBadge status={course.status} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
        <div className="text-xs font-semibold text-neutral-500 mb-2">Status</div>
        <div className="flex gap-2">
          {STATUSES.map((status) => (
            <form key={status} action={setCourseStatus.bind(null, courseId, status)}>
              <button
                type="submit"
                disabled={course.status === status}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  course.status === status
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {status}
              </button>
            </form>
          ))}
        </div>
        {course.status === "published" && (
          <p className="text-xs text-neutral-400 mt-3">
            Live in the app. Edits to scenes below apply immediately — there is no separate
            draft/published copy of scene content yet (Phase 9 hardening item).
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-neutral-700">Chapters</h2>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 mb-4">
        {chapters.length === 0 && <div className="p-4 text-sm text-neutral-500">No chapters yet.</div>}
        {chapters.map((ch) => (
          <div key={ch.id} className="flex items-center justify-between p-4">
            <Link href={`/courses/${courseId}/chapters/${ch.id}`} className="flex-1">
              <div className="text-sm font-medium text-neutral-900" dir="rtl">
                {ch.order + 1}. {ch.title_ar}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">{(ch.scenes as unknown[])?.length ?? 0} scenes</div>
            </Link>
            <DeleteButton
              action={deleteChapter.bind(null, courseId, ch.id)}
              confirmMessage={`Delete chapter "${ch.title_ar}" and all its scenes?`}
            />
          </div>
        ))}
      </div>

      <form action={createChapter.bind(null, courseId)} className="flex gap-2">
        <input
          name="title_ar"
          placeholder="عنوان الفصل الجديد"
          dir="rtl"
          required
          className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-neutral-900 text-white rounded-lg px-4 text-sm font-medium">
          Add chapter
        </button>
      </form>
    </div>
  );
}
