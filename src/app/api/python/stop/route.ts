import { NextResponse } from "next/server";
import { stopPython } from "@/lib/python/runner";
import type { PythonStopRequest } from "@/lib/python/types";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { runId } = (body ?? {}) as Partial<PythonStopRequest>;

  if (typeof runId !== "string" || runId.length === 0) {
    return NextResponse.json({ error: "Missing runId" }, { status: 400 });
  }

  const stopped = stopPython(runId);

  return NextResponse.json({ ok: stopped });
}
