import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log({ req: req.url });

  // if (req.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.rewrite(new URL("/dashboard-admin", req.url));
  // }

  return NextResponse.redirect(new URL("/find-an-atm", req.url));
}

export const config = {
  // Matcher is used to specify which route(s) the middleware is executed on
  // Executes the above function whenever this list of urlPath is reached
  matcher: ["/about/:path"],
};
