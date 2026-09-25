import { NextResponse, type NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  // Proxy intentionally disabled.
  // No Supabase authentication.
  // No session checks.
  // No redirects.
  // No route protection.
  return NextResponse.next();
}
