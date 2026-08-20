"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AiGeneratorForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setError(null);
    setStage("نحوّل الفكرة إلى بصيرة...");

    const res = await fetch("/api/ai-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const body = await res.json();
    setBusy(false);
    setStage(null);

    if (!res.ok) {
      setError(`${body.error ?? "Unknown error"}${body.stageReached ? ` (stage: ${body.stageReached})` : ""}`);
      return;
    }

    router.push(`/courses/${body.courseId}`);
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-xl">
      <label className="block text-sm font-medium text-neutral-700 mb-2">Topic or question (Arabic)</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        dir="rtl"
        rows={3}
        placeholder="مثال: وش يعني الذكاء الاصطناعي التوليدي؟"
        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm mb-4"
      />
      <button
        onClick={generate}
        disabled={busy || prompt.trim().length === 0}
        className="bg-neutral-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate draft course"}
      </button>
      {stage && <p className="text-xs text-neutral-500 mt-3" dir="rtl">{stage}</p>}
      {error && <p className="text-xs text-red-600 mt-3 whitespace-pre-wrap">{error}</p>}
      <p className="text-xs text-neutral-400 mt-4">
        Always creates a <code>draft</code> course — never auto-publishes. Content today comes from a deterministic
        template generator (no live model calls, see <code>@basirah/ai</code>), not a real LLM.
      </p>
    </div>
  );
}
