import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function generateCsp() {
  // generate random nonce converted to base64. Must be different on every HTTP page load
  // const nonce = crypto.randomBytes(16).toString('base64')
  const nonce = crypto.randomUUID();

  const csp = [
    { name: "default-src", values: ["'self'"] },
    {
      name: "script-src",
      values: [
        "'report-sample'",
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
      ],
    },
    {
      name: "style-src",
      values: ["'report-sample'", "'self'", `'nonce-${nonce}'`],
    },
    {
      name: "connect-src",
      values: ["'self'"],
    },
    { name: "font-src", values: ["'self'", "data:"] },
    { name: "img-src", values: ["'self'", "data:"] },
    { name: "worker-src", values: ["'self'", "blob:"] },
    { name: "frame-ancestors", values: ["'none'"] },
    { name: "form-action", values: ["'self'"] },
  ];

  const cspString = csp
    .map((directive) => {
      return `${directive.name} ${directive.values.join(" ")}`;
    })
    .join("; ");

  return { csp: cspString, nonce };
}

export async function middleware(req: NextRequest) {
  // Waitlist is whitelisted
  if (req.nextUrl.pathname.startsWith("/api/form/waitlist")) {
    return NextResponse.next();
  }

  const { csp, nonce } = generateCsp();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const headerKey =
    req.nextUrl.pathname === "/csp-report-only"
      ? "content-security-policy-report-only"
      : "content-security-policy";

  requestHeaders.set(headerKey, csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(headerKey, csp);

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // // if user is signed in and the current path is /login the user to the app
  if (session && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/discover", req.url));
  }

  // Redirect straight to app if they are on landing page
  if (session && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/feed/all", req.url));
  }

  if (session && req.nextUrl.pathname === "/signup") {
    return NextResponse.redirect(new URL("/discover", req.url));
  }

  // Check if the user is on a page they aren't supposed to be on
  if (
    !session &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/signup" &&
    req.nextUrl.pathname !== "/pricing"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/api/form/waitlist",
    "/feed/:path*",
    "/discover",
    "/folder",
    "/recentlyread",
    "/bookmarks",
    "/login",
    "/signup",
  ],
};
