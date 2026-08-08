/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return Response.json({ users: [], friendships: [] }, { status: 401 });
    }

    const url = new URL(req.url);
    const query = (url.searchParams.get("query") ?? "").trim();

    if (query) {
      const { data: accountMatches, error: accountError } = await supabase
        .from("profiles")
        .select("id, username")
        .ilike("username", `%${query}%`)
        .limit(20);

      if (accountError) {
        return Response.json({ message: accountError.message }, { status: 500 });
      }

      const matchedIds = (accountMatches ?? []).map((profile) => profile.id);

      const followingQuery = await supabase
        .from("friendships")
        .select("friend_id")
        .eq("user_id", user.id)
        .in("friend_id", matchedIds.length > 0 ? matchedIds : ["00000000-0000-0000-0000-000000000000"]);

      if (followingQuery.error) {
        return Response.json({ message: followingQuery.error.message }, { status: 500 });
      }

      const followingIds = new Set(
        (followingQuery.data ?? []).map((row) => row.friend_id),
      );

      const { data: followerRows, error: followerError } = await supabase
        .from("friendships")
        .select("friend_id, user_id");

      if (followerError) {
        return Response.json({ message: followerError.message }, { status: 500 });
      }

      const followerCounts = new Map<string, number>();

      for (const row of followerRows ?? []) {
        const current = followerCounts.get(row.friend_id) ?? 0;
        followerCounts.set(row.friend_id, current + 1);
      }

      return Response.json({
        users: (accountMatches ?? []).map((profile) => ({
          id: profile.id,
          username: profile.username,
          following: followingIds.has(profile.id),
          followers: followerCounts.get(profile.id) ?? 0,
          online: true,
          avatar: String(profile.username).slice(0, 1).toUpperCase(),
        })),
      });
    }

    const { data: friendships, error } = await supabase
      .from("friendships")
      .select("friend_id, profiles:friend_id ( id, username )")
      .eq("user_id", user.id);

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({
      friendships: friendships ?? [],
    });
  } catch (err: any) {
    return Response.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const targetId = body?.targetId || body?.friendId || body?.profileId;

    if (!targetId || !String(targetId).trim()) {
      return Response.json({ message: "Missing target profile" }, { status: 400 });
    }

    if (targetId === user.id) {
      return Response.json({ message: "Cannot follow yourself" }, { status: 400 });
    }

    const { error } = await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: targetId,
    });

    if (error) {
      if (String(error.message).toLowerCase().includes("duplicate")) {
        return Response.json({ success: true, alreadyFollowing: true });
      }

      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ success: true, alreadyFollowing: false });
  } catch (err: any) {
    return Response.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetId = body?.targetId || body?.friendId || body?.profileId;

    if (!targetId) {
      return Response.json({ message: "Missing target profile" }, { status: 400 });
    }

    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("user_id", user.id)
      .eq("friend_id", targetId);

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
