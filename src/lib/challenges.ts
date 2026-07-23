import { createClient } from "@/lib/client";
import { getPythonPracticeQuestion } from "@/lib/python-practice";

export async function getChallenges(courseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at");

  if (error) throw error;

  return data;
}

export async function getChallenge(id: string) {
  const practiceQuestion = getPythonPracticeQuestion(id);
  if (practiceQuestion) return practiceQuestion;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getChallengeTestCases(challengeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenge_test_cases")
    .select("*")
    .eq("challenge_id", challengeId);

  if (error) throw error;

  return data;
}
