import { NextRequest, NextResponse } from "next/server";
import logger from "./app/lib/logger";
import { serverEnv } from "./app/lib/server-env";
import { verifyJwt } from "./app/lib/session";

const publicRoutes = ["/login", "/sign-up"];

// Routes that require an authenticated session (any role)
const userRoutes = ["/dashboard"];

// Routes that require an authenticated session AND an admin role)
const adminRoutes = ["/admin/dashboard"];

function matchesRoute(path: string, routes: string[]) {
  return routes.some((route) => path === route || path.startsWith(`${route}/`));
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(path);
  const isUserRoute = matchesRoute(path, userRoutes);
  const isAdminRoute = matchesRoute(path, adminRoutes);

  // Any route that needs at least a logged-in session
  const isProtectedRoute = isUserRoute || isAdminRoute;

  const cookie = req.cookies.get(serverEnv.SESSION_PAY_WITH_ZCASH)?.value;

  if (!cookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verifying the session cookie JWT
    const session = cookie ? await verifyJwt(cookie) : null;

    // If protected route and session is invalid (no userId), redirect to login
    if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Admin-only area: block non-admins from reaching `/admin/**
    if (isAdminRoute && session?.userRole !== "admin") {
      // Logged-in regular users get sent to their own dashboard;
      // anyone else (bad/expired token) goes to login
      return NextResponse.redirect(
        new URL(
          session?.userRole === "user" ? "/dashboard" : "/login",
          req.url,
        ),
      );
    }

    // User-only area
    if (isUserRoute && session?.userRole !== "user") {
      return NextResponse.redirect(
        new URL(
          session?.userRole === "admin" ? "/admin/dashboard" : "/login",
          req.url,
        ),
      );
    }

    // Authenticated users visiting public routes -> send to the right dashboard by role
    if (isPublicRoute && session?.userId) {
      const destination =
        session?.userRole === "admin"
          ? "/admin/dashboard"
          : session?.userRole === "user"
            ? "/dashboard"
            : null;

      if (destination) {
        return NextResponse.redirect(new URL(destination, req.url));
      }
    }

  } catch (err) {
    logger.error("[proxy auth]", err);

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
    "/login",
    "/sign-up",
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
  ],
};
