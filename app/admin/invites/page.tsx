"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Timestamp,
  collection,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../../lib/firebase-client";
import { isDemoOrBotUser } from "../../../lib/demo-user";

/**
 * Written only by the `onUserOnboardingCompletedForReferral` trigger, one doc
 * per inviter. `signupCount` is a completed-signup count, not a link-tap count
 * - see the caveat rendered at the bottom of the page.
 */
interface InviteDocData {
  inviterUserId?: string;
  signupCount?: number;
  lastSignupAt?: Timestamp;
}
type InviteDoc = InviteDocData & { id: string };

interface UserDocData {
  username?: string;
  name?: string;
  city?: string;
  isDemoAccount?: boolean;
}

type Row = InviteDoc & { user?: UserDocData };

/** Firestore `in` queries take at most 30 values per call. */
const IN_CHUNK = 30;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export default function AdminInvitesPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [hiddenDemoCount, setHiddenDemoCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snap = await getDocs(
          query(
            collection(firestore(), "invites"),
            orderBy("signupCount", "desc"),
            limit(200)
          )
        );
        if (cancelled) return;

        const invites = snap.docs.map((d) => ({
          ...(d.data() as InviteDocData),
          id: d.id,
        }));

        // Resolve inviter profiles so the table shows handles, not raw UIDs.
        const users = new Map<string, UserDocData>();
        for (const ids of chunk(invites.map((i) => i.id), IN_CHUNK)) {
          const userSnap = await getDocs(
            query(collection(firestore(), "users"), where(documentId(), "in", ids))
          );
          for (const d of userSnap.docs) {
            users.set(d.id, d.data() as UserDocData);
          }
        }
        if (cancelled) return;

        const all: Row[] = invites.map((i) => ({ ...i, user: users.get(i.id) }));
        const real = all.filter((r) => !isDemoOrBotUser(r.id, r.user ?? {}));
        setHiddenDemoCount(all.length - real.length);
        setRows(real);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    if (!rows) return null;
    const signups = rows.reduce((sum, r) => sum + (r.signupCount ?? 0), 0);
    return { inviters: rows.length, signups };
  }, [rows]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Invites</h1>
        <p className="text-sm text-ink/60 mt-1">
          Users ranked by how many people signed up from their invite link, the
          top 200. Demo / bot accounts are hidden
          {hiddenDemoCount > 0 ? ` (${hiddenDemoCount} filtered)` : ""}.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {totals && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Users who've invited someone" value={totals.inviters} />
          <StatCard label="Attributed signups" value={totals.signups} />
        </div>
      )}

      <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Inviter</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">City</th>
              <th className="px-3 py-2 font-medium">Signups</th>
              <th className="px-3 py-2 font-medium">Last signup</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-ink/60">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-ink/60">
                  No attributed invites yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-ink/10">
                  <td className="px-3 py-2 font-medium">
                    {r.user?.username ? `@${r.user.username}` : r.id}
                  </td>
                  <td className="px-3 py-2 text-ink/70">{r.user?.name || "—"}</td>
                  <td className="px-3 py-2 text-ink/70">{r.user?.city || "—"}</td>
                  <td className="px-3 py-2 font-mono">{r.signupCount ?? 0}</td>
                  <td className="px-3 py-2 text-xs text-ink/50">
                    {r.lastSignupAt?.toDate().toLocaleDateString() ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-ink/60 bg-ink/5 border border-ink/10 rounded-lg p-4 space-y-2">
        <p className="font-semibold text-ink/80">What this counts</p>
        <p>
          One signup is counted when someone opens an invite link, installs the
          app, creates an account, and finishes onboarding — all on the same
          device, without the link being lost in between.
        </p>
        <p>
          It is <strong>not</strong> a count of invites sent or links tapped.
          The landing pages don&apos;t log taps, and a tap that goes out to the
          App Store and comes back after install loses the referrer, so real
          invite volume is higher than what&apos;s shown here. Closing that gap
          needs deferred deep linking.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <p className="text-xs text-ink/60">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
