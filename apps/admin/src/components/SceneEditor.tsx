"use client";

import { useMemo, useState, useTransition } from "react";
import type { SceneType } from "@basirah/content-schema";
import { PhonePreview } from "./PhonePreview";
import { SCENE_TYPES } from "../lib/sceneDefaults";
import {
  createScene,
  updateScene,
  deleteScene,
  duplicateScene,
  moveScene,
} from "../../app/(admin)/courses/[courseId]/chapters/[chapterId]/actions";

interface SceneRow {
  id: string;
  order: number;
  type: string;
  payload: Record<string, unknown>;
}

export function SceneEditor({ courseId, chapterId, scenes }: { courseId: string; chapterId: string; scenes: SceneRow[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(scenes[0]?.id ?? null);
  const [draft, setDraft] = useState<string>(scenes[0] ? JSON.stringify(scenes[0].payload, null, 2) : "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [newType, setNewType] = useState<SceneType>("textReveal");
  const [pending, startTransition] = useTransition();

  const selected = scenes.find((s) => s.id === selectedId) ?? null;

  const previewScene = useMemo(() => {
    try {
      return JSON.parse(draft) as Record<string, unknown>;
    } catch {
      return selected?.payload ?? null;
    }
  }, [draft, selected]);

  function select(scene: SceneRow) {
    setSelectedId(scene.id);
    setDraft(JSON.stringify(scene.payload, null, 2));
    setError(null);
    setSaved(false);
  }

  function save() {
    if (!selected) return;
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateScene(courseId, chapterId, selected.id, draft);
      if (!result.ok) setError(result.error ?? "Unknown error");
      else setSaved(true);
    });
  }

  function addScene() {
    startTransition(async () => {
      const result = await createScene(courseId, chapterId, newType);
      if (!result.ok) setError(result.error ?? "Unknown error");
    });
  }

  return (
    <div className="flex h-[calc(100dvh-56px)]">
      {/* Left: scene list */}
      <div className="w-64 shrink-0 border-r border-neutral-200 bg-white overflow-y-auto">
        <div className="p-3 border-b border-neutral-200 flex gap-2">
          <select value={newType} onChange={(e) => setNewType(e.target.value as SceneType)} className="flex-1 text-xs border border-neutral-200 rounded px-2 py-1.5">
            {SCENE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button onClick={addScene} disabled={pending} className="text-xs bg-neutral-900 text-white rounded px-2.5">
            + Add
          </button>
        </div>
        {scenes.map((s, i) => (
          <button
            key={s.id}
            onClick={() => select(s)}
            className={`w-full text-right px-3 py-2.5 text-xs border-b border-neutral-100 flex items-center justify-between ${
              s.id === selectedId ? "bg-amber-50" : "hover:bg-neutral-50"
            }`}
          >
            <span className="text-neutral-400">{i + 1}</span>
            <span className="flex-1 text-left font-mono text-neutral-700 truncate mx-2">{s.type}</span>
          </button>
        ))}
      </div>

      {/* Center: preview */}
      <div className="flex-1 flex items-center justify-center bg-neutral-100 p-6 overflow-y-auto">
        <PhonePreview scene={previewScene} />
      </div>

      {/* Right: inspector */}
      <div className="w-96 shrink-0 border-l border-neutral-200 bg-white p-4 flex flex-col overflow-y-auto">
        {!selected ? (
          <p className="text-sm text-neutral-500">Select or add a scene.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-neutral-500">{selected.type}</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => moveScene(courseId, chapterId, selected.id, "up")} className="text-neutral-500 hover:text-neutral-900">
                  ↑
                </button>
                <button onClick={() => moveScene(courseId, chapterId, selected.id, "down")} className="text-neutral-500 hover:text-neutral-900">
                  ↓
                </button>
                <button onClick={() => duplicateScene(courseId, chapterId, selected.id)} className="text-neutral-500 hover:text-neutral-900">
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this scene?")) {
                      deleteScene(courseId, chapterId, selected.id);
                      setSelectedId(null);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setSaved(false);
              }}
              spellCheck={false}
              className="flex-1 min-h-[400px] font-mono text-xs border border-neutral-200 rounded-lg p-3 resize-none"
              dir="ltr"
            />

            {error && <pre className="text-xs text-red-600 whitespace-pre-wrap mt-2">{error}</pre>}
            {saved && <p className="text-xs text-emerald-600 mt-2">Saved ✓</p>}

            <button
              onClick={save}
              disabled={pending}
              className="mt-3 bg-neutral-900 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save scene"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
