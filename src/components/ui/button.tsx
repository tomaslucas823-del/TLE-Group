import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "btn btn-shine inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm tracking-normal disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-solid",
        line: "btn-outline-ink",
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
