import { useEffect } from "react";

/**
 * Lightweight inertia scroll (no Lenis dependency).
 * Respects prefers-reduced-motion and touch devices (native scroll stays).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let running = false;

    const ease = 0.12;

    const tick = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.35) {
        current = target;
        running = false;
        window.scrollTo(0, current);
        return;
      }
      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      e.preventDefault();
      target = Math.max(
        0,
        Math.min(
          target + e.deltaY,
          document.documentElement.scrollHeight - window.innerHeight,
        ),
      );
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (!keys.includes(e.key)) return;
      // Let native handle keys; sync target after
      requestAnimationFrame(() => {
        target = window.scrollY;
        current = window.scrollY;
      });
    };

    const onScrollUser = () => {
      // If user dragged scrollbar, resync
      if (!running) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScrollUser, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollUser);
    };
  }, []);

  return null;
}
