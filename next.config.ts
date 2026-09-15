import type { NextConfig } from "next";

/**
 * Firebase Hosting (links.sipapp.co) owns the deep-link surface: the event /
 * group / profile / referral landing pages and the Universal Links
 * association file. The iOS app only ever mints links.sipapp.co URLs, but
 * Sip.entitlements claims sipapp.co as well — and this Vercel app answered 404
 * for all of it, so apex links showed an "invalid webpage" error and iOS could
 * never verify the association.
 *
 * These proxy the apex through to Firebase rather than redirecting, because
 * iOS refuses to follow redirects when fetching apple-app-site-association.
 */
const LINKS_ORIGIN = "https://links.sipapp.co";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/.well-known/apple-app-site-association",
          destination: `${LINKS_ORIGIN}/.well-known/apple-app-site-association`,
        },
        {
          source: "/.well-known/assetlinks.json",
          destination: `${LINKS_ORIGIN}/.well-known/assetlinks.json`,
        },
        { source: "/e/:path*", destination: `${LINKS_ORIGIN}/e/:path*` },
        { source: "/g/:path*", destination: `${LINKS_ORIGIN}/g/:path*` },
        { source: "/r/:path*", destination: `${LINKS_ORIGIN}/r/:path*` },
        { source: "/u/:path*", destination: `${LINKS_ORIGIN}/u/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
