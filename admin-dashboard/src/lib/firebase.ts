import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import {
  type Functions,
  getFunctions,
  httpsCallable,
} from "firebase/functions";

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedFunctions: Functions | null = null;
let persistencePromise: Promise<void> | null = null;

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client requested outside the browser.");
  }
}

function firebaseConfig() {
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  } as const;

  if (!cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId) {
    throw new Error(
      "Missing Firebase web config env vars. Set NEXT_PUBLIC_FIREBASE_* in admin-dashboard/.env.local."
    );
  }
  return cfg;
}

function ensureFirebase() {
  ensureBrowser();
  if (!cachedApp) {
    cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig());
  }
  if (!cachedAuth) cachedAuth = getAuth(cachedApp);
  if (!cachedFunctions) cachedFunctions = getFunctions(cachedApp, "us-east1");
}

export function getAuthClient(): Auth {
  ensureFirebase();
  return cachedAuth!;
}

/** Prefer local persistence so sessions survive tab closes and refresh; call before sign-in to avoid races. */
export function ensureAuthPersistence(): Promise<void> {
  ensureFirebase();
  if (!persistencePromise) {
    persistencePromise = setPersistence(cachedAuth!, browserLocalPersistence).catch(
      (err) => {
        console.warn("Firebase auth persistence:", err);
      }
    );
  }
  return persistencePromise;
}

export function getFunctionsClient(): Functions {
  ensureFirebase();
  return cachedFunctions!;
}

export async function listBars(opts?: { status?: string }) {
  const functions = getFunctionsClient();
  const fn = httpsCallable<{ status?: string }, { bars: unknown[] }>(
    functions,
    "listBars"
  );
  const res = await fn(opts ?? {});
  return res.data.bars;
}

export async function listCampaigns(opts?: {
  barId?: string;
  status?: string;
}) {
  const functions = getFunctionsClient();
  const fn = httpsCallable<
    { barId?: string; status?: string },
    { campaigns: unknown[] }
  >(functions, "listCampaigns");
  const res = await fn(opts ?? {});
  return res.data.campaigns;
}

export async function getBarAnalytics(params: {
  barId: string;
  startDate: string;
  endDate: string;
  campaignId?: string;
}) {
  const functions = getFunctionsClient();
  const fn = httpsCallable<
    typeof params,
    { barId: string; campaignId?: string; daily: unknown[] }
  >(functions, "getBarAnalytics");
  const res = await fn(params);
  return res.data;
}

export async function getMyBars() {
  const functions = getFunctionsClient();
  const fn = httpsCallable<unknown, { bars: unknown[] }>(functions, "getMyBars");
  const res = await fn({});
  return res.data.bars;
}

export async function lookupUserProfileAdmin(userId: string) {
  const functions = getFunctionsClient();
  const fn = httpsCallable<
    { userId: string },
    Record<string, unknown>
  >(functions, "lookupUserProfileAdmin");
  const res = await fn({ userId: userId.trim() });
  return res.data;
}
