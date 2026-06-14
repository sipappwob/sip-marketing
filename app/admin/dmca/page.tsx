"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminDmcaListLogs,
  adminDmcaLookupPost,
  adminDmcaRecordLog,
  adminDmcaRemovePost,
  type DmcaLogRow,
  type DmcaPostLookup,
} from "../../../lib/firebase-client";

export default function AdminDmcaPage() {
  const [postId, setPostId] = useState("");
  const [noticeId, setNoticeId] = useState("");
  const [notes, setNotes] = useState("");
  const [lookup, setLookup] = useState<DmcaPostLookup | null>(null);
  const [logs, setLogs] = useState<DmcaLogRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [logType, setLogType] = useState<
    "notice_received" | "counter_notice" | "restored" | "termination"
  >("notice_received");
  const [logNotes, setLogNotes] = useState("");

  useEffect(() => {
    adminDmcaListLogs(40)
      .then(setLogs)
      .catch(() => setLogs([]));
  }, []);

  async function handleLookup() {
    setError(null);
    setSuccess(null);
    setLookup(null);
    if (!postId.trim()) {
      setError("Enter a post ID.");
      return;
    }
    setBusy(true);
    try {
      const res = await adminDmcaLookupPost(postId.trim());
      setLookup(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setSuccess(null);
    if (!postId.trim()) {
      setError("Enter a post ID.");
      return;
    }
    if (
      !window.confirm(
        "Remove this post for copyright/DMCA? This archives the post, hides it from the feed, and increments the uploader's strike count."
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await adminDmcaRemovePost({
        postId: postId.trim(),
        dmcaNoticeId: noticeId.trim() || undefined,
        notes: notes.trim() || undefined,
        source: "dmca_notice",
      });
      setSuccess(res.message);
      if (res.repeatInfringerFlag) {
        setSuccess(
          `${res.message} ⚠️ Repeat-infringer threshold reached — review for termination (see docs/DMCA_SOP.md).`
        );
      }
      const freshLogs = await adminDmcaListLogs(40);
      setLogs(freshLogs);
      setLookup(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogOnly() {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      await adminDmcaRecordLog({
        type: logType,
        postId: postId.trim() || undefined,
        dmcaNoticeId: noticeId.trim() || undefined,
        notes: logNotes.trim() || notes.trim() || undefined,
      });
      setSuccess("Logged.");
      setLogNotes("");
      const freshLogs = await adminDmcaListLogs(40);
      setLogs(freshLogs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Log failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">DMCA</h1>
        <p className="text-sm text-ink/60 mt-1 max-w-2xl">
          Takedowns, strike tracking, and compliance logs. Follow{" "}
          <code className="text-xs bg-ink/5 px-1 rounded">docs/DMCA_SOP.md</code>{" "}
          — target 24–72h for valid notices. Public policy:{" "}
          <Link href="/dmca" className="underline">
            /dmca
          </Link>
          .
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
          {success}
        </p>
      )}

      <section className="bg-white border border-ink/10 rounded-lg p-5 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Remove post (takedown)</h2>
        <label className="block text-xs text-ink/70">
          Post ID
          <input
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            placeholder="Firestore posts/{id}"
            className="mt-1 w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs text-ink/70">
          External notice ID (optional)
          <input
            value={noticeId}
            onChange={(e) => setNoticeId(e.target.value)}
            placeholder="Email thread / Copyright Office ref"
            className="mt-1 w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs text-ink/70">
          Internal notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleLookup()}
            className="px-4 py-2 text-sm border border-ink/20 rounded-md disabled:opacity-60"
          >
            Preview post
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleRemove()}
            className="px-4 py-2 text-sm bg-ink text-ivory rounded-md font-semibold disabled:opacity-60"
          >
            Remove post
          </button>
        </div>
        {lookup && (
          <div className="text-xs bg-ink/5 rounded-md p-3 space-y-1 font-mono">
            <div>
              <span className="text-ink/50">author</span> @
              {lookup.authorUsername ?? lookup.authorId ?? "—"}
            </div>
            <div>
              <span className="text-ink/50">title</span> {lookup.eventTitle ?? "—"}
            </div>
            <div>
              <span className="text-ink/50">status</span> {lookup.moderationStatus}
            </div>
            <div>
              <span className="text-ink/50">strikes (12 mo)</span>{" "}
              {lookup.copyrightStrikes} / {lookup.repeatInfringerThreshold}
            </div>
            <div className="text-ink/70 pt-1">{lookup.description}</div>
          </div>
        )}
      </section>

      <section className="bg-white border border-ink/10 rounded-lg p-5 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Log only (no takedown)</h2>
        <p className="text-xs text-ink/60">
          Notice received, counter-notice, restore, or termination — retention ≥ 3 years.
        </p>
        <select
          value={logType}
          onChange={(e) =>
            setLogType(
              e.target.value as
                | "notice_received"
                | "counter_notice"
                | "restored"
                | "termination"
            )
          }
          className="w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
        >
          <option value="notice_received">Notice received</option>
          <option value="counter_notice">Counter-notice</option>
          <option value="restored">Restored</option>
          <option value="termination">Termination</option>
        </select>
        <textarea
          value={logNotes}
          onChange={(e) => setLogNotes(e.target.value)}
          placeholder="Notes"
          rows={2}
          className="w-full border border-ink/20 rounded-md px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleLogOnly()}
          className="px-4 py-2 text-sm border border-ink/20 rounded-md disabled:opacity-60"
        >
          Save log entry
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recent log</h2>
        <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">When</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Post</th>
                <th className="px-3 py-2 font-medium">By</th>
              </tr>
            </thead>
            <tbody>
              {logs === null ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-ink/60">
                    Loading…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-ink/60">
                    No entries yet.
                  </td>
                </tr>
              ) : (
                logs.map((row) => (
                  <tr key={row.id} className="border-t border-ink/10">
                    <td className="px-3 py-2 text-xs text-ink/50">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 font-medium">{row.type}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {row.postId ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink/60">
                      {row.performedByEmail ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
