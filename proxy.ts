import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/admin";

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const headers = response.headers;

  // Security headers
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Admin route protection
  if (request.nextUrl.pathname.startsWith(ADMIN_PATH)) {
    const token = request.nextUrl.searchParams.get("token");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || token !== adminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
