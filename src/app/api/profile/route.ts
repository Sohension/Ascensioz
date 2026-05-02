/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { username, description } = body;

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      description,
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return Response.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return new Response(err.message || "Server error", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return new Response(err.message || "Server error", { status: 500 });
  }
}
