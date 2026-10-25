import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { deliveryCategories } from "@/data/delivery";
import { cn } from "@/lib/cn";
import { useI18n } from "@/components/i18n-provider";

export const Route = createFileRoute("/_site/entrega")({
  head: () => ({
    meta: [
      { title: "Entrega - TLE Group" },
      {
        name: "description",
        content:
          "Qualidade da entrega TLE: renderizações, plantas, cortes e elevações.",
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
      {/* Header + tabs as one block */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[980px] px-4 pt-8 pb-5 md:pt-10 md:pb-6">
          <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">
            {isEn ? "Delivery" : "Entrega"}
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
            {isEn ? "Studio package samples" : "Amostras do pacote do estúdio"}
          </h1>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-mute">
            {isEn
              ? "Renders, plans and sections. No client data."
              : "Renders, plantas e cortes. Sem dados de clientes."}
          </p>

          <div className="mt-6 flex gap-0 overflow-x-auto scrollbar-none">
            {deliveryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={cn(
                  "relative shrink-0 px-3.5 py-2 text-[13px] transition-colors",
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
        </div>
      </section>

      {/* Catalog grid */}
      <section className="mx-auto max-w-[980px] px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
          {category.images.map((img) => (
            <figure key={img.src} className="group">
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
                    category.id === "renders" ? "object-cover" : "object-contain p-1.5",
                  )}
                />
              </div>
              {img.caption ? (
                <figcaption className="mt-1.5 text-[12px] text-mute">{img.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-stone">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="max-w-sm">
            <h2 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] md:text-[1.25rem]">
              {isEn
                ? "Same level of detail on your project"
                : "O mesmo nível de detalhe no seu projecto"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" hash="contacto" className={cn(buttonVariants())}>
              {isEn ? "Request a quote" : "Pedir cotação"}
            </Link>
            <Link to="/portfolio" className={cn(buttonVariants({ variant: "line" }))}>
              {isEn ? "Projects" : "Projectos"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
