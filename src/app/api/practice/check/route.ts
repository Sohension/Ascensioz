import { NextResponse } from "next/server";
import {
  getPythonPracticeQuestion,
  validatePythonPracticeSolution,
} from "@/lib/python-practice";

export async function POST(req: Request) {
  const { challengeId, code } = await req.json();
  const question = getPythonPracticeQuestion(challengeId);

  if (!question || typeof code !== "string") {
    return NextResponse.json(
      { error: "Unknown challenge or invalid code" },
      { status: 400 },
    );
  }

  const correct = validatePythonPracticeSolution(question.id, code);

  return NextResponse.json({
    correct,
    expectedOutput: question.expectedOutput,
  });
}
