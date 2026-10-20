import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "Algo saiu do previsto. Recarregue a página.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <h1 className="font-display text-3xl font-normal">Não foi possível abrir esta página.</h1>
      <p className="max-w-md text-sm break-words text-mute">{errorMessage(error)}</p>
    </main>
  );
}
