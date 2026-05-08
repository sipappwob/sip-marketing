"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBarAnalytics } from "@/lib/firebase";

type DailyRow = {
  id: string;
  date?: string;
  totalViews?: number;
  totalClicks?: number;
  totalScans?: number;
  totalRedemptions?: number;
  segmentMix?: Record<string, number>;
  [k: string]: unknown;
};

export default function CampaignDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;
  const barId = searchParams.get("barId") ?? "";
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barId || !campaignId) return;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    getBarAnalytics({
      barId,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      campaignId,
    })
      .then((res) => setDaily((res.daily as DailyRow[]) ?? []))
      .catch((err) => {
        setError(err?.message ?? "Failed to load");
        setDaily([]);
      })
      .finally(() => setLoading(false));
  }, [barId, campaignId]);

  const totals = daily.reduce(
    (acc, d) => ({
      views: acc.views + (d.totalViews ?? 0),
      clicks: acc.clicks + (d.totalClicks ?? 0),
      scans: acc.scans + (d.totalScans ?? 0),
      redemptions: acc.redemptions + (d.totalRedemptions ?? 0),
    }),
    { views: 0, clicks: 0, scans: 0, redemptions: 0 }
  );

  const segmentMixAgg: Record<string, number> = {};
  daily.forEach((d) => {
    const mix = d.segmentMix ?? {};
    Object.entries(mix).forEach(([id, score]) => {
      segmentMixAgg[id] = (segmentMixAgg[id] ?? 0) + score;
    });
  });

  return (
    <div className="container dashboardShell">
      <p className="dashBackLink">
        <Link href="/dashboard">← Dashboard</Link>
      </p>
      <h1 className="dashTitle" style={{ marginTop: 0, marginBottom: "1rem" }}>
        Campaign: {campaignId}
      </h1>

      {error && (
        <div className="card errorCard">
          {error}
        </div>
      )}

      {loading && <p className="dashSubtle">Loading…</p>}

      {!loading && daily.length > 0 && (
        <>
          <div className="grid metricGrid">
            <div className="card metricCard">
              <div className="metric">{totals.views}</div>
              <div className="label">Views</div>
            </div>
            <div className="card metricCard">
              <div className="metric">{totals.clicks}</div>
              <div className="label">Clicks</div>
            </div>
            <div className="card metricCard">
              <div className="metric">{totals.scans}</div>
              <div className="label">Scans</div>
            </div>
            <div className="card metricCard">
              <div className="metric">{totals.redemptions}</div>
              <div className="label">Redemptions</div>
            </div>
          </div>
          <div className="card">
            <h3 className="dashMinorTitle">Segment mix</h3>
            <p className="dashBody">
              {Object.entries(segmentMixAgg).length === 0
                ? "No segment data yet."
                : Object.entries(segmentMixAgg)
                    .sort((a, b) => b[1] - a[1])
                    .map(([id, score]) => `${id}: ${score.toFixed(2)}`)
                    .join(" · ")}
            </p>
          </div>
          <div className="card tableWrap">
            <h3 className="dashMinorTitle">Daily</h3>
            <table className="dashTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="num">Views</th>
                  <th className="num">Clicks</th>
                  <th className="num">Scans</th>
                  <th className="num">Redeem</th>
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
