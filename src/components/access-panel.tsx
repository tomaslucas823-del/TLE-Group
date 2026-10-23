import { useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function GoogleSignInButton({ callbackURL }: { callbackURL: string }) {
  const [busy, setBusy] = useState(false);
  const [pressed, setPressed] = useState(false);

  async function onClick() {
    if (busy) return;
    setPressed(true);
    setBusy(true);
    window.setTimeout(() => setPressed(false), 220);
    try {
      await signIn("google", { callbackURL });
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="google-btn group relative inline-flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-line bg-paper px-5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[transform,box-shadow,background-color,border-color] duration-200 hover:-translate-y-px hover:border-ink/20 hover:bg-white hover:shadow-[0_8px_24px_rgb(0_0_0/0.08)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-80"
      style={pressed ? { transform: "scale(0.96)" } : undefined}
    >
      <span className="google-btn__ripple" aria-hidden />
      <GoogleMark />
      <span>{busy ? "A abrir Google…" : "Continuar com Google"}</span>
    </button>
  );
}

export function AccessPanel({ title, callbackURL }: { title: string; callbackURL: string }) {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-md flex-col items-center justify-center px-5 py-24 text-center">
      <h1 className="font-display text-4xl leading-none font-normal md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute md:text-[15px]">
        Entre para acompanhar projetos, propostas e a agenda. Cada conta vê apenas os próprios registros.
      </p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((provider) =>
            provider.providerId === "google" ? (
              <GoogleSignInButton key={provider.providerId} callbackURL={callbackURL} />
            ) : (
              <button
                key={provider.providerId}
                type="button"
                className="btn btn-outline-ink min-h-11 w-full px-5 text-sm active:scale-[0.97]"
                onClick={() => signIn(provider.providerId, { callbackURL })}
              >
                Continuar com {provider.label}
              </button>
            ),
          )
        ) : (
          <p className="text-sm text-mute">O acesso por conta está desligado neste ambiente.</p>
        )}
      </div>
      <style>{`
        .google-btn__ripple {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(circle at center, rgb(22 22 22 / 0.08) 0%, transparent 65%);
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .google-btn:active .google-btn__ripple {
          opacity: 1;
          transform: scale(1.15);
          transition-duration: 0.12s;
        }
        @media (prefers-reduced-motion: reduce) {
          .google-btn,
          .google-btn__ripple {
            transition: none !important;
          }
          .google-btn:active {
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
