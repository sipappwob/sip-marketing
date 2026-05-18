/**
 * Miniature app screens rendered to faithfully match the real iOS app UI.
 *
 * Palette matches the app's `AppColors`:
 *   background #FBF7EA (shell), surface #FFFFFF, surface2 #F6F1E2,
 *   primary  #7C1C1C (cabernet), accent #B7722E (ember/clay), ink #14110F.
 *
 * Every labeled venue, username, and copy fragment is chosen to look like
 * what an actual NYC user would see tonight — not generic lorem ipsum.
 */

import { cn } from "./cn";

/* ------------------------------- FRAME --------------------------------- */

function ScreenFrame({
  children,
  className,
  statusTime = "10:42",
}: {
  children: React.ReactNode;
  className?: string;
  statusTime?: string;
}) {
  return (
    <div className={cn("flex h-full w-full flex-col bg-shell", className)}>
      {/* iOS status bar */}
      <div className="flex items-center justify-between px-5 pb-1 pt-0.5 text-[10px] font-semibold text-ink">
        <span>{statusTime}</span>
        <span className="flex items-center gap-1 text-ink/70">
          <span aria-hidden>•••</span>
          <span aria-hidden>5G</span>
          <span aria-hidden>▯▯▯</span>
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

function NavBar({
  title,
  leading,
  trailing,
  subtitle,
}: {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-hair px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        {leading}
        <div className="min-w-0">
          <div className="font-serif text-[15px] leading-tight text-ink">
            {title}
          </div>
          {subtitle && (
            <div className="truncate text-[9px] uppercase tracking-[0.2em] text-muted">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {trailing}
    </div>
  );
}

function TabBar({
  active,
}: {
  active: "feed" | "map" | "plans" | "promos" | "you";
}) {
  const items: { key: typeof active; label: string; icon: string }[] = [
    { key: "feed", label: "Feed", icon: "▤" },
    { key: "map", label: "Map", icon: "◎" },
    { key: "plans", label: "Plans", icon: "✦" },
    { key: "promos", label: "Promos", icon: "◆" },
    { key: "you", label: "You", icon: "●" },
  ];
  return (
    <div className="flex items-center justify-around border-t border-hair bg-ivory/90 px-2 py-1.5 backdrop-blur">
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <div
            key={it.key}
            className={cn(
              "flex flex-col items-center gap-0.5",
              isActive ? "text-cabernet" : "text-muted",
            )}
          >
            <span className="text-[11px] leading-none">{it.icon}</span>
            <span className="text-[8px] font-medium leading-none tracking-[0.08em]">
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Avatar({
  initials,
  color,
  size = 28,
  ring = false,
}: {
  initials: string;
  color: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-serif text-ivory",
        ring && "ring-2 ring-shell",
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
}

/* --------------------------------- MAP ---------------------------------- */

// Real LES / NYC bars with hand-chosen map positions (0–260 / 0–360).
const MAP_PINS = [
  { name: "Ray's Bar", x: 58, y: 96, tone: "cabernet", vibe: "2m wait" },
  { name: "Pianos", x: 134, y: 78, tone: "ember", vibe: "22m" },
  { name: "Beverly's", x: 208, y: 120, tone: "saffron", vibe: "32m" },
  { name: "Lovers Rock", x: 92, y: 186, tone: "crimson", vibe: "18m" },
  { name: "The Skinny", x: 182, y: 214, tone: "muted", vibe: "Rope" },
  { name: "Hair of the Dog", x: 42, y: 260, tone: "ember", vibe: "7m" },
  { name: "169 Bar", x: 148, y: 284, tone: "cabernet", vibe: "12m" },
] as const;

const TONE_COLORS: Record<string, string> = {
  cabernet: "#5A1220",
  crimson: "#8B2438",
  ember: "#D4662B",
  saffron: "#E8A845",
  muted: "#8A735A",
};

export function MapScreen() {
  // LES street-like grid. Horizontals = numbered streets, verticals = avenues.
  const horizontals = [54, 108, 168, 228, 288];
  const verticals = [42, 94, 146, 198, 238];

  // People clusters — small avatar-style dots indicating friends out near pins.
  const people = [
    { x: 52, y: 104, c: "#5A1220" },
    { x: 66, y: 88, c: "#D4662B" },
    { x: 128, y: 72, c: "#8B2438" },
    { x: 140, y: 86, c: "#E8A845" },
    { x: 202, y: 128, c: "#5A1220" },
    { x: 96, y: 192, c: "#D4662B" },
    { x: 88, y: 178, c: "#8A735A" },
    { x: 152, y: 290, c: "#8B2438" },
  ];

  return (
    <ScreenFrame>
      {/* Map canvas */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 90% at 50% 0%, #FBF3E1 0%, #F4EAD7 45%, #E8D7B5 100%)",
          }}
        />

        <svg
          viewBox="0 0 260 360"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          {/* Block shading */}
          <g fill="rgba(31,18,15,0.03)">
            <rect x="42" y="54" width="52" height="54" />
            <rect x="146" y="108" width="52" height="60" />
            <rect x="94" y="168" width="52" height="60" />
            <rect x="198" y="228" width="40" height="60" />
          </g>

          {/* Grid */}
          {horizontals.map((y) => (
            <line
              key={`h${y}`}
              x1={0}
              y1={y}
              x2={260}
              y2={y}
              stroke="rgba(31,18,15,0.14)"
              strokeWidth={1}
            />
          ))}
          {verticals.map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={360}
              stroke="rgba(31,18,15,0.14)"
              strokeWidth={1}
            />
          ))}

          {/* Main thoroughfare — Delancey */}
          <line
            x1={0}
            y1={150}
            x2={260}
            y2={150}
            stroke="rgba(212,102,43,0.35)"
            strokeWidth={3}
          />

          {/* People dots near pins */}
          {people.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.2}
              fill={p.c}
              opacity={0.75}
            />
          ))}

          {/* Bar pins */}
          {MAP_PINS.map((pin) => {
            const color = TONE_COLORS[pin.tone];
            const isActive = pin.name === "Lovers Rock";
            return (
              <g key={pin.name}>
                {isActive && (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={14}
                    fill={color}
                    opacity={0.18}
                  />
                )}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isActive ? 5.5 : 4.5}
                  fill={color}
                  stroke="#FBF3E1"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}

          {/* Pin labels — only the largest three so we don't crowd */}
          {MAP_PINS.filter((p) =>
            ["Lovers Rock", "Ray's Bar", "Beverly's"].includes(p.name),
          ).map((pin) => (
            <g key={`lbl-${pin.name}`}>
              <rect
                x={pin.x + 8}
                y={pin.y - 10}
                width={pin.name.length * 4.6 + 8}
                height={14}
                rx={3}
                fill="#FBF3E1"
                fillOpacity={0.92}
              />
              <text
                x={pin.x + 12}
                y={pin.y}
                fontSize="7"
                fontFamily="Inter, system-ui"
                fontWeight="600"
                fill="#14110F"
              >
                {pin.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Top overlay chip */}
      <div className="absolute inset-x-3 top-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-ivory/92 px-2.5 py-1 text-[9px] font-medium text-ink shadow-sm backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
          LES · live tonight
        </div>
        <div className="rounded-full bg-ivory/92 p-1.5 text-[10px] text-ink shadow-sm backdrop-blur">
          ⊙
        </div>
      </div>

      {/* Bar detail card — matches BarProfileView layout */}
      <div className="absolute inset-x-3 bottom-2 rounded-2xl border border-hair bg-ivory/95 p-3 shadow-[0_10px_28px_-14px_rgba(31,18,15,0.35)] backdrop-blur">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cabernet/10 text-[13px] text-cabernet">
            🏛
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-serif text-[13px] leading-tight text-ink">
                Lovers Rock
              </div>
              <div className="rounded-full bg-ember/90 px-1.5 py-[2px] text-[8px] font-medium text-ivory">
                Heating up
              </div>
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-muted">
              Caribbean · Bed-Stuy · $$
            </div>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-xl bg-shell px-1 py-2 text-center">
          <div>
            <div className="text-[8px] uppercase tracking-[0.14em] text-muted">
              Wait
            </div>
            <div className="mt-0.5 font-serif text-[12px] text-ink">18 min</div>
          </div>
          <div className="border-x border-hair">
            <div className="text-[8px] uppercase tracking-[0.14em] text-muted">
              Cover
            </div>
            <div className="mt-0.5 font-serif text-[12px] text-ink">$10</div>
          </div>
          <div>
            <div className="text-[8px] uppercase tracking-[0.14em] text-muted">
              Crowd
            </div>
            <div className="mt-0.5 font-serif text-[12px] text-ink">Busy</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {(["MJ", "A", "S", "T"] as const).map((i, idx) => (
            <Avatar
              key={idx}
              initials={i}
              color={
                ["#5A1220", "#D4662B", "#E8A845", "#8B2438"][idx]
              }
              size={18}
              ring
            />
          ))}
          <div className="ml-0.5 text-[9px] text-muted">
            3 friends here · 6 regulars
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- LINE --------------------------------- */

export function LineScreen() {
  const bars = [
    {
      name: "Ray's Bar",
      sub: "3 blocks · $ · dive",
      wait: "2 min",
      tone: "good" as const,
    },
    {
      name: "Hair of the Dog",
      sub: "5 blocks · $ · Irish pub",
      wait: "7 min",
      tone: "good" as const,
    },
    {
      name: "169 Bar",
      sub: "4 blocks · $ · karaoke",
      wait: "12 min",
      tone: "mid" as const,
    },
    {
      name: "Lovers Rock",
      sub: "6 blocks · $$ · Caribbean",
      wait: "18 min",
      tone: "mid" as const,
    },
    {
      name: "Pianos",
      sub: "4 blocks · $$ · live + DJ",
      wait: "22 min",
      tone: "hot" as const,
    },
    {
      name: "Beverly's",
      sub: "4 blocks · $$ · rooftop",
      wait: "32 min",
      tone: "hot" as const,
    },
    {
      name: "The Skinny",
      sub: "2 blocks · $ · dive",
      wait: "Rope up",
      tone: "off" as const,
    },
  ];

  const toneStyles = {
    good: { pill: "bg-[#6b8f3d] text-ivory" },
    mid: { pill: "bg-saffron text-ink" },
    hot: { pill: "bg-ember text-ivory" },
    off: { pill: "bg-ink/80 text-ivory" },
  } as const;

  return (
    <ScreenFrame>
      <NavBar
        title="Nearby tonight"
        subtitle="Live lines · LES"
        trailing={
          <div className="rounded-full border border-hair px-2 py-0.5 text-[9px] font-medium text-muted">
            Filters
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col">
        <div className="flex-1 overflow-hidden px-3 pt-2.5">
          {bars.map((b) => (
            <div
              key={b.name}
              className="mb-1.5 flex items-center justify-between rounded-xl border border-hair bg-ivory/80 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate font-serif text-[12.5px] leading-tight text-ink">
                  {b.name}
                </div>
                <div className="mt-0.5 truncate text-[9px] uppercase tracking-[0.18em] text-muted">
                  {b.sub}
                </div>
              </div>
              <div
                className={cn(
                  "ml-2 shrink-0 rounded-full px-2 py-1 text-[9px] font-medium",
                  toneStyles[b.tone].pill,
                )}
              >
                {b.wait}
              </div>
            </div>
          ))}
          <div className="mt-2 rounded-xl bg-cabernet/5 px-3 py-2 text-center text-[10px] text-cabernet">
            Pulled from <span className="font-medium">34 line reports</span> in
            the last 20 min
          </div>
        </div>
        <TabBar active="map" />
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- GROUPS ------------------------------- */
/* Friend group screen — group plan (social_event) + group-visibility posts. */

export function GroupsScreen() {
  const members = [
    { i: "MG", c: "#5A1220" },
    { i: "JT", c: "#D4662B" },
    { i: "AS", c: "#E8A845" },
    { i: "SK", c: "#8B2438" },
    { i: "TL", c: "#8A735A" },
  ];

  return (
    <ScreenFrame>
      <NavBar
        title="Friday Regulars"
        subtitle="Group · 5 members"
        trailing={
          <div className="rounded-full border border-hair px-2 py-0.5 text-[9px] font-medium text-muted">
            Invite
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col px-3 pt-2.5">
        {/* Group plan card — corresponds to a social_event with visibility = group */}
        <div className="rounded-2xl bg-cabernet p-3 text-ivory shadow-[0_10px_24px_-14px_rgba(90,18,32,0.55)]">
          <div className="flex items-center justify-between">
            <div className="text-[9px] uppercase tracking-[0.22em] text-saffron">
              Fri · 10:00 PM · Group event
            </div>
            <div className="rounded-full bg-ivory/15 px-2 py-[2px] text-[9px] font-medium">
              Going
            </div>
          </div>
          <div className="mt-1 font-serif text-[16px] leading-tight">
            Lovers Rock, late.
          </div>
          <div className="mt-1 text-[10px] text-ivory/75">
            ◎ Lovers Rock · 419 Tompkins Ave
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex -space-x-1.5">
              {members.map((m, idx) => (
                <Avatar
                  key={idx}
                  initials={m.i}
                  color={m.c}
                  size={22}
                  ring
                />
              ))}
            </div>
            <div className="text-[10px] text-saffron">3 going · 1 maybe</div>
          </div>
        </div>

        {/* Group posts — Post.visibility = .group, scoped to this groupId */}
        <div className="mt-2.5 text-[8px] uppercase tracking-[0.22em] text-muted">
          Group posts
        </div>
        <div className="mt-1.5 space-y-1.5">
          <div className="flex items-start gap-2 rounded-xl border border-hair bg-ivory/70 p-2">
            <Avatar initials="MG" color="#5A1220" size={22} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-[11.5px] text-ink">
                  @maya.g
                </div>
                <div className="text-[9px] uppercase tracking-[0.14em] text-ember">
                  12m
                </div>
              </div>
              <div className="mt-0.5 text-[10.5px] leading-snug text-ink/85">
                At Ray&rsquo;s now — kitchen open till midnight, line basically nothing.
              </div>
              <div className="mt-1 text-[9px] text-muted">◎ Ray&rsquo;s Bar</div>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-hair bg-ivory/70 p-2">
            <Avatar initials="JT" color="#D4662B" size={22} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-[11.5px] text-ink">
                  @jordan.t
                </div>
                <div className="text-[9px] uppercase tracking-[0.14em] text-ember">
                  28m
                </div>
              </div>
              <div className="mt-0.5 text-[10.5px] leading-snug text-ink/85">
                Lovers Rock posted $6 rum punch until 10. Aiming there after.
              </div>
              <div className="mt-1 text-[9px] text-muted">◎ Lovers Rock</div>
            </div>
          </div>
        </div>

        <div className="mt-auto mb-1">
          <TabBar active="feed" />
        </div>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------- FEED --------------------------------- */

export function FeedScreen() {
  const posts = [
    {
      initials: "MG",
      color: "#5A1220",
      username: "maya.g",
      time: "12m",
      event: "Ray's Friday regulars",
      text: "Line's basically nothing, kitchen's open till midnight. Getting a booth.",
      bar: "Ray's Bar",
      when: "10:30 PM",
      going: 6,
    },
    {
      initials: "JT",
      color: "#D4662B",
      username: "jordan.t",
      time: "28m",
      event: "",
      text: "Rooftop opens at 10 at Beverly's — who's in? $10 cover until 11.",
      bar: "Beverly's",
      when: "10:00 PM",
      going: 11,
    },
  ];

  return (
    <ScreenFrame>
      <NavBar
        title="Tonight"
        subtitle="Friends · Crews · You"
        trailing={
          <div className="rounded-full bg-cabernet px-2 py-0.5 text-[9px] font-medium text-ivory">
            + Post
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col">
        <div className="flex-1 overflow-hidden px-3 pt-2">
          {posts.map((p, i) => (
            <PostCard key={i} post={p} />
          ))}

          {/* Promo slot — how the feed surfaces bar promos inline */}
          <div className="mt-1 rounded-2xl bg-cabernet p-3 text-ivory">
            <div className="text-[8px] uppercase tracking-[0.22em] text-saffron">
              Bars near you
            </div>
            <div className="mt-0.5 font-serif text-[13px] leading-snug">
              Beverly&rsquo;s · 20% off well drinks till 11
            </div>
            <div className="mt-0.5 text-[9.5px] text-ivory/75">
              4 blocks away · tap for details
            </div>
          </div>
        </div>
        <TabBar active="feed" />
      </div>
    </ScreenFrame>
  );
}

function PostCard({
  post,
}: {
  post: {
    initials: string;
    color: string;
    username: string;
    time: string;
    event: string;
    text: string;
    bar: string;
    when: string;
    going: number;
  };
}) {
  return (
    <div className="mb-1.5 rounded-2xl border border-hair bg-ivory/80 p-2.5">
      <div className="flex items-center gap-2">
        <Avatar initials={post.initials} color={post.color} size={22} />
        <div className="min-w-0 flex-1">
          <div className="font-serif text-[11.5px] leading-tight text-ink">
            @{post.username}
          </div>
        </div>
        <div className="text-[9px] uppercase tracking-[0.14em] text-muted">
          {post.time}
        </div>
      </div>
      {post.event && (
        <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-ink/5 px-1.5 py-[2px] text-[9px] font-medium text-muted">
          <span aria-hidden>✦</span>
          {post.event}
        </div>
      )}
      <div className="mt-1.5 text-[11px] leading-snug text-ink/85">
        {post.text}
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-[9px] text-muted">
        <span className="flex items-center gap-0.5">
          <span aria-hidden>◎</span>
          {post.bar}
        </span>
        <span className="flex items-center gap-0.5">
          <span aria-hidden>◴</span>
          {post.when}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <div className="flex h-6 flex-1 items-center justify-center gap-1 rounded-md bg-cabernet/10 text-[10px] font-medium text-cabernet">
          <span aria-hidden>✓</span>
          I&rsquo;m going ({post.going})
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[10px] text-muted">
          ◌
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[10px] text-muted">
          ↗
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- BAR ---------------------------------- */

export function BarScreen() {
  return (
    <ScreenFrame>
      <NavBar
        title=""
        leading={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[11px] text-ink/70">
            ‹
          </div>
        }
        trailing={
          <div className="flex gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[10px] text-ink/70">
              ★
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[10px] text-ink/70">
              ↗
            </div>
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col">
        <div className="flex-1 overflow-hidden">
          {/* Bar header */}
          <div className="flex flex-col items-center px-4 pt-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cabernet/10 text-[22px] text-cabernet">
              🏛
            </div>
            <div className="mt-2 font-serif text-[16px] leading-tight text-ink">
              Lovers Rock
            </div>
            <div className="mt-0.5 text-[10px] font-medium text-ember">
              Caribbean bar · cocktails
            </div>
            <div className="mt-1 flex items-center gap-1 text-[9px] text-muted">
              <span aria-hidden>◎</span>
              419 Tompkins Ave, Bed-Stuy
            </div>
            <div className="mt-1 flex items-center gap-1 text-[9.5px] font-medium text-[#4a7a27]">
              <span aria-hidden>●</span>3 friends here now
            </div>
          </div>

          {/* Stats */}
          <div className="mx-3 mt-3 grid grid-cols-3 rounded-xl bg-ivory py-2 text-center shadow-[0_2px_8px_-6px_rgba(31,18,15,0.2)]">
            <div>
              <div className="text-[8px] uppercase tracking-[0.16em] text-muted">
                Wait
              </div>
              <div className="mt-0.5 font-serif text-[13px] text-ink">
                18 min
              </div>
            </div>
            <div className="border-x border-hair">
              <div className="text-[8px] uppercase tracking-[0.16em] text-muted">
                Cover
              </div>
              <div className="mt-0.5 font-serif text-[13px] text-ink">$10</div>
            </div>
            <div>
              <div className="text-[8px] uppercase tracking-[0.16em] text-muted">
                Crowd
              </div>
              <div className="mt-0.5 font-serif text-[13px] text-ink">Busy</div>
            </div>
          </div>

          {/* Follow row */}
          <div className="mx-3 mt-2.5 flex items-center gap-1.5">
            <div className="flex h-7 flex-1 items-center justify-center rounded-lg bg-cabernet text-[11px] font-medium text-ivory">
              Follow
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-hair bg-ivory text-[11px] text-cabernet">
              ↗
            </div>
          </div>

          {/* Promos section */}
          <div className="mt-3 px-3">
            <div className="text-[8px] uppercase tracking-[0.2em] text-muted">
              Tonight at Lovers Rock
            </div>
            <div className="mt-1 rounded-xl border border-hair bg-ivory p-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-serif text-[12.5px] leading-tight text-ember">
                  $6 rum punch before 10
                </div>
                <div className="rounded-full bg-ember/90 px-1.5 py-[2px] text-[8px] font-medium text-ivory">
                  Happy hour
                </div>
              </div>
              <div className="mt-1 text-[10px] leading-snug text-ink/80">
                House rum punch, $6 until the DJ kicks on.
              </div>
              <div className="mt-1 flex items-center gap-2 text-[9px] text-muted">
                <span>◴ Tonight · 6–10 PM</span>
                <span>◎ View on map</span>
              </div>
            </div>
          </div>

          {/* Posts tabs */}
          <div className="mt-2.5 flex items-center gap-4 border-b border-hair px-3 pb-1.5">
            <div className="font-serif text-[11px] text-ink">
              Recent posts
              <div className="mt-0.5 h-[2px] w-10 rounded-full bg-cabernet" />
            </div>
            <div className="font-serif text-[11px] text-muted">All-time</div>
          </div>
          <div className="px-3 py-2">
            <div className="flex items-start gap-2 rounded-xl bg-shell p-2">
              <Avatar initials="MG" color="#5A1220" size={20} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <div className="font-serif text-[11px] text-ink">
                    @maya.g
                  </div>
                  <div className="text-[8px] uppercase tracking-[0.14em] text-muted">
                    12m
                  </div>
                </div>
                <div className="text-[10px] leading-snug text-ink/80">
                  Line moving fast, kitchen open till midnight.
                </div>
              </div>
            </div>
          </div>
        </div>

        <TabBar active="map" />
      </div>
    </ScreenFrame>
  );
}

/* ------------------------------- PROMOS -------------------------------- */

export function PromoScreen() {
  const promos = [
    {
      venue: "Beverly's",
      venueType: "Rooftop",
      distance: "4 blocks",
      time: "2h ago",
      tag: "Happy hour",
      title: "20% off well drinks · till 11",
      desc: "Rooftop opens at 10, free entry before 11 with the app.",
      when: "Tonight · 8–11 PM",
      going: 11,
    },
    {
      venue: "Pianos",
      venueType: "Live music",
      distance: "5 blocks",
      time: "1h ago",
      tag: "No cover",
      title: "Free entry until 11 with the app",
      desc: "Free entry before 11 — terms in the app.",
      when: "Tonight · 9–11 PM",
      going: 28,
    },
  ];

  return (
    <ScreenFrame>
      <NavBar
        title="Tonight's promos"
        subtitle="LES · 0.8 mi"
        trailing={
          <div className="rounded-full border border-hair px-2 py-0.5 text-[9px] font-medium text-muted">
            Nearby
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col">
        <div className="flex-1 overflow-hidden px-3 pt-2">
          {promos.map((p, i) => (
            <PromoCard key={i} promo={p} />
          ))}
        </div>
        <TabBar active="promos" />
      </div>
    </ScreenFrame>
  );
}

/* --------------------------- BAR ANALYTICS ---------------------------- */
/** Stylized bar-admin metrics — mirrors funnel + rollup concepts in the real dashboard. */

export function BarAnalyticsScreen() {
  const cells = [
    0.22, 0.35, 0.5, 0.4, 0.28, 0.45, 0.55, 0.38, 0.42, 0.6, 0.48, 0.33,
    0.4, 0.52, 0.7, 0.58, 0.44, 0.5, 0.62, 0.55, 0.48,
  ];
  return (
    <ScreenFrame>
      <NavBar
        title="Campaigns"
        subtitle="Beverly's · this week"
        trailing={
          <div className="rounded-full border border-hair px-2 py-0.5 text-[9px] font-medium text-muted">
            Range
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col px-3 pb-1 pt-2">
        <div className="rounded-xl border border-hair bg-ivory/90 p-2.5 shadow-sm">
          <div className="text-[8px] uppercase tracking-[0.18em] text-muted">
            Live promotion
          </div>
          <div className="mt-0.5 font-serif text-[12px] text-ink">
            20% off wells · tonight
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
            {[
              ["Views", "1.4k"],
              ["Clicks", "312"],
              ["Redemptions", "48"],
            ].map(([label, val]) => (
              <div key={label} className="rounded-lg bg-shell py-1.5">
                <div className="text-[7px] uppercase tracking-[0.12em] text-muted">
                  {label}
                </div>
                <div className="mt-0.5 font-serif text-[11px] text-ink">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 min-h-0 flex-1 rounded-xl border border-hair bg-shell/60 p-2">
          <div className="text-[8px] uppercase tracking-[0.18em] text-muted">
            When it hits · hour × day
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-0.5">
            {cells.map((op, i) => (
              <div
                key={i}
                className="aspect-square rounded-[2px] bg-cabernet"
                style={{ opacity: 0.15 + op * 0.55 }}
              />
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <TabBar active="you" />
        </div>
      </div>
    </ScreenFrame>
  );
}

function PromoCard({
  promo,
}: {
  promo: {
    venue: string;
    venueType: string;
    distance: string;
    time: string;
    tag: string;
    title: string;
    desc: string;
    when: string;
    going: number;
  };
}) {
  return (
    <div className="mb-2 rounded-2xl border border-hair bg-ivory p-2.5">
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cabernet/10 text-[13px] text-cabernet">
          🏛
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="truncate font-serif text-[12px] leading-tight text-cabernet underline decoration-cabernet/30 decoration-1 underline-offset-2">
              {promo.venue}
            </div>
            <div className="text-[9px] uppercase tracking-[0.14em] text-muted">
              {promo.time}
            </div>
          </div>
          <div className="mt-0.5 flex items-center justify-between">
            <div className="text-[9px] text-muted">
              {promo.venueType} · {promo.distance}
            </div>
            <div className="rounded-full bg-ember px-1.5 py-[2px] text-[8px] font-medium text-ivory">
              {promo.tag}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 font-serif text-[13.5px] leading-tight text-ember">
        {promo.title}
      </div>
      <div className="mt-1 text-[10.5px] leading-snug text-ink/80">
        {promo.desc}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[9px] text-muted">
        <span>◴ {promo.when}</span>
        <span className="text-cabernet">◎ View on map</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <div className="flex h-6 flex-1 items-center justify-center gap-1 rounded-md bg-cabernet/10 text-[10px] font-medium text-cabernet">
          <span aria-hidden>✓</span>
          I&rsquo;m going ({promo.going})
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[10px] text-muted">
          ⬚
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-[10px] text-muted">
          ↗
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- PLANS -------------------------------- */
/* Social events feed — mirrors EventsFeedView / SocialEventRow.           */

export function PlansScreen() {
  const yourEvents = [
    {
      title: "Friday Regulars @ Lovers Rock",
      host: "@jordan.t",
      date: "Fri · 10:00 PM",
      venue: "Lovers Rock",
      going: 6,
      accent: "cabernet" as const,
    },
    {
      title: "Pre-game + rooftop after",
      host: "@maya.g",
      date: "Sat · 8:30 PM",
      venue: "Beverly's",
      going: 12,
      accent: "ember" as const,
    },
  ];

  const publicEvents = [
    {
      title: "Ludlow Block Party",
      host: "@pianos_nyc",
      date: "Sat · 9:00 PM",
      venue: "Pianos",
      going: 84,
    },
    {
      title: "Vinyl night · all 45s",
      host: "@hair.of.the.dog",
      date: "Sun · 9:00 PM",
      venue: "Hair of the Dog",
      going: 23,
    },
  ];

  return (
    <ScreenFrame>
      <NavBar
        title="Events"
        subtitle="This weekend"
        trailing={
          <div className="rounded-full bg-cabernet px-2 py-0.5 text-[9px] font-medium text-ivory">
            + Host
          </div>
        }
      />
      <div className="flex h-[calc(100%-56px)] flex-col">
        <div className="flex-1 overflow-hidden px-3 pt-2">
          <div className="text-[8px] uppercase tracking-[0.2em] text-muted">
            Your events
          </div>
          <div className="mt-1 space-y-1.5">
            {yourEvents.map((e) => (
              <EventRow key={e.title} event={e} />
            ))}
          </div>

          <div className="mt-2.5 text-[8px] uppercase tracking-[0.2em] text-muted">
            Public · within 10 mi
          </div>
          <div className="mt-1 space-y-1.5">
            {publicEvents.map((e) => (
              <EventRow key={e.title} event={e} />
            ))}
          </div>
        </div>
        <TabBar active="plans" />
      </div>
    </ScreenFrame>
  );
}

/* ------------------------------- PROFILE ------------------------------- */
/** Placeholder — matches Profile tab shell; refine against ConsumerOwnProfileView. */

export function ProfileScreen() {
  return (
    <ScreenFrame>
      <ProfileShell className="flex h-full flex-col">
        <ProfileShell className="min-h-0 flex-1 overflow-hidden px-4 pt-2">
          <ProfileShell className="flex flex-col items-center text-center">
            <Avatar initials="WO" color="#5A1220" size={52} />
            <ProfileShell className="mt-2 font-serif text-[15px] text-ink">@will.o</ProfileShell>
            <ProfileShell className="mt-0.5 text-[10px] text-muted">
              Brooklyn · going out tonight
            </ProfileShell>
          </ProfileShell>
          <ProfileShell className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-hair bg-ivory py-2.5 text-center">
            {[
              ["Friends", "42"],
              ["Following", "18"],
              ["Groups", "3"],
            ].map(([label, val]) => (
              <ProfileShell key={label}>
                <ProfileShell className="font-serif text-[13px] text-ink">{val}</ProfileShell>
                <ProfileShell className="text-[8px] uppercase tracking-[0.14em] text-muted">
                  {label}
                </ProfileShell>
              </ProfileShell>
            ))}
          </ProfileShell>
          <ProfileShell className="mt-3 space-y-1.5 pb-2">
            {["Edit profile", "Friends", "Favorite bars", "Groups"].map((row) => (
              <ProfileShell
                key={row}
                className="flex items-center justify-between rounded-xl border border-hair bg-ivory/80 px-3 py-2.5 text-[11px] text-ink"
              >
                <span>{row}</span>
                <span className="text-muted">›</span>
              </ProfileShell>
            ))}
          </ProfileShell>
        </ProfileShell>
        <TabBar active="you" />
      </ProfileShell>
    </ScreenFrame>
  );
}

function ProfileShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

function EventRow({
  event,
}: {
  event: {
    title: string;
    host: string;
    date: string;
    venue: string;
    going: number;
    accent?: "cabernet" | "ember";
  };
}) {
  const accentColor =
    event.accent === "cabernet"
      ? "bg-cabernet/10 text-cabernet"
      : event.accent === "ember"
        ? "bg-ember/15 text-ember"
        : "bg-ink/5 text-ink/70";

  return (
    <div className="flex items-start gap-2 rounded-xl border border-hair bg-ivory p-2">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[14px]",
          accentColor,
        )}
      >
        ✦
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-serif text-[12px] leading-tight text-ink">
          {event.title}
        </div>
        <div className="mt-0.5 text-[9.5px] text-muted">{event.host}</div>
        <div className="mt-1 flex items-center gap-2 text-[9px] text-muted">
          <span>◴ {event.date}</span>
          <span>◎ {event.venue}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <div className="text-[9.5px] font-medium text-cabernet">
          {event.going} going
        </div>
        <div className="text-[10px] text-muted">›</div>
      </div>
    </div>
  );
}
