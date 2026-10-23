import { createFileRoute, Outlet } from "@tanstack/react-router";
import { I18nProvider } from "@/components/i18n-provider";
import { PageTransition } from "@/components/page-transition";
import {
  CookieBanner,
  ScrollTopButton,
  SiteFooter,
  SiteHeader,
  WhatsAppButton,
} from "@/components/site-chrome";
import { SmoothScroll } from "@/components/smooth-scroll";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <I18nProvider>
      <SmoothScroll />
      <div className="min-h-screen bg-paper text-ink">
        <SiteHeader />
        <PageTransition>
          <Outlet />
        </PageTransition>
        <SiteFooter />
        <WhatsAppButton />
        <ScrollTopButton />
        <CookieBanner />
      </div>
    </I18nProvider>
  );
}
