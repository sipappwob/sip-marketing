/**
 * Client-side helpers for /admin/outreach. Everything goes through Firestore:
 * prospects and settings are read/written directly under super-admin rules;
 * long-running work is requested by creating an `outreach_jobs` doc that the
 * `onOutreachJobCreate` Cloud Function picks up.
 */
"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { firebaseAuth, firestore } from "./firebase-client";

export type OutreachStatus =
  | "new"
  | "no_email"
  | "ready"
  | "sent"
  | "followed_up"
  | "replied"
  | "interested"
  | "declined"
  | "do_not_contact"
  | "bounced"
  | "closed"
  | "skipped";

export interface Prospect {
  id: string;
  barName: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  website: string | null;
  phone: string | null;
  instagram: string | null;
  meetingMode: "call_or_visit" | "phone_only";
  businessStatus: string | null;
  email: string | null;
  emailCandidates: string[];
  emailSource: string | null;
  contactLookupStatus: string;
  status: OutreachStatus;
  step: number;
  firstSentAt: Timestamp | null;
  lastSentAt: Timestamp | null;
  nextSendAt: Timestamp | null;
  sequenceComplete: boolean;
  provider: string | null;
  threadId: string | null;
  lastReplySnippet: string | null;
  lastReplyAt: Timestamp | null;
  lastReplyFrom?: string | null;
  lastSendError?: string | null;
  notes: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface OutreachTemplate {
  subject: string;
  body: string;
}

export interface OutreachSettings {
  paused: boolean;
  fromName: string;
  fromEmail: string;
  dailyCap: number;
  followUpDays: number;
  maxFollowUps: number;
  calendlyUrl: string;
  postalAddress: string;
  phoneOnlyCities: string[];
  templates: {
    initial: OutreachTemplate;
    followUp1: OutreachTemplate;
    followUp2: OutreachTemplate;
  };
}

export type JobType =
  | "build_prospects"
  | "find_contacts"
  | "send_batch"
  | "send_one"
  | "send_test"
  | "sync_replies";

export interface OutreachJob {
  id: string;
  type: JobType;
  status: "pending" | "running" | "done" | "failed";
  result?: Record<string, unknown>;
  error?: string;
  barId?: string;
  createdAt: Timestamp | null;
  finishedAt?: Timestamp | null;
}

/** Mirrors functions/src/lib/outreach/types.ts so the form has sane defaults before the doc exists. */
export const DEFAULT_SETTINGS: OutreachSettings = {
  paused: true,
  fromName: "Will O'Brien",
  fromEmail: "will@sipapp.co",
  dailyCap: 20,
  followUpDays: 7,
  maxFollowUps: 2,
  calendlyUrl: "",
  postalAddress: "",
  phoneOnlyCities: ["Ann Arbor"],
  templates: {
    initial: {
      subject: "Quick question about {{barName}}",
      body: `Hi there,

I'm Will, one of the founders of Sip, a new app that shows people live wait times at bars near them, reported by the people standing in line. We're starting in {{areaLabel}}, and {{barName}} is already on the map.

Before we open to the public, I'm looking for a small group of bars to test it with. There's no cost and nothing to install. All I'm after is honest feedback on what would make it useful to you.

What you'd get:
- A free listing on the map with your hours, photos, and live line status
- A direct channel to post promotions to people deciding where to go tonight
- Personalized support from me on whatever you need, from setup to ideas

There's no traffic yet while we refine it, and we launch soon. Once we do, I think it becomes a strong promotional channel for a bar like yours.

{{meetingAsk}}

Will O'Brien
Founder, Sip
{{fromEmail}}
{{calendlyLine}}

Reply "stop" and I won't email again.
{{postalAddress}}`,
    },
    followUp1: {
      subject: "Re: Quick question about {{barName}}",
      body: `Hi again,

Floating this back up in case it got buried. I'd love to get {{barName}} in as one of our first test bars, and I can keep it to 10 minutes on the phone{{orStopBy}}.

If now isn't the right time, no problem at all.

Will O'Brien
Founder, Sip
{{fromEmail}}
{{calendlyLine}}

Reply "stop" and I won't email again.
{{postalAddress}}`,
    },
    followUp2: {
      subject: "Re: Quick question about {{barName}}",
      body: `Hi,

Last note from me. If you'd like to see how {{barName}} looks on Sip, I can send a screenshot or walk you through it in a few minutes. Otherwise I'll leave you be, and best of luck this season.

Will O'Brien
Founder, Sip
{{fromEmail}}
{{calendlyLine}}

Reply "stop" and I won't email again.
{{postalAddress}}`,
    },
  },
};

export function subscribeProspects(cb: (rows: Prospect[]) => void, onError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    collection(firestore(), "bar_outreach"),
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Prospect, "id">) }));
      rows.sort((a, b) => a.barName.localeCompare(b.barName));
      cb(rows);
    },
    (e) => onError(e)
  );
}

