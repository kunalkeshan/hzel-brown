import {
  initializeServerApp,
  type FirebaseServerAppSettings,
} from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { headers } from "next/headers";
import { getAuthToken } from "./server-token";

interface ServerAppOptions {
  authIdToken?: string;
  appCheckToken?: string;
}

/**
 * Get or initialize a Firebase Server App instance.
 * This is for server-side use only in Next.js App Router.
 *
 * When an auth token is provided, all Firebase operations (including Firestore queries)
 * will run in the context of the authenticated user.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param options - Optional configuration including auth and app check tokens
 * @returns Object containing server app, auth, and firestore instances
 */
export async function getServerApp(options: ServerAppOptions = {}) {
  let { authIdToken, appCheckToken } = options;

  // If authIdToken is not provided, try to get it from headers or cookies
  if (!authIdToken) {
    const token = await getAuthToken();
    if (token) {
      authIdToken = token;
    }
  }

  // Get Next.js headers for releaseOnDeref automatic cleanup
  const headersObj = await headers();

  const serverAppSettings: FirebaseServerAppSettings = {
    ...(authIdToken && { authIdToken }),
    ...(appCheckToken && { appCheckToken }),
    // Automatically clean up when headers object is garbage collected
    releaseOnDeref: headersObj,
  };

  // Initialize server app (will reuse existing instance if same config)
  const serverApp = initializeServerApp(firebaseConfig, serverAppSettings);

  return {
    app: serverApp,
    auth: getAuth(serverApp),
    firestore: getFirestore(serverApp),
  };
}

/**
 * Get server-side Auth instance.
 * Use this in server components, server actions, and API routes.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns Auth instance configured for server-side use
 */
export async function getServerAuth(authIdToken?: string): Promise<Auth> {
  const { auth } = await getServerApp({ authIdToken });
  return auth;
}

/**
 * Get server-side Firestore instance.
 * Use this in server components, server actions, and API routes.
 *
 * When authIdToken is provided (or automatically read from headers/cookies),
 * all Firestore queries will run in the authenticated user's context,
 * allowing you to use Security Rules.
 *
 * If authIdToken is not provided, it will automatically try to read from headers or cookies.
 *
 * @param authIdToken - Optional Firebase Auth ID token from client
 * @returns Firestore instance configured for server-side use
 */
export async function getServerFirestore(
  authIdToken?: string
): Promise<Firestore> {
  const { firestore } = await getServerApp({ authIdToken });
  return firestore;
}
