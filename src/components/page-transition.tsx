import { useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";

/** Fade-in curto ao mudar de rota. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="page-transition page-transition--in">
      {children}
    </div>
  );
}
