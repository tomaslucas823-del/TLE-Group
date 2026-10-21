import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageTransition } from "@/components/page-transition";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StudioCursor } from "@/components/studio-cursor";
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
      <SmoothScroll />
      <StudioCursor />
      <SiteHeader />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <SiteFooter />
      <WhatsAppButton />
      <ScrollTopButton />
      <CookieBanner />
    </div>
  );
}
