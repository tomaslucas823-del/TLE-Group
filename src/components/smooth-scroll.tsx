import { useEffect } from "react";

/**
 * Lightweight inertia scroll inspired by Lenis (no dependency).
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

    // Softer than before - closer to Lenis default feel
    const ease = 0.085;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const tick = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.4) {
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
      // Nested scrollable areas keep native behavior
      const path = e.composedPath?.() ?? [];
      for (const node of path) {
        if (!(node instanceof HTMLElement)) continue;
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 1) {
          return;
        }
      }
      e.preventDefault();
      target = Math.max(0, Math.min(target + e.deltaY, maxScroll()));
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (!keys.includes(e.key)) return;
      requestAnimationFrame(() => {
        target = window.scrollY;
        current = window.scrollY;
      });
    };

    const onScrollUser = () => {
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
