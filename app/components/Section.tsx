import { cn } from "./cn";

type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "sand";
};

export function Section({ id, children, className, tone = "default" }: Props) {
  return (
    <section
      id={id}
      className={cn(
        "py-24 sm:py-32 lg:py-44",
        tone === "sand" && "bg-sand",
        className,
      )}
    >
      {children}
    </section>
  );
}
