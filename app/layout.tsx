import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sipapp.co";
const SITE_TITLE = "Sip — Live bar wait times, map, and plans for going out";
const SITE_DESCRIPTION =
  "Sip shows live wait times at every bar near you, reported by people at the door — plus cover, crowd, and where your friends are checked in. Live in New York; Ann Arbor and more cities next.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Sip",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Sip",
  authors: [{ name: "Sip, Inc." }],
  generator: "Next.js",
  keywords: [
    "live bar wait times",
    "bar line app",
    "nightlife app",
    "going out app",
    "bar map",
    "wait time at bar",
    "bar cover charge tonight",
    "NYC bars",
    "New York nightlife",
    "Ann Arbor bars",
    "nightlife discovery",
    "private events bars",
    "bar deals app",
    "friends nightlife app",
    "bar promotions app",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Sip",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Sip — going out, in one app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  category: "lifestyle",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Structured data injected as JSON-LD so search engines can render Sip
 * as a SoftwareApplication with explicit serviceable cities (NYC primary,
 * Ann Arbor next). This drives rich-result eligibility for both organic
 * search and AI overviews / Generative Engine Optimization.
 */
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sip",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    audience: {
      "@type": "PeopleAudience",
      audienceType: "Bar-goers and nightlife patrons",
    },
    featureList: [
      "Live wait times reported by people at the door",
      "Wait, cover, and crowd reports per bar",
      "Map of bars with live status and friend check-ins",
      "Bar pages with recent posts and live stats",
      "Public and private events with RSVP",
      "Groups for your regular crew",
      "Search for bars and people in one input",
      "Bar promotions with real start/end times",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sip",
    url: SITE_URL,
    email: "will@sipapp.co",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "will@sipapp.co",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "security",
        email: "sam@sipapp.co",
        availableLanguage: ["English"],
      },
    ],
    areaServed: [
      { "@type": "City", name: "New York", addressRegion: "NY", addressCountry: "US" },
      { "@type": "City", name: "Ann Arbor", addressRegion: "MI", addressCountry: "US" },
    ],
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sip",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baskerville.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-ivory text-ink">
        <script
          type="application/ld+json"
          // JSON.stringify output is safe in a JSON-LD script tag; no user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
