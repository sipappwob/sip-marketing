"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from "../../lib/firebase-client";

interface AdminShellProps {
  children: React.ReactNode;
}

type Status =
  | "loading"
  | "anonymous"
  | "unverified"
  | "not_admin"
  | "admin";

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  const isLoginRoute = pathname === "/admin/login";
  const isResetRoute = pathname === "/admin/reset-password";

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), async (u) => {
      setUser(u);
      if (!u) {
        setStatus("anonymous");
        return;
      }
      await u.reload().catch(() => {});
      if (!u.emailVerified) {
        setStatus("unverified");
        return;
      }
      try {
        const snap = await getDoc(doc(firestore(), "super_admins", u.uid));
        setStatus(snap.exists() ? "admin" : "not_admin");
      } catch {
        setStatus("not_admin");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (status === "anonymous" && !isLoginRoute && !isResetRoute) {
      router.replace("/admin/login");
    }
  }, [status, isLoginRoute, isResetRoute, router]);

  const navItems = useMemo(
    () => [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/bars", label: "Bars" },
      { href: "/admin/bar-admins", label: "Bar admins" },
      { href: "/admin/access", label: "Early access" },
      { href: "/admin/users", label: "Users" },
    ],
    []
  );

  if (isLoginRoute || isResetRoute) {
    return <main className="min-h-screen bg-ivory">{children}</main>;
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-ink/70 text-sm">Loading…</p>
      </main>
    );
  }

  if (status === "unverified" && user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory px-6">
        <div className="max-w-md w-full space-y-4 bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Verify your email</h1>
          <p className="text-sm text-ink/70">
            Super Admin access requires a verified email. Open the link Firebase sent you, then
            continue here.
          </p>
          {verifyMsg && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
              {verifyMsg}
            </p>
          )}
          <button
            type="button"
            disabled={verifyBusy}
            onClick={async () => {
              setVerifyBusy(true);
              setVerifyMsg(null);
              try {
                await sendEmailVerification(user);
                setVerifyMsg("Verification email sent.");
              } finally {
                setVerifyBusy(false);
              }
            }}
            className="w-full bg-ink text-ivory rounded-md py-2 text-sm font-semibold disabled:opacity-60"
          >
            {verifyBusy ? "Sending…" : "Resend verification email"}
          </button>
          <button
            type="button"
            disabled={verifyBusy}
            onClick={async () => {
              setVerifyBusy(true);
              try {
                await user.reload();
                if (user.emailVerified) window.location.reload();
              } finally {
                setVerifyBusy(false);
              }
            }}
            className="w-full border border-ink/20 rounded-md py-2 text-sm font-medium disabled:opacity-60"
          >
            I verified — reload
          </button>
          <button
            type="button"
            onClick={() => signOut(firebaseAuth()).then(() => router.replace("/admin/login"))}
            className="w-full text-xs text-ink/50 underline"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  if (status === "not_admin") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Not authorized</h1>
          <p className="text-ink/70 text-sm">
            Your account isn&rsquo;t on the internal super-admin list. If you should have access,
            ask Will or Sam to add your uid to{" "}
            <code className="text-xs bg-ink/5 px-1 rounded">super_admins</code> in Firestore.
          </p>
          {user && (
            <p className="text-xs text-ink/50 font-mono break-all">
              uid: {user.uid}
            </p>
          )}
          <button
            onClick={() => signOut(firebaseAuth())}
            className="px-4 py-2 rounded-md bg-ink text-ivory text-sm"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  if (status === "anonymous") {
    return null;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-ink/10 bg-ivory">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
          <Link href="/admin" className="font-semibold text-lg">
            Sip Super Admin
          </Link>
          <nav className="flex gap-4 flex-1">
            {navItems.map((n) => {
              const active =
                pathname === n.href ||
                (n.href !== "/admin" && pathname?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`text-sm ${
                    active ? "text-ink font-semibold" : "text-ink/60"
                  } hover:text-ink`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink/60">{user?.email ?? user?.uid}</span>
            <button
              onClick={() => signOut(firebaseAuth())}
              className="text-xs px-3 py-1.5 rounded-md border border-ink/20 hover:bg-ink/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
