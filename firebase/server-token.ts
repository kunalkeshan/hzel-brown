import { cookies, headers } from "next/headers";

const AUTH_TOKEN_COOKIE_NAME = "firebase-auth-token";
const AUTH_TOKEN_HEADER_NAME = "authorization";

/**
 * Extract auth token from Authorization header.
 * Supports both "Bearer <token>" and plain token formats.
 *
 * @returns Auth token string if found, null otherwise
 */
export async function getAuthTokenFromHeaders(): Promise<string | null> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get(AUTH_TOKEN_HEADER_NAME);

    if (!authHeader) {
      return null;
    }

    // Support "Bearer <token>" format
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Support plain token format
    return authHeader;
  } catch (error) {
    // Headers might not be available in all contexts
    return null;
  }
}

/**
 * Extract auth token from cookies.
 *
 * @returns Auth token string if found, null otherwise
 */
export async function getAuthTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
    return token?.value ?? null;
  } catch (error) {
    // Cookies might not be available in all contexts
    return null;
  }
}

/**
 * Get auth token from headers or cookies.
 * Tries headers first (for API routes), then falls back to cookies.
 *
 * @returns Auth token string if found, null otherwise
 */
export async function getAuthToken(): Promise<string | null> {
  // Try headers first (for API routes and server actions)
  const headerToken = await getAuthTokenFromHeaders();
  if (headerToken) {
    return headerToken;
  }

  // Fall back to cookies (for server components)
  const cookieToken = await getAuthTokenFromCookies();
  return cookieToken;
}
