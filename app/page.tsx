import type { ComponentProps } from "react";

import { BarTeaser } from "./components/BarTeaser";
import { Button } from "./components/Button";
import { Container } from "./components/Container";
import { Eyebrow } from "./components/Eyebrow";
import { FeatureGrid } from "./components/FeatureGrid";
import { PhoneScreenshot } from "./components/PhoneScreenshot";
import { PhoneScrollReveal } from "./components/PhoneScrollReveal";
import { ScrollReveal } from "./components/ScrollReveal";
import { Section } from "./components/Section";
import { WaitlistForm } from "./components/WaitlistForm";

/* ----------------------------- Page shell ----------------------------- */

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProofStrip />
        <FeatureRows />
        <EveryFeatureSection />
        <WaitlistSection />
        <BarTeaser />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------- Header ------------------------------- */

function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <Container className="flex items-center justify-between py-6">
        <a
          href="#top"
          className="font-serif text-2xl tracking-tight text-ink"
        >
          Sip
        </a>
        <nav className="hidden items-center gap-10 text-sm text-muted md:flex">
          <a href="#app" className="transition-colors hover:text-ink">
            App
          </a>
          <a href="#every-feature" className="transition-colors hover:text-ink">
            Features
          </a>
          <a href="#contact" className="transition-colors hover:text-ink">
            Get access
          </a>
        </nav>
        <Button href="#contact" variant="primary">
          Get early access
        </Button>
      </Container>
    </header>
  );
}

/* -------------------------------- Hero -------------------------------- */

