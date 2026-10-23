import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export function AccessPanel({ title, callbackURL }: { title: string; callbackURL: string }) {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-md flex-col items-center justify-center px-5 py-24 text-center">
      <h1 className="font-display text-4xl leading-none font-normal md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute md:text-[15px]">
        Entre para acompanhar projetos, propostas e a agenda. Cada conta vê apenas os próprios registros.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              className="btn btn-outline-ink min-h-11 w-full px-5 text-sm"
              onClick={() => signIn(provider.providerId, { callbackURL })}
            >
              Continuar com {provider.label}
            </button>
          ))
        ) : (
          <p className="text-sm text-mute">O acesso por conta está desligado neste ambiente.</p>
        )}
      </div>
    </main>
  );
}
