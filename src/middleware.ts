import { NextResponse, type NextRequest } from "next/server";

const allowedOrigins = [
  "https://www.dashboard.chotuengineer.com",
  "https://api.chotuengineer.com"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  const requestOrigin = request.headers.get("origin");

  if (pathname.startsWith("/api")) {
    if (method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        response.headers.set("Access-Control-Allow-Origin", requestOrigin);
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Max-Age", "86400");
      }
      return response;
    }

    const response = NextResponse.next();
    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      response.headers.set("Access-Control-Allow-Origin", requestOrigin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};