import { Button } from "./components/Button";
import { Container } from "./components/Container";
import { Eyebrow } from "./components/Eyebrow";
import { PhoneMockup } from "./components/PhoneMockup";
import {
  BarAnalyticsScreen,
  BarScreen,
  FeedScreen,
  GroupsScreen,
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
              <span className="text-cabernet">What&apos;s live, in one place.</span>
              <br />
              <span className="text-ink">Targeted promotions.</span>{" "}
              <span className="text-ink">Analytics you can use.</span>
            </h1>

            <p className="mt-7 max-w-[520px] text-lg leading-relaxed text-muted">
              For going out, Sip is where tonight&apos;s offers, the neighborhood
              map, and real plans show up together. For bars, it&apos;s scheduled
              campaigns, audience targeting, and funnel analytics — so spend comes
              with a read on what moved.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="#contact" variant="primary">
                Get early access
              </Button>
              <Button href="#product" variant="secondary">
                See the app
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted">
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                Tonight &amp; upcoming
              </span>
              <span>Patron app</span>
              <span className="hidden sm:inline">Bar dashboard</span>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden className="sip-sunset-halo" />
            <PhoneMockup className="lg:rotate-[-3deg]">
              <PromoScreen />
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
    title: "Reach, not spray",
    body: "Offers scatter across social, print, and word of mouth. Venues can&apos;t aim them; patrons can&apos;t rely on a single place to look.",
  },
  {
    title: "Spend without signal",
    body: "Bars buy nights and promos with little read on who saw a campaign, what moved, or which hours matter. The feedback loop comes too late, if at all.",
  },
];

function Problem() {
  return (
    <Section tone="sand">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Nightlife still sells blind.
          </h2>
        </div>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-12 lg:mt-24 lg:gap-16">
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
  screen: "promos" | "analytics" | "map" | "events";
  align: "left" | "right";
};

const productRows: ProductRowData[] = [
  {
    eyebrow: "Promotions",
    title: "Campaigns on a schedule.",
    body: "Bars set start and end times, shape reach with zone- and segment-level targeting, and surface offers in a Promotions feed patrons check for tonight — not buried in an infinite timeline.",
    screen: "promos",
    align: "left",
  },
  {
    eyebrow: "Analytics",
    title: "Know what moved.",
    body: "Views, clicks, and redemptions roll up by campaign with segment mix and peak-hour patterns from in-app behavior.",
    screen: "analytics",
    align: "right",
  },
  {
    eyebrow: "Neighborhood",
    title: "The block, in context.",
    body: "Nearby bars with recent wait, cover, and crowd from patron reports — plus a fast line-report flow when someone is willing to share what it looks like from the sidewalk.",
    screen: "map",
    align: "left",
  },
  {
    eyebrow: "Events & groups",
    title: "Plans with RSVPs attached.",
    body: "Host public or group-only events, carry friend groups night to night, and keep posts and RSVPs tied to the same object — not lost across chats.",
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
            Built for operators.
            <span className="text-ember"> Clear for guests.</span>
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
    screen === "promos"
      ? PromoScreen
      : screen === "analytics"
        ? BarAnalyticsScreen
        : screen === "map"
          ? MapScreen
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
          <Eyebrow>Why Sip</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Same network.
            <span className="text-cabernet"> Different jobs.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-14 lg:mt-20">
          <WhyCard
            label="For patrons"
            title="One app for going out."
            points={[
              "Promotions with real windows — today and the rest of the week",
              "Nearby bars with wait, cover, and crowd from people already there",
              "Events and groups with RSVPs and posts in one feed",
            ]}
            accent="ember"
          />
          <WhyCard
            label="For bar operators"
            title="Target. Run. Read the results."
            points={[
              "Audience estimation by zone, age bracket, and behavioral segment",
              "Scheduled campaigns surfaced in a dedicated patron feed",
              "Funnel metrics, segment mix, and peak-hour patterns per campaign",
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
          <Eyebrow className="justify-center">In the app</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Feed, venue, <span className="text-ember">groups.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Mock screens match the live iOS layout — not generic placeholders.
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
              <GroupsScreen />
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
            Open Sip when we open{" "}
            <span className="text-ember">your city.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            We&apos;re live in private beta in New York. Leave your email and
            we&apos;ll reach out when the next wave opens.
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
            — targeted promotions, patron discovery, bar analytics
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
