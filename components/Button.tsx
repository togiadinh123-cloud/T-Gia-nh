import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ff6f61] text-white shadow-[0_12px_28px_rgba(255,111,97,0.28)] hover:bg-[#f45f54] active:translate-y-0.5",
  secondary:
    "border border-[#d8e5e4] bg-white text-[#12333f] shadow-sm hover:border-[#9fc9c6] hover:bg-[#f5fbfa] active:translate-y-0.5",
  ghost: "text-[#47626c] hover:bg-[#eaf5f3] active:translate-y-0.5",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className = "",
) {
  return `inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-extrabold tracking-normal transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e9f91] ${variants[variant]} ${className}`;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonClassName(variant, className)} disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55 disabled:shadow-none`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
