/**
 * Miniature app screens rendered in the Moroccan-sunset palette.
 * Each one is designed to fit inside <PhoneMockup>'s screen area.
 */

import { cn } from "./cn";

function ScreenFrame({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex items-baseline justify-between px-5 pb-2 pt-1">
        <div>
          <div className="font-serif text-[15px] leading-tight text-ink">
            {title}
          </div>
          {subtitle && (
            <div className="text-[9px] uppercase tracking-[0.22em] text-ember">
              {subtitle}
            </div>
          )}
        </div>
        <div className="text-[10px] font-medium text-muted">10:42</div>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* -------------------------------- MAP ---------------------------------- */

export function MapScreen() {
  const streets = [
    "M0 60 Q70 48 140 66 T260 58",
    "M0 110 Q80 102 150 118 T260 108",
    "M0 170 Q60 160 130 178 T260 168",
    "M0 230 Q80 218 160 234 T260 224",
    "M0 290 Q80 282 160 298 T260 288",
    "M50 0 Q48 80 62 160 T72 360",
    "M130 0 Q128 90 140 180 T150 360",
    "M210 0 Q208 90 218 180 T226 360",
  ];

  const dots = [
    { x: 48, y: 80, r: 6, color: "#5A1220", pulse: true },
    { x: 110, y: 115, r: 4, color: "#D4662B" },
    { x: 160, y: 96, r: 5, color: "#E8A845" },
    { x: 68, y: 175, r: 4, color: "#8B2438" },
    { x: 200, y: 165, r: 5, color: "#D4662B", pulse: true },
    { x: 92, y: 235, r: 3, color: "#8A735A" },
    { x: 172, y: 250, r: 6, color: "#5A1220" },
    { x: 218, y: 205, r: 3, color: "#E8A845" },
    { x: 130, y: 290, r: 4, color: "#D4662B" },
  ];

  return (
    <ScreenFrame title="Lower East Side" subtitle="Live · tonight">
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 10%, #FBF3E1 0%, #F4EAD7 55%, #E8D7B5 100%)",
          }}
        />
        <svg
          viewBox="0 0 260 360"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          {streets.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="rgba(31,18,15,0.12)"
              strokeWidth={1.1}
            />
          ))}

          {dots.map((dot, i) => (
            <g key={i}>
              {dot.pulse && (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r + 7}
                  fill={dot.color}
                  opacity={0.18}
                />
              )}
              <circle
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill={dot.color}
                stroke="#FBF3E1"
                strokeWidth={1.5}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-ivory/92 p-3 shadow-[0_8px_24px_-12px_rgba(31,18,15,0.35)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-serif text-[13px] leading-tight text-ink">
              Lovers Rock
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted">
              3 friends · 6 regulars
            </div>
          </div>
          <div className="rounded-full bg-cabernet px-2 py-[3px] text-[9px] font-medium text-ivory">
            Heating up
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-4 rounded-full border border-ivory"
              style={{
                background: [
                  "#5A1220",
                  "#D4662B",
                  "#E8A845",
                  "#8B2438",
                  "#8A735A",
                ][i],
              }}
            />
          ))}
          <div className="ml-1 text-[9px] text-muted">+18 nearby</div>
        </div>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- LINE --------------------------------- */

