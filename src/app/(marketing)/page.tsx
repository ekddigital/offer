import HeroSection from "@/components/marketing/hero";
import OfferCategories from "@/components/marketing/offer-categories";
import SiteHeader from "@/components/marketing/site-header";
import TrustStrip from "@/components/marketing/trust-strip";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-16 px-6 py-16">
        <HeroSection />
        <TrustStrip />
        <OfferCategories />
      </main>
    </div>
  );
}
