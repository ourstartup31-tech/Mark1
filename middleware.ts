import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("supermarket_token")?.value;
  const { pathname } = req.nextUrl;

  // 1. If no token, and trying to access protected routes -> redirect to login
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/superadmin") || pathname.startsWith("/checkout")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // 2. Prevent logged-in users from accessing /login
    if (pathname === "/login") {
       if (role === "superadmin") return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
       if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
       return NextResponse.redirect(new URL("/", req.url));
    }

    // 3. Role-based routing
    if (pathname.startsWith("/superadmin") && role !== "superadmin") {
       return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
        if (role === "superadmin") return NextResponse.next(); // Allow superadmin to see admin?
        return NextResponse.redirect(new URL("/", req.url));
    }

    // If customer area and user is admin/superadmin, maybe redirect them to their dashboard?
    // User said "/ → only role = 'customer'". This is strict.
    if (pathname === "/" && role !== "customer") {
        if (role === "superadmin") return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
        if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token -> clear and redirect
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("supermarket_token");
    return response;
  }
}

// Config to match only relevant routes
export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/superadmin/:path*",
    "/checkout/:path*",
  ],
};
