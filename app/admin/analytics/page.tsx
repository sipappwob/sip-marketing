"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getPlatformAnalytics,
  pingSuperAdmin,
  type PlatformAnalytics,
  type WindowTotals,
} from "../../../lib/firebase-client";

type WindowKey = "today" | "last7" | "last30" | "allTime";
const WINDOW_LABELS: Record<WindowKey, string> = {
  today: "Today",
  last7: "7 days",
  last30: "30 days",
  allTime: "All time",
};

const SEGMENT_LABELS: Record<string, string> = {
  high_engagement: "High engagement",
  committed: "Committed",
  explorer: "Explorer",
  uploader: "Uploader",
  lurker: "Lurker",
  loyal_regular: "Loyal regular",
  weekend_warrior: "Weekend",
  weekday_user: "Weekday",
  happy_hour_user: "Happy hour",
  late_night_user: "Late night",
  high_spend_user: "High spend",
  deal_seeker: "Deal seeker",
  high_deal_sensitivity: "High deal sensitivity",
  medium_deal_sensitivity: "Med deal sensitivity",
  low_deal_sensitivity: "Low deal sensitivity",
  group_planner: "Group planner",
  group_joiner: "Group joiner",
  mostly_solo: "Mostly solo",
  high_cover_tolerance: "High cover tolerance",
  low_cover_tolerance: "Low cover tolerance",
};

const DOW_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CHART = "#5a1220";
const CHART2 = "#d4662b";
const CHART3 = "#e8a845";

function pct(n: number, d: number): string {
  if (!d) return "—";
  return `${((n / d) * 100).toFixed(1)}%`;
}
function fmt(n: number | undefined): string {
  return (n ?? 0).toLocaleString();
}
function tsToDate(ts: { seconds: number } | number | null | undefined): string {
  if (ts == null) return "—";
  const ms = typeof ts === "number" ? ts : ts.seconds * 1000;
  return new Date(ms).toLocaleString();
}

export default function AnalyticsPage() {
  const [data, setData] = useState<PlatformAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [win, setWin] = useState<WindowKey>("last7");
  const [diag, setDiag] = useState<string | null>(null);

  async function runDiag() {
    setDiag(null);
    try {
      const p = await pingSuperAdmin();
      setDiag(
        `Callable OK · project ${p.projectId ?? "?"} · uid ${p.uid.slice(0, 8)}…`
      );
    } catch (e) {
      setDiag(e instanceof Error ? e.message : "Ping failed.");
    }
  }

  const load = useCallback(async (refresh: boolean) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      setData(await getPlatformAnalytics(refresh));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const w: WindowTotals | null = data ? data.windows[win] : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-ink/60 mt-1">
            Founder view of platform-wide behavior. Aggregate only — no
            individual user data. Snapshots refresh automatically every 2 hours.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-ink/15 overflow-hidden">
            {(Object.keys(WINDOW_LABELS) as WindowKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setWin(k)}
                className={`text-xs px-3 py-1.5 ${
                  win === k ? "bg-ink text-ivory" : "bg-white text-ink/70 hover:bg-ink/5"
                }`}
              >
                {WINDOW_LABELS[k]}
              </button>
            ))}
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="text-xs px-3 py-1.5 rounded-md border border-ink/20 text-ink/70 hover:bg-ink/5 disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Recompute"}
          </button>
        </div>
      </div>

      {error && (
        <div className="space-y-2">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => load(false)}
              className="text-xs px-3 py-1.5 rounded-md border border-ink/20 hover:bg-ink/5"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={runDiag}
              className="text-xs px-3 py-1.5 rounded-md border border-ink/20 hover:bg-ink/5"
            >
              Test callable connection
            </button>
          </div>
          {diag && (
            <p className="text-xs text-ink/60 bg-ink/5 border border-ink/10 rounded-md px-3 py-2">
              {diag}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink/60">Loading analytics…</p>
      ) : !error && data && w ? (
        <>
          <ExecutiveOverview data={data} w={w} winLabel={WINDOW_LABELS[win]} />
          <Trends data={data} />
          <Funnels w={w} winLabel={WINDOW_LABELS[win]} />
          <Segments data={data} />
          <Heatmaps data={data} />
          <VenueIntelligence data={data} />
          <PromoAnalytics w={w} data={data} winLabel={WINDOW_LABELS[win]} />
          <TrackingHealth data={data} />
          <p className="text-[11px] text-ink/40">
            Generated {new Date(data.generatedAt).toLocaleString()} · meta computed{" "}
            {tsToDate(data.meta.computedAt)}
          </p>
        </>
      ) : !error ? (
        <p className="text-sm text-ink/60">No analytics data yet. Run Recompute or the backfill script.</p>
      ) : null}
    </div>
  );
}

