import { AiGeneratorForm } from "../../../src/components/AiGeneratorForm";

export default function AiGeneratorPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">AI Content Studio</h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-xl">
        Topic → classify → outline → Arabic scenes → SceneSchema validation → moderation → draft course
        (spec §22-24). Review in <code>/courses/[id]</code> before publishing — nothing here goes live automatically.
      </p>
      <AiGeneratorForm />
    </div>
  );
}
