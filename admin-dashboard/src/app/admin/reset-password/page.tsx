"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { ensureAuthPersistence, getAuthClient } from "@/lib/firebase";

export default function AdminResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter the email you use to sign in.");
      return;
    }
    setSubmitting(true);
    try {
      await ensureAuthPersistence();
      await sendPasswordResetEmail(getAuthClient(), trimmed);
      setSuccess("Password reset email sent. Check your inbox (and spam).");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Couldn't send reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: "4rem" }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.5rem" }}>
          Reset password
        </h1>
        <p style={{ color: "#666", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          We’ll email you a link to reset your admin password.
        </p>

        <form onSubmit={onSubmit}>
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
              placeholder="you@sipapp.co"
              autoComplete="email"
            />
          </div>

          {error && (
            <p style={{ color: "#c00", fontSize: 14, marginBottom: "0.75rem" }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: "#156b3a", fontSize: 14, marginBottom: "0.75rem" }}>
              {success}
            </p>
          )}

          <button type="submit" className="btn" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Sending…" : "Send reset email"}
          </button>
        </form>

        <div style={{ marginTop: "1rem", fontSize: 13 }}>
          <Link href="/" style={{ color: "#7c1c1c", textDecoration: "none" }}>
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