// ——— Section 1: Executive overview ———
function ExecutiveOverview({
  data,
  w,
  winLabel,
}: {
  data: PlatformAnalytics;
  w: WindowTotals;
  winLabel: string;
}) {
  const m = data.meta;
  const activeVenues = data.venues.filter(
    (v) => v.views + v.imHere + v.redemptions + v.lineReports > 0
  ).length;
  return (
    <Section title="Executive overview" subtitle="Live engagement health">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Stat label="DAU" value={fmt(m.dau)} />
        <Stat label="WAU" value={fmt(m.wau)} />
        <Stat label="MAU" value={fmt(m.mau)} />
        <Stat
          label="Stickiness (DAU/MAU)"
          value={m.mau ? `${((m.stickiness ?? 0) * 100).toFixed(0)}%` : "—"}
        />
        <Stat label={`New users · ${winLabel}`} value={fmt(w.newUsers)} />
        <Stat label={`Active users · ${winLabel}`} value={fmt(w.activeUsers)} />
        <Stat label="Total users" value={fmt(m.lifetime?.totalUsers)} />
        <Stat label="Active venues (30d)" value={fmt(activeVenues)} />
        <Stat
          label={`Promo conversion · ${winLabel}`}
          value={pct(w.promo.redemptions, w.promo.views)}
          hint="redemptions / unique views"
        />
        <Stat
          label={`Event RSVP rate · ${winLabel}`}
          value={pct(w.events.rsvps, w.events.impressions)}
          hint="rsvps / impressions"
        />
        <Stat label={`Sessions · ${winLabel}`} value={fmt(w.sessions)} />
        <Stat
          label="Avg session"
          value={w.avgSessionSeconds ? `${Math.round(w.avgSessionSeconds / 60)}m ${w.avgSessionSeconds % 60}s` : "—"}
        />
      </div>
    </Section>
  );
}

// ——— Section 2: Trends ———
function Trends({ data }: { data: PlatformAnalytics }) {
  const series = data.series.slice(-30);
  return (
    <Section title="Trends" subtitle="Daily, last 30 days (app timezone)">
      <Card>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,18,15,0.08)" />
            <XAxis dataKey="dayKey" tick={{ fontSize: 10 }} tickFormatter={(d) => String(d).slice(5)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="activeUsers" name="Active users" stroke={CHART} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="promoViews" name="Promo views" stroke={CHART2} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="redemptions" name="Redemptions" stroke={CHART3} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <Legend items={[["Active users", CHART], ["Promo views", CHART2], ["Redemptions", CHART3]]} />
      </Card>
    </Section>
  );
}

// ——— Section 3: Funnels ———
function Funnels({ w, winLabel }: { w: WindowTotals; winLabel: string }) {
  const promo = [
    { step: "Impressions", v: w.promo.impressions },
    { step: "Unique views", v: w.promo.views },
    { step: "Clicks", v: w.promo.clicks },
    { step: "Saves", v: w.promo.saves },
    { step: "QR shown", v: w.promo.qrShown },
    { step: "Redeemed", v: w.promo.redemptions },
  ];
  const evt = [
    { step: "Impressions", v: w.events.impressions },
    { step: "Clicks", v: w.events.clicks },
    { step: "RSVPs", v: w.events.rsvps },
  ];
  const discovery = [
    { step: "Map opens", v: w.bars.mapOpens },
    { step: "Searches", v: w.bars.searches },
    { step: "Bar views", v: w.bars.views },
    { step: "I'm here", v: w.bars.imHere },
    { step: "Directions", v: w.bars.directions },
  ];
  return (
    <Section title="Engagement funnels" subtitle={winLabel}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FunnelChart title="Promo funnel" rows={promo} />
        <FunnelChart title="Event funnel" rows={evt} />
        <FunnelChart title="Bar discovery" rows={discovery} />
      </div>
    </Section>
  );
}

