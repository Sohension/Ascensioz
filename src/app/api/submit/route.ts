import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

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

    // 1. Save submission
    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        code,
      })
      .select()
      .single();

    if (subError) {
      return NextResponse.json(subError, { status: 500 });
    }

    // 2. Get reward info from challenge
    const { data: challenge } = await supabase
      .from("challenges")
      .select("reward_xp, reward_coins")
      .eq("id", challengeId)
      .single();

    // 3. Update stats (simple version)
    // 3. Update stats
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "add_user_rewards",
      {
        p_user_id: user.id,
        p_xp_gain: challenge?.reward_xp ?? 10,
        p_coin_gain: challenge?.reward_coins ?? 5,
      },
    );

    
    

    if (rpcError) {
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
      submission,
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
