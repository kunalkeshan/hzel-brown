"use client";

import { useEffect, useRef } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/firebase/app";
import { useUserStore } from "@/stores/user-store";
import {
  getAndStoreAuthToken,
  setupTokenRefresh,
  clearAuthToken,
} from "@/firebase/client-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const tokenRefreshCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Set up auth state listener to keep user store in sync
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // User is signed in
        setUser(user);

        // Get and store auth token
        await getAndStoreAuthToken(false);

        // Set up automatic token refresh
        // Clean up previous refresh interval if it exists
        if (tokenRefreshCleanupRef.current) {
          tokenRefreshCleanupRef.current();
        }
        tokenRefreshCleanupRef.current = setupTokenRefresh(user);
      } else {
        // User is signed out
        setUser(null);

        // Clear auth token cookie
        clearAuthToken();

        // Clean up token refresh interval
        if (tokenRefreshCleanupRef.current) {
          tokenRefreshCleanupRef.current();
          tokenRefreshCleanupRef.current = null;
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      if (tokenRefreshCleanupRef.current) {
        tokenRefreshCleanupRef.current();
      }
    };
  }, [setUser]);

  return <>{children}</>;
}
