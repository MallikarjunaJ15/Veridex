import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  if (request.nextUrl.pathname.startsWith("/register")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
