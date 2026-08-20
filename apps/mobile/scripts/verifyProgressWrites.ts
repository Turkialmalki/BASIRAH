import { createBasirahClient, upsertSceneProgress, touchStreak, insertSavedInsight } from "@basirah/database";

async function main() {
  const client = createBasirahClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

  const { data: signIn, error: signInError } = await client.auth.signInAnonymously();
  if (signInError || !signIn.user) throw signInError ?? new Error("no user from anonymous sign-in");
  const userId = signIn.user.id;
  console.log("signed in anonymously as", userId);

  // grab a real scene id to attach progress to
  const { data: scene, error: sceneError } = await client.from("scenes").select("id").limit(1).single();
  if (sceneError || !scene) throw sceneError ?? new Error("no scene found");

  const { error: progressError } = await upsertSceneProgress(client, {
    userId,
    sceneId: scene.id,
    interactionResponse: { kind: "choice", optionId: "a", correct: true },
  });
  if (progressError) throw progressError;
  console.log("wrote user_scene_progress for scene", scene.id);

  const { error: streakError } = await touchStreak(client, { userId, minutesLearned: 6 });
  if (streakError) throw streakError;
  console.log("wrote streaks row");

  const { error: insightError } = await insertSavedInsight(client, {
    userId,
    kind: "quote",
    snapshot: { ar: "التراكم أقوى من الحماس." },
  });
  if (insightError) throw insightError;
  console.log("wrote saved_insights row");

  const { data: streakRow } = await client.from("streaks").select("*").eq("user_id", userId).single();
  console.log("streak row:", streakRow);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
