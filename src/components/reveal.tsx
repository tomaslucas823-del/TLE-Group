import { type CSSProperties, type ElementType, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type RevealVariant = "up" | "down" | "left" | "right" | "zoom" | "fade";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger delay in ms */
  delay?: number;
  /** Slower timing — matches Elementor animated-slow */
  slow?: boolean;
  className?: string;
  /** Once visible, stay visible (default true) */
  once?: boolean;
};

/**
 * Scroll reveal — Elementor-style fadeIn / slideInLeft|Right / zoomIn / fadeInDown
 * as used on casaseconomicas.pt. IntersectionObserver + prefers-reduced-motion.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
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
      className={cn("reveal", `reveal--${variant}`, slow && "reveal--slow", className)}
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
        const shift = Math.min(y * 0.32, 160);
        node.style.transform = `translate3d(0, ${shift}px, 0) scale(1.1)`;
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
