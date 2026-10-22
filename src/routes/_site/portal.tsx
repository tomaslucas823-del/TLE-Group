import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ClientPortal } from "@/components/client-portal";
import { SessionGate } from "@/components/session-gate";
import { loadPortal, type StudioData } from "@/lib/studio.functions";

export const Route = createFileRoute("/_site/portal")({
  head: () => ({
    meta: [
      { title: "Portal do cliente — TLE Arquitetura" },
      { name: "description", content: "Acompanhe etapas, aprove imagens e baixe a proposta." },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  return (
    <SessionGate title="Portal do cliente" callbackURL="/portal">
      <PortalBody />
    </SessionGate>
  );
}

function PortalBody() {
  const [data, setData] = useState<StudioData | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setData(await loadPortal());
  }, []);

  useEffect(() => {
    let live = true;
    loadPortal()
      .then((next) => {
        if (live) setData(next);
      })
      .catch((caught: unknown) => {
        if (live) setError(caught instanceof Error ? caught.message : "Não foi possível abrir o portal.");
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-5 pt-28 pb-20">
      {error ? <p className="text-sm text-timber-deep">{error}</p> : null}
      {data ? <ClientPortal data={data} onChange={() => void reload()} /> : null}
      {!data && !error ? <div className="h-64 animate-pulse bg-stone" /> : null}
    </main>
  );
}
