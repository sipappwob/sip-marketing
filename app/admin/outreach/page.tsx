"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { firebaseAuth } from "../../../lib/firebase-client";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  renderPreview,
  requestJob,
  saveSettings,
  setProspectEmail,
  subscribeJob,
  subscribeProspects,
  updateProspect,
  type JobType,
  type OutreachJob,
  type OutreachSettings,
  type OutreachStatus,
  type Prospect,
} from "../../../lib/outreach-client";

const STATUS_LABEL: Record<OutreachStatus, string> = {
  new: "New",
  no_email: "No email",
  ready: "Ready",
  sent: "Sent",
  followed_up: "Followed up",
  replied: "Replied",
  interested: "Interested",
  declined: "Declined",
  do_not_contact: "Do not contact",
  bounced: "Bounced",
  closed: "Closed",
  skipped: "Skipped",
};

const STATUS_TONE: Record<OutreachStatus, string> = {
  new: "bg-ink/5 text-ink/70",
  no_email: "bg-amber-50 text-amber-800",
  ready: "bg-sky-50 text-sky-800",
  sent: "bg-indigo-50 text-indigo-800",
  followed_up: "bg-indigo-50 text-indigo-800",
  replied: "bg-emerald-50 text-emerald-800",
  interested: "bg-emerald-600 text-white",
  declined: "bg-ink/10 text-ink/60",
  do_not_contact: "bg-red-50 text-red-800",
  bounced: "bg-red-50 text-red-800",
  closed: "bg-ink/10 text-ink/50",
  skipped: "bg-ink/10 text-ink/50",
};

const JOB_LABEL: Record<JobType, string> = {
  build_prospects: "Refresh bar list",
  find_contacts: "Find contact emails",
  send_batch: "Send today's batch",
  send_one: "Send to one bar",
  send_test: "Send me a test",
  sync_replies: "Check for replies",
};

/** Reachable by phone only: no email anywhere, but Google Places gave us a number. */
function isPhoneOnly(p: Pick<Prospect, "email" | "phone" | "status">): boolean {
  return !p.email && !!p.phone && !["closed", "do_not_contact"].includes(p.status);
}

