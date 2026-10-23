import { Link } from "@tanstack/react-router";
import { useI18n } from "@/components/i18n-provider";
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
  const { t } = useI18n();
  const total = estimateCents(draft.area, draft.style, draft.tier);
  const parts = splitPayments(total);
  const paymentLabels = [t.payments.signal, t.payments.executive, t.payments.images];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <div className="space-y-8">
        <label className="block">
          <span className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-mute">{t.estimate.area}</span>
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
          <legend className="text-sm text-mute">{t.estimate.style}</legend>
          <div className="mt-2">
            {STYLES.map((style) => {
              const active = draft.style === style.id;
              const copy = t.styles[style.id];
              return (
                <button
                  key={style.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...draft, style: style.id })}
                  className="flex w-full items-baseline justify-between gap-6 border-b border-line py-3 text-left"
                >
                  <span className={cn("text-sm", active ? "text-ink" : "text-mute")}>{copy.label}</span>
                  <span className={cn("hidden text-sm sm:block", active ? "text-charcoal" : "text-mute")}>
                    {copy.note}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm text-mute">{t.estimate.tier}</legend>
          <div className="mt-2">
            {TIERS.map((tier) => {
              const active = draft.tier === tier.id;
              const copy = t.tiers[tier.id];
              return (
                <button
                  key={tier.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...draft, tier: tier.id })}
                  className="flex w-full items-baseline justify-between gap-6 border-b border-line py-3 text-left"
                >
                  <span className={cn("text-sm", active ? "text-ink" : "text-mute")}>{copy.label}</span>
                  <span className={cn("hidden text-right text-sm sm:block", active ? "text-charcoal" : "text-mute")}>
                    {copy.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
      <aside className="lg:pt-4" aria-live="polite">
        <p className="text-sm text-mute">{t.estimate.ref}</p>
        <p className="mt-3 font-display text-5xl leading-none font-normal md:text-6xl">{brlFromCents(total)}</p>
        <p className="mt-4 max-w-sm text-sm text-mute">{t.estimate.disclaimer}</p>
        <ul className="mt-8 text-sm">
          {parts.map((part, index) => (
            <li key={part.label} className="flex items-baseline justify-between gap-4 border-t border-line py-3">
              <span>
                {paymentLabels[index] ?? part.label}
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
            {t.estimate.handoff}
          </Link>
        ) : (
          <a href="#orcamento" className="mt-8 inline-flex min-h-11 items-center bg-ink px-5 text-sm text-paper">
            {t.estimate.cta}
          </a>
        )}
      </aside>
    </div>
  );
}
