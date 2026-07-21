import { NextResponse } from "next/server";

function normalize(code: string) {
  return code.replace(/\s+/g, "").replace(/['"]/g, '"').trim().toLowerCase();
}

export async function POST(req: Request) {
  const { code } = await req.json();

  const expected = `print("hello world")`;

  const correct = normalize(code) === normalize(expected);

  return NextResponse.json({
    correct,
  });
}
