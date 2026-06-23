"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { ensureAuthPersistence, firebaseAuth, activeFirebaseProjectId, prodFirebaseEnvDiagnostics } from "../../../lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const firebaseDiag = prodFirebaseEnvDiagnostics();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), async (u) => {
      if (!u) {
        setPendingVerification(false);
        return;
      }
      await u.reload().catch(() => {});
      if (u.emailVerified) {
        setPendingVerification(false);
        router.replace("/admin");
        return;
      }
      setPendingVerification(true);
    });
    return () => unsub();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setVerifyMsg(null);
    try {
      await ensureAuthPersistence();
      await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
      const u = firebaseAuth().currentUser;
      await u?.reload();
      if (u?.emailVerified) {
        router.replace("/admin");
        return;
      }
      setPendingVerification(true);
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendVerificationOnly() {
    setSubmitting(true);
    setError(null);
    setVerifyMsg(null);
    try {
      await ensureAuthPersistence();
      await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
      const u = firebaseAuth().currentUser;
      if (!u) throw new Error("No user after sign-in");
      await u.reload();
      if (u.emailVerified) {
        router.replace("/admin");
        return;
      }
      await sendEmailVerification(u);
      setPendingVerification(true);
      setVerifyMsg(
        "Verification email sent. Check your inbox (and spam), then tap “I verified — continue”."
      );
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    setVerifyBusy(true);
    setError(null);
    setVerifyMsg(null);
    try {
      const u = firebaseAuth().currentUser;
      if (!u) return;
      await sendEmailVerification(u);
      setVerifyMsg("Verification email sent again.");
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setVerifyBusy(false);
    }
  }

  async function handleContinueAfterVerify() {
    setVerifyBusy(true);
    setError(null);
    setVerifyMsg(null);
    try {
      const u = firebaseAuth().currentUser;
      await u?.reload();
      if (u?.emailVerified) {
        setPendingVerification(false);
        router.replace("/admin");
      } else {
        setError("Not verified yet. Open the link in your email first.");
      }
    } finally {
      setVerifyBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4 bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Sip Super Admin</h1>
          <p className="text-xs text-ink/60 mt-1 leading-relaxed">
            Internal tools for the Sip team only. This is not the venue / bar-operator
            console (that product is separate). Sign in with your Sip Firebase Auth
            account; your email must be verified and your uid must be in{" "}
            <code className="text-[11px] bg-ink/5 px-1 rounded">super_admins</code>.
          </p>
        </div>

        {firebaseDiag.useProd && (
          <p className="text-xs text-ink/50 font-mono">
            Firebase: {activeFirebaseProjectId() || "?"}
          </p>
        )}

        {firebaseDiag.useProd && !firebaseDiag.complete && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 leading-relaxed">
            Production Firebase config is not in this build yet (baked PROD project:{" "}
            {firebaseDiag.bakedProdProjectId}). You can still sign in, but admin callables will
            fail until you redeploy Production on Vercel with{" "}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_FIREBASE_PROD_*</code> vars.
          </p>
        )}

        {pendingVerification ? (
          <div className="space-y-3 text-sm">
            <p className="text-ink/70 text-xs leading-relaxed">
              Verify your email before accessing the admin app. Open the link from Firebase, then
              return here.
            </p>
            {verifyMsg && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
                {verifyMsg}
              </p>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="button"
              disabled={verifyBusy}
              onClick={() => void handleResendVerification()}
              className="w-full bg-ink text-ivory rounded-md py-2 text-sm font-semibold disabled:opacity-60"
            >
              {verifyBusy ? "Sending…" : "Resend verification email"}
            </button>
            <button
              type="button"
              disabled={verifyBusy}
              onClick={() => void handleContinueAfterVerify()}
              className="w-full border border-ink/20 rounded-md py-2 text-sm font-medium disabled:opacity-60"
            >
              I verified — continue
            </button>
            <button
              type="button"
              disabled={verifyBusy}
              onClick={async () => {
                await signOut(firebaseAuth());
                setPendingVerification(false);
                setPassword("");
              }}
              className="w-full text-xs text-ink/50 underline"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs text-ink/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs text-ink/70">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ink text-ivory rounded-md py-2 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              disabled={submitting || !email.trim() || !password}
              onClick={() => void handleSendVerificationOnly()}
              className="w-full border border-ink/20 rounded-md py-2 text-sm font-medium disabled:opacity-60"
            >
              Send verification email
            </button>
            <p className="text-[11px] text-ink/50 leading-relaxed">
              Use the same email and password. We sign you in briefly so Firebase can send the
              verification message.
            </p>
            <div className="text-center text-xs">
              <Link href="/admin/reset-password" className="text-ink/70 underline">
                Forgot password?
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "auth/unknown";
  const projectId = activeFirebaseProjectId();
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return (
      `Wrong email or password for Firebase project ${projectId || "?"}. ` +
      "Super admin now uses sip-prod-29422 — your staging password may not apply. " +
      "Use Forgot password after we fix the reset flow, or ask Will/Sam to reset you in Firebase Console → Authentication."
    );
  }
  if (code === "auth/user-not-found") {
    return (
      `No Firebase account for this email in ${projectId || "?"}. ` +
      "Create the user in Firebase Console → Authentication (sip-prod-29422), then add their uid to super_admins."
    );
  }
  if (code === "auth/operation-not-allowed") {
    return "Email/password sign-in is disabled in this Firebase project. Enable it in Authentication → Sign-in method.";
  }
  if (code === "auth/api-key-not-valid") {
    return "Firebase web config is wrong — check NEXT_PUBLIC_FIREBASE_* env vars in Vercel.";
  }
  if (err instanceof Error && err.message.includes("Firebase config incomplete")) {
    return err.message;
  }
  if (code === "auth/network-request-failed") {
    return "Network error — check your connection.";
  }
  return `Sign in failed (${code}).`;
}
