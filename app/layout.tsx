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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sipapp.co"
  ),
  title: "Sip — Targeted bar promotions & analytics",
  description:
    "Bars run scheduled, targeted campaigns and read funnel analytics. Patrons see what's live nearby in one app. Private beta in New York.",
};

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
      <body className="min-h-screen bg-ivory text-ink">{children}</body>
    </html>
  );
}
