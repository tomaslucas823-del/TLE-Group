import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
      {/* Header strip */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-3 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-4 sm:py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.16em] text-mute uppercase">
              {isEn ? "Delivery" : "Entrega"}
            </p>
            <h1 className="mt-1 font-display text-[1.35rem] leading-tight font-normal tracking-tight sm:text-[1.6rem]">
              {isEn ? "Studio package samples." : "Amostras do pacote do estúdio."}
            </h1>
          </div>
          <p className="max-w-[16rem] text-[11px] leading-snug text-mute sm:text-right">
            {isEn
              ? "Renders, plans, sections — no client data."
              : "Renders, plantas, cortes — sem dados de clientes."}
          </p>
        </div>
      </section>

      {/* Category switcher */}
      <section className="sticky top-11 z-30 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex min-w-0 flex-1 gap-0 overflow-x-auto scrollbar-none">
            {deliveryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={cn(
                  "relative shrink-0 px-3 py-2.5 text-[12px] transition-colors",
                  active === cat.id ? "text-ink" : "text-mute hover:text-ink",
                )}
              >
                {isEn ? cat.labelEn : cat.label}
                {active === cat.id ? (
                  <span className="absolute inset-x-3 bottom-0 h-px bg-ink" aria-hidden />
                ) : null}
              </button>
            ))}
          </div>
          <p className="hidden shrink-0 text-[10px] tabular-nums text-mute sm:block">
            {category.images.length}
          </p>
        </div>
      </section>

      {/* Catalog grid — hairline gaps */}
      <section className="mx-auto max-w-5xl px-3 py-3 sm:px-4 sm:py-4">
        <p className="mb-2 text-[11px] text-mute">
          {isEn ? category.descriptionEn : category.description}
        </p>

        <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-3">
          {category.images.map((img) => (
            <figure key={img.src} className="group bg-paper">
              <div
                className={cn(
                  "overflow-hidden bg-[#f5f5f3]",
                  category.id === "renders" ? "aspect-[4/3]" : "aspect-[3/2]",
                )}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "h-full w-full transition duration-300 group-hover:opacity-95",
                    category.id === "renders" ? "object-cover" : "object-contain p-1",
                  )}
                />
              </div>
              {img.caption ? (
                <figcaption className="px-2 py-1.5 text-[10px] leading-none tracking-wide text-mute">
                  {img.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 px-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-6">
          <p className="text-[12px] text-mute">
            {isEn
              ? "Same level of detail on your project."
              : "O mesmo nível de detalhe no seu projecto."}
          </p>
          <div className="flex gap-2">
            <Link to="/" hash="contacto" className={cn(buttonVariants(), "!h-9 !px-4 !text-[12px]")}>
              {isEn ? "Request a quote" : "Pedir cotação"}
            </Link>
            <Link
              to="/portfolio"
              className={cn(buttonVariants({ variant: "line" }), "!h-9 !px-4 !text-[12px]")}
            >
              {isEn ? "Projects" : "Projectos"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
