import { createFileRoute, Outlet } from "@tanstack/react-router";
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
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <WhatsAppButton />
      <ScrollTopButton />
      <CookieBanner />
    </div>
  );
}
