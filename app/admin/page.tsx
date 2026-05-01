"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { firestore } from "../../lib/firebase-client";

interface Counts {
  pendingBarRequests: number;
  needsReviewBars: number;
  pendingBarAdmins: number;
  earlyAccess7d: number;
  earlyAccessTotal: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const fs = firestore();
        const sevenDaysAgo = Timestamp.fromMillis(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        );
        const [
          pendingBars,
          needsReview,
          pendingAdmins,
          access7d,
          accessTotal,
          users,
        ] = await Promise.all([
          getCountFromServer(
            query(
              collection(fs, "bar_requests"),
              where("status", "==", "pending")
            )
          ),
          getCountFromServer(
            query(
              collection(fs, "bars"),
              where("curationStatus", "==", "needs_review")
            )
          ),
          getCountFromServer(
            query(
              collection(fs, "bar_admins"),
              where("status", "==", "pending")
            )
          ),
          getCountFromServer(
            query(
              collection(fs, "early_access_requests"),
              where("createdAt", ">=", sevenDaysAgo)
            )
          ),
          getCountFromServer(collection(fs, "early_access_requests")),
          getCountFromServer(collection(fs, "users")),
        ]);
        if (cancelled) return;
        setCounts({
          pendingBarRequests: pendingBars.data().count,
          needsReviewBars: needsReview.data().count,
          pendingBarAdmins: pendingAdmins.data().count,
          earlyAccess7d: access7d.data().count,
          earlyAccessTotal: accessTotal.data().count,
          totalUsers: users.data().count,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const banners: { text: string; href: string; tone: "warn" | "info" }[] = [];
  if (counts) {
    if (counts.pendingBarRequests > 0) {
      banners.push({
        text: `${counts.pendingBarRequests} pending bar request${counts.pendingBarRequests === 1 ? "" : "s"} need a decision`,
        href: "/admin/bars",
        tone: "warn",
      });
    }
    if (counts.pendingBarAdmins > 0) {
      banners.push({
        text: `${counts.pendingBarAdmins} bar admin${counts.pendingBarAdmins === 1 ? "" : "s"} awaiting verification`,
        href: "/admin/bar-admins",
        tone: "warn",
      });
    }
    if (counts.earlyAccess7d > 0) {
      banners.push({
        text: `${counts.earlyAccess7d} new early-access signup${counts.earlyAccess7d === 1 ? "" : "s"} in the last 7 days`,
        href: "/admin/access",
        tone: "info",
      });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {banners.length > 0 && (
        <div className="space-y-2">
          {banners.map((b) => (
            <a
              key={b.text}
              href={b.href}
              className={`block px-4 py-3 rounded-md border text-sm ${
                b.tone === "warn"
                  ? "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100"
                  : "bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100"
              }`}
            >
              {b.text} →
            </a>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Pending bar requests"
          value={counts?.pendingBarRequests}
          href="/admin/bars"
        />
        <Stat
          label="Bars needing review"
          value={counts?.needsReviewBars}
          href="/admin/bars"
        />
        <Stat
          label="Pending bar admins"
          value={counts?.pendingBarAdmins}
          href="/admin/bar-admins"
        />
        <Stat
          label="Early access (total)"
          value={counts?.earlyAccessTotal}
          href="/admin/access"
        />
        <Stat
          label="Early access (7 days)"
          value={counts?.earlyAccess7d}
          href="/admin/access"
        />
        <Stat
          label="Total users"
          value={counts?.totalUsers}
          href="/admin/users"
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number | undefined;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block bg-white rounded-lg border border-ink/10 p-4 hover:bg-ink/5"
    >
      <div className="text-xs text-ink/60">{label}</div>
      <div className="text-3xl font-semibold mt-1">
        {value === undefined ? "…" : value.toLocaleString()}
      </div>
    </a>
  );
}
