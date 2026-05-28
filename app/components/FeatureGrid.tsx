import { ScrollReveal } from "./ScrollReveal";

type Capability = {
  title: string;
  body: string;
};

/**
 * Every-capability grid. Lives below the 5 marquee feature rows so we
 * cover the full app surface (groups, friends, wait reports, line photos,
 * cover/crowd, RSVP, favorites, etc.) without forcing each one into its
 * own scroll-stop.
 *
 * Visual treatment: each subtitle sits inside an outlined "bubble" pill
 * with a small ember dot — gives the section structural rhythm so the
 * eye can scan the grid as a list of badges rather than a wall of prose.
 * Body copy is intentionally one-line tight (≤ 14 words each).
 */

const capabilities: Capability[] = [
  {
    title: "Cover charge",
    body: "Live cover (or no cover) reported at the door.",
  },
  {
    title: "Crowd level",
    body: "Five-step crowdedness, reported by people inside.",
  },
  {
    title: "Groups",
    body: "Standing chats for your crew — not a new text thread.",
  },
  {
    title: "Friend requests",
    body: "Add, accept, or cancel pending — all one tap.",
  },
  {
    title: "Follow + favorite",
    body: "Follow venues. Pin three favorites on the map.",
  },
  {
    title: "Friend pins on the map",
    body: "Friends show up where they're checked in.",
  },
  {
    title: "Snap the door",
    body: "Optional line photo, timestamped for proof.",
  },
  {
    title: "Sign in your way",
    body: "Apple, Google, or email. Real name shown only to friends.",
  },
  {
    title: "Privacy by default",
    body: "Location only while the app is open. Hide any time.",
  },
];

const trailingCapability: Capability = {
  title: "More cities next",
  body: "NYC is live. Ann Arbor is up next.",
};

export function FeatureGrid() {
  return (
    <>
      <ul className="mt-14 grid list-none gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
        {capabilities.map((c, i) => (
          <ScrollReveal
            key={c.title}
            variant="rise"
            delay={Math.min(i * 0.04, 0.28)}
            as="li"
            className="list-none"
          >
            <div className="group">
              <span className="inline-flex items-center gap-2 rounded-full border border-cabernet/20 bg-shell/70 px-3.5 py-1.5 transition-colors group-hover:border-cabernet/45 group-hover:bg-shell">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_0_rgba(212,102,43,0.55)]"
                />
                <span className="font-serif text-[14px] leading-none text-cabernet">
                  {c.title}
                </span>
              </span>
              <p className="mt-4 text-[15px] leading-snug text-muted">
                {c.body}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </ul>

      <ScrollReveal
        variant="rise"
        delay={0.1}
        className="mt-14 flex flex-col items-center gap-3 border-t border-cabernet/10 pt-10 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-left"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-cabernet/20 bg-shell/70 px-3.5 py-1.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_0_rgba(212,102,43,0.55)]"
          />
          <span className="font-serif text-[14px] leading-none text-cabernet">
            {trailingCapability.title}
          </span>
        </span>
        <p className="text-[15px] leading-snug text-muted">
          {trailingCapability.body}
        </p>
      </ScrollReveal>
    </>
  );
}
