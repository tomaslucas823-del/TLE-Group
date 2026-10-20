import { createFileRoute } from "@tanstack/react-router";
import { AccessPanel } from "@/components/access-panel";

export const Route = createFileRoute("/_site/login")({
  head: () => ({
    meta: [
      { title: "Entrar — TLE Arquitetura" },
      { name: "description", content: "Acesso ao portal do cliente e à área do estúdio." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return <AccessPanel title="Entrar no estúdio" callbackURL="/estudio" />;
}
