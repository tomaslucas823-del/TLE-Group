import { useEffect, useState, type ReactNode } from "react";
import { AccessPanel } from "@/components/access-panel";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function SessionGate({
  children,
  title,
  callbackURL,
}: {
  children: ReactNode;
  title: string;
  callbackURL: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { user, isPending } = useCurrentUserState();

  useEffect(() => setMounted(true), []);

  if (!mounted || isPending) {
    return (
      <div className="mx-auto max-w-6xl px-5 pt-28 pb-16">
        <div className="h-8 w-40 animate-pulse bg-stone" />
        <div className="mt-6 h-64 animate-pulse bg-stone" />
      </div>
    );
  }

  if (!user) return <AccessPanel title={title} callbackURL={callbackURL} />;
  return <>{children}</>;
}
