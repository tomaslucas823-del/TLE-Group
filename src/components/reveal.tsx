import { type CSSProperties, type ElementType, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type RevealVariant = "up" | "down" | "left" | "right" | "zoom" | "fade";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number;
  slow?: boolean;
  className?: string;
  once?: boolean;
};

/** Scroll reveal leve — só opacity + deslocamento pequeno. */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "fade",
  delay = 0,
  slow = false,
  className,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-in");
          }
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const style = delay
    ? ({ "--reveal-delay": `${Math.min(delay, 120)}ms` } as CSSProperties)
    : undefined;

  return (
    <Tag
      ref={ref}
      className={cn("reveal", `reveal--${variant}`, slow && "reveal--slow", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}

/** Parallax desligado por desempenho — mantém a API para não quebrar a home. */
export function useHeroParallax(_active: boolean) {
  return useRef<HTMLDivElement | null>(null);
}

// re-export useRef type helper for callers
import { useRef } from "react";
