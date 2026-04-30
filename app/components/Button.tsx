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
  disabled?: boolean;
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
    const href = props.href;
    const isHttp = href.startsWith("http://") || href.startsWith("https://");
    const isSpecialScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href) && !isHttp;

    // `next/link` should not be used for mailto:/tel:/sms:/etc.
    if (isSpecialScheme) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer">
          {children}
        </a>
      );
    }

    const isExternal = isHttp;
    return (
      <Link
        href={href}
        className={classes}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className={cn(
        classes,
        buttonProps.disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}