function FunnelChart({ title, rows }: { title: string; rows: { step: string; v: number }[] }) {
  const top = rows[0]?.v || 1;
  return (
    <Card>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.step}>
            <div className="flex justify-between text-xs text-ink/70">
              <span>{r.step}</span>
              <span className="font-mono">
                {r.v.toLocaleString()}
                {i > 0 && top > 0 && (
                  <span className="text-ink/40"> · {((r.v / top) * 100).toFixed(0)}%</span>
                )}
              </span>
            </div>
            <div className="h-2 bg-ink/5 rounded mt-1 overflow-hidden">
              <div
                className="h-full rounded"
                style={{ width: `${Math.min(100, (r.v / top) * 100)}%`, background: CHART }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ——— Section 4: Segments ———
function Segments({ data }: { data: PlatformAnalytics }) {
  const rows = Object.entries(data.segments.counts)
    .map(([id, count]) => ({ id, label: SEGMENT_LABELS[id] ?? id, count }))
    .sort((a, b) => b.count - a.count);
  const insufficientPct = data.segments.total
    ? (data.segments.insufficient / data.segments.total) * 100
    : 0;
  return (
    <Section
      title="User segments"
      subtitle={`Behavioral segments · ${data.segments.total} profiled · ${insufficientPct.toFixed(0)}% insufficient data`}
    >
      <Card>
        {rows.length === 0 ? (
          <p className="text-sm text-ink/60">
            No confident segments yet — needs more user activity.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(180, rows.length * 26)}>
            <BarChart data={rows} layout="vertical" margin={{ left: 40, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(31,18,15,0.08)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={120} />
              <Tooltip />
              <Bar dataKey="count" fill={CHART} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </Section>
  );
}

// ——— Section 5: Heatmaps ———
function Heatmaps({ data }: { data: PlatformAnalytics }) {
  const hourly = Array.from({ length: 24 }, (_, h) => ({
    label: String(h).padStart(2, "0"),
    v: data.heatmap.hourly[String(h).padStart(2, "0")] ?? 0,
  }));
  const dow = DOW_ORDER.map((d) => ({ label: d, v: data.heatmap.dayOfWeek[d] ?? 0 }));
  return (
    <Section title="Activity heatmaps" subtitle="Events by hour & day, last 30 days (ET)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold mb-3">By hour of day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourly} margin={{ left: -16, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,18,15,0.08)" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={1} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="v" name="Events" fill={CHART2} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3">By day of week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dow} margin={{ left: -16, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,18,15,0.08)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="v" name="Events" radius={[3, 3, 0, 0]}>
                {dow.map((d) => (
                  <Cell key={d.label} fill={d.label === "Fri" || d.label === "Sat" ? CHART : CHART3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Section>
  );
}

// ——— Section 6: Venue intelligence ———
type VenueSort = "views" | "imHere" | "redemptions" | "lineReports";
function VenueIntelligence({ data }: { data: PlatformAnalytics }) {
  const [sort, setSort] = useState<VenueSort>("views");
  const rows = [...data.venues].sort((a, b) => b[sort] - a[sort]).slice(0, 25);
  const cols: { key: VenueSort; label: string }[] = [
    { key: "views", label: "Views" },
    { key: "imHere", label: "I'm here" },
    { key: "redemptions", label: "Redemptions" },
    { key: "lineReports", label: "Line reports" },
  ];
  return (
    <Section title="Venue intelligence" subtitle="Top venues, last 30 days">
      <Card padded={false}>
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Venue</th>
              {cols.map((c) => (
                <th key={c.key} className="px-3 py-2 font-medium text-right">
                  <button
                    onClick={() => setSort(c.key)}
                    className={sort === c.key ? "text-ink font-semibold" : "text-ink/60"}
                  >
                    {c.label}
                    {sort === c.key ? " ↓" : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-ink/50">
                  No venue activity in the last 30 days.
                </td>
              </tr>
            ) : (
              rows.map((v) => (
                <tr key={v.barId} className="border-t border-ink/10">
                  <td className="px-3 py-2 font-medium">{v.name}</td>
                  <td className="px-3 py-2 text-right font-mono">{v.views.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-mono">{v.imHere.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-mono">{v.redemptions.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-mono">{v.lineReports.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </Section>
  );
}

// ——— Section 7: Promo analytics ———
function PromoAnalytics({
  w,
  data,
  winLabel,
}: {
  w: WindowTotals;
  data: PlatformAnalytics;
  winLabel: string;
}) {
  const byType = Object.entries(data.byBarType)
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.promoViews - a.promoViews)
    .slice(0, 12);
  return (
    <Section title="Promo analytics" subtitle={winLabel}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Unique views" value={fmt(w.promo.views)} />
        <Stat label="Redemptions" value={fmt(w.promo.redemptions)} />
        <Stat label="View → redeem" value={pct(w.promo.redemptions, w.promo.views)} />
        <Stat label="QR → redeem" value={pct(w.promo.redemptions, w.promo.qrShown)} />
      </div>
      <Card>
        <h3 className="text-sm font-semibold mb-3">Promo views by bar type (30d)</h3>
        {byType.length === 0 ? (
          <p className="text-sm text-ink/60">No bar-type promo activity yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(160, byType.length * 26)}>
            <BarChart data={byType} layout="vertical" margin={{ left: 40, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(31,18,15,0.08)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 10 }} width={110} />
              <Tooltip />
              <Bar dataKey="promoViews" name="Promo views" fill={CHART} radius={[0, 3, 3, 0]} />
              <Bar dataKey="redemptions" name="Redemptions" fill={CHART3} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <Legend items={[["Promo views", CHART], ["Redemptions", CHART3]]} />
      </Card>
    </Section>
  );
}

// ——— Section 8: Tracking health ———
function TrackingHealth({ data }: { data: PlatformAnalytics }) {
  const th = data.meta.trackingHealth ?? {};
  const counts = th.eventTypeCount ?? {};
  const lastSeen = th.eventTypeLastSeen ?? {};
  const names = Object.keys({ ...counts, ...lastSeen }).sort();
  const now = Date.now();
  return (
    <Section title="Data quality & tracking health" subtitle="Last 35-day window">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Events (24h)" value={fmt(th.last24hEvents)} />
        <Stat
          label="Missing userId (24h)"
          value={fmt(th.missingUserId)}
          tone={(th.missingUserId ?? 0) > 0 ? "warn" : "ok"}
        />
        <Stat label="Latest event" value={tsToDate(th.latestEventAt)} small />
        <Stat label="Event types firing" value={fmt(names.length)} />
      </div>
      <Card padded={false}>
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Event</th>
              <th className="px-3 py-2 font-medium text-right">Count (35d)</th>
              <th className="px-3 py-2 font-medium text-right">Last seen</th>
              <th className="px-3 py-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {names.map((n) => {
              const seen = lastSeen[n] ?? 0;
              const ageH = seen ? (now - seen) / 3600000 : Infinity;
              const stale = ageH > 24 * 7;
              return (
                <tr key={n} className="border-t border-ink/10">
                  <td className="px-3 py-2 font-mono text-xs">{n}</td>
                  <td className="px-3 py-2 text-right font-mono">{(counts[n] ?? 0).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-xs text-ink/60">
                    {seen ? new Date(seen).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        !seen
                          ? "bg-ink/10 text-ink/50"
                          : stale
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {!seen ? "never" : stale ? "stale" : "ok"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </Section>
  );
}

// ——— Reusable bits ———
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-ink/55">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Card({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <div className={`bg-white border border-ink/10 rounded-lg ${padded ? "p-4" : "overflow-hidden"}`}>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  small,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  small?: boolean;
  tone?: "ok" | "warn";
}) {
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-3">
      <div className="text-[11px] text-ink/55">{label}</div>
      <div
        className={`${small ? "text-sm" : "text-2xl"} font-semibold mt-0.5 ${
          tone === "warn" ? "text-amber-700" : "text-ink"
        }`}
      >
        {value}
      </div>
      {hint && <div className="text-[10px] text-ink/40 mt-0.5">{hint}</div>}
    </div>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {items.map(([label, color]) => (
        <div key={label} className="flex items-center gap-1.5 text-[11px] text-ink/60">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}
