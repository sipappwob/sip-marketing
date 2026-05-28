import { Container } from "./Container";
import { ScrollReveal } from "./ScrollReveal";

/**
 * One-line bar-operator teaser placed just above the footer. Replaces
 * the previous full-width "For venues" section — the consumer story
 * leads, and bar operators get a quiet, direct contact line.
 */
export function BarTeaser() {
  return (
    <section
      id="venues"
      className="border-t border-hair/60 bg-gradient-to-b from-ivory to-sand/40 py-20"
    >
      <Container>
        <ScrollReveal variant="rise" className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-ember">
            <span aria-hidden className="inline-block h-px w-7 bg-ember/70" />
            For bar operators
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-[40px]">
            Running a bar? We&rsquo;re talking to a small group of operators.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            Publish tonight&rsquo;s deal, schedule the time window it runs, and
            see the numbers behind it &mdash; who saw it, who clicked, peak
            hours &mdash; on the same platform patrons use to find you.
          </p>
          <p className="mt-8 text-sm text-muted">
            Reach out:{" "}
            <a
              href="mailto:will@sipapp.co?subject=Sip%20for%20bars"
              className="text-cabernet underline decoration-cabernet/40 underline-offset-4 transition-colors hover:decoration-cabernet"
            >
              will@sipapp.co
            </a>
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
