import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../../../../src/lib/supabaseServer";
import { SceneEditor } from "../../../../../../src/components/SceneEditor";

export const dynamic = "force-dynamic";

async function getData(courseId: string, chapterId: string) {
  const client = supabaseAdmin();
  const { data: chapter } = await client.from("chapters").select("id, title_ar, course_id").eq("id", chapterId).maybeSingle();
  if (!chapter || chapter.course_id !== courseId) return null;

  const { data: scenes } = await client
    .from("scenes")
    .select("id, order, type, payload")
    .eq("chapter_id", chapterId)
    .order("order", { ascending: true });

  return { chapter, scenes: scenes ?? [] };
}

export default async function ChapterEditorPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  const result = await getData(courseId, chapterId);
  if (!result) notFound();

  return (
    <div className="flex flex-col h-dvh">
      <div className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-neutral-200 bg-white">
        <Link href={`/courses/${courseId}`} className="text-xs text-neutral-500 hover:text-neutral-800">
          ← Course
        </Link>
        <span className="text-sm font-medium text-neutral-900" dir="rtl">
          {result.chapter.title_ar}
        </span>
      </div>
      <SceneEditor
        courseId={courseId}
        chapterId={chapterId}
        scenes={result.scenes as { id: string; order: number; type: string; payload: Record<string, unknown> }[]}
      />
    </div>
  );
}