function Hero() {
  return (
    <Section
      id="top"
      className="relative overflow-hidden pt-40 sm:pt-44 lg:pt-56"
    >
      <div aria-hidden className="sip-hero-horizon" />

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <ScrollReveal variant="rise" className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ivory/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-ember backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_0_rgba(212,102,43,0.9)]" />
              Live in New York · Ann Arbor + more cities soon
            </span>

            <h1 className="mt-7 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-[72px]">
              <span className="text-cabernet">Know the line,</span>
              <br />
              <span className="text-ink">before you walk over.</span>
            </h1>

            <p className="mt-7 max-w-[540px] text-lg leading-relaxed text-muted">
              Sip shows live wait times at every bar near you — reported by
              people standing in the line right now. See it on the map, on the
              bar page, or before you even leave the house.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="#contact" variant="primary">
                Get early access
              </Button>
              <Button href="#app" variant="secondary">
                See the app
              </Button>
            </div>
          </ScrollReveal>

          <PhoneScrollReveal
            initialRotate={-8}
            panThrough={false}
            className="relative"
          >
            <div aria-hidden className="sip-sunset-halo" />
            <PhoneScreenshot
              src="map-detail.jpg"
              alt="Sip Map detail half-sheet: a wine bar with hero image, live wait/cover/crowd stats, and wait-time bucket pills (No line, Under 10, 10-20, 20-30)."
              priority
            />
          </PhoneScrollReveal>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------- Proof / What -------------------------- */

function ProofStrip() {
  return (
    <section
      aria-label="What Sip does, in one line per surface"
      className="sip-blend-ivory-to-sand"
    >
      <Container className="py-14">
        <ScrollReveal variant="rise">
          <ul className="grid gap-x-10 gap-y-6 text-center sm:grid-cols-2 lg:grid-cols-3 lg:text-left">
            {[
              ["Lines", "Live wait times reported by people at the door."],
              ["Map", "Wait, cover, and crowd at every bar near you."],
              ["Bar pages", "Live stats and recent posts for one venue."],
              ["Search", "Bars and people in one input."],
              ["Plans", "Public and private events with RSVP."],
              ["Promotions", "Tonight's deals from bars on Sip."],
            ].map(([tab, line]) => (
              <li key={tab}>
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-ember">
                  {tab}
                </div>
                <div className="mt-2 text-[15px] leading-snug text-ink">
                  {line}
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </Container>
    </section>
  );
}

/* ---------------------- Marquee feature rows ------------------------ */

type FeatureBlock = {
  id: string;
  tab: string;
  title: string;
  body: string;
  bullets: string[];
  align: "left" | "right";
  screenshot: ComponentProps<typeof PhoneScreenshot>;
  /** Lean angle for the scroll-linked phone reveal. Alternate row-to-row. */
  rotate: number;
};

const features: FeatureBlock[] = [
  {
    id: "lines",
    tab: "Lines",
    title: "Live wait times, from people in the line right now.",
    body: "Outside a packed door? Pick a wait bucket — no line, under 10, 10–20, 20–30, 30–45, 45+ — and the next person sees what you saw. The bar's page and the map both update with the live average.",
    bullets: [
      "Six wait buckets that take a single tap",
      "Optional photo of the actual door, timestamped",
      "Reports decay over time so old data doesn't mislead",
    ],
    align: "right",
    rotate: -6,
    screenshot: {
      src: "map-detail.jpg",
      alt: "Sip map detail half-sheet: a wine bar with live wait/cover/crowd stats and wait-time bucket pills (No line, Under 10 min, 10-20 min, 20-30).",
    },
  },
  {
    id: "map",
    tab: "Map",
    title: "Every bar nearby, with the context that matters.",
    body: "Open the map for wait, cover, and crowd at every venue near you — plus your friends' avatars when they're checked in. Tap a pin to slide up a half-sheet; drag it to full screen for the whole bar page.",
    bullets: [
      "Friend avatars on the map when they're checked in",
      "Filter to a group to focus the view",
      "Drag the half-sheet up for the full bar page",
    ],
    align: "left",
    rotate: 6,
    screenshot: {
      src: "map.jpg",
      alt: "Sip Map view zoomed into NYC's East Village showing bar pins, including 1-friends-here clusters near Heaven Can Wait and Doc Holliday's.",
    },
  },
  {
    id: "bar-pages",
    tab: "Bar pages",
    title: "One page per venue. Everything before you walk in.",
    body: "Hero photo, live wait/cover/crowd, recent posts from people who've actually been there, and the bar's tonight offer if they're running one. Follow a venue to get its posts in your feed, or pick it as one of three favorites to highlight on the map.",
    bullets: [
      "Wait, cover, and crowd live at the top",
      "Recent posts from people actually there",
      "Follow + favorites carry across the whole app",
    ],
    align: "right",
    rotate: -6,
    screenshot: {
      src: "bar-profile.jpg",
      alt: "Sip bar profile for a wine bar showing the hero charcuterie image, live wait/cover/crowd stats, a Follow button, and a Recent Posts tab.",
    },
  },
  {
    id: "search",
    tab: "Search",
    title: "One input for bars and the people you go out with.",
    body: "Type a name; Sip returns matching bars (with type and distance) and matching people (with mutual-friend counts). Add a friend from the same row that finds them; follow a bar from the same row that finds it.",
    bullets: [
      "Bars sorted by relevance, with type and distance",
      "People with mutual-friend counts inline",
      "Add and Follow buttons right where you found them",
    ],
    align: "left",
    rotate: 6,
    screenshot: {
      src: "search.jpg",
      alt: "Sip Search tab with the query 'sa': bar results including Eightball Saloon and Casa Dominick's plus people results @samuelhanson and @salty_nina with Friend / Add actions.",
    },
  },
  {
    id: "plans",
    tab: "Plans",
    title: "Public events and private invites — without a group chat.",
    body: "Public events are open to anyone on Sip; private events show only to people you invited. RSVP, see the venue, find the night on the map. No extra group chat to spin up every weekend.",
    bullets: [
      "Public events for the room, private events for your crew",
      "Venue and host on every event card",
      "Going counts so you know what's actually full",
    ],
    align: "right",
    rotate: -6,
    screenshot: {
      src: "plans.jpg",
      alt: "Sip Plans tab listing user events: a pre-game + rooftop after at Beverly's, Friday Regulars at Lovers Rock, and Vinyl Night at Hair of the Dog with going counts.",
    },
  },
  {
    id: "promotions",
    tab: "Promotions",
    title: "Bar promotions, rolling out venue by venue.",
    body: "Bars on Sip can post tonight's deal with the time window it's live. A few venues are already running offers; we're onboarding the rest one at a time. How each bar redeems an offer is up to the bar — we'll surface those details as we sign more on.",
    bullets: [
      "Real start and end times — no stale flyers",
      "Today + Upcoming filters so you can plan ahead",
      "View on Map opens the venue directly",
    ],
    align: "left",
    rotate: 6,
    screenshot: {
      src: "promotions.jpg",
      alt: "Sip Promotions tab showing a karaoke promo from 169 Bar with a live time window and an event description.",
    },
  },
];

function FeatureRows() {
  return (
    <section
      id="app"
      className="relative overflow-hidden sip-blend-sand-to-ivory pt-24 sm:pt-32 lg:pt-40"
    >
      <Container>
        <ScrollReveal variant="rise" className="max-w-2xl">
          <Eyebrow>The app</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            What&rsquo;s in the app.
          </h2>
        </ScrollReveal>

        <div className="mt-20 flex flex-col gap-28 lg:gap-36">
          {features.map((feature) => (
            <FeatureRow key={feature.id} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureRow({
  id,
  tab,
  title,
  body,
  bullets,
  align,
  rotate,
  screenshot,
}: FeatureBlock) {
  const textFirst = align === "left";

  return (
    <article
      id={id}
      className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24"
    >
      <ScrollReveal
        variant="rise"
        className={textFirst ? "lg:order-1" : "lg:order-2"}
      >
        <Eyebrow>{tab}</Eyebrow>
        <h3 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
          {title}
        </h3>
        <p className="mt-5 max-w-[540px] text-[17px] leading-relaxed text-muted">
          {body}
        </p>
        <ul className="mt-7 space-y-3 text-[15px] text-ink">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[10px] inline-block h-px w-6 shrink-0 bg-ember"
              />
              <span className="text-muted">{b}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <PhoneScrollReveal
        initialRotate={rotate}
        className={textFirst ? "relative lg:order-2" : "relative lg:order-1"}
      >
        <div aria-hidden className="sip-sunset-halo" />
        <PhoneScreenshot {...screenshot} />
      </PhoneScrollReveal>
    </article>
  );
}

/* ----------------------- Every feature grid -------------------------- */

function EveryFeatureSection() {
  return (
    <section
      id="every-feature"
      className="relative overflow-hidden sip-blend-ivory-flat py-24 sm:py-32"
    >
      <Container>
        <ScrollReveal variant="rise" className="max-w-2xl">
          <Eyebrow>Every feature</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            What else Sip does.
          </h2>
        </ScrollReveal>

        <FeatureGrid />
      </Container>
    </section>
  );
}

/* ------------------------ Waitlist (patron) -------------------------- */

function WaitlistSection() {
  return (
    <Section
      id="contact"
      tone="sand"
      className="relative overflow-hidden pb-28 sm:pb-36 lg:pb-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(232,215,181,0) 0%, rgba(232,168,69,0.22) 55%, rgba(212,102,43,0.28) 100%)",
        }}
      />
      <Container className="relative">
        <ScrollReveal variant="rise" className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Early access</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Join the waitlist
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            We&rsquo;re opening Sip city by city. New York is live, Ann Arbor is
            up next, and we&rsquo;ll email you the moment your city opens.
          </p>
          <WaitlistForm />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

/* ------------------------------- Footer ------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t border-hair bg-ivory">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 text-xs text-muted sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl text-ink">Sip</span>
          <span className="text-muted/80">
            Live bar wait times, a map, and your social plans — for going out.
          </span>
        </div>
        <FooterNav />
        <FooterMeta />
      </Container>
    </footer>
  );
}

function FooterNav() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
      <a href="#app" className="transition-colors hover:text-ink">
        App
      </a>
      <a href="#every-feature" className="transition-colors hover:text-ink">
        Features
      </a>
      <a href="#venues" className="transition-colors hover:text-ink">
        For bars
      </a>
      <a href="#contact" className="transition-colors hover:text-ink">
        Get access
      </a>
      <a href="/privacy" className="transition-colors hover:text-ink">
        Privacy
      </a>
      <a href="/terms" className="transition-colors hover:text-ink">
        Terms
      </a>
    </div>
  );
}

function FooterMeta() {
  return (
    <FooterMetaInner>
      <div>{`© ${new Date().getFullYear()} Sip, Inc.`}</div>
      <div className="text-muted/70">
        Security &amp; abuse:{" "}
        <a
          href="mailto:sam@sipapp.co"
          className="text-muted/80 transition-colors hover:text-ink"
        >
          sam@sipapp.co
        </a>
      </div>
      <a
        href="/admin/login"
        rel="nofollow"
        className="text-[10px] text-muted/35 transition-colors hover:text-muted/60"
      >
        Admin
      </a>
    </FooterMetaInner>
  );
}

function FooterMetaInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 text-muted/80 sm:items-end">
      {children}
    </div>
  );
}
