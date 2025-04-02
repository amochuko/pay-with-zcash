import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_PAY_WITH_ZCASH } from "./app/lib/config";
import { verifyJwt } from "./app/lib/session";

const publicRoutes = ["/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const cookie = String(cookieStore.get(SESSION_PAY_WITH_ZCASH)?.value);

  const session = await verifyJwt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher is used to specify which route(s) the middleware is executed on
  // Executes the above function whenever this list of urlPath is reached
  matcher: [
    "/dashboard",
    "/login",
    "/dashboard/categories",
    "/dashboard/merchants",
    "/dashboard/settings",
  ],
};
