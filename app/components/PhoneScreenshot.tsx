import Image from "next/image";
import { cn } from "./cn";

type Props = {
  /** Path under `/public/screens/` — e.g. `promotions.jpg` */
  src: string;
  /** Alt text describing the captured iOS screen state. */
  alt: string;
  /** Optional rotation in degrees for editorial-stack effects. */
  rotate?: number;
  /** Caption rendered just below the device frame (small uppercase). */
  caption?: string;
  /** Marks this mockup as the most prominent (above-the-fold) — bumps to priority loading. */
  priority?: boolean;
  className?: string;
};

/**
 * Phone bezel + real iOS screenshot. Replaces the previous synthetic
 * `Screens.tsx` React mocks so the marketing site displays exactly what
 * users see in the live app — not a recreation that can drift over time.
 *
 * Source images live in `public/screens/` and are JPEG-encoded portrait
 * captures from the Sip iPhone build (aspect ratio 471x1024 ≈ 9:19.5).
 */
export function PhoneScreenshot({
  src,
  alt,
  rotate,
  caption,
  priority = false,
  className,
}: Props) {
  const transform = rotate ? { transform: `rotate(${rotate}deg)` } : undefined;

  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-[300px] aspect-[300/620]",
        className,
      )}
      style={transform}
    >
      <div
        className="size-full rounded-[44px] bg-[#111014] p-[11px]"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(0,0,0,0.6), 0 30px 80px -24px rgba(42,24,27,0.35), 0 14px 40px -16px rgba(90,18,32,0.22)",
        }}
      >
        <div className="relative size-full overflow-hidden rounded-[34px] bg-shell">
          {/* Dynamic Island */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[14px] z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-[16px] bg-black"
          />
          <Image
            src={`/screens/${src}`}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 60vw, 80vw"
            priority={priority}
            className="object-cover object-top"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
