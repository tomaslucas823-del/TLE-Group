import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { deliveryCategories } from "@/data/delivery";
import { cn } from "@/lib/cn";
import { useI18n } from "@/components/i18n-provider";

export const Route = createFileRoute("/_site/entrega")({
  head: () => ({
    meta: [
      { title: "Entrega — TLE Group" },
      {
        name: "description",
        content:
          "Qualidade da entrega TLE: renderizações, plantas, cortes e elevações. O rigor técnico que acompanha cada proposta.",
      },
    ],
  }),
  component: EntregaPage,
});

function EntregaPage() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [active, setActive] = useState(deliveryCategories[0]?.id ?? "renders");
  const category = deliveryCategories.find((c) => c.id === active) ?? deliveryCategories[0];

  return (
    <main className="pt-11">
      {/* Hero — compact */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-5 md:py-10">
          <Reveal variant="up">
            <p className="text-[11px] font-medium tracking-[0.18em] text-mute uppercase">
              {isEn ? "Delivery quality" : "Qualidade da entrega"}
            </p>
          </Reveal>
          <Reveal variant="up" delay={30}>
            <h1 className="mt-2 max-w-2xl font-display text-[1.85rem] leading-[1.08] font-normal tracking-tight md:text-4xl">
              {isEn
                ? "What leaves the studio with every proposal."
                : "O que sai do estúdio em cada proposta."}
            </h1>
          </Reveal>
          <Reveal variant="up" delay={60}>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-mute md:text-[14px]">
              {isEn
                ? "Renders, floor plans, sections and elevations — samples from real packages, without client data."
                : "Renderizações, plantas baixas, cortes e elevações — amostras de pacotes reais, sem dados de clientes."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tabs — compact sticky */}
      <section className="sticky top-11 z-30 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 md:px-5">
          <div className="flex gap-0.5 overflow-x-auto py-2 scrollbar-none">
            {deliveryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] transition-colors",
                  active === cat.id
                    ? "bg-ink text-paper"
                    : "text-mute hover:bg-stone hover:text-ink",
                )}
              >
                {isEn ? cat.labelEn : cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content — dense grid */}
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-5 md:py-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div className="max-w-xl">
            <h2 className="font-display text-lg font-normal md:text-xl">
              {isEn ? category.labelEn : category.label}
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-mute md:text-[13px]">
              {isEn ? category.descriptionEn : category.description}
            </p>
          </div>
          <p className="text-[11px] tabular-nums text-mute">
            {category.images.length} {isEn ? "pieces" : "peças"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-2.5">
          {category.images.map((img, i) => (
            <Reveal key={img.src} variant="up" delay={Math.min(i * 30, 120)}>
              <figure className="group overflow-hidden border border-line bg-paper">
                <div
                  className={cn(
                    "overflow-hidden bg-[#f7f7f5]",
                    category.id === "renders" ? "aspect-[4/3]" : "aspect-[3/2]",
                  )}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={900}
                    height={675}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "h-full w-full transition duration-400 group-hover:scale-[1.015]",
                      category.id === "renders" ? "object-cover" : "object-contain p-1.5",
                    )}
                  />
                </div>
                {img.caption ? (
                  <figcaption className="border-t border-line px-2.5 py-1.5 text-[11px] leading-snug text-mute">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA — compact */}
      <section className="border-t border-line bg-stone">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-5 md:py-10">
          <div className="max-w-md">
            <h2 className="font-display text-lg font-normal md:text-xl">
              {isEn
                ? "Want this level of detail on your project?"
                : "Quer este nível de detalhe no seu projecto?"}
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-mute md:text-[13px]">
              {isEn
                ? "Area, site and idea. We reply with a reference and the path to the full package."
                : "Metragem, terreno e ideia. Respondemos com referência e o caminho até ao pacote completo."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" hash="contacto" className={cn(buttonVariants())}>
              {isEn ? "Request a quote" : "Pedir cotação"}
            </Link>
            <Link to="/portfolio" className={cn(buttonVariants({ variant: "line" }))}>
              {isEn ? "View projects" : "Ver projectos"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
