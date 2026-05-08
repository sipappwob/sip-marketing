"use client";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { ensureAuthPersistence, getAuthClient } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuthClient();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) router.replace("/dashboard");
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerifyMsg(null);
    setLoading(true);
    try {
      await ensureAuthPersistence();
      const auth = getAuthClient();
      await signInWithEmailAndPassword(auth, email, password);
      await auth.currentUser?.reload();
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        setPendingVerification(true);
        return;
      }
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  async function handleResendVerification() {
    setVerifyMsg(null);
    setError(null);
    setVerifyBusy(true);
    try {
      const auth = getAuthClient();
      const user = auth.currentUser;
      if (!user) {
        setPendingVerification(false);
        return;
      }
      await sendEmailVerification(user);
      setVerifyMsg("Verification email sent. Check your inbox (and spam).");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send email.");
    } finally {
      setVerifyBusy(false);
    }
  }

  async function handleSignOutFromVerify() {
    setVerifyBusy(true);
    try {
      await signOut(getAuthClient());
      setPendingVerification(false);
      setPassword("");
    } finally {
      setVerifyBusy(false);
    }
  }

  async function handleSendVerificationOnly() {
    setError(null);
    setVerifyMsg(null);
    setLoading(true);
    try {
      await ensureAuthPersistence();
      const auth = getAuthClient();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      const u = auth.currentUser;
      if (!u) throw new Error("No user after sign-in");
      await u.reload();
      if (u.emailVerified) {
        setVerifyMsg("This account is already verified — you can sign in.");
        setPendingVerification(false);
        await router.replace("/dashboard");
        return;
      }
      await sendEmailVerification(u);
      setPendingVerification(true);
      setVerifyMsg("Verification email sent. Check your inbox (and spam), then tap “I verified my email — continue”.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send verification email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleContinueAfterVerify() {
    setError(null);
    setVerifyMsg(null);
    setVerifyBusy(true);
    try {
      const auth = getAuthClient();
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        setPendingVerification(false);
        router.replace("/dashboard");
      } else {
        setError("Not verified yet. Open the link in your email first.");
      }
    } finally {
      setVerifyBusy(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: "4rem" }}>
      <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem" }}>
          Bar operator console <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#888" }}>(prototype)</span>
        </h1>
        <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          For future venue analytics — not the internal team admin. Team tools: marketing site → /admin.
        </p>

        {pendingVerification ? (
          <div>
            <p style={{ fontSize: "0.9rem", marginBottom: "1rem", lineHeight: 1.5 }}>
              Verify your email before using the dashboard. Open the link in the message from Firebase,
              then return here and sign in again.
            </p>
            {verifyMsg && (
              <p style={{ color: "#156b3a", fontSize: 14, marginBottom: "0.75rem" }}>{verifyMsg}</p>
            )}
            {error && (
              <p style={{ color: "#c00", fontSize: 14, marginBottom: "0.75rem" }}>{error}</p>
            )}
            <button
              type="button"
              className="btn"
              disabled={verifyBusy}
              style={{ width: "100%", marginBottom: "0.6rem" }}
              onClick={() => void handleResendVerification()}
            >
              {verifyBusy ? "Sending…" : "Resend verification email"}
            </button>
            <button
              type="button"
              className="btn btnGhost"
              disabled={verifyBusy}
              style={{ width: "100%", marginBottom: "0.6rem" }}
              onClick={() => void handleContinueAfterVerify()}
            >
              I verified my email — continue
            </button>
            <button
              type="button"
              className="btn btnGhost"
              disabled={verifyBusy}
              style={{ width: "100%" }}
              onClick={() => void handleSignOutFromVerify()}
            >
              Back to sign in
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          {error && (
            <p style={{ color: "#c00", fontSize: 14, marginBottom: "1rem" }}>
              {error}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button type="submit" className="btn" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              className="btn btnGhost"
              disabled={loading || !email.trim() || !password}
              style={{ width: "100%" }}
              onClick={() => void handleSendVerificationOnly()}
            >
              Send verification email
            </button>
          </div>
          <p style={{ color: "#888", fontSize: 12, marginTop: "0.65rem", lineHeight: 1.4 }}>
            Use the same email and password. We sign you in once so Firebase can send the link; you must verify before the dashboard opens.
          </p>
        </form>
        )}

        {!pendingVerification && (
        <div style={{ marginTop: "0.9rem", fontSize: 13, textAlign: "center", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <Link
            href="/admin/reset-password"
            style={{ color: "#7c1c1c", textDecoration: "none" }}
          >
            Forgot password?
          </Link>
          <span style={{ color: "#888", fontSize: 12 }}>
            New account? Verify the email Firebase sends before signing in.
          </span>
        </div>
        )}
      </div>
    </div>
  );
}
