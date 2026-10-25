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
    <main className="pt-12">
      {/* Hero */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
          <Reveal variant="up">
            <p className="text-[12px] font-medium tracking-[0.2em] text-mute uppercase">
              {isEn ? "Delivery quality" : "Qualidade da entrega"}
            </p>
          </Reveal>
          <Reveal variant="up" delay={40}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-normal tracking-tight md:text-6xl">
              {isEn
                ? "What leaves the studio with every proposal."
                : "O que sai do estúdio em cada proposta."}
            </h1>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mute md:text-base">
              {isEn
                ? "Renders, dimensioned plans, sections and elevations. Samples from real TLE packages — without client data."
                : "Renderizações, plantas cotadas, cortes e elevações. Amostras de pacotes reais da TLE — sem dados de clientes."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-line bg-paper sticky top-11 z-30">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {deliveryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[13px] transition-colors",
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

      {/* Content */}
      <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <Reveal key={category.id} variant="up">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-2xl font-normal md:text-3xl">
              {isEn ? category.labelEn : category.label}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">
              {isEn ? category.descriptionEn : category.description}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {category.images.map((img, i) => (
            <Reveal key={img.src} variant="up" delay={i * 50}>
              <figure className="group overflow-hidden border border-line bg-stone">
                <div className="aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.01]"
                  />
                </div>
                {img.caption ? (
                  <figcaption className="border-t border-line px-4 py-3 text-[13px] text-mute">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-stone">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-lg">
            <h2 className="font-display text-2xl font-normal md:text-3xl">
              {isEn
                ? "Want this level of detail on your project?"
                : "Quer este nível de detalhe no seu projecto?"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mute md:text-[15px]">
              {isEn
                ? "Tell us the area, the site and the idea. We reply with a reference and the path to the full package."
                : "Indique a metragem, o terreno e a ideia. Respondemos com uma referência e o caminho até ao pacote completo."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
