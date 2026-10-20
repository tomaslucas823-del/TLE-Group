import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm tracking-normal transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-charcoal",
        line: "border border-ink/20 bg-transparent text-ink hover:border-ink",
        glass: "border-b border-paper/70 bg-transparent px-0 text-paper hover:border-paper",
        quiet: "bg-transparent px-0 text-ink underline-offset-4 hover:underline",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}
