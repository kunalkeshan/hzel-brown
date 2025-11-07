"use client";

import { auth } from "./app";
import type { User } from "firebase/auth";

const AUTH_TOKEN_COOKIE_NAME = "firebase-auth-token";

/**
 * Get the current user's Firebase Auth ID token.
 * Returns null if no user is authenticated.
 *
 * @param forceRefresh - If true, forces token refresh even if not expired
 * @returns ID token string if user is authenticated, null otherwise
 */
export async function getAuthToken(
  forceRefresh: boolean = false
): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken(forceRefresh);
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Refresh the current user's auth token.
 * This is useful when you know the token might be expired.
 *
 * @returns Refreshed ID token string if user is authenticated, null otherwise
 */
export async function refreshAuthToken(): Promise<string | null> {
  return getAuthToken(true);
}

/**
 * Store auth token in a cookie.
 * Uses document.cookie for client-side storage.
 * Note: For production, consider using HTTP-only cookies via an API route.
 *
 * @param token - The auth token to store
 */
export function storeAuthToken(token: string): void {
  if (typeof document === "undefined") {
    return;
  }

  // Set cookie with 1 hour expiration (matching Firebase token expiration)
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Clear the auth token cookie.
 */
export function clearAuthToken(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Get and store the current user's auth token.
 * This is a convenience function that gets the token and stores it in a cookie.
 *
 * @param forceRefresh - If true, forces token refresh even if not expired
 * @returns ID token string if user is authenticated, null otherwise
 */
export async function getAndStoreAuthToken(
  forceRefresh: boolean = false
): Promise<string | null> {
  const token = await getAuthToken(forceRefresh);
  if (token) {
    storeAuthToken(token);
  }
  return token;
}

/**
 * Set up automatic token refresh for the current user.
 * Tokens expire after 1 hour, so we refresh them every 50 minutes.
 *
 * @param user - The authenticated user
 * @returns Cleanup function to stop the refresh interval
 */
export function setupTokenRefresh(user: User): () => void {
  // Refresh token every 50 minutes (tokens expire after 1 hour)
  const refreshInterval = setInterval(async () => {
    try {
      const token = await refreshAuthToken();
      if (token) {
        storeAuthToken(token);
      }
    } catch (error) {
      console.error("Error refreshing auth token:", error);
    }
  }, 50 * 60 * 1000); // 50 minutes in milliseconds

  // Also refresh immediately to ensure we have a fresh token
  getAndStoreAuthToken(false).catch((error) => {
    console.error("Error getting initial auth token:", error);
  });

  // Return cleanup function
  return () => {
    clearInterval(refreshInterval);
  };
}
