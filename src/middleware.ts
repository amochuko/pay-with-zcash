import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_PAY_WITH_ZCASH, verifyJwt } from "./app/lib/session";

const publicRoutes = ["/login", "/sign-up"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const cookie = String(cookieStore.get(SESSION_PAY_WITH_ZCASH)?.value);

  if (!cookie && isProtectedRoute) {
    console.log("No session cookie found.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verifying the session cookie JWT
    const session = await verifyJwt(cookie);

    // If protected route and session is invalid (no userId), redirect to login
    if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If public route and session exists (user is logged in), redirect to dashboard
    if (isPublicRoute && session?.userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (err) {
    console.error("Error verifying session: ", err);
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  return NextResponse.next(); // Proceed if no issue
}

export const config = {
  // Matcher is used to specify which route(s) the middleware is executed on
  // Executes the above function whenever this list of urlPath is reached
  matcher: [
    "/dashboard",
    "/login",
    "/sign-up",
    "/dashboard/categories",
    "/dashboard/merchants",
    "/dashboard/settings",
  ],
};
