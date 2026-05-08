/**
 * Firebase Web SDK singleton for the gated admin pages.
 *
 * Reads NEXT_PUBLIC_FIREBASE_* env vars (set in Vercel for the marketing app).
 * These values are safe to ship in the client bundle — Firebase security
 * relies on Firestore rules + Auth, not on hiding the API key.
 *
 * Required envs:
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * Optional:
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 */
"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

let cachedApp: FirebaseApp | null = null;
let authPersistencePromise: Promise<void> | null = null;

function ensureApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  if (!config.apiKey || !config.projectId) {
    throw new Error(
      "Firebase web config missing — set NEXT_PUBLIC_FIREBASE_* env vars in Vercel."
    );
  }
  cachedApp = getApps().length ? getApp() : initializeApp(config);
  return cachedApp;
}

export function firebaseAuth(): Auth {
  return getAuth(ensureApp());
}

/** Keeps sessions across tabs/refreshes; call before sign-in. */
export function ensureAuthPersistence(): Promise<void> {
  const auth = firebaseAuth();
  if (!authPersistencePromise) {
    authPersistencePromise = setPersistence(auth, browserLocalPersistence).catch(
      (e) => {
        console.warn("Auth persistence", e);
      }
    );
  }
  return authPersistencePromise;
}

export function firestore(): Firestore {
  return getFirestore(ensureApp());
}