export async function loadSettings(): Promise<OutreachSettings> {
  const snap = await getDoc(doc(firestore(), "outreach_settings", "default"));
  if (!snap.exists()) return DEFAULT_SETTINGS;
  const raw = snap.data() as Partial<OutreachSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    phoneOnlyCities: raw.phoneOnlyCities ?? DEFAULT_SETTINGS.phoneOnlyCities,
    templates: {
      initial: { ...DEFAULT_SETTINGS.templates.initial, ...(raw.templates?.initial ?? {}) },
      followUp1: { ...DEFAULT_SETTINGS.templates.followUp1, ...(raw.templates?.followUp1 ?? {}) },
      followUp2: { ...DEFAULT_SETTINGS.templates.followUp2, ...(raw.templates?.followUp2 ?? {}) },
    },
  };
}

export async function saveSettings(s: OutreachSettings): Promise<void> {
  const uid = firebaseAuth().currentUser?.uid ?? null;
  await setDoc(
    doc(firestore(), "outreach_settings", "default"),
    { ...s, updatedAt: serverTimestamp(), updatedBy: uid },
    { merge: true }
  );
}

export async function requestJob(
  type: JobType,
  extra: { barId?: string; toEmail?: string; force?: boolean } = {}
): Promise<string> {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new Error("Not signed in.");
  const payload: Record<string, unknown> = {
    type,
    requestedBy: uid,
    status: "pending",
    createdAt: serverTimestamp(),
  };
  if (extra.barId) payload.barId = extra.barId;
  if (extra.toEmail) payload.toEmail = extra.toEmail;
  if (extra.force) payload.force = true;
  const ref = await addDoc(collection(firestore(), "outreach_jobs"), payload);
  return ref.id;
}

export function subscribeJob(jobId: string, cb: (job: OutreachJob | null) => void): Unsubscribe {
  return onSnapshot(doc(firestore(), "outreach_jobs", jobId), (snap) => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    cb({ id: snap.id, ...(snap.data() as Omit<OutreachJob, "id">) });
  });
}

export async function updateProspect(
  barId: string,
  patch: Partial<Pick<Prospect, "email" | "status" | "notes" | "contactLookupStatus" | "nextSendAt" | "sequenceComplete">>
): Promise<void> {
  await updateDoc(doc(firestore(), "bar_outreach", barId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

/** Admin typed or picked an address: store it and mark the prospect sendable. */
export async function setProspectEmail(p: Prospect, email: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  const patch: Record<string, unknown> = {
    email: clean || null,
    contactLookupStatus: clean ? "manual" : p.contactLookupStatus,
    updatedAt: serverTimestamp(),
  };
  if (clean && ["new", "no_email"].includes(p.status)) patch.status = "ready";
  if (!clean && p.status === "ready") patch.status = "no_email";
  await updateDoc(doc(firestore(), "bar_outreach", p.id), patch);
}

/** Pure, client-side preview with the same placeholder rules as the server. */
export function renderPreview(
  tpl: OutreachTemplate,
  p: Pick<Prospect, "barName" | "city" | "neighborhood" | "meetingMode">,
  s: OutreachSettings
): { subject: string; body: string } {
  const areaLabel = p.city === "New York City" ? "the East Village and Lower East Side" : p.city || p.neighborhood || "your neighborhood";
  const vars: Record<string, string> = {
    barName: p.barName,
    city: p.city,
    neighborhood: p.neighborhood ?? "",
    areaLabel,
    meetingAsk:
      p.meetingMode === "phone_only"
        ? "Would you be open to a 10-minute call sometime this week or next?"
        : "Would you be open to a 10-minute call? I'm also happy to stop by in person whenever is easiest for you.",
    orStopBy: p.meetingMode === "phone_only" ? "" : ", or stop by in person",
    calendlyLine: s.calendlyUrl.trim() ? `Pick a time that suits you: ${s.calendlyUrl.trim()}` : "",
    postalAddress: s.postalAddress.trim(),
    fromName: s.fromName,
    fromEmail: s.fromEmail,
  };
  const render = (t: string) =>
    t.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, k: string) => vars[k] ?? "").replace(/\n{3,}/g, "\n\n").trim();
  return { subject: render(tpl.subject), body: render(tpl.body) };
}
