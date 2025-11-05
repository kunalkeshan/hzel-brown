"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

/**
 * CartHydration component
 *
 * This component manually triggers Zustand store rehydration after the client has mounted.
 * This prevents hydration mismatches between server and client by ensuring the store
 * state is synchronized only after Next.js has completed its initial hydration.
 *
 * Why this is needed:
 * - During SSR, sessionStorage doesn't exist, so the store starts with empty state
 * - On the client, we need to restore the persisted state from sessionStorage
 * - Using skipHydration + manual rehydration ensures this happens after React hydration
 *
 * Usage: Import this component in the root layout
 */
export function CartHydration() {
  useEffect(() => {
    // Manually trigger rehydration after client-side mount
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
