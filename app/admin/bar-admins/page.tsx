"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listBarAdminsAdmin,
  setBarAdminStatusAdmin,
  type BarAdminRow,
  type BarAdminValidationRow,
} from "../../../lib/firebase-client";

type BarAdmin = BarAdminRow;
type Validation = BarAdminValidationRow;

function formatMillis(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
  return new Date(ms).toLocaleString();
}

export default function AdminBarAdminsPage() {
  const [admins, setAdmins] = useState<BarAdmin[] | null>(null);
  const [validations, setValidations] = useState<Validation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { admins: rows, validations: tokens } = await listBarAdminsAdmin();
      setAdmins(rows);
      setValidations(tokens);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(admin: BarAdmin, status: "active" | "rejected") {
    setBusyId(admin.id);
    setError(null);
    try {
      await setBarAdminStatusAdmin(admin.id, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = useMemo(
    () => admins?.filter((a) => a.status === "pending") ?? [],
    [admins]
  );
  const active = useMemo(
    () => admins?.filter((a) => a.status === "active") ?? [],
    [admins]
  );
  const rejected = useMemo(
    () =>
      admins?.filter(
        (a) => a.status === "rejected" || a.status === "revoked"
      ) ?? [],
    [admins]
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Bar admins</h1>
        <p className="text-sm text-ink/60 mt-1">
          Approve, revoke, or audit bar-administrator account ownership. The
          email-validation flow auto-flips status on click; use the manual
          buttons here when an owner&rsquo;s email gets stuck or you want to
          revoke access.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Section
        title="Pending"
        count={pending.length}
        emptyText="No pending bar admins."
        rows={pending.map((a) => (
          <AdminRow
            key={a.id}
            admin={a}
            primaryAction={{
              label: "Mark as active",
              onClick: () => setStatus(a, "active"),
            }}
            secondaryAction={{
              label: "Revoke",
              onClick: () => setStatus(a, "rejected"),
            }}
            busy={busyId === a.id}
          />
        ))}
        loading={admins === null}
      />

      <Section
        title="Active"
        count={active.length}
        emptyText="No active bar admins yet."
        rows={active.map((a) => (
          <AdminRow
            key={a.id}
            admin={a}
            primaryAction={null}
            secondaryAction={{
              label: "Revoke",
              onClick: () => setStatus(a, "rejected"),
            }}
            busy={busyId === a.id}
          />
        ))}
        loading={admins === null}
      />

      {rejected.length > 0 && (
        <Section
          title="Revoked"
          count={rejected.length}
          emptyText=""
          rows={rejected.map((a) => (
            <AdminRow
              key={a.id}
              admin={a}
              primaryAction={{
                label: "Re-activate",
                onClick: () => setStatus(a, "active"),
              }}
              secondaryAction={null}
              busy={busyId === a.id}
            />
          ))}
          loading={admins === null}
        />
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Pending validation tokens ({validations?.length ?? "…"})
        </h2>
        <p className="text-xs text-ink/60 mb-3">
          Outstanding email-verification tokens. Useful for debugging stuck
          flows; tokens are single-use and read-only here.
        </p>
        {validations === null ? (
          <p className="text-sm text-ink/60">Loading…</p>
        ) : validations.length === 0 ? (
          <p className="text-sm text-ink/60">None outstanding.</p>
        ) : (
          <div className="overflow-x-auto bg-white border border-ink/10 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-ink/5 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Bar</th>
                  <th className="px-3 py-2 font-medium">Sent to</th>
                  <th className="px-3 py-2 font-medium">Created</th>
                  <th className="px-3 py-2 font-medium">Expires</th>
                  <th className="px-3 py-2 font-medium">Sent</th>
                </tr>
              </thead>
              <tbody>
                {validations.map((v) => (
                  <tr key={v.id} className="border-t border-ink/10">
                    <td className="px-3 py-2 font-medium">{v.barName}</td>
                    <td className="px-3 py-2 font-mono text-xs">{v.email}</td>
                    <td className="px-3 py-2 text-xs text-ink/60">
                      {formatMillis(v.createdAt)}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink/60">
                      {formatMillis(v.expiresAt)}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink/60">
                      {v.sendCount ?? 1}×
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

interface SectionProps {
  title: string;
  count: number;
  emptyText: string;
  rows: React.ReactNode[];
  loading: boolean;
}

function Section({ title, count, emptyText, rows, loading }: SectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">
        {title} ({loading ? "…" : count})
      </h2>
      {loading ? (
        <p className="text-sm text-ink/60">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-ink/60">{emptyText}</p>
      ) : (
        <div className="space-y-2">{rows}</div>
      )}
    </section>
  );
}

interface RowProps {
  admin: BarAdmin;
  primaryAction: { label: string; onClick: () => void } | null;
  secondaryAction: { label: string; onClick: () => void } | null;
  busy: boolean;
}

function AdminRow({ admin, primaryAction, secondaryAction, busy }: RowProps) {
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">
          {admin.displayName || admin.email || admin.id}
        </div>
        {admin.email && admin.email !== admin.displayName && (
          <div className="text-xs text-ink/60 font-mono truncate">
            {admin.email}
          </div>
        )}
        <div className="text-[11px] text-ink/50 font-mono truncate">
          uid: {admin.id}
        </div>
        {admin.assignedBars && admin.assignedBars.length > 0 && (
          <div className="text-xs text-ink/70 mt-1">
            Bars:{" "}
            {admin.assignedBars
              .map((b) => `${b.barId}${b.status ? ` (${b.status})` : ""}`)
              .join(", ")}
          </div>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        {primaryAction && (
          <button
            disabled={busy}
            onClick={primaryAction.onClick}
            className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            disabled={busy}
            onClick={secondaryAction.onClick}
            className="text-xs px-3 py-1.5 rounded-md border border-ink/20 text-ink/70 hover:bg-ink/5 disabled:opacity-60"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
