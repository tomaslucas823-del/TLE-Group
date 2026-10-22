import { useEffect, useState } from "react";
import type { Draft } from "@/components/simulator";
import { estimateCents, styleLabel, tierLabel } from "@/lib/estimate";
import { brlFromCents } from "@/lib/format";
import { pushLocalLead } from "@/lib/local-leads";
import { getCaptchaChallenge, submitPublicLead } from "@/lib/studio.functions";

type FieldErrors = { nome?: string; email?: string; telefone?: string; captcha?: string };

function validate(nome: string, email: string, telefone: string, captchaAnswer: string): FieldErrors {
  const errors: FieldErrors = {};
  if (nome.trim().length < 2) errors.nome = "Indique o seu nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Indique um e-mail válido.";
  const digits = telefone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) errors.telefone = "Indique um telefone válido.";
  if (!captchaAnswer.trim()) errors.captcha = "Resolva a verificação de segurança.";
  return errors;
}

export function QuoteForm({ draft }: { draft: Draft }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [company, setCompany] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<"cloud" | "local" | null>(null);
  const total = estimateCents(draft.area, draft.style, draft.tier);

  async function loadCaptcha() {
    try {
      const challenge = await getCaptchaChallenge();
      setCaptchaToken(challenge.token);
      setCaptchaQuestion(challenge.question);
      setCaptchaAnswer("");
    } catch {
      setCaptchaQuestion("Verificação indisponível — actualize a página.");
    }
  }

  useEffect(() => {
    void loadCaptcha();
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate(nome, email, telefone, captchaAnswer);
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      name: nome.trim(),
      email: email.trim(),
      phone: telefone.trim(),
      areaM2: draft.area,
      style: draft.style,
      complexity: draft.tier,
      message: mensagem.trim(),
      company: company.trim(),
      captchaToken,
      captchaAnswer: captchaAnswer.trim(),
    };
    setPending(true);
    try {
      await submitPublicLead({ data: payload });
      setResult("cloud");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (/verificação|desafio|incorrecta|expirado|captcha/i.test(message)) {
        setErrors({ captcha: message || "Verificação falhou. Tente de novo." });
        void loadCaptcha();
        setPending(false);
        return;
      }
      if (!company.trim()) {
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
        setResult("cloud");
      }
    } finally {
      setPending(false);
    }
  }

  if (result) {
    return (
      <div role="status">
        <p className="font-display text-4xl font-normal">Pedido recebido.</p>
        <p className="mt-4 text-sm text-mute">
          {result === "cloud"
            ? "Entrou na mesa do estúdio. Resposta em um dia útil."
            : "Ficou guardado neste aparelho e passa para o estúdio no próximo acesso."}
        </p>
        <p className="mt-6 text-sm">
          {brlFromCents(total)} · {draft.area} m² · {styleLabel(draft.style)} · {tierLabel(draft.tier)}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5">
      <p className="text-sm text-mute">
        {brlFromCents(total)} · {draft.area} m² · {styleLabel(draft.style)} · {tierLabel(draft.tier)}
      </p>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa">Empresa</label>
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
      <Field id="nome" label="Nome" value={nome} onChange={setNome} error={errors.nome} autoComplete="name" />
      <Field
        id="email"
        label="E-mail"
        value={email}
        onChange={setEmail}
        error={errors.email}
        type="email"
        autoComplete="email"
      />
      <Field
        id="telefone"
        label="Telefone"
        value={telefone}
        onChange={setTelefone}
        error={errors.telefone}
        type="tel"
        autoComplete="tel"
      />
      <label className="block text-sm text-mute" htmlFor="mensagem">
        Mensagem
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
      <label className="block text-sm text-mute" htmlFor="captcha">
        Segurança — {captchaQuestion || "A carregar…"}
        <input
          id="captcha"
          type="text"
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
      <button type="submit" disabled={pending || !captchaToken} className="mt-2 min-h-11 w-fit bg-ink px-6 text-sm text-paper">
        {pending ? "A enviar…" : "Enviar"}
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
