import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
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

/** Scroll reveal with smoother easing and more travel distance. */
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const style = delay
    ? ({ "--reveal-delay": `${Math.min(delay, 400)}ms` } as CSSProperties)
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

/** Stagger children reveals by index (wrapper only). */
export function RevealStagger({
  children,
  className,
  step = 70,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} variant="up" delay={i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Hero media parallax: slight translate + scale tied to scroll.
 * Returns a ref to attach to the media layer.
 */
export function useHeroParallax(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = window.innerHeight || 1;
        const t = Math.min(1, Math.max(0, y / h));
        // Move down slowly and scale up as user leaves hero
        node.style.transform = `translate3d(0, ${t * 12}%, 0) scale(${1 + t * 0.08})`;
        node.style.opacity = String(1 - t * 0.45);
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
