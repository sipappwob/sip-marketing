"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  assertSuperAdminForPasswordReset,
  ensureAuthPersistence,
  firebaseAuth,
} from "../../../lib/firebase-client";

export default function AdminResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email.");
      return;
    }
    setBusy(true);
    try {
      await ensureAuthPersistence();
      try {
        await assertSuperAdminForPasswordReset(trimmed);
      } catch (preErr) {
        const msg = preErr instanceof Error ? preErr.message : "";
        // Callable may be blocked by Cloud IAM (403) until invoker is granted — still send reset email.
        if (
          !msg.includes("internal") &&
          !msg.includes("not-found") &&
          !msg.includes("permission-denied") &&
          !msg.includes("not listed")
        ) {
          throw preErr;
        }
        if (msg.includes("not-found") || msg.includes("not listed") || msg.includes("permission-denied")) {
          throw preErr;
        }
        console.warn("[reset] super-admin pre-check skipped:", msg);
      }
      await sendPasswordResetEmail(firebaseAuth(), trimmed, {
        url: `${window.location.origin}/admin/login`,
        handleCodeInApp: false,
      });
      setOk("Password reset email sent. Check your inbox (and spam).");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-ivory">
      <div className="w-full max-w-sm space-y-4 bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-xs text-ink/60">
          Use the same email as Super Admin sign-in (Firebase Email/Password). We confirm your account
          on the server, then Firebase sends the link.
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@sipapp.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          {ok && <p className="text-xs text-emerald-700">{ok}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-ivory rounded-md py-2 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send reset email"}
          </button>
        </form>
        <Link href="/admin/login" className="text-xs text-ink/70 underline block text-center">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
