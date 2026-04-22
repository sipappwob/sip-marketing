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
  title: "Sip — Nightlife runs blind. Sip makes it visible.",
  description:
    "Sip is the live map of the night: see where it's busy, where your friends are, and where to go — before you leave the house.",
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
