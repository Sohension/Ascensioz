import { NextResponse } from "next/server";
import { runPython, DEFAULT_TIMEOUT_MS } from "@/lib/python/runner";
import type { PythonRunRequest } from "@/lib/python/types";

export const maxDuration = 30;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { files, entry, runId, timeoutMs } = (body ?? {}) as Partial<PythonRunRequest> & {
    timeoutMs?: number;
  };

  if (!files || typeof files !== "object") {
    return NextResponse.json(
      { error: "Missing 'files' object" },
      { status: 400 },
    );
  }

  // Clamp the timeout to a safe range.
  const safeTimeout =
    typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
      ? Math.min(Math.max(Math.floor(timeoutMs), 1000), 30_000)
      : DEFAULT_TIMEOUT_MS;

  const result = await runPython({ files, entry, runId }, safeTimeout);

  return NextResponse.json(result);
}
