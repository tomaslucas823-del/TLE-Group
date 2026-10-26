import { createFileRoute } from "@tanstack/react-router";
import { requireSessionOrRedirect } from "@/lib/auth/require-session";
import { useCallback, useEffect, useState } from "react";
import { SessionGate } from "@/components/session-gate";
import { StudioDesk } from "@/components/studio-desk";
import { clearLocalLeads, readLocalLeads } from "@/lib/local-leads";
import { importLocalLeads, loadStudio, type StudioData } from "@/lib/studio.functions";

export const Route = createFileRoute("/_site/estudio")({
  beforeLoad: () => requireSessionOrRedirect("/estudio"),
  head: () => ({
    meta: [
      { title: "Estúdio - TLE Group" },
      { name: "description", content: "CRM, propostas, agenda e parcelas da TLE Group." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EstudioPage,
});

function EstudioPage() {
  return (
    <SessionGate title="Área do estúdio" callbackURL="/estudio">
      <Desk />
    </SessionGate>
  );
}

function Desk() {
  const [data, setData] = useState<StudioData | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const next = await loadStudio();
    setData(next);
  }, []);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const local = readLocalLeads();
        if (local.length) {
          await importLocalLeads({ data: local });
          clearLocalLeads();
        }
        const next = await loadStudio();
        if (live) setData(next);
      } catch (caught) {
        if (live) setError(caught instanceof Error ? caught.message : "Não foi possível abrir o estúdio.");
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-5 pt-28 pb-20">
      <h1 className="font-display text-5xl font-normal">Mesa</h1>
      <p className="mt-3 max-w-xl text-mute">
        Leads, clientes, agenda e propostas desta conta. As parcelas registam M-Pesa, e-Mola, cartão
        ou transferência em meticais — a cobrança real entra quando o gateway estiver ligado.
      </p>
      {error ? <p className="mt-6 text-sm text-timber-deep">{error}</p> : null}
      {data ? <div className="mt-8"><StudioDesk data={data} onChange={() => void reload()} /></div> : null}
      {!data && !error ? <div className="mt-8 h-64 animate-pulse bg-stone" /> : null}
    </main>
  );
}
