import { Link } from "@tanstack/react-router";
import { STYLES, TIERS, estimateCents, splitPayments, type StyleId, type TierId } from "@/lib/estimate";
import { brlFromCents } from "@/lib/format";
import { cn } from "@/lib/cn";

export type Draft = { area: number; style: StyleId; tier: TierId };

export function Simulator({
  draft,
  onChange,
  showHandoff = false,
}: {
  draft: Draft;
  onChange: (next: Draft) => void;
  showHandoff?: boolean;
}) {
  const total = estimateCents(draft.area, draft.style, draft.tier);
  const parts = splitPayments(total);

  return (
    <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
      <div className="space-y-10">
        <label className="block">
          <span className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-mute">Metragem</span>
            <span className="font-display text-4xl leading-none font-normal">{draft.area} m²</span>
          </span>
          <input
            id="metragem"
            type="range"
            min={40}
            max={800}
            step={10}
            value={draft.area}
            onChange={(event) => onChange({ ...draft, area: Number(event.target.value) })}
            className="meter mt-6 w-full"
            suppressHydrationWarning
          />
        </label>
        <fieldset>
          <legend className="text-sm text-mute">Partido</legend>
          <div className="mt-2">
            {STYLES.map((style) => {
              const active = draft.style === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...draft, style: style.id })}
                  className="flex w-full items-baseline justify-between gap-6 border-b border-line py-3 text-left"
                >
                  <span className={cn("text-sm", active ? "text-ink" : "text-mute")}>{style.label}</span>
                  <span className={cn("hidden text-sm sm:block", active ? "text-charcoal" : "text-mute")}>
                    {style.note}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm text-mute">Entrega</legend>
          <div className="mt-2">
            {TIERS.map((tier) => {
              const active = draft.tier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...draft, tier: tier.id })}
                  className="flex w-full items-baseline justify-between gap-6 border-b border-line py-3 text-left"
                >
                  <span className={cn("text-sm", active ? "text-ink" : "text-mute")}>{tier.label}</span>
                  <span className={cn("hidden text-right text-sm sm:block", active ? "text-charcoal" : "text-mute")}>
                    {tier.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
      <aside className="lg:pt-8" aria-live="polite">
        <p className="text-sm text-mute">Referência, em meticais</p>
        <p className="mt-3 font-display text-5xl leading-none font-normal md:text-6xl">{brlFromCents(total)}</p>
        <p className="mt-4 max-w-sm text-sm text-mute">
          Não é proposta fechada. Terreno, programa e prazo ainda ajustam o valor.
        </p>
        <ul className="mt-8 text-sm">
          {parts.map((part) => (
            <li key={part.label} className="flex items-baseline justify-between gap-4 border-t border-line py-3">
              <span>
                {part.label}
                <span className="text-mute"> · {part.percent}%</span>
              </span>
              <span>{brlFromCents(part.amountCents)}</span>
            </li>
          ))}
        </ul>
        {showHandoff ? (
          <Link
            to="/"
            hash="orcamento"
            search={{ area: draft.area, estilo: draft.style, entrega: draft.tier }}
            className="mt-8 inline-flex min-h-11 items-center bg-ink px-5 text-sm text-paper"
          >
            Levar ao pedido
          </Link>
        ) : (
          <a href="#orcamento" className="mt-8 inline-flex min-h-11 items-center bg-ink px-5 text-sm text-paper">
            Pedir com esta estimativa
          </a>
        )}
      </aside>
    </div>
  );
}
