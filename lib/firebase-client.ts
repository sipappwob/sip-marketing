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
import { getFunctions, httpsCallable, type Functions, FunctionsError } from "firebase/functions";

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

/** Analytics + bar-admin callables can cold-start slowly; default client timeout is 70s. */
const SUPER_ADMIN_CALLABLE_TIMEOUT_MS = 180_000;

function superAdminCallable<RequestData, ResponseData>(name: string) {
  return httpsCallable<RequestData, ResponseData>(
    firebaseFunctions(),
    name,
    { timeout: SUPER_ADMIN_CALLABLE_TIMEOUT_MS }
  );
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
  console.error("[callable error]", err);
  if (err instanceof FunctionsError) {
    const code = err.code.replace(/^functions\//, "");
    const details =
      err.details != null && String(err.details).length > 0
        ? String(err.details)
        : null;
    if (details && details !== "internal") {
      return `${code}: ${details}`;
    }
    if (err.message && err.message !== "internal") {
      return `${code}: ${err.message}`;
    }
    if (code === "internal") {
      return (
        "Cloud Function failed (internal). This usually means the function " +
        "crashed, timed out, or its response was not JSON-safe. Redeploy the " +
        "latest functions from Sip main, hard-refresh, and click " +
        "\"Test callable connection\". Check Firebase console → Functions → " +
        "Logs for superAdminGetAnalytics."
      );
    }
    if (code === "deadline-exceeded") {
      return (
        "Request timed out — analytics can take up to 3 minutes on first load. " +
        "Try again; if it keeps failing, check Firebase function logs."
      );
    }
    if (code === "unauthenticated") {
      return "Not signed in — reload and sign in again.";
    }
    if (code === "permission-denied") {
      return "Not authorized — your uid must be in super_admins.";
    }
    return `${code}: request failed`;
  }
  if (err && typeof err === "object" && "message" in err) {
    const msg = String((err as { message: string }).message);
    if (msg && msg !== "internal") return msg;
  }
  return "Request failed.";
}

async function ensureCallableAuth(): Promise<void> {
  await ensureAuthPersistence();
  const user = firebaseAuth().currentUser;
  if (!user) throw new Error("Not signed in.");
  await user.getIdToken(true);
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

// ——— Bar admin Super Admin callables ———

export type BarAdminAssignmentRow = {
  barId: string;
  role?: string;
  status?: string;
};

export type BarAdminRow = {
  id: string;
  status: string | null;
  email: string | null;
  displayName: string | null;
  assignedBars: BarAdminAssignmentRow[];
  createdAt: number | null;
  updatedAt: number | null;
  decidedAt: number | null;
};

export type BarAdminValidationRow = {
  id: string;
  uid: string | null;
  barId: string | null;
  barName: string | null;
  email: string | null;
  status: string | null;
  createdAt: number | null;
  expiresAt: number | null;
  lastSentAt: number | null;
  sendCount: number | null;
};

export async function listBarAdminsAdmin(): Promise<{
  admins: BarAdminRow[];
  validations: BarAdminValidationRow[];
}> {
  await ensureCallableAuth();
  const fn = superAdminCallable<
    Record<string, never>,
    { admins: BarAdminRow[]; validations: BarAdminValidationRow[] }
  >("superAdminListBarAdmins");
  try {
    const res = await fn({});
    return {
      admins: res.data.admins ?? [],
      validations: res.data.validations ?? [],
    };
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}

export async function setBarAdminStatusAdmin(
  adminUid: string,
  status: "active" | "rejected"
): Promise<void> {
  await ensureCallableAuth();
  const fn = superAdminCallable<
    { adminUid: string; status: "active" | "rejected" },
    { ok: true }
  >("superAdminSetBarAdminStatus");
  try {
    await fn({ adminUid, status });
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}

// ——— Founder analytics (platform-wide) ———

export interface PromoFunnel {
  impressions: number;
  views: number;
  clicks: number;
  saves: number;
  shares: number;
  qrShown: number;
  redemptions: number;
}
export interface WindowTotals {
  activeUsers: number;
  newUsers: number;
  totalEvents: number;
  sessions: number;
  avgSessionSeconds: number;
  promo: PromoFunnel;
  events: { impressions: number; clicks: number; rsvps: number };
  bars: {
    views: number;
    imHere: number;
    lineReports: number;
    crowdReports: number;
    photos: number;
    searches: number;
    mapOpens: number;
    directions: number;
    saves: number;
    shares: number;
  };
  social: {
    friendsAdded: number;
    groupsCreated: number;
    groupsJoined: number;
    invitesSent: number;
    invitesAccepted: number;
  };
}
export interface PlatformAnalytics {
  generatedAt: number;
  meta: {
    computedAt?: { seconds: number } | number | null;
    dau?: number;
    wau?: number;
    mau?: number;
    stickiness?: number;
    lifetime?: {
      totalUsers?: number;
      totalEvents?: number;
      totalRedemptions?: number;
      totalPromoViews?: number;
    };
    trackingHealth?: {
      last24hEvents?: number;
      missingUserId?: number;
      latestEventAt?: { seconds: number } | null;
      eventTypeLastSeen?: Record<string, number>;
      eventTypeCount?: Record<string, number>;
    };
  };
  windows: {
    today: WindowTotals;
    last7: WindowTotals;
    last30: WindowTotals;
    allTime: WindowTotals;
  };
  series: {
    dayKey: string;
    activeUsers: number;
    newUsers: number;
    promoViews: number;
    redemptions: number;
    sessions: number;
    totalEvents: number;
  }[];
  segments: { counts: Record<string, number>; insufficient: number; total: number };
  venues: {
    barId: string;
    name: string;
    views: number;
    imHere: number;
    redemptions: number;
    lineReports: number;
  }[];
  byCity: Record<string, { barEvents: number; redemptions: number }>;
  byBarType: Record<string, { barEvents: number; promoViews: number; redemptions: number }>;
  heatmap: { hourly: Record<string, number>; dayOfWeek: Record<string, number> };
}

export async function pingSuperAdmin(): Promise<{
  ok: true;
  uid: string;
  projectId: string | null;
  at: number;
}> {
  await ensureCallableAuth();
  const fn = superAdminCallable<
    Record<string, never>,
    { ok: true; uid: string; projectId: string | null; at: number }
  >("superAdminPing");
  const res = await fn({});
  return res.data;
}

export async function getPlatformAnalytics(
  refresh = false
): Promise<PlatformAnalytics> {
  await ensureCallableAuth();
  const fn = superAdminCallable<{ refresh: boolean }, PlatformAnalytics>(
    "superAdminGetAnalytics"
  );
  try {
    const res = await fn({ refresh });
    return res.data;
  } catch (e) {
    throw new Error(callableErrorMessage(e));
  }
}
