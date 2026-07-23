import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";
import {
  getPythonPracticeQuestion,
  validatePythonPracticeSolution,
} from "@/lib/python-practice";

export async function POST(req: Request) {
  
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { challengeId, code } = body;

    if (!challengeId || !code) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const practiceQuestion = getPythonPracticeQuestion(challengeId);
    if (practiceQuestion && !validatePythonPracticeSolution(challengeId, code)) {
      return NextResponse.json({ error: "Solution is not correct" }, { status: 400 });
    }

    // The primary key makes this claim idempotent across retries and concurrent requests.
    const { data: completion, error: completionError } = await supabase
      .from("practice_completions")
      .insert({ user_id: user.id, question_id: challengeId })
      .select()
      .maybeSingle();

    if (completionError?.code === "23505") {
      return NextResponse.json({ success: true, alreadyCompleted: true });
    }
    if (completionError) {
      return NextResponse.json({ error: completionError.message }, { status: 500 });
    }

    let rewardXp = practiceQuestion?.reward_xp;
    let rewardCoins = practiceQuestion?.reward_coins;

    if (!practiceQuestion) {
      const { data: challenge } = await supabase
        .from("challenges")
        .select("reward_xp, reward_coins")
        .eq("id", challengeId)
        .single();
      rewardXp = challenge?.reward_xp;
      rewardCoins = challenge?.reward_coins;

      const { error: submissionError } = await supabase.from("submissions").insert({
        user_id: user.id,
        challenge_id: challengeId,
        code,
      });
      if (submissionError) {
        return NextResponse.json({ error: submissionError.message }, { status: 500 });
      }
    }

    const { error: rpcError } = await supabase.rpc(
      "add_user_rewards",
      {
        p_user_id: user.id,
        p_xp_gain: rewardXp ?? 10,
        p_coin_gain: rewardCoins ?? 5,
      },
    );

    
    

    if (rpcError) {
      await supabase
        .from("practice_completions")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", challengeId);

      return NextResponse.json(
        {
          error: "RPC failed",
          details: rpcError,
        },
        { status: 500 },
      );
    }

    

    return NextResponse.json({
      success: true,
      completion,
      xp: rewardXp ?? 10,
      coins: rewardCoins ?? 5,
    });
  } catch (err) {
    

    return NextResponse.json(
      {
        error: "Server error",
        details: err instanceof Error ? err.message : err,
      },
      { status: 500 },
    );
  }
}
