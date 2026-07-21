import { createClient } from "@/lib/client";

export async function addXP(userId: string, xpReward: number) {
  const supabase = await createClient();

  const { data: stats } = await supabase
    .from("user_stats")
    .select("xp")
    .eq("user_id", userId)
    .single();

  const currentXP = stats?.xp ?? 0;

  await supabase
    .from("user_stats")
    .update({
      xp: currentXP + xpReward,
    })
    .eq("user_id", userId);
}

export async function addCoins(userId: string, coinReward: number) {
  const supabase = await createClient();

  const { data: stats } = await supabase
    .from("user_stats")
    .select("coins")
    .eq("user_id", userId)
    .single();

  const currentCoins = stats?.coins ?? 0;

  await supabase
    .from("user_stats")
    .update({
      coins: currentCoins + coinReward,
    })
    .eq("user_id", userId);
}

export async function updateGlobalOVR(userId: string, ovr: number) {
  const supabase = await createClient();

  await supabase
    .from("user_stats")
    .update({
      global_ovr: ovr,
    })
    .eq("user_id", userId);
}
