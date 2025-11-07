/**
 * CLIENT-SIDE FIREBASE CONFIGURATION
 *
 * This file is for client-side use only (browser/React components).
 * For server-side use (server components, server actions, API routes),
 * use firebase/server-app.ts instead.
 *
 * @see firebase/server-app.ts for server-side Firebase configuration
 */

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase (prevent multiple initializations)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with proper persistence for Next.js App Router
export const auth = getAuth(app);

// Set persistence to local storage (important for Next.js App Router)
// This ensures auth state persists across page reloads
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
}

export const db = getFirestore(app);
// const analytics = getAnalytics(app);
