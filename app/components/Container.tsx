import { cn } from "./cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1120px] px-6 sm:px-10 lg:px-14",
        className,
      )}
    >
      {children}
    </div>
  );
}
