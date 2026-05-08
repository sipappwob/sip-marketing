"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuthClient, getMyBars, listCampaigns, getBarAnalytics } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Bar = { id: string; name?: string; [k: string]: unknown };
type Campaign = { id: string; name?: string; barId?: string; [k: string]: unknown };
type DailyRow = {
  id: string;
  date?: string;
  totalViews?: number;
  totalClicks?: number;
  totalScans?: number;
  totalRedemptions?: number;
  uniqueUsers?: number;
  [k: string]: unknown;
};

export default function DashboardPage() {
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedBarId, setSelectedBarId] = useState<string>("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuthClient();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }
      await user.reload().catch(() => {});
      if (!user.emailVerified) router.replace("/");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const auth = getAuthClient();
    if (!auth.currentUser) return;
    getMyBars()
      .then((b) => setBars((b as Bar[]) ?? []))
      .catch(() => setBars([]));
  }, []);

  useEffect(() => {
    if (!selectedBarId) {
      setCampaigns([]);
      setDaily([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      listCampaigns({ barId: selectedBarId }).then((c) =>
        setCampaigns((c as Campaign[]) ?? [])
      ),
      getBarAnalytics({
        barId: selectedBarId,
        startDate,
        endDate,
      })
        .then((res) => setDaily(res.daily as DailyRow[]))
        .catch((err) => {
          setError(err?.message ?? "Failed to load analytics");
          setDaily([]);
        }),
    ]).finally(() => setLoading(false));
  }, [selectedBarId, startDate, endDate]);

  const totals = daily.reduce(
    (acc, d) => ({
      views: acc.views + (d.totalViews ?? 0),
      clicks: acc.clicks + (d.totalClicks ?? 0),
      scans: acc.scans + (d.totalScans ?? 0),
      redemptions: acc.redemptions + (d.totalRedemptions ?? 0),
      uniqueUsers: Math.max(acc.uniqueUsers, d.uniqueUsers ?? 0),
    }),
    { views: 0, clicks: 0, scans: 0, redemptions: 0, uniqueUsers: 0 }
  );

  const conversionRates = {
    clickRate: totals.views ? ((totals.clicks / totals.views) * 100).toFixed(1) : "—",
    scanRate: totals.clicks ? ((totals.scans / totals.clicks) * 100).toFixed(1) : "—",
    redeemRate: totals.scans ? ((totals.redemptions / totals.scans) * 100).toFixed(1) : "—",
  };

  const selectedBarName =
    bars.find((b) => b.id === selectedBarId)?.name?.toString() ?? "Choose a bar";

  return (
    <div className="container dashboardShell">
      <header className="dashHeader">
        <div>
          <p className="dashEyebrow">Sip Admin</p>
          <h1 className="dashTitle">Bar Analytics</h1>
          <p className="dashSubtle">{selectedBarName}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link href="/dashboard/users" className="btn btnGhost">
            User lookup
          </Link>
          <button
            type="button"
            className="btn btnGhost"
            onClick={() => signOut(getAuthClient()).then(() => router.replace("/"))}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="card filterCard">
        <label className="filterLabel">Bar</label>
        <select
          value={selectedBarId}
          onChange={(e) => setSelectedBarId(e.target.value)}
          className="dashInput"
        >
          <option value="">Select a bar</option>
          {bars.map((b) => (
            <option key={b.id} value={b.id}>
              {(b.name as string) || b.id}
            </option>
          ))}
        </select>
        <label className="filterLabel">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="dashInput"
        />
        <label className="filterLabel">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="dashInput"
        />
      </div>

      {error && (
        <div className="card errorCard">
          {error}
        </div>
      )}

      {loading && <p className="dashSubtle">Loading analytics…</p>}

      {selectedBarId && !loading && (
        <>
          <h2 className="dashSectionTitle">Overview</h2>
          <div className="grid metricGrid">
            <div className="card metricCard">
              <div className="metric">{totals.views}</div>
              <div className="label">Promo views</div>
            </div>
            <div className="card metricCard">
              <div className="metric">{totals.clicks}</div>
              <div className="label">Clicks</div>
            </div>
            <div className="card metricCard">
              <div className="metric">{totals.scans}</div>
              <div className="label">QR scans</div>
            </div>
            <div className="card metricCard">
              <div className="metric">{totals.redemptions}</div>
              <div className="label">Redemptions</div>
            </div>
          </div>
          <div className="card metricCard">
            <div className="metric">{totals.uniqueUsers}</div>
            <div className="label">Unique users (max in period)</div>
          </div>
          <div className="card">
            <h3 className="dashMinorTitle">Funnel conversion</h3>
            <p className="dashBody">
              Views → Clicks: {conversionRates.clickRate}% · Clicks → Scans:{" "}
              {conversionRates.scanRate}% · Scans → Redemptions:{" "}
              {conversionRates.redeemRate}%
            </p>
          </div>

          <h2 className="dashSectionTitle">Campaigns</h2>
          <ul className="campaignList">
            {campaigns.map((c) => (
              <li key={c.id}>
                <Link href={`/dashboard/campaigns/${c.id}?barId=${selectedBarId}`}>
                  <span className="card campaignCard">
                    <span>{(c.name as string) || c.id}</span>
                    <span>View →</span>
                  </span>
                </Link>
              </li>
            ))}
            {campaigns.length === 0 && (
              <li className="card">No campaigns for this bar.</li>
            )}
          </ul>

          <h2 className="dashSectionTitle">Daily rollup</h2>
          <div className="card tableWrap">
            <table className="dashTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="num">Views</th>
                  <th className="num">Clicks</th>
                  <th className="num">Scans</th>
                  <th className="num">Redeem</th>
                  <th className="num">Users</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((d) => (
                  <tr key={d.id}>
                    <td>{d.date}</td>
                    <td className="num">{d.totalViews ?? 0}</td>
                    <td className="num">{d.totalClicks ?? 0}</td>
                    <td className="num">{d.totalScans ?? 0}</td>
                    <td className="num">{d.totalRedemptions ?? 0}</td>
                    <td className="num">{d.uniqueUsers ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
