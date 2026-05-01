"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../../../lib/firebase-client";

interface EarlyAccessRequestData {
  email?: string;
  source?: string;
  createdAt?: Timestamp;
}
type EarlyAccessRequest = EarlyAccessRequestData & { id: string };

export default function AdminAccessPage() {
  const [rows, setRows] = useState<EarlyAccessRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const snap = await getDocs(
          query(
            collection(firestore(), "early_access_requests"),
            orderBy("createdAt", "desc"),
            limit(500)
          )
        );
        if (cancelled) return;
        setRows(
          snap.docs.map((d) => ({
            ...(d.data() as EarlyAccessRequestData),
            id: d.id,
          }))
        );
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
      <div>
        <h1 className="text-2xl font-semibold">Early access</h1>
        <p className="text-sm text-ink/60 mt-1">
          Email signups from the marketing site.
        </p>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-ink/60">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-ink/60">
                  No requests yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-ink/10">
                  <td className="px-3 py-2 font-mono text-xs">{r.email}</td>
                  <td className="px-3 py-2 text-ink/60 text-xs">
                    {r.source ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-ink/50">
                    {r.createdAt?.toDate().toLocaleString() ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
