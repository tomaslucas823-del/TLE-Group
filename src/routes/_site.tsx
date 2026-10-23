import { createFileRoute, Outlet } from "@tanstack/react-router";
import { I18nProvider } from "@/components/i18n-provider";
import {
  CookieBanner,
  ScrollTopButton,
  SiteFooter,
  SiteHeader,
  WhatsAppButton,
} from "@/components/site-chrome";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-paper text-ink">
        <SiteHeader />
        <Outlet />
        <SiteFooter />
        <WhatsAppButton />
        <ScrollTopButton />
        <CookieBanner />
      </div>
    </I18nProvider>
  );
}
