import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#dcebea] bg-white shadow-[0_18px_48px_rgba(18,51,63,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
