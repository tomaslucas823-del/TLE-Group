import { useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Short fade between routes — 280ms, no layout jump. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    if (pathname === key) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setKey(pathname);
      setVisible(true);
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => {
      setKey(pathname);
      setVisible(true);
      window.scrollTo(0, 0);
    }, 160);
    return () => window.clearTimeout(t);
  }, [pathname, key]);

  return (
    <div
      className={cn(
        "page-transition",
        visible ? "page-transition--in" : "page-transition--out",
      )}
    >
      {children}
    </div>
  );
}
