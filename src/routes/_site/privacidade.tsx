import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/_site/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — TLE Arquitetura" },
      {
        name: "description",
        content: "Como a TLE trata nome, contacto e dados de projeto.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-20">
      <h1 className="font-display text-5xl font-normal">Privacidade</h1>
      <p className="mt-4 text-sm text-mute">
        {site.legalName} · NUIT {site.nuit} · {site.city}, {site.country}
      </p>
      <div className="mt-10 space-y-8 text-charcoal">
        <section>
          <h2 className="font-display text-2xl font-semibold">O que coletamos</h2>
          <p className="mt-3">
            Nome, e-mail, telefone, metragem e a mensagem do pedido de cotação. Na área com sessão,
            também guardamos clientes, propostas, parcelas e o estado das imagens aprovadas. A conta
            de acesso é a do provedor escolhido no login — não armazenamos a senha desse provedor.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">Para que serve</h2>
          <p className="mt-3">
            Responder o pedido, montar a proposta, acompanhar o projeto e registrar reuniões. Não
            vendemos esses dados. O acesso de cada conta fica limitado aos registros dela.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">Cookies</h2>
          <p className="mt-3">
            O banner desta página pede consentimento antes de qualquer medição. Sem o identificador
            do Google Analytics preenchido no estúdio, nenhum script de medição é carregado. A
            sessão de login usa um cookie estrito do próprio site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">Seus direitos</h2>
          <p className="mt-3">
            Pode pedir acesso, correção ou eliminação dos seus dados pelo e-mail {site.email}. O
            NUIT, o telefone, a morada e as redes publicados no rodapé são provisórios até o estúdio
            os substituir.
          </p>
        </section>
      </div>
    </main>
  );
}
