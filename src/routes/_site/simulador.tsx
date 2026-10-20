import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Simulator, type Draft } from "@/components/simulator";

export const Route = createFileRoute("/_site/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador — TLE Arquitetura" },
      {
        name: "description",
        content: "Estime um estudo residencial pela metragem, pelo partido e pelo tipo de entrega.",
      },
    ],
  }),
  component: SimulatorPage,
});

function SimulatorPage() {
  const [draft, setDraft] = useState<Draft>({ area: 180, style: "pedra", tier: "estudo" });

  return (
    <main className="mx-auto max-w-6xl px-5 pt-28 pb-20">
      <h1 className="max-w-2xl font-display text-5xl leading-none font-normal md:text-6xl">
        Área, partido, entrega.
      </h1>
      <p className="mt-4 max-w-xl text-mute">
        A divisão em sinal, projeto executivo e imagens finais segue o cronograma do estúdio. Leve
        a estimativa para o pedido de orçamento.
      </p>
      <div className="mt-12">
        <Simulator draft={draft} onChange={setDraft} showHandoff />
      </div>
    </main>
  );
}
