import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

// Public routes
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api/game") ||
    request.nextUrl.pathname.startsWith("/api/python") ||
    request.nextUrl.pathname === "/ide";

// Redirect unauthenticated users
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // ---- Caching headers ----
  const res = supabaseResponse;
  const urlPath = request.nextUrl.pathname;

  // Never cache auth-sensitive dynamic routes.
  const noCachePaths =
    urlPath.startsWith("/api/") ||
    urlPath.startsWith("/dashboard") ||
    urlPath.startsWith("/profile") ||
    urlPath.startsWith("/friends") ||
    urlPath.startsWith("/practice") ||
    urlPath.startsWith("/ide") ||
    urlPath.startsWith("/auth");

  if (noCachePaths) {
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
  } else if (
    urlPath.startsWith("/_next/static") ||
    urlPath.startsWith("/game") ||
    /\.(gif|mp4|webm|mp3|png|jpg|jpeg|svg|ico|woff2?)$/i.test(urlPath)
  ) {
    // Immutable long-lived cache for fingerprint-hashed build assets & media.
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    // Public pages get a short revalidation cache for better TTFB.
    res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }

  return res;
}
