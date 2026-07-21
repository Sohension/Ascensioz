import { createClient } from "@/lib/client";

export async function getCourses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at");

  if (error) throw error;

  return data;
}

export async function getCourse(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}
