import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { buttonVariants } from "@/components/ui/button";

export function AccessPanel({ title, callbackURL }: { title: string; callbackURL: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 pt-28 pb-16">
      <h1 className="font-display text-5xl leading-none font-normal">{title}</h1>
      <p className="mt-4 text-mute">
        Entre para acompanhar projetos, propostas e a agenda. Cada conta vê apenas os próprios registros.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              className={buttonVariants({ variant: "line" })}
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
