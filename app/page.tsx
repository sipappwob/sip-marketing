import { Button } from "./components/Button";
import { Container } from "./components/Container";
import { Eyebrow } from "./components/Eyebrow";
import { PhoneMockup } from "./components/PhoneMockup";
import {
  BarAnalyticsScreen,
  BarScreen,
  FeedScreen,
  MapScreen,
  ProfileScreen,
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
        <AppFeatures />
        <ForVenues />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}

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
          <a href="#venues" className="transition-colors hover:text-ink">
            For bars
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

            <h1 className="mt-7 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-[72px]">
              <span className="text-cabernet">Going out,</span>
              <br />
              <span className="text-ink">in one app.</span>
            </h1>

            <p className="mt-7 max-w-[520px] text-lg leading-relaxed text-muted">
              {`Sip shows bar promotions, a live map of nearby spots, and your feed of friends and plans. Bars publish offers and see how they perform.`}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="#contact" variant="primary">
                Get early access
              </Button>
              <Button href="#app" variant="secondary">
                See the app
              </Button>
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

type FeatureBlock = {
  id: string;
  tab: string;
  title: string;
  body: string;
  Screen: React.ComponentType;
  align: "left" | "right";
};

const features: FeatureBlock[] = [
  {
    id: "feed",
    tab: "Feed",
    title: "Posts from friends and your groups.",
    body: "See where people are going, RSVP to nights out, and keep group updates in one timeline instead of scattered chats.",
    Screen: FeedScreen,
    align: "left",
  },
  {
    id: "promos",
    tab: "Promotions",
    title: "Tonight's deals with real hours.",
    body: "Browse bar promotions near you with start and end times, cover notes, and how many people marked they're going.",
    Screen: PromoScreen,
    align: "right",
  },
  {
    id: "map",
    tab: "Map",
    title: "Bars nearby, with live context.",
    body: "Open the map for wait times, cover, and crowd level, plus where friends are checked in. Tap a pin for the full bar page.",
    Screen: MapScreen,
    align: "left",
  },
  {
    id: "bar",
    tab: "Bar page",
    title: "Everything for one venue.",
    body: "Follow a bar, read tonight's promos, see recent posts, and check wait, cover, and crowd before you head over.",
    Screen: BarScreen,
    align: "right",
  },
  {
    id: "profile",
    tab: "Profile",
    title: "Your account and crew.",
    body: "Manage friends, favorite and followed bars, groups, and your own posts — the same profile you use across the app.",
    Screen: ProfileScreen,
    align: "left",
  },
];

function AppFeatures() {
  return (
    <Section id="app" tone="sand">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The app</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Five tabs for patrons.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Feed, promotions, map, bar pages, and profile — the same tabs you use
            when you go out.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-28 lg:gap-36">
          {features.map((feature) => (
            <FeatureRow key={feature.id} {...feature} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FeatureRow({
  id,
  tab,
  title,
  body,
  Screen,
  align,
}: FeatureBlock) {
  const textFirst = align === "left";

  return (
    <article
      id={id}
      className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24"
    >
      <div className={textFirst ? "lg:order-1" : "lg:order-2"}>
        <Eyebrow>{tab}</Eyebrow>
        <h3 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
          {title}
        </h3>
        <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted">
          {body}
        </p>
      </div>
      <FeatureMock textFirst={textFirst} Screen={Screen} />
    </article>
  );
}

function FeatureMock({
  textFirst,
  Screen,
}: {
  textFirst: boolean;
  Screen: React.ComponentType;
}) {
  return (
    <div
      className={
        textFirst ? "relative lg:order-2" : "relative lg:order-1"
      }
    >
      <div aria-hidden className="sip-sunset-halo" />
      <PhoneMockup>
        <Screen />
      </PhoneMockup>
    </div>
  );
}

function ForVenues() {
  return (
    <Section id="venues">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>For bars</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              Run promotions. See the numbers.
            </h2>
            <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted">
              {`Bar admins schedule offers, set audience targeting, and review funnel metrics — views, clicks, redemptions, and peak hours — on the same platform patrons use to discover you.`}
            </p>
          </div>
          <div className="relative">
            <div aria-hidden className="sip-sunset-halo" />
            <PhoneMockup>
              <BarAnalyticsScreen />
            </PhoneMockup>
          </div>
        </div>
      </Container>
    </Section>
  );
}

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
          <Eyebrow className="justify-center">Early access</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Join the waitlist
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {`Patrons and venues use the same list while we open markets. We'll email you when Sip is live in your city.`}
          </p>
          <WaitlistForm />
        </div>
      </Container>
    </Section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-hair bg-ivory">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 text-xs text-muted sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl text-ink">Sip</span>
          <span className="text-muted/80">
            Bar promos, map, and feed for patrons · campaigns for venues
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
      <a href="#venues" className="transition-colors hover:text-ink">
        For bars
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
  );
}

function FooterMeta() {
  return (
    <FooterMetaInner>
      <div>{`© ${new Date().getFullYear()} Sip, Inc.`}</div>
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
