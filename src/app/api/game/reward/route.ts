import { NextResponse } from "next/server";
import { admin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const { user_id, xp, coins } = await req.json();

    if (!user_id || xp == null || coins == null) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Get current stats
    const { data: currentStats, error: fetchError } = await admin
      .from("user_stats")
      .select("xp, coins")
      .eq("user_id", user_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Update stats
    const { error: updateError } = await admin
      .from("user_stats")
      .update({
        xp: currentStats.xp + xp,
        coins: currentStats.coins + coins,
      })
      .eq("user_id", user_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Rewards updated successfully!",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
