import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import type { Draft } from "@/components/simulator";
import { estimateCents } from "@/lib/estimate";
import { mznFromCents } from "@/lib/format";
import { pushLocalLead } from "@/lib/local-leads";
import { getCaptchaChallenge, submitPublicLead } from "@/lib/studio.functions";

type FieldErrors = { nome?: string; email?: string; telefone?: string; captcha?: string };

type Challenge = {
  token: string;
  question: string;
  turnstileSiteKey?: string;
};

export function QuoteForm({ draft }: { draft: Draft }) {
  const { t } = useI18n();
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
      <div role="status">
        <p className="font-display text-4xl font-normal">{t.quote.received}</p>
        <p className="mt-4 text-sm text-mute">
          {result === "cloud" ? t.quote.receivedCloud : t.quote.receivedLocal}
        </p>
        <p className="mt-6 text-sm">
          {mznFromCents(total)} · {draft.area} m² · {styleLabel} · {tierLabel}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5">
      <p className="text-sm text-mute">
        {mznFromCents(total)} · {draft.area} m² · {styleLabel} · {tierLabel}
      </p>
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
      <label className="block text-sm text-mute" htmlFor="mensagem">
        {t.quote.message}
        <textarea
          id="mensagem"
          value={mensagem}
          onChange={(event) => setMensagem(event.target.value)}
          rows={2}
          maxLength={800}
          className="field mt-1 h-14 resize-none"
          suppressHydrationWarning
        />
      </label>
      {challenge ? (
        <label className="block text-sm text-mute" htmlFor="captcha">
          {challenge.question}
          <input
            id="captcha"
            inputMode="numeric"
            autoComplete="off"
            value={captchaAnswer}
            onChange={(event) => setCaptchaAnswer(event.target.value)}
            aria-invalid={Boolean(errors.captcha)}
            aria-describedby={errors.captcha ? "captcha-erro" : undefined}
            className="field"
            suppressHydrationWarning
          />
          {errors.captcha ? (
            <span id="captcha-erro" className="mt-1 block text-timber-deep">
              {errors.captcha}
            </span>
          ) : null}
        </label>
      ) : (
        <p className="text-sm text-mute">{t.quote.captchaLoading}</p>
      )}
      {formError ? (
        <p role="alert" className="text-sm text-timber-deep">
          {formError}
        </p>
      ) : null}
      <button type="submit" disabled={pending || !challenge} className="btn-cta btn-cta--dark mt-2 w-fit disabled:opacity-60">
        {pending ? t.quote.sending : t.quote.send}
        <span className="btn-cta__icon" aria-hidden>
          →
        </span>
      </button>
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
    <label className="block text-sm text-mute" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-erro` : undefined}
        className="field"
        suppressHydrationWarning
      />
      {error ? (
        <span id={`${id}-erro`} className="mt-1 block text-timber-deep">
          {error}
        </span>
      ) : null}
    </label>
  );
}
