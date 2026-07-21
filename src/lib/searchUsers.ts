import { createClient } from "@/lib/client";

export async function searchUsers(query: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .ilike("username", `%${query}%`)
    .limit(10);

  if (error) throw error;

  return data ?? [];
}
