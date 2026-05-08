import type { Metadata } from "next";
import "./globals.css";
import { AuthPersistence } from "@/components/AuthPersistence";

export const metadata: Metadata = {
  title: "Sip Bar Admin",
  description: "Bar analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthPersistence />
        {children}
      </body>
    </html>
  );
}
