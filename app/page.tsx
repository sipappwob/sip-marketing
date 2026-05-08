import { Button } from "./components/Button";
import { Container } from "./components/Container";
import { Eyebrow } from "./components/Eyebrow";
import { PhoneMockup } from "./components/PhoneMockup";
import {
  BarScreen,
  CrewScreen,
  FeedScreen,
  LineScreen,
  MapScreen,
  PlansScreen,
  PromoScreen,
} from "./components/Screens";
import { Section } from "./components/Section";
import { WaitlistForm } from "./components/WaitlistForm";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Ornament>I</Ornament>
        <Problem />
        <Ornament>II</Ornament>
        <Product />
        <Ornament>III</Ornament>
        <WhySip />
        <Ornament>IV</Ornament>
        <Showcase />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}

/* --------------------------------- NAV ---------------------------------- */

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
          <a href="#product" className="transition-colors hover:text-ink">
            Product
          </a>
          <a href="#why" className="transition-colors hover:text-ink">
            Why Sip
          </a>
          <a href="#contact" className="transition-colors hover:text-ink">
            Contact
          </a>
        </nav>
        <Button href="#contact" variant="primary">
          Get early access
        </Button>
      </Container>
    </header>
  );
}

/* ------------------------------- ORNAMENT ------------------------------- */

function Ornament({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="sip-ornament">
          <span aria-hidden>✦</span>
          <span className="font-serif text-xs tracking-[0.36em] text-muted">
            {children}
          </span>
          <span aria-hidden>✦</span>
        </div>
      </Container>
    </div>
  );
}

/* --------------------------------- HERO --------------------------------- */

