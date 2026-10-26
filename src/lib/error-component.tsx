import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "Algo saiu do previsto. Recarregue a página.";

/** Messages that are safe to show to end users (validation / auth). */
const SAFE_PREFIXES = [
  "Unauthorized",
  "Sem permissão",
  "Informe",
  "Indique",
  "E-mail",
  "Telefone",
  "Estimativa",
  "Status inválido",
  "Método inválido",
  "Demasiados pedidos",
  "Apenas a equipa",
  "Conta de cliente",
  "Cliente não encontrado",
  "Não foi possível",
];

function isSafeMessage(message: string): boolean {
  if (message.length > 180) return false;
  // Never show stack-like content
  if (message.includes("\n") || message.includes(" at ") || message.includes("Error:")) return false;
  return SAFE_PREFIXES.some((p) => message.startsWith(p) || message.includes(p));
}

function errorMessage(error: unknown): string {
  const raw =
    error instanceof Error && error.message
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  const isProd =
    typeof process !== "undefined" && process.env?.NODE_ENV === "production";

  if (!raw) return FALLBACK_MESSAGE;
  if (isProd && !isSafeMessage(raw)) return FALLBACK_MESSAGE;
  return raw;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <h1 className="font-display text-3xl font-normal">Não foi possível abrir esta página.</h1>
      <p className="max-w-md text-sm break-words text-mute">{errorMessage(error)}</p>
    </main>
  );
}
