import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import type { Draft } from "@/components/simulator";
import { STYLES, TIERS, clampArea, estimateCents, type StyleId, type TierId } from "@/lib/estimate";
import { mznFromCents } from "@/lib/format";
import { site } from "@/lib/site";
import { getCaptchaChallenge, submitPublicLead } from "@/lib/studio.functions";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type FieldErrors = {
  nome?: string;
  email?: string;
  telefone?: string;
  captcha?: string;
};

type Challenge = {
  token: string;
  question: string;
  turnstileSiteKey?: string;
};

const defaultDraft: Draft = { area: 180, style: "pedra", tier: "estudo" };

const DELIVERY_WEEKS: Record<TierId, { min: number; max: number }> = {
  estudo: { min: 2, max: 3 },
  executivo: { min: 5, max: 7 },
  completo: { min: 8, max: 12 },
};

export function QuoteForm({ draft: initialDraft }: { draft?: Draft }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<Draft>(initialDraft ?? defaultDraft);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [company, setCompany] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<"cloud" | null>(null);

  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const total = estimateCents(draft.area, draft.style, draft.tier);
  const styleLabel = t.styles[draft.style].label;
  const tierLabel = t.tiers[draft.tier].label;
  const weeks = DELIVERY_WEEKS[draft.tier];
  const prazo =
    weeks.min === weeks.max
      ? `${weeks.min} ${t.quote.weeks}`
      : `${weeks.min}–${weeks.max} ${t.quote.weeks}`;
  const totalLabel = mznFromCents(total);

  async function loadChallenge() {
    try {
      const next = await getCaptchaChallenge();
      setChallenge(next);
      setCaptchaAnswer("");
      setTurnstileToken("");
    } catch {
      setChallenge(null);
    }
  }

  useEffect(() => {
    void loadChallenge();
  }, []);

  useEffect(() => {
    const siteKey = challenge?.turnstileSiteKey;
    if (!siteKey || !turnstileRef.current) return;

    function renderWidget() {
      if (!turnstileRef.current || !siteKey || !window.turnstile) return;
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: "auto",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }

    const existing = document.getElementById("cf-turnstile-script");
    if (window.turnstile) {
      renderWidget();
      return;
    }
    if (existing) {
      existing.addEventListener("load", renderWidget);
      return () => existing.removeEventListener("load", renderWidget);
    }

    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => renderWidget();
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, [challenge?.turnstileSiteKey]);

  function validate(
    nomeVal: string,
    emailVal: string,
    telefoneVal: string,
    answer: string,
  ): FieldErrors {
    const next: FieldErrors = {};
    if (nomeVal.trim().length < 2) next.nome = t.quote.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim())) next.email = t.quote.errEmail;
    const digits = telefoneVal.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 13) next.telefone = t.quote.errPhone;
    if (!answer.trim()) next.captcha = t.quote.errCaptcha;
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    const next = validate(nome, email, telefone, captchaAnswer);
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!challenge?.token) {
      setFormError(t.quote.errSubmit);
      void loadChallenge();
      return;
    }
    if (challenge.turnstileSiteKey && !turnstileToken) {
      setFormError(t.quote.errCaptcha);
      return;
    }

    setPending(true);
    try {
      await submitPublicLead({
        data: {
          name: nome.trim(),
          email: email.trim(),
          phone: telefone.trim(),
          areaM2: draft.area,
          style: draft.style,
          complexity: draft.tier,
          message: mensagem.trim(),
          company: company.trim(),
          captchaToken: challenge.token,
          captchaAnswer: captchaAnswer.trim(),
          turnstileToken,
        },
      });
      setResult("cloud");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      setFormError(message || t.quote.errSubmit);
      void loadChallenge();
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
      setTurnstileToken("");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    const waText = [
      `Olá, TLE Group. Já enviei cotação pelo site.`,
      `Nome: ${nome.trim()}`,
      `Tel: ${telefone.trim()}`,
      `${draft.area} m² · ${styleLabel} · ${tierLabel}`,
      totalLabel,
    ].join("\n");
    const waUrl = site.phoneWa
      ? `https://wa.me/${site.phoneWa}?text=${encodeURIComponent(waText)}`
      : "";

    return (
      <div role="status" className="rounded-2xl border border-line bg-stone/40 px-6 py-8">
        <p className="font-display text-[1.5rem] font-semibold tracking-[-0.03em]">{t.quote.received}</p>
        <p className="mt-2 text-[14px] leading-relaxed text-mute">{t.quote.receivedCloud}</p>
        <div className="mt-6 space-y-1 border-t border-line pt-5 text-[13px] text-mute">
          <p className="text-[1.15rem] font-medium text-ink">{totalLabel}</p>
          <p>
            {draft.area} m² · {styleLabel} · {tierLabel}
          </p>
          <p>
            {t.quote.delivery}: {prazo}
          </p>
        </div>
        {waUrl ? (
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-cta btn-cta--dark mt-6 inline-flex">
            {t.quote.sendWhatsApp}
            <span className="btn-cta__icon" aria-hidden>
              →
            </span>
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa">Company</label>
        <input
          id="empresa"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="rounded-2xl border border-line px-5 py-5">
        <div className="space-y-5">
          <label className="block text-[11px] font-medium tracking-[0.04em] text-mute uppercase" htmlFor="area">
            {t.estimate.area}
            <div className="mt-2 flex max-w-[10rem] items-baseline gap-1.5">
              <input
                id="area"
                type="number"
                min={40}
                max={800}
                step={10}
                value={draft.area}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, area: clampArea(Number(e.target.value)) }))
                }
                className="field w-full text-[15px]"
                suppressHydrationWarning
              />
              <span className="shrink-0 text-[13px] text-mute">m²</span>
            </div>
          </label>

          <fieldset className="min-w-0 border-0 p-0">
            <legend className="text-[11px] font-medium tracking-[0.04em] text-mute uppercase">
              {t.estimate.tier}
            </legend>
            <div className="choice-grid" role="radiogroup" aria-label={t.estimate.tier}>
              {TIERS.map((tier) => {
                const active = draft.tier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`choice-chip${active ? " choice-chip--active" : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, tier: tier.id }))}
                  >
                    {t.tiers[tier.id].label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="min-w-0 border-0 p-0">
            <legend className="text-[11px] font-medium tracking-[0.04em] text-mute uppercase">
              {t.estimate.style}
            </legend>
            <div className="choice-grid" role="radiogroup" aria-label={t.estimate.style}>
              {STYLES.map((s) => {
                const active = draft.style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`choice-chip${active ? " choice-chip--active" : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, style: s.id }))}
                  >
                    {t.styles[s.id].label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label
            className="block text-[11px] font-medium tracking-[0.04em] text-mute uppercase"
            htmlFor="mensagem"
          >
            {t.quote.message}
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={(event) => setMensagem(event.target.value)}
              rows={3}
              maxLength={800}
              placeholder={t.quote.messagePlaceholder}
              className="field mt-2 min-h-[4.5rem] w-full resize-y text-[15px]"
              suppressHydrationWarning
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[11px] font-medium tracking-[0.06em] text-mute uppercase">{t.estimate.ref}</p>
            <p className="mt-1 font-display text-[1.65rem] leading-none font-semibold tracking-[-0.03em]">
              {totalLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium tracking-[0.06em] text-mute uppercase">{t.quote.delivery}</p>
            <p className="mt-1 text-[15px] font-medium">{prazo}</p>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-mute">{t.estimate.disclaimer}</p>
      </div>

      <div className="rounded-2xl border border-line px-5 py-5">
        <div className="space-y-4">
          <Field id="nome" label={t.quote.name} value={nome} onChange={setNome} error={errors.nome} autoComplete="name" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="telefone"
              label={t.quote.phone}
              value={telefone}
              onChange={setTelefone}
              error={errors.telefone}
              type="tel"
              autoComplete="tel"
            />
            <Field
              id="email"
              label={t.quote.email}
              value={email}
              onChange={setEmail}
              error={errors.email}
              type="email"
              autoComplete="email"
            />
          </div>

          {challenge ? (
            <label className="block text-[11px] font-medium tracking-[0.04em] text-mute uppercase" htmlFor="captcha">
              {challenge.question}
              <input
                id="captcha"
                inputMode="numeric"
                autoComplete="off"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                aria-invalid={Boolean(errors.captcha)}
                className="field mt-2 w-full max-w-[7rem] text-[15px]"
                suppressHydrationWarning
              />
              {errors.captcha ? (
                <span className="mt-1 block normal-case tracking-normal text-[12px] text-timber-deep">
                  {errors.captcha}
                </span>
              ) : null}
            </label>
          ) : (
            <p className="text-[12px] text-mute">{t.quote.captchaLoading}</p>
          )}

          <div ref={turnstileRef} className="pt-1" />

          {formError ? (
            <p role="alert" className="text-[13px] text-timber-deep">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending || !challenge}
            className="btn-cta btn-cta--dark mt-1 w-full disabled:opacity-60 sm:w-auto"
          >
            {pending ? t.quote.sending : t.quote.send}
            <span className="btn-cta__icon" aria-hidden>
              →
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-[11px] font-medium tracking-[0.04em] text-mute uppercase" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-erro` : undefined}
        className="field mt-2 w-full text-[15px]"
        suppressHydrationWarning
      />
      {error ? (
        <span id={`${id}-erro`} className="mt-1 block normal-case tracking-normal text-[12px] text-timber-deep">
          {error}
        </span>
      ) : null}
    </label>
  );
}
