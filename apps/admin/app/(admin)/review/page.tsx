import Link from "next/link";
import { supabaseAdmin } from "../../../src/lib/supabaseServer";
import { StatusBadge } from "../../../src/components/StatusBadge";
import { setCourseStatus } from "../courses/actions";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const client = supabaseAdmin();
  const { data } = await client
    .from("courses")
    .select("id, slug, title_ar, status")
    .in("status", ["in_review", "published"])
    .order("status");
  const courses = (data ?? []) as { id: string; slug: string; title_ar: string; status: string }[];

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Review &amp; Publish</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Human review is mandatory before anything goes live (spec §24) — draft courses don&apos;t appear here.
      </p>

      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
        {courses.length === 0 && <div className="p-5 text-sm text-neutral-500">Nothing in review or published yet.</div>}
        {courses.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <Link href={`/courses/${c.id}`}>
              <div className="text-sm font-medium text-neutral-900" dir="rtl">
                {c.title_ar}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">{c.slug}</div>
            </Link>
            <div className="flex items-center gap-3">
              <StatusBadge status={c.status} />
              {c.status === "in_review" && (
                <form action={setCourseStatus.bind(null, c.id, "published")}>
                  <button type="submit" className="text-xs bg-emerald-600 text-white rounded-full px-3 py-1.5">
                    Publish
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
