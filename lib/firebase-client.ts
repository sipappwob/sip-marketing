/**
 * Firebase Web SDK singleton for the gated admin pages.
 *
 * Staging / Preview / local dev — keep existing Vercel names (sip-staging-70488):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (optional)
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (optional)
 *
 * Production only (www.sipapp.co) — add separate *_PROD_* vars (sip-prod-29422):
 *   NEXT_PUBLIC_FIREBASE_PROD_API_KEY
 *   NEXT_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_PROD_APP_ID
 *   NEXT_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET (optional)
 *   NEXT_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID (optional)
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
import { getFunctions, httpsCallable, type Functions } from "firebase/functions";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function readProdConfig(): FirebaseWebConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PROD_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET ?? "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_PROD_APP_ID ?? "",
  };
}

function readDefaultConfig(): FirebaseWebConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

function isComplete(c: FirebaseWebConfig): boolean {
  return Boolean(c.apiKey && c.authDomain && c.projectId && c.appId);
}

function resolveFirebaseConfig(): FirebaseWebConfig {
  const onProd = process.env.VERCEL_ENV === "production";

  if (onProd) {
    const prod = readProdConfig();
    if (isComplete(prod)) return prod;
  }

  const staging = readDefaultConfig();
  if (isComplete(staging)) return staging;

  return onProd ? readProdConfig() : staging;
}

const config = resolveFirebaseConfig();

let cachedApp: FirebaseApp | null = null;
let cachedFunctions: Functions | null = null;
let authPersistencePromise: Promise<void> | null = null;

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("This Firebase helper runs only in the browser.");
  }
}

function ensureApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  if (
    !config.apiKey ||
    !config.authDomain ||
    !config.projectId ||
    !config.appId
  ) {
    throw new Error(
      "Firebase web config incomplete — on production set NEXT_PUBLIC_FIREBASE_PROD_*; otherwise set NEXT_PUBLIC_FIREBASE_* (staging)."
    );
  }
  cachedApp = getApps().length ? getApp() : initializeApp(config);
  return cachedApp;
}

export function firebaseAuth(): Auth {
  ensureBrowser();
  return getAuth(ensureApp());
}

export function firebaseFunctions(): Functions {
  ensureBrowser();
  if (!cachedFunctions) {
    cachedFunctions = getFunctions(firebaseAuth().app, "us-east1");
  }
  return cachedFunctions;
}

/** Server verifies Email/Password user + super_admins/{uid} before password reset. */
export async function assertSuperAdminForPasswordReset(
  email: string
): Promise<void> {
  const fn = httpsCallable<{ email: string }, { ok: true }>(
    firebaseFunctions(),
    "assertSuperAdminForPasswordReset"
  );
  const res = await fn({ email: email.trim().toLowerCase() });
  if (!res.data?.ok) {
    throw new Error("Could not verify super admin account.");
  }
}

/** Keeps sessions across tabs/refreshes; call before sign-in. */
export function ensureAuthPersistence(): Promise<void> {
  ensureBrowser();
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
  ensureBrowser();
  return getFirestore(ensureApp());
}

// ——— DMCA Super Admin callables (see docs/DMCA_SOP.md) ———

export type DmcaPostLookup = {
  postId: string;
  authorId: string | null;
  authorUsername: string | null;
  eventTitle: string | null;
  description: string | null;
  moderationStatus: string;
  copyrightStrikes: number;
  repeatInfringerThreshold: number;
};

export type DmcaLogRow = {
  id: string;
  type: string;
  postId?: string | null;
  authorId?: string | null;
  notes?: string | null;
  performedByEmail?: string | null;
  createdAt: number | null;
};

function callableErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: string }).message);
  }
  return "Request failed.";
}

export async function adminDmcaLookupPost(postId: string): Promise<DmcaPostLookup> {
  const fn = httpsCallable<{ postId: string }, DmcaPostLookup>(
    firebaseFunctions(),
    "adminDmcaLookupPost"
  );
  try {
    const res = await fn({ postId: postId.trim() });
    return res.data;
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}

export async function adminDmcaRemovePost(params: {
  postId: string;
  dmcaNoticeId?: string;
  notes?: string;
  source?: string;
}): Promise<{ message: string; repeatInfringerFlag: boolean; copyrightStrikes: number }> {
  const fn = httpsCallable<
    typeof params,
    { message: string; repeatInfringerFlag: boolean; copyrightStrikes: number }
  >(firebaseFunctions(), "adminDmcaRemovePost");
  try {
    const res = await fn(params);
    return res.data;
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}

export async function adminDmcaRecordLog(params: {
  type: "notice_received" | "counter_notice" | "restored" | "termination";
  postId?: string;
  authorId?: string;
  dmcaNoticeId?: string;
  notes?: string;
  counterNoticeFrom?: string;
  originalComplainantEmail?: string;
}): Promise<void> {
  const fn = httpsCallable<typeof params, { ok: true }>(
    firebaseFunctions(),
    "adminDmcaRecordLog"
  );
  try {
    await fn(params);
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}

export async function adminDmcaListLogs(limit = 50): Promise<DmcaLogRow[]> {
  const fn = httpsCallable<{ limit: number }, { logs: DmcaLogRow[] }>(
    firebaseFunctions(),
    "adminDmcaListLogs"
  );
  try {
    const res = await fn({ limit });
    return res.data.logs ?? [];
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}
