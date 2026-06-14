import Link from "next/link";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
};

export function LegalPage({ eyebrow, title, effectiveDate, children }: Props) {
  return (
    <>
      <LegalHeader />
      <main className="relative pt-36 pb-28 sm:pt-44 sm:pb-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[280px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(232,168,69,0.22) 0%, rgba(232,168,69,0) 70%)",
          }}
        />
        <Container className="relative">
          <div className="mx-auto max-w-[720px]">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 text-sm uppercase tracking-[0.22em] text-muted">
              Effective {effectiveDate}
            </p>

            <div className="legal-prose mt-14">{children}</div>

            <div className="mt-20 border-t border-hair pt-10 text-sm text-muted">
              Questions? Email{" "}
              <a
                href="mailto:sam@sipapp.co"
                className="text-cabernet underline-offset-4 hover:underline"
              >
                sam@sipapp.co
              </a>
              .
            </div>
          </div>
        </Container>
      </main>
      <LegalFooter />
    </>
  );
}

function LegalHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <Container className="flex items-center justify-between py-6">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-ink"
        >
          Sip
        </Link>
        <nav className="hidden items-center gap-10 text-sm text-muted md:flex">
          <Link href="/#product" className="transition-colors hover:text-ink">
            Product
          </Link>
          <Link href="/#why" className="transition-colors hover:text-ink">
            Why Sip
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-ink">
            Contact
          </Link>
        </nav>
      </Container>
    </header>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-hair bg-ivory">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 text-xs text-muted sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl text-ink">Sip</span>
          <span className="text-muted/80">— the live map of the night</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-ink">
            Terms
          </Link>
          <Link href="/dmca" className="transition-colors hover:text-ink">
            DMCA
          </Link>
          <a
            href="mailto:sam@sipapp.co"
            className="transition-colors hover:text-ink"
          >
            Contact
          </a>
        </div>
        <div className="text-muted/80">
          © 2026 White Pine Enterprises, LLC
        </div>
      </Container>
    </footer>
  );
}
