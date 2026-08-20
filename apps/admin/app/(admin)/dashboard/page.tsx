import { supabaseAdmin } from "../../../src/lib/supabaseServer";

export const dynamic = "force-dynamic";

async function getStats() {
  const client = supabaseAdmin();
  const [{ count: courseCount }, { count: publishedCount }, { count: sceneCount }, { data: statusRows }] = await Promise.all([
    client.from("courses").select("id", { count: "exact", head: true }),
    client.from("courses").select("id", { count: "exact", head: true }).eq("status", "published"),
    client.from("scenes").select("id", { count: "exact", head: true }),
    client.from("courses").select("status"),
  ]);

  const byStatus: Record<string, number> = {};
  for (const row of statusRows ?? []) {
    byStatus[row.status as string] = (byStatus[row.status as string] ?? 0) + 1;
  }

  return { courseCount: courseCount ?? 0, publishedCount: publishedCount ?? 0, sceneCount: sceneCount ?? 0, byStatus };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Courses", value: stats.courseCount },
    { label: "Published", value: stats.publishedCount },
    { label: "Total scenes", value: stats.sceneCount },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Dashboard</h1>
      <p className="text-sm text-neutral-500 mb-8">Live from Postgres — not mock data.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="text-3xl font-bold text-neutral-900">{c.value}</div>
            <div className="text-sm text-neutral-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">Courses by status</h2>
        <div className="flex gap-3">
          {(["draft", "in_review", "published", "archived"] as const).map((status) => (
            <div key={status} className="flex-1 text-center py-3 rounded-lg bg-neutral-50">
              <div className="text-xl font-bold text-neutral-900">{stats.byStatus[status] ?? 0}</div>
              <div className="text-xs text-neutral-500 mt-1">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
