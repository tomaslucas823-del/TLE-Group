import { createFileRoute } from "@tanstack/react-router";
import { AccessPanel } from "@/components/access-panel";

export const Route = createFileRoute("/_site/login")({
  head: () => ({
    meta: [
      { title: "Entrar - TLE Group" },
      { name: "description", content: "Aceda à área do estúdio ou ao portal do cliente." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return <AccessPanel title="Entrar no estúdio" callbackURL="/estudio" />;
}
