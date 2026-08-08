/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ friendId: string }> },
) {
  try {
    const { friendId } = await params;
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return Response.json({ messages: [] }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("messages")
      .select("id, sender_id, recipient_id, content, created_at")
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${user.id})`,
      )
      .order("created_at", { ascending: true });

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ messages: data ?? [] });
  } catch (err: any) {
    return Response.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ friendId: string }> },
) {
  try {
    const { friendId } = await params;
    const supabase = await createClient();
    const body = await req.json();
    const { content } = body;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!content || String(content).trim().length < 1) {
      return Response.json({ message: "Message cannot be empty" }, { status: 400 });
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: friendId,
      content: String(content).trim(),
    });

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
