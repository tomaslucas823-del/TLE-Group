import { type CSSProperties, type ElementType, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type RevealVariant = "up" | "left" | "right" | "zoom" | "fade";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger delay in ms */
  delay?: number;
  className?: string;
  /** Once visible, stay visible (default true) */
  once?: boolean;
};

/**
 * Scroll reveal — equivalent to Elementor fadeIn / slideIn / zoomIn on casaseconomicas.pt.
 * Uses IntersectionObserver; respects prefers-reduced-motion via CSS.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined;

  return (
    <Tag
      ref={ref}
      className={cn("reveal", `reveal--${variant}`, className)}
      style={style}
    >
      {children}
    </Tag>
  );
}

/** Soft parallax on a full-bleed media layer (hero background). */
export function useHeroParallax(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Cap so it never leaves the section awkwardly
        const shift = Math.min(y * 0.28, 140);
        node.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active]);

  return ref;
}
