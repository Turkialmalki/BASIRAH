export function PlaceholderPage({ title, phase, description }: { title: string; phase: string; description: string }) {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">{title}</h1>
      <p className="text-sm text-neutral-500 mb-6">{description}</p>
      <div className="bg-white border border-dashed border-neutral-300 rounded-xl p-8 text-sm text-neutral-500">
        Not built yet — {phase}.
      </div>
    </div>
  );
}
