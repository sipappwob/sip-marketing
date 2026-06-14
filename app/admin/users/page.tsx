"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../../../lib/firebase-client";
import { isDemoOrBotUser } from "../../../lib/demo-user";

interface UserDocData {
  username?: string;
  name?: string;
  city?: string;
  accountType?: string;
  ageBracket?: string;
  createdAt?: Timestamp;
  isDemoAccount?: boolean;
}
type UserDoc = UserDocData & { id: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[] | null>(null);
  const [hiddenDemoCount, setHiddenDemoCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const snap = await getDocs(
          query(
            collection(firestore(), "users"),
            orderBy("createdAt", "desc"),
            limit(500)
          )
        );
        if (cancelled) return;
        const all = snap.docs.map((d) => ({
          ...(d.data() as UserDocData),
          id: d.id,
        }));
        const real = all.filter((u) => !isDemoOrBotUser(u.id, u));
        setHiddenDemoCount(all.length - real.length);
        setUsers(real);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const breakdown = useMemo(() => {
    if (!users) return null;
    const byCity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byAge: Record<string, number> = {};
    for (const u of users) {
      const c = u.city || "Unknown";
      byCity[c] = (byCity[c] ?? 0) + 1;
      const t = u.accountType || "Unknown";
      byType[t] = (byType[t] ?? 0) + 1;
      const a = u.ageBracket || "Unknown";
      byAge[a] = (byAge[a] ?? 0) + 1;
    }
    return { byCity, byType, byAge, total: users.length };
  }, [users]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-ink/60 mt-1">
          Showing the {users?.length ?? "…"} most recent real users (capped at
          500). Demo / bot accounts are hidden
          {hiddenDemoCount > 0 ? ` (${hiddenDemoCount} filtered)` : ""}.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {breakdown && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BreakdownCard title="By city" data={breakdown.byCity} />
          <BreakdownCard title="By account type" data={breakdown.byType} />
          <BreakdownCard title="By age bracket" data={breakdown.byAge} />
        </div>
      )}

      <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Username</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">City</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {users === null ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-ink/60">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-ink/60">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-ink/10">
                  <td className="px-3 py-2 font-medium">{u.username || "—"}</td>
                  <td className="px-3 py-2 text-ink/70">{u.name || "—"}</td>
                  <td className="px-3 py-2 text-ink/70">{u.city || "—"}</td>
                  <td className="px-3 py-2 text-xs text-ink/60">
                    {u.accountType || "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-ink/50">
                    {u.createdAt?.toDate().toLocaleDateString() ?? "—"}
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

function BreakdownCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {entries.map(([k, v]) => (
          <li key={k} className="flex justify-between text-xs">
            <span className="text-ink/70">{k}</span>
            <span className="font-mono">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
