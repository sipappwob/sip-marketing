"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../lib/firebase-client";

interface Counts {
  pendingBarRequests: number;
  needsReviewBars: number;
  earlyAccessRequests: number;
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
        const [pendingBars, needsReview, access, users] = await Promise.all([
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
          getCountFromServer(collection(fs, "early_access_requests")),
          getCountFromServer(collection(fs, "users")),
        ]);
        if (cancelled) return;
        setCounts({
          pendingBarRequests: pendingBars.data().count,
          needsReviewBars: needsReview.data().count,
          earlyAccessRequests: access.data().count,
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Pending bar requests" value={counts?.pendingBarRequests} href="/admin/bars" />
        <Stat label="Bars needing review" value={counts?.needsReviewBars} href="/admin/bars" />
        <Stat label="Early-access signups" value={counts?.earlyAccessRequests} href="/admin/access" />
        <Stat label="Total users" value={counts?.totalUsers} href="/admin/users" />
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
