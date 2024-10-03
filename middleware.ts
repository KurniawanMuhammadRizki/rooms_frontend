import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  console.log("Session:", session);

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      console.log("No session, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRoles = session.user?.roles;
    const hasTenantRole = Array.isArray(userRoles)
      ? userRoles.includes("TENANT")
      : userRoles === "TENANT";

    if (!hasTenantRole) {
      console.log(
        "User does not have the TENANT role, redirecting to unauthorized"
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/checkout")) {
    if (!session) {
      console.log("No session, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRoles = session.user?.roles;
    const hasUserRole = Array.isArray(userRoles)
      ? userRoles.includes("USER")
      : userRoles === "USER";

    if (!hasUserRole) {
      console.log(
        "User does not have the USER role, redirecting to unauthorized"
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/user")) {
    if (!session) {
      console.log("No session, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRoles = session.user?.roles;
    const hasRequiredRole = Array.isArray(userRoles)
      ? userRoles.includes("USER") || userRoles.includes("TENANT")
      : userRoles === "TENANT" || userRoles === "USER";

    if (!hasRequiredRole) {
      console.log(
        "User does not have the required role, redirecting to unauthorized"
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
    "/user/:path*",
  ],
};
