import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rate limiting configuration
 * Uses in-memory storage for simplicity. For production with multiple instances,
 * consider using Redis or another distributed cache.
 */
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 100 requests per minute per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS = 100;

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as the key, fallback to a default if not available
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimit.entries());
  entries.forEach(([key, record]) => {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  });
}, RATE_LIMIT_WINDOW);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to all routes except static assets
  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static") &&
    !pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif)$/)
  ) {
    const key = getRateLimitKey(request);
    const allowed = checkRateLimit(key);

    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "text/plain",
        },
      });
    }
  }

  // Protect /cms route in production
  if (pathname.startsWith("/cms")) {
    // In production, you might want to add IP whitelisting or additional authentication
    // For now, we'll just add a warning header in development
    const response = NextResponse.next();

    if (process.env.NODE_ENV === "production") {
      // Add security warning header
      response.headers.set(
        "X-CMS-Access",
        "Restricted - Authenticated users only"
      );
    }

    return response;
  }

  // Enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (health checks)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
