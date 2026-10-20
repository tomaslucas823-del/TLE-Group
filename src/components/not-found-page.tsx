import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 py-24 text-center text-ink">
      <div className="max-w-md">
        <p className="font-display text-6xl font-normal">404</p>
        <h1 className="mt-4 font-display text-4xl font-normal">Esta página não foi desenhada.</h1>
        <p className="mt-4 text-mute">
          O endereço não corresponde a nenhum ambiente do estúdio. Volte ao início ou veja os
          projetos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={buttonVariants()}>
            Voltar ao início
          </Link>
          <Link to="/portfolio" className={buttonVariants({ variant: "line" })}>
            Ver portfólio
          </Link>
        </div>
      </div>
    </main>
  );
}
