import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;
    const protectedRoutes = ["/dashboard", "/analyze"];
    const authRoutes = ["/login", "/register"];

    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
    const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

    // 1. Protected route with no token -> boot to login
    if (isProtected && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Auth route with valid token -> send to dashboard
    if (token && isAuthRoute) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (error) {
        // Token invalid/expired -> let them view auth routes
        return NextResponse.next();
      }
    }

    // 3. Protected route with a token -> verify it
    if (isProtected && token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/analyze/:path*", "/login", "/register"],
};
