import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  // Try multiple ways to get the token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
    secureCookie: false, // Set to false for localhost
  });

  console.log("Middleware check:", {
    pathname: req.nextUrl.pathname,
    hasToken: !!token,
    token: token ? "exists" : "null",
    cookies: req.cookies.getAll().map((c) => c.name),
  });

  // Allow access to login page and API routes without authentication
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/api/auth") ||
    req.nextUrl.pathname.startsWith("/api/version") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon.ico") ||
    req.nextUrl.pathname.startsWith("/api/")
  ) {
    console.log("Allowing access to:", req.nextUrl.pathname);
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    console.log("No token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Token found, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - api/version (version API route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     * - login (login page)
     */
    "/((?!api/auth|api/version|_next/static|_next/image|favicon.ico|public|login).*)",
  ],
};
