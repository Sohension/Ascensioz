import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/client";

export async function getProfile(id: string) {
  return unstable_cache(
    async () => {
      const supabase = await createClient();

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      return data;
    },
    [`profile-${id}`],
    {
      revalidate: 300,
      tags: [`profile-${id}`],
    },
  )();
}
