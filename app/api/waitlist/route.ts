import { NextResponse } from "next/server";

/**
 * Waitlist signup endpoint.
 *
 * Receives { email } from the marketing homepage form and notifies the Sip
 * team at will@sipapp.co and sam@sipapp.co via Resend. The requester's
 * address is put in Reply-To so hitting "Reply" answers the person directly.
 *
 * Required env vars (set in Vercel → sip-marketing → Settings → Environment):
 *   - RESEND_API_KEY   Resend API key (create at resend.com).
 *   - WAITLIST_FROM    Optional override. Defaults to the verified
 *                      www.sipapp.co domain below; set this if you verify
 *                      another sender (e.g. "Sip <hello@sipapp.co>").
 *   - WAITLIST_TO      Optional. Comma-separated override for `to` (testing).
 *
 * NOTE on Resend: the `from` host MUST match a domain you verified in
 * Resend → Domains. Sending from any other domain returns 403 and the
 * API only allows sending to your account login email until verified.
 */

const RESEND_API = "https://api.resend.com/emails";
const DEFAULT_RECIPIENTS = ["will@sipapp.co", "sam@sipapp.co"];
// The apex sipapp.co domain is verified in Resend (DKIM + MX confirmed in
// public DNS). www.sipapp.co was never the verified host. The local-part
// doesn't need a real mailbox.
const DEFAULT_FROM = "Sip Waitlist <hello@sipapp.co>";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[waitlist] RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "Email service is not configured yet. Try again shortly." },
      { status: 503 },
    );
  }

  let body: { email?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email || email.length > 320 || !emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const timestamp = new Date().toISOString();
  const from = process.env.WAITLIST_FROM || DEFAULT_FROM;
  const recipients = parseRecipientList(process.env.WAITLIST_TO);

  const subject = `Sip waitlist signup — ${email}`;
  const html = `
    <div style="font-family: -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif; color: #1f120f; max-width: 520px; padding: 24px;">
      <h2 style="font-family: Baskerville, 'Hoefler Text', 'Times New Roman', serif; font-weight: 400; font-size: 22px; margin: 0 0 8px 0;">
        New Sip waitlist signup
      </h2>
      <p style="margin: 8px 0 16px 0; color: #5a4a40;">A new person just requested early access.</p>
      <table style="border-collapse: separate; border-spacing: 0 4px; width: 100%; font-size: 14px;">
        <tr>
          <td style="padding: 10px 14px; background:#f4ead7; border-radius: 8px 0 0 8px; width: 110px; font-weight: 600;">Email</td>
          <td style="padding: 10px 14px; background:#f4ead7; border-radius: 0 8px 8px 0;">
            <a href="mailto:${escapeHtml(email)}" style="color:#5a1220; text-decoration: underline;">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; background:#f4ead7; border-radius: 8px 0 0 8px; font-weight: 600;">Received</td>
          <td style="padding: 10px 14px; background:#f4ead7; border-radius: 0 8px 8px 0;">${escapeHtml(timestamp)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; background:#f4ead7; border-radius: 8px 0 0 8px; font-weight: 600;">Source</td>
          <td style="padding: 10px 14px; background:#f4ead7; border-radius: 0 8px 8px 0;">sipapp.co / Request access</td>
        </tr>
      </table>
      <p style="margin-top: 24px; font-size: 11px; color: #8a735a;">
        IP: ${escapeHtml(ip)}<br />
        User agent: ${escapeHtml(userAgent)}
      </p>
    </div>
  `;

  const text = [
    "New Sip waitlist signup",
    "",
    `Email:    ${email}`,
    `Received: ${timestamp}`,
    `Source:   sipapp.co / Request access`,
    `IP:       ${ip}`,
    `UA:       ${userAgent}`,
  ].join("\n");

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[waitlist] Resend error", res.status, errText);
      return NextResponse.json(
        { error: "Couldn't send right now. Please email sam@sipapp.co directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[waitlist] Network error", err);
    return NextResponse.json(
      { error: "Network error. Please try again." },
      { status: 502 },
    );
  }

  // Best-effort: log the signup in Firestore via the existing Cloud Function
  // so it shows up in the admin dashboard. We pass `skipEmail: true` to avoid
  // a duplicate notification (we already sent the nicer Vercel-templated one
  // above). Failures here don't affect the user response.
  void logSignupInFirestore(email).catch((err) => {
    console.warn("[waitlist] Firestore log failed (non-fatal)", err);
  });

  return NextResponse.json({ ok: true });
}

const DEFAULT_LOG_URL =
  "https://us-east1-sip-staging-70488.cloudfunctions.net/submitEarlyAccessRequest";

async function logSignupInFirestore(email: string): Promise<void> {
  const url = process.env.EARLY_ACCESS_LOG_URL?.trim() || DEFAULT_LOG_URL;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      skipEmail: true,
      source: "sipapp.co_waitlist",
    }),
  });
}

function parseRecipientList(raw: string | undefined): string[] {
  if (!raw?.trim()) return DEFAULT_RECIPIENTS;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : DEFAULT_RECIPIENTS;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
