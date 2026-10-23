import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/_site/termos")({
  head: () => ({
    meta: [
      { title: "Termos e condições - TLE Arquitetura" },
      {
        name: "description",
        content: "Condições de uso do site e dos serviços de visualização e projeto da TLE Arquitetura.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-20">
      <h1 className="font-display text-5xl font-normal">Termos e condições</h1>
      <p className="mt-4 text-sm text-mute">
        {site.legalName} · NUIT {site.nuit} · {site.city}, {site.country}
      </p>
      <div className="mt-10 space-y-8 text-charcoal">
        <section>
          <h2 className="font-display text-2xl font-semibold">1. Quem somos</h2>
          <p className="mt-3">
            A TLE presta serviços de visualização residencial e apoio a projeto em Moçambique. O
            site apresenta o portefólio, uma estimativa de referência e o pedido de cotação. Os
            dados de contacto no rodapé são os canais oficiais até serem actualizados pelo estúdio.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">2. Uso do site</h2>
          <p className="mt-3">
            Pode navegar, consultar projectos e enviar um pedido de cotação. É proibido usar o site
            para spam, recolha automatizada abusiva, tentativa de acesso indevido ao portal ou
            qualquer uso ilegal. Reservamo-nos o direito de recusar ou interromper acessos que
            prejudiquem o serviço.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">3. Estimativas e propostas</h2>
          <p className="mt-3">
            O simulador e os valores apresentados no site são referências em meticais, não propostas
            fechadas. O valor final depende do terreno, do programa, do prazo e do que for acordado
            por escrito. Só existe compromisso comercial após proposta aceite pelo cliente e pelo
            estúdio.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">4. Conteúdo e imagens</h2>
          <p className="mt-3">
            Textos, desenhos e imagens do site e dos projectos pertencem à TLE ou aos seus titulares.
            Não podem ser copiados, revendidos ou usados em obra de terceiros sem autorização. As
            imagens de estudo ilustram intenções de projecto; a obra real depende de execução,
            materiais e condições do local.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">5. Conta e portal</h2>
          <p className="mt-3">
            O login (por exemplo Google) serve para aceder ao portal do cliente ou à área do
            estúdio. Cada conta vê apenas os registos associados. O utilizador é responsável por
            manter o acesso à conta do provedor de identidade em segurança.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">6. Dados pessoais</h2>
          <p className="mt-3">
            O tratamento de nome, contacto e dados de projecto está descrito na{" "}
            <Link to="/privacidade" className="underline underline-offset-4">
              política de privacidade
            </Link>
            . Ao enviar um pedido ou criar sessão, aceita esse tratamento na medida necessária à
            resposta e ao acompanhamento do trabalho.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">7. Limitação</h2>
          <p className="mt-3">
            O site é disponibilizado tal como está. Não garantimos disponibilidade ininterrupta.
            Na medida permitida pela lei moçambicana aplicável, a TLE não responde por danos
            indirectos decorrentes do uso do site. A relação contratual de projecto rege-se pela
            proposta e documentos assinados, não só por estes termos gerais.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">8. Contacto</h2>
          <p className="mt-3">
            Questões sobre estes termos:{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            . Actualizaremos esta página quando a morada, o NUIT ou os contactos definitivos forem
            confirmados.
          </p>
        </section>
      </div>
    </main>
  );
}
