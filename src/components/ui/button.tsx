import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "quiet" | "night";
  size?: "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[transform,background-color,color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50",
        size === "lg" && "min-h-12 rounded-xl px-6 text-base",
        size === "md" && "min-h-11 rounded-lg px-4 text-[0.95rem]",
        size === "icon" && "size-11 rounded-full",
        variant === "primary" && "bg-moss text-paper hover:bg-moss-2",
        variant === "ghost" && "border border-line bg-paper text-ink hover:bg-paper-2",
        variant === "quiet" && "text-muted hover:text-ink",
        variant === "night" && "bg-paper/10 text-paper hover:bg-paper/16",
        className,
      )}
      {...props}
    />
  );
}
