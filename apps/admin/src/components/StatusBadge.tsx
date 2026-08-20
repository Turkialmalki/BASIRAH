const COLORS: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  in_review: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-neutral-100 text-neutral-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${COLORS[status] ?? COLORS.draft}`}>
      {status}
    </span>
  );
}
