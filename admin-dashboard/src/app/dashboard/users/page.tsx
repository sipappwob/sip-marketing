"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuthClient, lookupUserProfileAdmin } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LookupResult = {
  userId?: string;
  profile?: Record<string, unknown>;
  referralPrivate?: Record<string, unknown>;
  statusAwardsSummary?: Record<string, unknown>;
  statusAwards?: Array<{
    id: string;
    points: number;
    sourceType: string;
    createdAt: number | null;
    metadata: Record<string, unknown>;
  }>;
};

function fmtTs(ms: number | null | undefined) {
  if (ms == null || !Number.isFinite(ms)) return "—";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "—";
  }
}

export default function AdminUserLookupPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LookupResult | null>(null);

  useEffect(() => {
    const auth = getAuthClient();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }
      await user.reload().catch(() => {});
      if (!user.emailVerified) router.replace("/");
    });
    return () => unsub();
  }, [router]);

  async function runLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    const id = userId.trim();
    if (!id) {
      setError("Enter a Firebase user id (UID).");
      return;
    }
    setLoading(true);
    try {
      const res = (await lookupUserProfileAdmin(id)) as LookupResult;
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  const p = data?.profile ?? {};
  const refp = data?.referralPrivate ?? {};
  const sum = data?.statusAwardsSummary ?? {};
  const awards = data?.statusAwards ?? [];

  return (
    <div className="container dashboardShell">
      <header className="dashHeader">
        <div>
          <p className="dashEyebrow">Sip Admin</p>
          <h1 className="dashTitle">User lookup</h1>
          <p className="dashSubtle">
            Search any consumer profile and Status ledger (Firestore-backed).
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link href="/dashboard" className="btn btnGhost">
            Analytics
          </Link>
          <button
            type="button"
            className="btn btnGhost"
            onClick={() => signOut(getAuthClient()).then(() => router.replace("/"))}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="card filterCard" style={{ gridTemplateColumns: "1fr" }}>
        <form
          onSubmit={runLookup}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "flex-end" }}
        >
          <div style={{ flex: "1 1 240px" }}>
            <label htmlFor="uid" style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
              User UID
            </label>
            <input
              id="uid"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Firebase Auth UID"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading…" : "Look up"}
          </button>
        </form>
        {error && (
          <p style={{ color: "#c00", marginTop: "0.75rem", fontSize: 14 }}>{error}</p>
        )}
      </div>

      {data && (
        <>
          <div className="card">
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>Profile</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "0.75rem",
                fontSize: 14,
              }}
            >
              <Stat label="Username" value={String(p.username ?? "—")} />
              <Stat label="Name" value={String(p.name ?? "—")} />
              <Stat
                label="First / Last"
                value={`${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "—"}
              />
              <Stat label="City" value={String(p.city ?? "—")} />
              <Stat label="Account" value={String(p.accountType ?? "—")} />
              <Stat label="Status points" value={String(p.statusPoints ?? 0)} accent />
              <Stat
                label="Onboarding"
                value={p.hasCompletedOnboarding ? "Complete" : "Incomplete"}
              />
              <Stat label="Private profile" value={p.isPrivate ? "Yes" : "No"} />
              <Stat label="Friends" value={String(p.friendsCount ?? 0)} />
              <Stat label="Favorite bars" value={String(p.favoriteBarsCount ?? 0)} />
              <Stat label="Visited bars" value={String(p.visitedBarsCount ?? 0)} />
              <Stat label="Created" value={fmtTs(p.createdAt as number)} />
            </div>
          </div>

          <div className="card">
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>Referral (private)</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0.75rem",
                fontSize: 14,
              }}
            >
              <Stat label="Referred by UID" value={String(refp.referredByUserId ?? "—")} />
              <Stat label="Source" value={String(refp.referralSource ?? "—")} />
              <Stat
                label="Attributed at"
                value={
                  typeof refp.referralAttributedAt === "number"
                    ? fmtTs(Math.round(refp.referralAttributedAt * 1000))
                    : "—"
                }
              />
              <Stat
                label="Hunt referral awarded"
                value={fmtTs(refp.referralAwardedAt as number)}
              />
              <Stat
                label="Awarded to UID"
                value={String(refp.referralAwardedToUserId ?? "—")}
              />
            </div>
          </div>

          <div className="card">
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
              Status awards (recent)
            </h2>
            <p style={{ margin: "0 0 0.75rem", color: "#666", fontSize: 13 }}>
              Showing {String(sum.ledgerEntriesShown ?? awards.length)} ledger entries
              (sample sum {String(sum.sumPointsInLedgerSample ?? "—")} pts in sample).
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="dashTable">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Points</th>
                    <th>Source</th>
                    <th>Entry id</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ color: "#666" }}>
                        No status awards in ledger yet.
                      </td>
                    </tr>
                  ) : (
                    awards.map((a) => (
                      <tr key={a.id}>
                        <td>{fmtTs(a.createdAt ?? undefined)}</td>
                        <td>{a.points}</td>
                        <td>{a.sourceType}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#8f5a52", fontWeight: 700 }}>{label}</div>
      <div
        style={{
          fontWeight: accent ? 700 : 400,
          color: accent ? "#7c1c1c" : undefined,
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  );
}