function Hero() {
  return (
    <Section
      id="top"
      className="relative overflow-hidden pt-40 sm:pt-44 lg:pt-56"
    >
      <div aria-hidden className="sip-hero-horizon" />

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ivory/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-ember backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_0_rgba(212,102,43,0.9)]" />
              Private beta · New York
            </span>

            <h1 className="mt-7 font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-[78px]">
              Promotions you can
              <br />
              <span className="text-cabernet">actually</span>
              <span className="text-ink"> find.</span>
            </h1>

            <p className="mt-7 max-w-[520px] text-lg leading-relaxed text-muted">
              Sip surfaces real bar deals and campaigns — what&apos;s live tonight,
              not buried in a feed. Built for people going out and the venues
              running the promos.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="#contact" variant="primary">
                Get early access
              </Button>
              <Button href="#product" variant="secondary">
                See the app
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-muted">
              <span>
                <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember" />
                Live promos · tonight
              </span>
              <span className="hidden sm:inline">
                Deals · crews · map
              </span>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden className="sip-sunset-halo" />
            <PhoneMockup className="lg:rotate-[-3deg]">
              <MapScreen />
            </PhoneMockup>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------- PROBLEM ------------------------------- */

const problems = [
  {
    title: "No real-time visibility",
    body: "You don't know which bar is packed, quiet, or over capacity until you're already in line. Decisions are made on a coin flip.",
  },
  {
    title: "Group plans fragment fast",
    body: "Three group chats, five screenshots, nobody quite knows the plan. By 11pm half the crew is somewhere else.",
  },
  {
    title: "Bars fly without signal",
    body: "Venues have no live demand signal and no direct channel to the people nearby. Marketing is a guess, every night.",
  },
];

function Problem() {
  return (
    <Section tone="sand">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Every night out is planned on screenshots and{" "}
            <span className="text-cabernet">guesses.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10 lg:mt-24 lg:gap-12">
          {problems.map((p, i) => (
            <article
              key={p.title}
              className="relative border-t border-hair pt-8"
            >
              <span
                className="font-serif text-5xl leading-none text-ember/90 sm:text-6xl"
                aria-hidden
              >
                0{i + 1}
              </span>
              <h3 className="mt-5 font-serif text-2xl leading-snug">
                {p.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------- PRODUCT ------------------------------- */

type ProductRowData = {
  eyebrow: string;
  title: string;
  body: string;
  screen: "map" | "line" | "crew" | "events";
  align: "left" | "right";
};

const productRows: ProductRowData[] = [
  {
    eyebrow: "Live map",
    title: "See tonight before you leave.",
    body: "A real-time map of bars, crowd energy, and friends who are out. Every check-in, RSVP, and post updates the map as it happens.",
    screen: "map",
    align: "left",
  },
  {
    eyebrow: "Line intelligence",
    title: "Know the line before you go.",
    body: "Wait times, capacity, and live bouncer signal — reported by the people actually in line. No more walking five blocks for a closed rope.",
    screen: "line",
    align: "right",
  },
  {
    eyebrow: "Crews",
    title: "Plan with your people.",
    body: "Persistent friend crews carry from one night to the next. Drop a plan, invite the group, and see who's in with one tap.",
    screen: "crew",
    align: "left",
  },
  {
    eyebrow: "Events",
    title: "Real plans, not screenshots.",
    body: "Host a night in one tap, invite your crew, see who's in. Public events surface nearby — with live RSVP counts, hosts you know, and a map pin already waiting.",
    screen: "events",
    align: "right",
  },
];

function Product() {
  return (
    <Section id="product">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The product</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            One app for every part of{" "}
            <span className="text-ember">every night.</span>
          </h2>
        </div>

        <div className="mt-20 flex flex-col gap-28 lg:gap-36">
          {productRows.map((row) => (
            <ProductRow key={row.title} {...row} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProductRow({ eyebrow, title, body, screen, align }: ProductRowData) {
  const textFirst = align === "left";
  const Screen =
    screen === "map"
      ? MapScreen
      : screen === "line"
        ? LineScreen
        : screen === "crew"
          ? CrewScreen
          : PlansScreen;

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
      <div className={textFirst ? "lg:order-1" : "lg:order-2"}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
          {title}
        </h3>
        <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted">
          {body}
        </p>
      </div>
      <div className={textFirst ? "relative lg:order-2" : "relative lg:order-1"}>
        <div aria-hidden className="sip-sunset-halo" />
        <PhoneMockup>
          <Screen />
        </PhoneMockup>
      </div>
    </div>
  );
}

/* -------------------------------- WHY SIP ------------------------------- */

function WhySip() {
  return (
    <Section id="why" tone="sand">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Why Sip matters</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Both sides of the night, finally on the{" "}
            <span className="text-cabernet">same map.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-14 lg:mt-20">
          <WhyCard
            label="For users"
            title="Your night, with signal."
            points={[
              "See what's busy and where your crew is, in real time",
              "Skip the group-chat archaeology — plans live in one place",
              "Catch limited-time promos from bars you actually go to — before they expire",
            ]}
            accent="ember"
          />
          <WhyCard
            label="For bars"
            title="A live demand signal — and a direct channel to it."
            points={[
              "Live headcount, regulars vs. discovery, hour-by-hour traffic",
              "Targeted promotions to nearby users, sliced by crew and visit history",
              "The first operator dashboard built for nightlife, not restaurants",
            ]}
            accent="cabernet"
          />
        </div>
      </Container>
    </Section>
  );
}

function WhyCard({
  label,
  title,
  points,
  accent,
}: {
  label: string;
  title: string;
  points: string[];
  accent: "ember" | "cabernet";
}) {
  const accentClass = accent === "ember" ? "bg-ember" : "bg-cabernet";
  const labelClass = accent === "ember" ? "text-ember" : "text-cabernet";

  return (
    <article className="relative rounded-3xl border border-hair bg-ivory/60 p-8 sm:p-10">
      <div
        className={`text-[11px] font-medium uppercase tracking-[0.26em] ${labelClass}`}
      >
        {label}
      </div>
      <h3 className="mt-4 font-serif text-3xl leading-snug sm:text-4xl">
        {title}
      </h3>
      <ul className="mt-8 space-y-5">
        {points.map((p) => (
          <li
            key={p}
            className="flex gap-4 text-[16px] leading-relaxed text-ink/85"
          >
            <span
              aria-hidden
              className={`mt-[10px] inline-block h-px w-6 shrink-0 ${accentClass}`}
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* -------------------------------- SHOWCASE ------------------------------ */

function Showcase() {
  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(212,102,43,0.14) 0%, rgba(212,102,43,0) 70%)",
        }}
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Product showcase</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Minimal. <span className="text-ember">Live.</span>{" "}
            <span className="text-cabernet">Yours.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            The whole night, on one screen. No ads, no infinite scroll.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 justify-items-center gap-16 md:grid-cols-3 md:gap-6 lg:mt-28">
          <div className="md:-mr-8 md:mt-12 md:self-end">
            <PhoneMockup rotate={-5}>
              <FeedScreen />
            </PhoneMockup>
          </div>
          <div className="md:z-10">
            <PhoneMockup>
              <BarScreen />
            </PhoneMockup>
          </div>
          <div className="md:-ml-8 md:mt-12 md:self-end">
            <PhoneMockup rotate={5}>
              <PromoScreen />
            </PhoneMockup>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------------- CTA --------------------------------- */

function CTA() {
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
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Get early access</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            The night is about to get a lot{" "}
            <span className="text-ember">more visible.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Join the waitlist and we&apos;ll let you in as soon as Sip opens in
            your city.
          </p>

          <WaitlistForm />
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------- FOOTER ------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-hair bg-ivory">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 text-xs text-muted sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl text-ink">Sip</span>
          <span className="text-muted/80">
            — bar promos, crews, and the live map
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <a href="#product" className="transition-colors hover:text-ink">
            Product
          </a>
          <a href="#why" className="transition-colors hover:text-ink">
            Why Sip
          </a>
          <a href="#contact" className="transition-colors hover:text-ink">
            Contact
          </a>
          <a href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-ink">
            Terms
          </a>
        </div>
        <div className="flex flex-col items-center gap-1 text-muted/80 sm:items-end">
          <div>© {new Date().getFullYear()} Sip, Inc.</div>
          <a
            href="/admin/login"
            rel="nofollow"
            className="text-[10px] text-muted/35 transition-colors hover:text-muted/60"
          >
            Admin
          </a>
        </div>
      </Container>
    </footer>
  );
}
