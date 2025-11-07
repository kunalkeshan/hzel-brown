import { getServerAuth } from "./server-app";
import type { User } from "firebase/auth";

/**
 * Get the current authenticated user from server-side auth.
 * Returns null if no user is authenticated.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns User object if authenticated, null otherwise
 */
export async function getServerUser(
  authIdToken?: string
): Promise<User | null> {
  try {
    const auth = await getServerAuth(authIdToken);
    return auth.currentUser;
  } catch (error) {
    // If auth token is invalid or expired, return null
    return null;
  }
}

/**
 * Require an authenticated user. Throws an error if no user is authenticated.
 * Use this when you need to ensure a user is logged in before proceeding.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns User object (never null)
 * @throws Error if user is not authenticated
 */
export async function requireServerUser(authIdToken?: string): Promise<User> {
  const user = await getServerUser(authIdToken);

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Get the current user's ID safely.
 * Returns null if no user is authenticated.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns User ID string if authenticated, null otherwise
 */
export async function getServerUserId(
  authIdToken?: string
): Promise<string | null> {
  const user = await getServerUser(authIdToken);
  return user?.uid ?? null;
}

/**
 * Get the current user's email safely.
 * Returns null if no user is authenticated or email is not available.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns User email string if authenticated and available, null otherwise
 */
export async function getServerUserEmail(
  authIdToken?: string
): Promise<string | null> {
  const user = await getServerUser(authIdToken);
  return user?.email ?? null;
}

/**
 * Get the current user's display name safely.
 * Returns null if no user is authenticated or display name is not available.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns User display name string if authenticated and available, null otherwise
 */
export async function getServerUserDisplayName(
  authIdToken?: string
): Promise<string | null> {
  const user = await getServerUser(authIdToken);
  return user?.displayName ?? null;
}

/**
 * Check if a user is currently authenticated.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns true if user is authenticated, false otherwise
 */
export async function isServerUserAuthenticated(
  authIdToken?: string
): Promise<boolean> {
  const user = await getServerUser(authIdToken);
  return user !== null;
}
