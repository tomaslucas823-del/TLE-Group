import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Studio cursor: thin ring that grows over project media.
 * Desktop only; hidden when reduced motion or touch.
 */
export function StudioCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("Ver");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setActive(true);
    document.documentElement.classList.add("has-studio-cursor");

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (el) {
        setHovering(true);
        setLabel(el.dataset.cursor || "Ver");
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-studio-cursor");
    };
  }, []);

  if (!active) return null;

  return (
    <div
      className={cn("studio-cursor", hovering && "studio-cursor--hover")}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden
    >
      <span className="studio-cursor__ring" />
      <span className="studio-cursor__label">{label}</span>
    </div>
  );
}
