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

import { initializeApp, getApp, type FirebaseApp } from "firebase/app";
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

const PROD_PROJECT_ID = "sip-prod-29422";

function isProdProjectConfig(c: FirebaseWebConfig): boolean {
  return isComplete(c) && c.projectId === PROD_PROJECT_ID;
}

const PROD_HOSTS = new Set(["www.sipapp.co", "sipapp.co"]);

function isAdminPath(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
}

/** Prod Firebase for www.sipapp.co, production deploys, and /admin when PROD vars are baked. */
function shouldUseProdFirebase(): boolean {
  if (typeof window !== "undefined" && PROD_HOSTS.has(window.location.hostname)) {
    return true;
  }
  if (process.env.VERCEL_ENV === "production") return true;
  // Preview deploys (e.g. *.vercel.app) still bundle PROD_* vars — use them on admin routes.
  if (isAdminPath() && isProdProjectConfig(readProdConfig())) return true;
  return false;
}

function missingProdKeys(c: FirebaseWebConfig): string[] {
  const out: string[] = [];
  if (!c.apiKey) out.push("NEXT_PUBLIC_FIREBASE_PROD_API_KEY");
  if (!c.authDomain) out.push("NEXT_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN");
  if (!c.projectId) out.push("NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID");
  if (!c.appId) out.push("NEXT_PUBLIC_FIREBASE_PROD_APP_ID");
  return out;
}

function resolveFirebaseConfig(): FirebaseWebConfig {
  const prod = readProdConfig();
  const staging = readDefaultConfig();
  const useProd = shouldUseProdFirebase();

  if (useProd) {
    if (isProdProjectConfig(prod)) return prod;
    // Some Vercel Production envs set prod values on the standard (non-_PROD_) keys.
    if (isProdProjectConfig(staging)) return staging;
    console.error(
      "[firebase] Expected sip-prod-29422 on production host. PROD keys missing/wrong:",
      missingProdKeys(prod).join(", ") || "none empty",
      "— baked PROD projectId:",
      prod.projectId || "(empty)",
      "— baked default projectId:",
      staging.projectId || "(empty)"
    );
    return isComplete(prod) ? prod : staging;
  }

  if (isComplete(staging)) return staging;
  if (isProdProjectConfig(prod)) return prod;
  return staging;
}

let resolvedConfig: FirebaseWebConfig | null = null;
let cachedApp: FirebaseApp | null = null;
let cachedFunctions: Functions | null = null;
let authPersistencePromise: Promise<void> | null = null;

function getConfig(): FirebaseWebConfig {
  if (typeof window !== "undefined") {
    const next = resolveFirebaseConfig();
    if (!resolvedConfig || resolvedConfig.projectId !== next.projectId) {
      resolvedConfig = next;
      cachedApp = null;
      cachedFunctions = null;
    }
    return resolvedConfig;
  }
  // SSR: only VERCEL_ENV applies (no hostname).
  const prod = readProdConfig();
  if (process.env.VERCEL_ENV === "production" && isComplete(prod)) return prod;
  const staging = readDefaultConfig();
  if (isComplete(staging)) return staging;
  return isComplete(prod) ? prod : staging;
}

/** Active Firebase project (resolved on first client use). */
export function activeFirebaseProjectId(): string {
  return getConfig().projectId;
}

export function isProdFirebaseProject(): boolean {
  return getConfig().projectId === PROD_PROJECT_ID;
}

/** For admin UI — which PROD env vars are empty in this build. */
export function prodFirebaseEnvDiagnostics(): {
  useProd: boolean;
  complete: boolean;
  missing: string[];
  bakedProdProjectId: string;
  bakedDefaultProjectId: string;
  activeProjectId: string;
  hostname: string;
} {
  const prod = readProdConfig();
  const staging = readDefaultConfig();
  return {
    useProd: shouldUseProdFirebase(),
    complete: isProdProjectConfig(prod) || isProdProjectConfig(staging),
    missing: missingProdKeys(prod),
    bakedProdProjectId: prod.projectId || "(empty in build)",
    bakedDefaultProjectId: staging.projectId || "(empty in build)",
    activeProjectId: getConfig().projectId || "(none)",
    hostname:
      typeof window !== "undefined" ? window.location.hostname : "(ssr)",
  };
}

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("This Firebase helper runs only in the browser.");
  }
}

function ensureApp(): FirebaseApp {
  const config = getConfig();
  if (cachedApp && cachedApp.options.projectId === config.projectId) {
    return cachedApp;
  }
  cachedApp = null;
  cachedFunctions = null;
  if (!isComplete(config)) {
    const missing = shouldUseProdFirebase()
      ? missingProdKeys(readProdConfig())
      : [
          "NEXT_PUBLIC_FIREBASE_API_KEY",
          "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
          "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
          "NEXT_PUBLIC_FIREBASE_APP_ID",
        ];
    throw new Error(
      `Firebase config incomplete (missing: ${missing.join(", ")}). ` +
        "Set vars on Vercel for Production, then redeploy — env vars are baked in at build time."
    );
  }
  if (shouldUseProdFirebase() && config.projectId !== PROD_PROJECT_ID) {
    console.warn(
      "[firebase] Expected",
      PROD_PROJECT_ID,
      "but using",
      config.projectId,
      "— check NEXT_PUBLIC_FIREBASE_PROD_* vars and redeploy."
    );
  }
  const appName = config.projectId === PROD_PROJECT_ID ? "sip-prod" : "sip-staging";
  try {
    cachedApp = getApp(appName);
    return cachedApp;
  } catch {
    // Reuse legacy [DEFAULT] app when project matches (existing auth sessions).
    try {
      const legacy = getApp();
      if (legacy.options.projectId === config.projectId) {
        cachedApp = legacy;
        return cachedApp;
      }
    } catch {
      /* no default app */
    }
    cachedApp = initializeApp(config, appName);
    return cachedApp;
  }
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

function callableErrorMessage(err: unknown, fnName?: string): string {
  console.error("[callable error]", fnName ?? "", err);
  const pid = activeFirebaseProjectId();
  if (shouldUseProdFirebase() && pid && pid !== PROD_PROJECT_ID) {
    return (
      `Wrong Firebase project (${pid}). Production admin must use ${PROD_PROJECT_ID}. ` +
      "Check NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID is sip-prod-29422 (not staging), " +
      "redeploy Production on Vercel, sign out, and sign in again."
    );
  }
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
        `Cloud Function failed (internal)${fnName ? ` [${fnName}]` : ""}. ` +
        `Firebase project: ${pid || "?"}. ` +
        "If project is not sip-prod-29422, fix Vercel PROD env vars. " +
        "Otherwise check Firebase console → Functions → Logs."
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
    throw new Error(callableErrorMessage(e, "superAdminListBarAdmins"));
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
    throw new Error(callableErrorMessage(e, "superAdminSetBarAdminStatus"));
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
  try {
    const res = await fn({});
    return res.data;
  } catch (e) {
    throw new Error(callableErrorMessage(e, "superAdminPing"));
  }
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
    throw new Error(callableErrorMessage(e, "superAdminGetAnalytics"));
  }
}
