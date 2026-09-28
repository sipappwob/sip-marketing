"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { firestore } from "../../../lib/firebase-client";

type Report = {
  id: string;
  contentType?: string;
  reason?: string;
  status?: string;
  detail?: string;
  createdAt?: Timestamp;
};

export default function AdminReportsPage() {
  const [rows, setRows] = useState<Report[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDocs(query(collection(firestore(), "content_reports"), orderBy("createdAt", "desc"), limit(100)))
      .then((snap) => {
        setRows(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Report, "id">) }))
        );
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load reports."));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Content reports</h1>
      <p className="text-sm text-ink/60">
        Open reports from the app. Resolving a post still uses the DMCA tools.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {rows === null && !error && <p className="text-sm text-ink/60">Loading…</p>}
      {rows?.length === 0 && <p className="text-sm text-ink/60">No reports.</p>}
      <ul className="space-y-2">
        {rows?.map((r) => (
          <li key={r.id} className="bg-white border border-ink/10 rounded-lg p-3 text-sm">
            <div className="font-medium">
              {r.contentType ?? "content"} · {r.reason ?? "report"} · {r.status ?? "open"}
            </div>
            {r.detail && <p className="text-ink/70 mt-1">{r.detail}</p>}
            <p className="text-[11px] text-ink/40 font-mono mt-1">{r.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
