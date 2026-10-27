import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/_site/termos")({
  head: () => ({
    meta: [
      { title: "Termos e condições - TLE Group" },
      {
        name: "description",
        content: "Condições de uso do site e dos serviços da TLE Group — Total Link Engenharia & Construções.",
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
        {site.legalName} · {site.city}, {site.country}
      </p>
      <div className="mt-10 space-y-8 text-charcoal">
        <section>
          <h2 className="font-display text-2xl font-semibold">1. Quem somos</h2>
          <p className="mt-3">
            A TLE Group (Total Link Engenharia & Construções) presta soluções técnicas nas áreas de
            construção civil em Moçambique. O site apresenta projectos, dicas de construção e o
            pedido de contacto. Os canais oficiais incluem o telefone {site.phoneDisplay} (WhatsApp e
            e-Mola).
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">2. Uso do site</h2>
          <p className="mt-3">
            Pode navegar, consultar projectos e enviar um pedido. É proibido usar o site para spam,
            recolha automatizada abusiva, tentativa de acesso indevido ao portal ou qualquer uso
            ilegal.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">3. Estimativas e propostas</h2>
          <p className="mt-3">
            Os valores apresentados no site são referências em meticais, não propostas fechadas. O
            valor final depende do terreno, do programa, do prazo e do que for acordado por escrito.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">4. Pagamentos móveis</h2>
          <p className="mt-3">
            M-Pesa e e-Mola podem ser usados como meio de pagamento quando indicado na proposta. O
            registo no portal é controlo interno; a cobrança real no operador só ocorre conforme
            instruções da TLE Group.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">5. Conta e portal</h2>
          <p className="mt-3">
            O login serve para aceder ao portal do cliente ou à área do estúdio. Cada conta vê apenas
            os registos associados.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">6. Dados pessoais</h2>
          <p className="mt-3">
            O tratamento de dados está descrito na{" "}
            <Link to="/privacidade" className="underline underline-offset-4">
              política de privacidade
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">7. Contacto</h2>
          <p className="mt-3">
            {site.phoneDisplay} ·{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            · {site.city}, {site.country}
          </p>
        </section>
      </div>
    </main>
  );
}