function fmt(ts: Timestamp | null | undefined): string {
  if (!ts) return "—";
  try {
    return ts.toDate().toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

export default function AdminOutreachPage() {
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [dueFollowUps, setDueFollowUps] = useState(0);
  const [settings, setSettings] = useState<OutreachSettings>(DEFAULT_SETTINGS);
  const [settingsVersion, setSettingsVersion] = useState(0);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<OutreachJob | null>(null);
  const [jobBusy, setJobBusy] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phoneOnlyFilter, setPhoneOnlyFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [previewBarId, setPreviewBarId] = useState<string>("");

  useEffect(() => {
    const unsub = subscribeProspects(
      (rows) => {
        setProspects(rows);
        const now = Date.now();
        setDueFollowUps(
          rows.filter(
            (p) =>
              ["sent", "followed_up"].includes(p.status) &&
              !p.sequenceComplete &&
              !!p.nextSendAt &&
              p.nextSendAt.toMillis() <= now
          ).length
        );
      },
      (e) => setError(e.message)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    loadSettings()
      .then((s) => {
        setSettings(s);
        setSettingsVersion((v) => v + 1);
        setSettingsLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load settings."));
  }, []);

  const runJob = useCallback(
    async (type: JobType, extra: { barId?: string; toEmail?: string; force?: boolean } = {}) => {
      setError(null);
      setJobBusy(true);
      try {
        const id = await requestJob(type, extra);
        const unsub = subscribeJob(id, (j) => {
          setJob(j);
          if (j && (j.status === "done" || j.status === "failed")) {
            setJobBusy(false);
            unsub();
          }
        });
      } catch (e) {
        setJobBusy(false);
        setError(e instanceof Error ? e.message : "Could not start job.");
      }
    },
    []
  );

  async function persistSettings(next: OutreachSettings) {
    setSavingSettings(true);
    setError(null);
    try {
      await saveSettings(next);
      setSettings(next);
      setSettingsVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of prospects ?? []) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [prospects]);

  const cities = useMemo(
    () => Array.from(new Set((prospects ?? []).map((p) => p.city))).sort(),
    [prospects]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (prospects ?? []).filter((p) => {
      if (cityFilter !== "all" && p.city !== cityFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (phoneOnlyFilter && !isPhoneOnly(p)) return false;
      if (q && !`${p.barName} ${p.email ?? ""} ${p.neighborhood ?? ""} ${p.notes ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prospects, cityFilter, statusFilter, phoneOnlyFilter, search]);

  const previewProspect =
    (prospects ?? []).find((p) => p.id === previewBarId) ??
    (prospects ?? []).find((p) => p.city === "New York City") ??
    (prospects ?? [])[0] ?? {
      barName: "Sample Bar",
      city: "New York City",
      neighborhood: "East Village",
      meetingMode: "call_or_visit" as const,
    };

  const total = prospects?.length ?? 0;
  const withEmail = (prospects ?? []).filter((p) => !!p.email).length;
  const phoneOnlyCount = (prospects ?? []).filter(isPhoneOnly).length;
  const readyCount = counts.ready ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Bar outreach</h1>
          <p className="text-sm text-ink/60 mt-1 max-w-2xl">
            Founder email campaign to the EV/LES and Ann Arbor bars already on the map. The agent
            finds a contact on each venue&rsquo;s website, sends from{" "}
            <span className="font-mono">{settings.fromEmail}</span>, follows up after{" "}
            {settings.followUpDays} days with no reply, and stops the moment someone answers.
            Ann Arbor bars are asked for a phone call only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!settingsLoaded || savingSettings}
            onClick={() => persistSettings({ ...settings, paused: !settings.paused })}
            className={`text-xs px-3 py-1.5 rounded-md border font-semibold ${
              settings.paused
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-emerald-300 bg-emerald-50 text-emerald-900"
            } disabled:opacity-60`}
          >
            {settings.paused ? "Schedule paused — click to resume" : "Schedule running — click to pause"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <Stat label="Bars" value={total} />
        <Stat label="With email" value={withEmail} />
        <Stat label="Phone only" value={phoneOnlyCount} tone={phoneOnlyCount > 0 ? "warn" : undefined} />
        <Stat label="Ready to send" value={readyCount} />
        <Stat label="Follow-ups due" value={dueFollowUps} />
        <Stat label="Replied" value={(counts.replied ?? 0) + (counts.interested ?? 0) + (counts.declined ?? 0)} />
        <Stat label="Interested" value={counts.interested ?? 0} tone="good" />
      </div>

      <section className="bg-white border border-ink/10 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <JobButton label={JOB_LABEL.build_prospects} busy={jobBusy} onClick={() => runJob("build_prospects")} />
          <JobButton label={JOB_LABEL.find_contacts} busy={jobBusy} onClick={() => runJob("find_contacts")} />
          <JobButton label={JOB_LABEL.sync_replies} busy={jobBusy} onClick={() => runJob("sync_replies")} />
          <JobButton
            label={JOB_LABEL.send_test}
            busy={jobBusy}
            onClick={() =>
              runJob("send_test", {
                toEmail: firebaseAuth().currentUser?.email ?? undefined,
                barId: previewBarId || undefined,
              })
            }
          />
          <JobButton
            label={`${JOB_LABEL.send_batch} (cap ${settings.dailyCap})`}
            busy={jobBusy}
            primary
            onClick={() => {
              if (window.confirm(`Send up to ${settings.dailyCap} emails now (follow-ups due first, then ready bars)?`)) {
                runJob("send_batch");
              }
            }}
          />
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-md border border-ink/20 text-ink/70 hover:bg-ink/5"
          >
            {showSettings ? "Hide settings" : "Settings"}
          </button>
          <button
            type="button"
            onClick={() => setShowTemplates((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-md border border-ink/20 text-ink/70 hover:bg-ink/5"
          >
            {showTemplates ? "Hide templates" : "Templates"}
          </button>
        </div>
        <p className="text-xs text-ink/50">
          Order of operations the first time: refresh bar list → find contact emails → review the
          table and fix any addresses → send yourself a test → resume the schedule (weekdays 10:30
          ET) or send a batch now.
        </p>
        {job && <JobStatus job={job} />}
      </section>

      {showSettings && (
        <SettingsPanel
          key={settingsVersion}
          settings={settings}
          saving={savingSettings}
          onSave={persistSettings}
        />
      )}

      {showTemplates && (
        <TemplatesPanel
          key={settingsVersion}
          settings={settings}
          saving={savingSettings}
          onSave={persistSettings}
          preview={previewProspect}
          prospects={prospects ?? []}
          previewBarId={previewBarId}
          onPreviewBar={setPreviewBarId}
        />
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bar, email, neighborhood"
            className="text-sm border border-ink/20 rounded-md px-3 py-1.5 bg-white w-64"
          />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-sm border border-ink/20 rounded-md px-2 py-1.5 bg-white"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-ink/20 rounded-md px-2 py-1.5 bg-white"
          >
            <option value="all">All statuses</option>
            {(Object.keys(STATUS_LABEL) as OutreachStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]} ({counts[s] ?? 0})
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-ink/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={phoneOnlyFilter}
              onChange={(e) => setPhoneOnlyFilter(e.target.checked)}
              className="accent-amber-600"
            />
            Phone only ({phoneOnlyCount})
          </label>
          <span className="text-xs text-ink/50">{filtered.length} shown</span>
        </div>

        {prospects === null ? (
          <p className="text-sm text-ink/60">Loading…</p>
        ) : prospects.length === 0 ? (
          <div className="bg-white border border-ink/10 rounded-lg p-6 text-sm text-ink/60">
            No prospects yet. Click <strong>Refresh bar list</strong> to import the approved EV/LES and
            Ann Arbor bars with their website and phone from Google Places.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-ink/10 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-ink/5 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Bar</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Touches</th>
                  <th className="px-3 py-2 font-medium">Next</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProspectRow
                    key={p.id}
                    p={p}
                    busy={jobBusy}
                    onSendOne={() => {
                      if (window.confirm(`Send the next touch to ${p.barName} (${p.email}) now?`)) {
                        runJob("send_one", { barId: p.id });
                      }
                    }}
                    onRelookup={() => runJob("find_contacts", { barId: p.id, force: true })}
                    onError={setError}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "good" | "warn" }) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        tone === "good"
          ? "bg-emerald-50 border-emerald-200"
          : tone === "warn"
            ? "bg-amber-50 border-amber-200"
            : "bg-white border-ink/10"
      }`}
    >
      <div className="text-[11px] text-ink/60">{label}</div>
      <div className="text-2xl font-semibold mt-0.5">{value.toLocaleString()}</div>
    </div>
  );
}

function JobButton({
  label,
  busy,
  primary,
  onClick,
}: {
  label: string;
  busy: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-md font-semibold disabled:opacity-60 ${
        primary ? "bg-ink text-ivory hover:bg-ink/90" : "border border-ink/20 text-ink hover:bg-ink/5"
      }`}
    >
      {label}
    </button>
  );
}

function JobStatus({ job }: { job: OutreachJob }) {
  const tone =
    job.status === "failed"
      ? "bg-red-50 border-red-200 text-red-800"
      : job.status === "done"
        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
        : "bg-sky-50 border-sky-200 text-sky-900";
  const r = job.result ?? {};
  const summary = Object.entries(r)
    .filter(([k, v]) => k !== "outcomes" && (typeof v === "number" || typeof v === "string" || typeof v === "boolean"))
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(" · ");
  const outcomes = Array.isArray(r.outcomes) ? (r.outcomes as { barName: string; to: string; ok: boolean; error?: string }[]) : [];
  return (
    <div className={`border rounded-md px-3 py-2 text-xs space-y-1 ${tone}`}>
      <div>
        <strong>{JOB_LABEL[job.type]}</strong> — {job.status}
        {job.status === "running" || job.status === "pending" ? "…" : ""}
      </div>
      {job.error && <div>{job.error}</div>}
      {summary && <div className="font-mono text-[11px]">{summary}</div>}
      {outcomes.length > 0 && (
        <ul className="font-mono text-[11px] space-y-0.5 max-h-40 overflow-auto">
          {outcomes.map((o, i) => (
            <li key={i}>
              {o.ok ? "✓" : "✗"} {o.barName} → {o.to}
              {o.error ? ` (${o.error})` : ""}
            </li>
          ))}
        </ul>
      )}
      {job.result?.continuedIn ? <div>More bars remain; a follow-on job was queued automatically.</div> : null}
    </div>
  );
}

function ProspectRow({
  p,
  busy,
  onSendOne,
  onRelookup,
  onError,
}: {
  p: Prospect;
  busy: boolean;
  onSendOne: () => void;
  onRelookup: () => void;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.email ?? "");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState(p.notes ?? "");

  function beginEdit() {
    setDraft(p.email ?? "");
    setEditing(true);
  }

  async function commitEmail(value: string) {
    try {
      await setProspectEmail(p, value);
      setEditing(false);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Could not save email.");
    }
  }

  async function setStatus(status: OutreachStatus) {
    try {
      const patch: Parameters<typeof updateProspect>[1] = { status };
      if (["do_not_contact", "declined", "interested", "skipped"].includes(status)) {
        patch.sequenceComplete = true;
        patch.nextSendAt = null;
      }
      if (status === "ready") {
        patch.sequenceComplete = false;
      }
      await updateProspect(p.id, patch);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Could not update status.");
    }
  }

  const canSend = !!p.email && !["do_not_contact", "bounced", "closed", "skipped", "declined", "interested"].includes(p.status) && !p.sequenceComplete;

  return (
    <>
      <tr className="border-t border-ink/10 align-top">
        <td className="px-3 py-2">
          <div className="font-medium flex items-center gap-1.5 flex-wrap">
            {p.barName}
            {isPhoneOnly(p) && (
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200"
                title="No email found anywhere. Reach this bar by phone."
              >
                Phone only
              </span>
            )}
          </div>
          <div className="text-[11px] text-ink/50">
            {p.neighborhood ?? p.city}
            {p.meetingMode === "phone_only" ? " · call, no visit" : ""}
          </div>
          <div className="text-[11px] text-ink/50 flex gap-2 flex-wrap mt-0.5">
            {p.website && (
              <a href={p.website} target="_blank" rel="noreferrer" className="underline">
                site
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone.replace(/[^+\d]/g, "")}`} className={isPhoneOnly(p) ? "font-semibold text-amber-900 underline" : "underline"}>
                {p.phone}
              </a>
            )}
            {p.instagram && (
              <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noreferrer" className="underline">
                @{p.instagram}
              </a>
            )}
          </div>
        </td>
        <td className="px-3 py-2">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitEmail(draft);
              }}
              className="flex gap-1"
            >
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                list={`cands-${p.id}`}
                className="text-xs border border-ink/20 rounded px-2 py-1 w-56 font-mono"
                placeholder="name@venue.com"
              />
              <datalist id={`cands-${p.id}`}>
                {p.emailCandidates?.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <button type="submit" className="text-xs px-2 py-1 rounded bg-ink text-ivory">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="text-xs px-2 py-1 rounded border border-ink/20">
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={beginEdit}
              className="text-left font-mono text-xs hover:underline"
              title="Click to edit"
            >
              {p.email ?? <span className="text-ink/40">add email</span>}
            </button>
          )}
          {!editing && p.emailCandidates && p.emailCandidates.length > 1 && (
            <div className="text-[10px] text-ink/40 mt-0.5 truncate max-w-[16rem]">
              also: {p.emailCandidates.filter((c) => c !== p.email).slice(0, 3).join(", ")}
            </div>
          )}
          {p.lastSendError && <div className="text-[10px] text-red-700 mt-0.5">{p.lastSendError}</div>}
        </td>
        <td className="px-3 py-2">
          <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${STATUS_TONE[p.status] ?? ""}`}>
            {STATUS_LABEL[p.status] ?? p.status}
          </span>
          {p.lastReplySnippet && (
            <div className="text-[11px] text-ink/60 mt-1 max-w-[18rem] line-clamp-3" title={p.lastReplySnippet}>
              “{p.lastReplySnippet}”
            </div>
          )}
          {p.notes && !notesOpen && (
            <button
              type="button"
              onClick={() => {
                setNotes(p.notes ?? "");
                setNotesOpen(true);
              }}
              className="block text-left text-[11px] mt-1 max-w-[18rem] whitespace-pre-wrap rounded border border-sky-200 bg-sky-50 text-sky-950 px-2 py-1 hover:bg-sky-100"
              title="Click to edit notes"
            >
              {p.notes}
            </button>
          )}
        </td>
        <td className="px-3 py-2 text-xs text-ink/70 whitespace-nowrap">
          {p.step ?? 0}
          {p.lastSentAt ? ` · last ${fmt(p.lastSentAt)}` : ""}
        </td>
        <td className="px-3 py-2 text-xs text-ink/70 whitespace-nowrap">
          {p.sequenceComplete ? "—" : fmt(p.nextSendAt)}
        </td>
        <td className="px-3 py-2">
          <div className="flex flex-wrap gap-1">
            {canSend && (
              <button disabled={busy} onClick={onSendOne} className="text-[11px] px-2 py-1 rounded bg-ink text-ivory disabled:opacity-60">
                Send now
              </button>
            )}
            {["sent", "followed_up", "replied"].includes(p.status) && (
              <>
                <button onClick={() => setStatus("interested")} className="text-[11px] px-2 py-1 rounded bg-emerald-600 text-white">
                  Interested
                </button>
                <button onClick={() => setStatus("declined")} className="text-[11px] px-2 py-1 rounded border border-ink/20">
                  Declined
                </button>
                {p.status !== "replied" && (
                  <button onClick={() => setStatus("replied")} className="text-[11px] px-2 py-1 rounded border border-ink/20">
                    Mark replied
                  </button>
                )}
              </>
            )}
            {!["do_not_contact", "closed"].includes(p.status) && (
              <button onClick={() => setStatus("do_not_contact")} className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-700">
                Do not contact
              </button>
            )}
            {["new", "no_email", "ready"].includes(p.status) && (
              <button onClick={() => setStatus("skipped")} className="text-[11px] px-2 py-1 rounded border border-ink/20 text-ink/60">
                Skip
              </button>
            )}
            {["skipped", "declined", "do_not_contact", "bounced"].includes(p.status) && p.email && (
              <button onClick={() => setStatus("ready")} className="text-[11px] px-2 py-1 rounded border border-ink/20 text-ink/60">
                Re-enable
              </button>
            )}
            {p.website && (
              <button disabled={busy} onClick={onRelookup} className="text-[11px] px-2 py-1 rounded border border-ink/20 text-ink/60 disabled:opacity-60">
                Re-scan site
              </button>
            )}
            <button
              onClick={() => {
                if (!notesOpen) setNotes(p.notes ?? "");
                setNotesOpen((v) => !v);
              }}
              className="text-[11px] px-2 py-1 rounded border border-ink/20 text-ink/60"
            >
              {p.notes ? "Edit notes" : "Add notes"}
            </button>
          </div>
        </td>
      </tr>
      {notesOpen && (
        <tr className="border-t border-ink/5 bg-ink/[0.02]">
          <td colSpan={6} className="px-3 py-2">
            <div className="flex gap-2 items-start">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="text-xs border border-ink/20 rounded px-2 py-1 flex-1 bg-white"
                placeholder="Call notes, who you spoke with, what they asked for…"
              />
              <button
                onClick={async () => {
                  try {
                    await updateProspect(p.id, { notes: notes.trim() || null });
                    setNotesOpen(false);
                  } catch (e) {
                    onError(e instanceof Error ? e.message : "Could not save notes.");
                  }
                }}
                className="text-xs px-2 py-1 rounded bg-ink text-ivory"
              >
                Save
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SettingsPanel({
  settings,
  saving,
  onSave,
}: {
  settings: OutreachSettings;
  saving: boolean;
  onSave: (s: OutreachSettings) => Promise<void>;
}) {
  const [draft, setDraft] = useState(settings);

  return (
    <section className="bg-white border border-ink/10 rounded-lg p-4 space-y-4">
      <h2 className="text-base font-semibold">Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        <Field label="From name">
          <input value={draft.fromName} onChange={(e) => setDraft({ ...draft, fromName: e.target.value })} className={inputCls} />
        </Field>
        <Field label="From email (mailbox the agent sends as)">
          <input value={draft.fromEmail} onChange={(e) => setDraft({ ...draft, fromEmail: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Daily send cap">
          <input
            type="number"
            min={1}
            max={100}
            value={draft.dailyCap}
            onChange={(e) => setDraft({ ...draft, dailyCap: Math.max(1, Number(e.target.value) || 1) })}
            className={inputCls}
          />
        </Field>
        <Field label="Days before follow-up">
          <input
            type="number"
            min={1}
            max={30}
            value={draft.followUpDays}
            onChange={(e) => setDraft({ ...draft, followUpDays: Math.max(1, Number(e.target.value) || 1) })}
            className={inputCls}
          />
        </Field>
        <Field label="Follow-ups after the first email">
          <select
            value={draft.maxFollowUps}
            onChange={(e) => setDraft({ ...draft, maxFollowUps: Number(e.target.value) })}
            className={inputCls}
          >
            <option value={0}>None</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </Field>
        <Field label="Calendly link (optional)">
          <input value={draft.calendlyUrl} onChange={(e) => setDraft({ ...draft, calendlyUrl: e.target.value })} className={inputCls} placeholder="https://calendly.com/…" />
        </Field>
        <Field label="Phone-only cities (comma separated)">
          <input
            value={draft.phoneOnlyCities.join(", ")}
            onChange={(e) =>
              setDraft({
                ...draft,
                phoneOnlyCities: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className={inputCls}
          />
        </Field>
        <Field label="Postal address for the footer (CAN-SPAM)" wide>
          <input value={draft.postalAddress} onChange={(e) => setDraft({ ...draft, postalAddress: e.target.value })} className={inputCls} placeholder="Sip, 123 Street, New York, NY 10002" />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(draft)}
          className="text-xs px-3 py-1.5 rounded-md bg-ink text-ivory font-semibold disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        <p className="text-[11px] text-ink/50">
          The schedule runs weekdays at 10:30 ET and checks for replies every 3 hours. Keep the cap low
          for the first two weeks so the mailbox warms up.
        </p>
      </div>
    </section>
  );
}

function TemplatesPanel({
  settings,
  saving,
  onSave,
  preview,
  prospects,
  previewBarId,
  onPreviewBar,
}: {
  settings: OutreachSettings;
  saving: boolean;
  onSave: (s: OutreachSettings) => Promise<void>;
  preview: Pick<Prospect, "barName" | "city" | "neighborhood" | "meetingMode">;
  prospects: Prospect[];
  previewBarId: string;
  onPreviewBar: (id: string) => void;
}) {
  const [draft, setDraft] = useState(settings);
  const [which, setWhich] = useState<"initial" | "followUp1" | "followUp2">("initial");

  const tpl = draft.templates[which];
  const rendered = renderPreview(tpl, preview, draft);

  return (
    <section className="bg-white border border-ink/10 rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Templates</h2>
        <div className="flex gap-1">
          {(["initial", "followUp1", "followUp2"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setWhich(k)}
              className={`text-xs px-3 py-1 rounded-md border ${which === k ? "bg-ink text-ivory border-ink" : "border-ink/20 text-ink/70"}`}
            >
              {k === "initial" ? "Initial" : k === "followUp1" ? "Follow-up 1" : "Follow-up 2"}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-ink/50">
        Placeholders: {"{{barName}} {{areaLabel}} {{city}} {{neighborhood}} {{meetingAsk}} {{orStopBy}} {{calendlyLine}} {{postalAddress}} {{fromName}} {{fromEmail}}"}.
        {" "}<code>meetingAsk</code> and <code>orStopBy</code> switch automatically for phone-only cities.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Field label="Subject">
            <input
              value={tpl.subject}
              onChange={(e) => setDraft({ ...draft, templates: { ...draft.templates, [which]: { ...tpl, subject: e.target.value } } })}
              className={inputCls}
            />
          </Field>
          <Field label="Body (plain text)">
            <textarea
              value={tpl.body}
              rows={22}
              onChange={(e) => setDraft({ ...draft, templates: { ...draft.templates, [which]: { ...tpl, body: e.target.value } } })}
              className={`${inputCls} font-mono text-xs leading-relaxed`}
            />
          </Field>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-medium text-ink/70">Preview</div>
            <select
              value={previewBarId}
              onChange={(e) => onPreviewBar(e.target.value)}
              className="text-xs border border-ink/20 rounded px-2 py-1 bg-white max-w-[16rem]"
            >
              <option value="">Pick a bar…</option>
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.barName} · {p.city}
                </option>
              ))}
            </select>
          </div>
          <div className="border border-ink/10 rounded-md bg-ivory/60 p-3 text-sm">
            <div className="text-xs text-ink/60">
              From: {draft.fromName} &lt;{draft.fromEmail}&gt;
            </div>
            <div className="font-medium mt-1">{rendered.subject}</div>
            <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed mt-3">{rendered.body}</pre>
          </div>
        </div>
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={() => onSave(draft)}
        className="text-xs px-3 py-1.5 rounded-md bg-ink text-ivory font-semibold disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save templates"}
      </button>
    </section>
  );
}

const inputCls = "w-full text-sm border border-ink/20 rounded-md px-2 py-1.5 bg-white";

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <span className="block text-[11px] text-ink/60 mb-1">{label}</span>
      {children}
    </label>
  );
}
