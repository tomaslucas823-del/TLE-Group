import { createFileRoute } from "@tanstack/react-router";
import { AccessPanel } from "@/components/access-panel";

type LoginSearch = { callback?: string };

export const Route = createFileRoute("/_site/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    callback: typeof search.callback === "string" ? search.callback : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar - TLE Group" },
      { name: "description", content: "Aceda à área do estúdio ou ao portal do cliente." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { callback } = Route.useSearch();
  const callbackURL =
    callback && callback.startsWith("/") && !callback.startsWith("//")
      ? callback
      : "/estudio";
  return <AccessPanel title="Entrar no estúdio" callbackURL={callbackURL} />;
}
