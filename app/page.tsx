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
              <span className="text-ink">
                Offers, map, and plans — without the guesswork.
              </span>
            </h1>

            <p className="mt-7 max-w-[520px] text-lg leading-relaxed text-muted">
              Sip is built for going out: tonight&apos;s promos with real windows, the
              neighborhood on a map, and RSVPs that stay attached to the plan. The
              same network gives bars scheduled campaigns, audience targeting, and
              funnel analytics — so what you see stays worth opening.
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
                Promos &amp; map
              </span>
              <span>Events &amp; groups</span>
              <span className="hidden sm:inline">
                Venues: campaigns &amp; analytics
              </span>
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
    title: "The night is scattered",
    body: "Specials, lines, and plans live across stories, texts, and half a dozen apps. You still guess what&apos;s real, what&apos;s expired, and where people actually agreed to meet.",
  },
  {
    title: "Venues fly just as blind",
    body: "Bars push the same offers into the void with little sense of who saw them or what moved. That&apos;s a different pain — but the same missing signal — as yours.",
  },
];

function Problem() {
  return (
    <Section tone="sand">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Nobody sees the same night.
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
    title: "Tonight&apos;s offers, organized.",
    body: "See bar deals with real start and end times in a feed meant for going out — not buried in a social timeline. Venues set those windows behind the scenes and tune likely reach by zone and segment.",
    screen: "promos",
    align: "left",
  },
  {
    eyebrow: "Neighborhood",
    title: "The block, before you walk.",
    body: "Nearby spots with recent wait, cover, and crowd from people already there — plus fast line reports when someone shares what it looks like from the sidewalk. Honest signal for you; richer context for everyone.",
    screen: "map",
    align: "right",
  },
  {
    eyebrow: "Events & groups",
    title: "Plans that stay put.",
    body: "Host or follow a night with RSVPs and posts tied to the same plan, not lost across chats. Venues meet you on the same rails when offers and events line up.",
    screen: "events",
    align: "left",
  },
  {
    eyebrow: "Bar analytics",
    title: "When venues measure, offers stay sharp.",
    body: "The same network that powers your promos gives bars funnel metrics — views, clicks, redemptions, segment mix, and peak-hour patterns — so what&apos;s in your feed earns its place.",
    screen: "analytics",
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
            Your night, clear.
            <span className="text-ember"> Venues, supported.</span>
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
            You go out.
            <span className="text-cabernet"> Venues need a read.</span>
          </h2>
        </div>

        <div className="mt-16 flex max-w-4xl flex-col gap-10 lg:mt-20 lg:gap-14">
          <WhyCard
            label="If you&apos;re going out"
            title="One feed for the night."
            points={[
              "Promos with real windows — today and the rest of the week",
              "Map context from people already at the door",
              "Events and groups with RSVPs that don&apos;t dissolve in chat",
            ]}
            accent="ember"
          />
          <WhyCard
            label="If you run a venue"
            title="Campaigns and numbers on the same product."
            points={[
              "Reach estimates by zone, age bracket, and behavioral segment",
              "Scheduled offers surfaced where patrons actually look",
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
            The screens you actually thumb through — feed, venue, groups — styled
            like the shipping iOS app.
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
            Join the waitlist for the consumer app. Run a venue? Same list — we&apos;ll
            route you when your market opens.
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
            — what&apos;s live, maps &amp; plans · campaigns &amp; analytics for venues
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
