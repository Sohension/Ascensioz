import { createClient } from "@/lib/client";

export async function createAttempt(
  userId: string,
  challengeId: string,
  code: string,
  verdict: string,
  solveTimeSeconds: number,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenge_attempts")
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      code,
      verdict,
      solve_time_seconds: solveTimeSeconds,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function markChallengeSolved(userId: string, challengeId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("solved_challenges").insert({
    user_id: userId,
    challenge_id: challengeId,
  });

  if (error) throw error;
}

export async function hasSolvedChallenge(userId: string, challengeId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("solved_challenges")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .maybeSingle();

  return !!data;
}