export function LineScreen() {
  const bars = [
    { name: "Ray's Bar", sub: "3 blocks · $", wait: "2 min", tone: "good" },
    { name: "Lovers Rock", sub: "6 blocks · $$", wait: "18 min", tone: "mid" },
    { name: "Beverly's", sub: "4 blocks · $$", wait: "32 min", tone: "hot" },
    { name: "The Skinny", sub: "2 blocks · $", wait: "Closed rope", tone: "off" },
  ] as const;

  const toneColors = {
    good: { bg: "bg-[#E9D9B8]", text: "text-ink", pill: "bg-[#6b8f3d] text-ivory" },
    mid: { bg: "bg-[#EBD5A8]", text: "text-ink", pill: "bg-saffron text-ink" },
    hot: { bg: "bg-[#EAC7A2]", text: "text-ink", pill: "bg-ember text-ivory" },
    off: { bg: "bg-[#E8D7B5]", text: "text-muted", pill: "bg-ink/70 text-ivory" },
  } as const;

  return (
    <ScreenFrame title="Nearby tonight" subtitle="Live lines · Fri 10:42">
      <div className="flex h-full flex-col gap-2 overflow-hidden px-4 pt-2">
        {bars.map((b) => {
          const t = toneColors[b.tone];
          return (
            <div
              key={b.name}
              className={cn(
                "flex items-center justify-between rounded-2xl px-3 py-2.5",
                t.bg,
              )}
            >
              <div>
                <div className={cn("font-serif text-[13px] leading-tight", t.text)}>
                  {b.name}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-muted">
                  {b.sub}
                </div>
              </div>
              <div
                className={cn(
                  "rounded-full px-2 py-1 text-[9px] font-medium",
                  t.pill,
                )}
              >
                {b.wait}
              </div>
            </div>
          );
        })}
        <div className="mt-auto mb-2 rounded-2xl border border-hair bg-ivory/70 px-3 py-2 text-center text-[10px] text-muted">
          Pulled from{" "}
          <span className="font-medium text-cabernet">28 people</span> in line
          right now
        </div>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- CREW --------------------------------- */

export function CrewScreen() {
  const avatars = [
    { i: "M", c: "#5A1220" },
    { i: "J", c: "#D4662B" },
    { i: "A", c: "#E8A845" },
    { i: "S", c: "#8B2438" },
    { i: "T", c: "#8A735A" },
  ];

  return (
    <ScreenFrame title="Friday night" subtitle="Your crew">
      <div className="flex h-full flex-col gap-3 px-4">
        <div className="rounded-2xl bg-cabernet p-4 text-ivory shadow-[0_10px_28px_-14px_rgba(90,18,32,0.6)]">
          <div className="text-[9px] uppercase tracking-[0.24em] text-saffron">
            Plan · 10:00pm
          </div>
          <div className="mt-1 font-serif text-[18px] leading-tight">
            Lovers Rock, then wherever.
          </div>
          <div className="mt-3 flex -space-x-2">
            {avatars.map((a, idx) => (
              <div
                key={idx}
                className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-cabernet font-serif text-[11px] text-ivory"
                style={{ background: a.c }}
              >
                {a.i}
              </div>
            ))}
            <div className="ml-2 self-center text-[10px] text-ivory/80">
              3 of 5 in
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-hair bg-shell p-3">
          <div className="flex items-center justify-between">
            <div className="font-serif text-[13px] leading-tight text-ink">
              Maya is at Ray&apos;s
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-ember">
              12m ago
            </div>
          </div>
          <div className="mt-1 text-[11px] leading-snug text-muted">
            &ldquo;Line moving fast, kitchen open till midnight.&rdquo;
          </div>
        </div>

        <div className="rounded-2xl border border-hair bg-shell p-3">
          <div className="flex items-center justify-between">
            <div className="font-serif text-[13px] leading-tight text-ink">
              Jordan pinned a spot
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-ember">
              Now
            </div>
          </div>
          <div className="mt-1 text-[11px] leading-snug text-muted">
            Post-Rock plan: Beverly&apos;s rooftop · RSVP?
          </div>
        </div>

        <div className="mt-auto mb-2 flex items-center justify-between rounded-full border border-hair bg-ivory px-4 py-2 text-[11px]">
          <span className="text-muted">Tonight</span>
          <span className="font-medium text-cabernet">3 plans live</span>
        </div>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- FEED --------------------------------- */

export function FeedScreen() {
  const posts = [
    {
      who: "Maya",
      bar: "Ray's Bar",
      note: "Line moving fast.",
      tone: "ember",
    },
    {
      who: "Lovers Rock",
      bar: "Venue",
      note: "22 in · DJ on at 11",
      tone: "cabernet",
    },
    {
      who: "Jordan",
      bar: "Beverly's",
      note: "Rooftop opens at 10.",
      tone: "saffron",
    },
  ] as const;

  const toneDot = {
    ember: "bg-ember",
    cabernet: "bg-cabernet",
    saffron: "bg-saffron",
  } as const;

  return (
    <ScreenFrame title="Tonight" subtitle="For you">
      <div className="flex h-full flex-col gap-2.5 px-4 pt-1">
        {posts.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl border border-hair bg-shell p-3"
          >
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", toneDot[p.tone])} />
              <div className="font-serif text-[13px] leading-tight text-ink">
                {p.who}
              </div>
              <span className="ml-auto text-[9px] uppercase tracking-[0.2em] text-muted">
                {p.bar}
              </span>
            </div>
            <div className="mt-1.5 text-[11px] leading-snug text-muted">
              {p.note}
            </div>
          </div>
        ))}

        <div className="mt-1 rounded-2xl bg-cabernet px-3 py-3 text-ivory">
          <div className="text-[9px] uppercase tracking-[0.24em] text-saffron">
            Bars near you
          </div>
          <div className="mt-1 font-serif text-[14px] leading-snug">
            Beverly&apos;s · 20% off well drinks till 11
          </div>
        </div>

        <div className="mt-auto mb-2 text-center text-[9px] uppercase tracking-[0.22em] text-muted">
          Live from 47 friends · 12 bars
        </div>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- PLANS -------------------------------- */

export function PlansScreen() {
  return (
    <ScreenFrame title="Plans" subtitle="Your crew">
      <div className="flex h-full flex-col gap-3 px-4">
        <div className="overflow-hidden rounded-2xl border border-hair bg-shell">
          <div
            className="h-16 w-full"
            style={{
              background:
                "linear-gradient(135deg, #5A1220 0%, #8B2438 55%, #D4662B 100%)",
            }}
          />
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="font-serif text-[14px] leading-tight text-ink">
                Friday · Lovers Rock
              </div>
              <div className="rounded-full bg-cabernet px-2 py-[3px] text-[9px] font-medium text-ivory">
                Going
              </div>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
              10:00pm · LES
            </div>
            <div className="mt-3 flex -space-x-1.5">
              {["#5A1220", "#D4662B", "#E8A845", "#8B2438"].map((c, i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-full border border-shell"
                  style={{ background: c }}
                />
              ))}
              <span className="ml-2 self-center text-[10px] text-muted">
                6 going · 3 maybe
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-hair bg-shell p-3">
          <div className="flex items-center justify-between">
            <div className="font-serif text-[13px] leading-tight text-ink">
              Saturday · Beverly&apos;s
            </div>
            <div className="rounded-full border border-hair px-2 py-[3px] text-[9px] text-muted">
              Maybe
            </div>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
            Rooftop · 9:30pm
          </div>
        </div>

        <div className="mt-auto mb-2 flex items-center justify-between rounded-full bg-ink px-4 py-2 text-[11px] text-ivory">
          <span className="text-saffron">+</span>
          <span>Start a plan</span>
          <span className="text-ivory/50">⌘N</span>
        </div>
      </div>
    </ScreenFrame>
  );
}
