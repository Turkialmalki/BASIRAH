import { NextResponse, type NextRequest } from "next/server";

/**
 * MVP admin gate: a single shared `ADMIN_ACCESS_CODE`, set as an
 * httpOnly cookie after `/login`. This is deliberately not per-user RBAC
 * — every write actually happens server-side via the service-role client
 * (`src/lib/supabaseServer.ts`), so this cookie is the only thing standing
 * between "anyone with the URL" and "can edit content." Real per-editor
 * accounts (Supabase Auth + a `role` on `profiles`) are Phase 9/10
 * hardening, once there's more than one editor.
 */
const COOKIE_NAME = "basirah_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (session !== process.env.ADMIN_ACCESS_CODE) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
