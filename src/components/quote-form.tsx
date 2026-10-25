import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import type { Draft } from "@/components/simulator";
import { STYLES, TIERS, clampArea, estimateCents, type StyleId, type TierId } from "@/lib/estimate";
import { mznFromCents } from "@/lib/format";
import { pushLocalLead } from "@/lib/local-leads";
import { getCaptchaChallenge, submitPublicLead } from "@/lib/studio.functions";

type FieldErrors = { nome?: string; email?: string; telefone?: string; captcha?: string };

type Challenge = {
  token: string;
  question: string;
  turnstileSiteKey?: string;
};

const defaultDraft: Draft = { area: 180, style: "pedra", tier: "estudo" };

/** Prazo de referência por tipo de entrega (semanas). */
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
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<"cloud" | "local" | null>(null);

  const total = estimateCents(draft.area, draft.style, draft.tier);
  const styleLabel = t.styles[draft.style].label;
  const tierLabel = t.tiers[draft.tier].label;
  const weeks = DELIVERY_WEEKS[draft.tier];
  const prazo =
    weeks.min === weeks.max
      ? `${weeks.min} ${t.quote.weeks}`
      : `${weeks.min}–${weeks.max} ${t.quote.weeks}`;

  async function loadChallenge() {
    try {
      const next = await getCaptchaChallenge();
      setChallenge(next);
      setCaptchaAnswer("");
    } catch {
      setChallenge(null);
    }
  }

  useEffect(() => {
    void loadChallenge();
  }, []);

  function validate(nomeVal: string, emailVal: string, telefoneVal: string, answer: string): FieldErrors {
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

    const payload = {
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
    };
    setPending(true);
    try {
      await submitPublicLead({ data: payload });
      setResult("cloud");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      const isSoft =
        !message ||
        /network|fetch|failed to fetch|timeout/i.test(message);
      if (isSoft && !company.trim()) {
        pushLocalLead({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          areaM2: payload.areaM2,
          style: payload.style,
          complexity: payload.complexity,
          message: payload.message,
        });
        setResult("local");
      } else {
        setFormError(message || t.quote.errSubmit);
        void loadChallenge();
      }
    } finally {
      setPending(false);
    }
  }

  if (result) {
    return (
      <div role="status" className="space-y-4">
        <p className="font-display text-[1.75rem] font-semibold tracking-[-0.03em]">{t.quote.received}</p>
        <p className="text-[14px] text-mute">
          {result === "cloud" ? t.quote.receivedCloud : t.quote.receivedLocal}
        </p>
        <div className="border-t border-line pt-4 text-[13px] text-mute">
          <p>{mznFromCents(total)}</p>
          <p className="mt-1">
            {draft.area} m² · {styleLabel} · {tierLabel}
          </p>
          <p className="mt-1">
            {t.quote.delivery}: {prazo}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      {/* Projeto */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-[12px] text-mute" htmlFor="area">
            {t.estimate.area}
            <div className="mt-1.5 flex items-baseline gap-1.5">
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
                className="field w-full"
                suppressHydrationWarning
              />
              <span className="shrink-0 text-[13px] text-mute">m²</span>
            </div>
          </label>

          <label className="block text-[12px] text-mute" htmlFor="tier">
            {t.estimate.tier}
            <select
              id="tier"
              value={draft.tier}
              onChange={(e) => setDraft((d) => ({ ...d, tier: e.target.value as TierId }))}
              className="field mt-1.5 w-full"
              suppressHydrationWarning
            >
              {TIERS.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {t.tiers[tier.id].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-[12px] text-mute" htmlFor="style">
          {t.estimate.style}
          <select
            id="style"
            value={draft.style}
            onChange={(e) => setDraft((d) => ({ ...d, style: e.target.value as StyleId }))}
            className="field mt-1.5 w-full"
            suppressHydrationWarning
          >
            {STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {t.styles[s.id].label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[12px] text-mute" htmlFor="mensagem">
          {t.quote.message}
          <textarea
            id="mensagem"
            value={mensagem}
            onChange={(event) => setMensagem(event.target.value)}
            rows={4}
            maxLength={1200}
            placeholder={t.quote.messagePlaceholder}
            className="field mt-1.5 min-h-[5.5rem] w-full resize-y"
            suppressHydrationWarning
          />
        </label>
      </div>

      {/* Resumo: custo + prazo */}
      <div className="border-y border-line py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-wide text-mute uppercase">{t.estimate.ref}</p>
            <p className="mt-1 font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em]">
              {mznFromCents(total)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] tracking-wide text-mute uppercase">{t.quote.delivery}</p>
            <p className="mt-1 text-[15px] font-medium">{prazo}</p>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-mute">{t.estimate.disclaimer}</p>
      </div>

      {/* Contacto */}
      <div className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="empresa">Company</label>
          <input
            id="empresa"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            suppressHydrationWarning
          />
        </div>

        <Field id="nome" label={t.quote.name} value={nome} onChange={setNome} error={errors.nome} autoComplete="name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="email"
            label={t.quote.email}
            value={email}
            onChange={setEmail}
            error={errors.email}
            type="email"
            autoComplete="email"
          />
          <Field
            id="telefone"
            label={t.quote.phone}
            value={telefone}
            onChange={setTelefone}
            error={errors.telefone}
            type="tel"
            autoComplete="tel"
          />
        </div>

        {challenge ? (
          <label className="block text-[12px] text-mute" htmlFor="captcha">
            {challenge.question}
            <input
              id="captcha"
              inputMode="numeric"
              autoComplete="off"
              value={captchaAnswer}
              onChange={(event) => setCaptchaAnswer(event.target.value)}
              aria-invalid={Boolean(errors.captcha)}
              aria-describedby={errors.captcha ? "captcha-erro" : undefined}
              className="field mt-1.5 w-full max-w-[8rem]"
              suppressHydrationWarning
            />
            {errors.captcha ? (
              <span id="captcha-erro" className="mt-1 block text-[12px] text-timber-deep">
                {errors.captcha}
              </span>
            ) : null}
          </label>
        ) : (
          <p className="text-[13px] text-mute">{t.quote.captchaLoading}</p>
        )}

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
    <label className="block text-[12px] text-mute" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-erro` : undefined}
        className="field mt-1.5 w-full"
        suppressHydrationWarning
      />
      {error ? (
        <span id={`${id}-erro`} className="mt-1 block text-[12px] text-timber-deep">
          {error}
        </span>
      ) : null}
    </label>
  );
}
