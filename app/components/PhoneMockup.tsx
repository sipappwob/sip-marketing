import { cn } from "./cn";

type Props = {
  label?: string;
  caption?: string;
  className?: string;
  children?: React.ReactNode;
  /**
   * Subtle rotation in degrees — useful for product-showcase stacks.
   */
  rotate?: number;
};

export function PhoneMockup({
  label = "App preview",
  caption,
  className,
  children,
  rotate,
}: Props) {
  const transform = rotate ? { transform: `rotate(${rotate}deg)` } : undefined;

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[280px] aspect-[280/580]",
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
          <div
            aria-hidden
            className="absolute left-1/2 top-[18px] z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-[16px] bg-black"
          />

          {children ? (
            <div className="relative h-full w-full pt-12">{children}</div>
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-6 pt-12">
              <span className="font-serif text-lg text-ink/60">
                {label}
              </span>
              {caption && (
                <span className="max-w-[180px] text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                  {caption}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
