"use client";

/**
 * A deliberately-simplified web approximation of what this scene will
 * look like in the actual `@basirah/animation-engine` renderer (React
 * Native, not DOM — a pixel-accurate live preview would mean running the
 * real Reanimated/Skia components inside Next.js, which isn't worth the
 * dependency weight for a CMS preview). This mirrors layout and content,
 * not motion or exact typography.
 */
export function PhonePreview({ scene }: { scene: Record<string, unknown> | null }) {
  return (
    <div className="w-[280px] h-[560px] bg-[#1B1815] rounded-[36px] p-3 shadow-xl mx-auto">
      <div className="w-full h-full bg-[#FAF6EF] rounded-[26px] overflow-hidden flex flex-col" dir="rtl">
        <div className="h-1 mx-4 mt-3 rounded-full bg-[#C08A3E]" />
        <div className="flex-1 p-5 overflow-y-auto">{scene ? renderScene(scene) : <Empty />}</div>
      </div>
    </div>
  );
}

function Empty() {
  return <div className="text-xs text-[#8A8175] text-center mt-10">Select a scene to preview it.</div>;
}

function renderScene(scene: Record<string, unknown>) {
  const type = scene.type as string;
  const content = (scene.content ?? {}) as Record<string, unknown>;

  switch (type) {
    case "textReveal":
      return (content.lines as { ar: string }[] | undefined)?.map((l, i) => (
        <p key={i} className="text-xl font-bold text-[#1B1815] mb-3">
          {l.ar}
        </p>
      ));
    case "quote":
      return <p className="text-lg text-[#1B1815] border-r-2 border-[#C08A3E] pr-3">{(content.quote as { ar: string })?.ar}</p>;
    case "numberCounter":
      return (
        <div className="text-center mt-10">
          <div className="text-5xl font-black text-[#C08A3E]">
            {String(content.to)}
            {String(content.suffix ?? "")}
          </div>
          {content.caption ? <p className="text-sm text-[#4A443D] mt-2">{(content.caption as { ar: string }).ar}</p> : null}
        </div>
      );
    case "multipleChoice":
      return (
        <div>
          <p className="font-semibold mb-3">{(content.question as { ar: string })?.ar}</p>
          {(content.options as { id: string; label: { ar: string } }[] | undefined)?.map((o) => (
            <div key={o.id} className="border border-[#E7DFD1] rounded-lg px-3 py-2 mb-2 text-sm">
              {o.label.ar}
            </div>
          ))}
        </div>
      );
    case "trueFalse":
      return (
        <div>
          <p className="font-semibold mb-3">{(content.statement as { ar: string })?.ar}</p>
          <div className="flex gap-2">
            <div className="flex-1 border border-[#E7DFD1] rounded-lg py-4 text-center">صح</div>
            <div className="flex-1 border border-[#E7DFD1] rounded-lg py-4 text-center">خطأ</div>
          </div>
        </div>
      );
    case "slider":
      return (
        <div>
          <p className="font-semibold mb-4">{(content.prompt as { ar: string })?.ar}</p>
          <div className="text-3xl font-black text-[#C08A3E] text-center mb-3">
            {String(content.defaultValue)}
            {String(content.unit ?? "")}
          </div>
          <div className="h-1.5 rounded-full bg-[#E7DFD1]" />
        </div>
      );
    case "summary":
      return (
        <div>
          <p className="font-bold text-lg mb-3">{(content.heading as { ar: string })?.ar}</p>
          {(content.bullets as { ar: string }[] | undefined)?.map((b, i) => (
            <p key={i} className="text-sm mb-2">
              ✓ {b.ar}
            </p>
          ))}
        </div>
      );
    case "completion":
      return (
        <div className="text-center mt-16">
          <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center text-2xl">✓</div>
          <p className="font-bold text-lg">{(content.heading as { ar: string })?.ar}</p>
        </div>
      );
    case "money":
      return (
        <div>
          <div className="bg-[#1B1815] rounded-xl p-5 text-center mb-3">
            <div className="text-2xl font-black text-white">{(Number(content.amountHalalas ?? 0) / 100).toFixed(0)} SAR</div>
          </div>
          <div className="flex flex-wrap gap-1">
            {(content.basket as { label: { ar: string } }[] | undefined)?.map((b, i) => (
              <span key={i} className="text-xs bg-[#F3E3C6] rounded-full px-2 py-1">
                {b.label.ar}
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="text-center mt-16">
          <span className="inline-block text-xs bg-[#E7DFD1] text-[#4A443D] rounded-full px-2 py-1 mb-3">{type}</span>
          <p className="text-sm text-[#4A443D]">{(scene.accessibility as { label?: string } | undefined)?.label}</p>
        </div>
      );
  }
}
