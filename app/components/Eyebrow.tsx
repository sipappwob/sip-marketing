import { cn } from "./cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-ember",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-px w-7 bg-ember/70"
      />
      {children}
    </span>
  );
}
