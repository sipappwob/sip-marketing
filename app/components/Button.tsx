import Link from "next/link";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "quiet";

type BaseProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

type AnchorProps = BaseProps & {
  href: string;
  type?: never;
  onClick?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type Props = AnchorProps | ButtonProps;

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabernet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

const variants: Record<Variant, string> = {
  primary: "sip-btn-primary text-ivory",
  secondary:
    "border border-hair text-ink hover:bg-ink/[0.04] hover:border-ink/25",
  quiet: "text-ink/80 hover:text-ink",
};

export function Button(props: Props) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href) {
    const isExternal = props.href.startsWith("http");
    return (
      <Link
        href={props.href}
        className={classes}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
