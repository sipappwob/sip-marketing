"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firebaseAuth, firestore } from "../../../lib/firebase-client";

interface BarRequestData {
  name?: string;
  city?: string;
  address?: string;
  googleMapsUrl?: string;
  notes?: string;
  submittedBy?: string;
  submittedByUsername?: string;
  submittedAt?: Timestamp;
  status?: string;
  /** Set by the onBarRequestCreate trigger when a Place ID was extracted. */
  resultBarId?: string;
}
type BarRequest = BarRequestData & { id: string };

interface BarData {
  name?: string;
  city?: string;
  type?: string;
  formattedAddress?: string;
  curationStatus?: string;
  classificationReason?: string;
  googlePrimaryType?: string;
  googleTypes?: string[];
}
type Bar = BarData & { id: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function AdminBarsPage() {
  const [requests, setRequests] = useState<BarRequest[] | null>(null);
  const [needsReview, setNeedsReview] = useState<Bar[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const fs = firestore();
      const reqSnap = await getDocs(
        query(
          collection(fs, "bar_requests"),
          where("status", "==", "pending"),
          orderBy("submittedAt", "desc"),
          limit(100)
        )
      );
      const barSnap = await getDocs(
        query(
          collection(fs, "bars"),
          where("curationStatus", "==", "needs_review"),
          orderBy("name"),
          limit(200)
        )
      );
      setRequests(
        reqSnap.docs.map((d) => ({
          ...(d.data() as BarRequestData),
          id: d.id,
        }))
      );
      setNeedsReview(
        barSnap.docs.map((d) => ({
          ...(d.data() as BarData),
          id: d.id,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function resolveRequest(req: BarRequest, action: "approve" | "reject") {
    const uid = firebaseAuth().currentUser?.uid;
    if (!uid) {
      setError("Not signed in.");
      return;
    }
    setBusyId(req.id);
    setError(null);
    try {
      const fs = firestore();
      const requestRef = doc(fs, "bar_requests", req.id);

      if (action === "reject") {
        await updateDoc(requestRef, {
          status: "rejected",
          resolvedBy: uid,
          resolvedAt: serverTimestamp(),
        });
      } else {
        const name = (req.name ?? "").trim();
        if (!name) {
          throw new Error("Bar request has no name.");
        }
        // Prefer the bar id the trigger pre-filled (for Google-Maps-link
        // submissions) so we don't double-write. Otherwise mint a stable
        // manual id from the request id.
        const barId =
          req.resultBarId?.trim() ||
          `manual-${slugify(name)}-${req.id.slice(-6)}`;

        const barUpdate: Record<string, unknown> = {
          name,
          curationStatus: "approved",
          curationSource: "user_request",
          status: "active",
          reviewedBy: uid,
          reviewedAt: new Date().toISOString(),
          requestId: req.id,
        };
        if (req.city) barUpdate.city = req.city.trim();
        if (req.address) barUpdate.formattedAddress = req.address.trim();

        const batch = writeBatch(fs);
        batch.set(doc(fs, "bars", barId), barUpdate, { merge: true });
        batch.update(requestRef, {
          status: "approved",
          resolvedBy: uid,
          resolvedAt: serverTimestamp(),
          resultBarId: barId,
        });
        await batch.commit();
      }

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function setBarStatus(bar: Bar, status: "approved" | "rejected") {
    const uid = firebaseAuth().currentUser?.uid;
    if (!uid) {
      setError("Not signed in.");
      return;
    }
    setBusyId(bar.id);
    setError(null);
    try {
      await updateDoc(doc(firestore(), "bars", bar.id), {
        curationStatus: status,
        reviewedBy: uid,
        reviewedAt: new Date().toISOString(),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Bars</h1>
        <p className="text-sm text-ink/60 mt-1">
          Review user-submitted bars and venues the seeder flagged as
          ambiguous.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">
          User submissions ({requests?.length ?? "…"})
        </h2>
        {requests === null ? (
          <p className="text-sm text-ink/60">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-ink/60">No pending requests.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-ink/10 rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base">
                      {r.name || "(no name)"}
                    </h3>
                    <p className="text-xs text-ink/60">
                      {[r.address, r.city].filter(Boolean).join(" · ") ||
                        "no address"}
                    </p>
                  </div>
                  <span className="text-[10px] text-ink/50">
                    by {r.submittedByUsername || r.submittedBy?.slice(0, 8)}
                  </span>
                </div>
                {r.googleMapsUrl && (
                  <a
                    href={r.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline truncate"
                  >
                    {r.googleMapsUrl}
                  </a>
                )}
                {r.notes && (
                  <p className="text-sm text-ink/70 whitespace-pre-wrap">
                    {r.notes}
                  </p>
                )}
                <div className="flex gap-2 mt-1">
                  <button
                    disabled={busyId === r.id}
                    onClick={() => resolveRequest(r, "approve")}
                    className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Approve & add bar
                  </button>
                  <button
                    disabled={busyId === r.id}
                    onClick={() => resolveRequest(r, "reject")}
                    className="text-xs px-3 py-1.5 rounded-md border border-ink/20 text-ink/70 hover:bg-ink/5 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Seeded — needs review ({needsReview?.length ?? "…"})
        </h2>
        {needsReview === null ? (
          <p className="text-sm text-ink/60">Loading…</p>
        ) : needsReview.length === 0 ? (
          <p className="text-sm text-ink/60">Nothing to review.</p>
        ) : (
          <div className="overflow-x-auto bg-white border border-ink/10 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-ink/5 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">City</th>
                  <th className="px-3 py-2 font-medium">Type / Google</th>
                  <th className="px-3 py-2 font-medium">Reason</th>
                  <th className="px-3 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {needsReview.map((b) => (
                  <tr key={b.id} className="border-t border-ink/10">
                    <td className="px-3 py-2 font-medium">
                      {b.name}
                      <div className="text-[11px] text-ink/50 truncate max-w-[260px]">
                        {b.formattedAddress}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-ink/70">{b.city}</td>
                    <td className="px-3 py-2 text-ink/70">
                      {b.type}
                      <div className="text-[11px] text-ink/50">
                        {b.googlePrimaryType}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-ink/60">
                      {b.classificationReason}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <button
                        disabled={busyId === b.id}
                        onClick={() => setBarStatus(b, "approved")}
                        className="text-xs px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busyId === b.id}
                        onClick={() => setBarStatus(b, "rejected")}
                        className="ml-2 text-xs px-2.5 py-1 rounded border border-ink/20 text-ink/70 hover:bg-ink/5 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
