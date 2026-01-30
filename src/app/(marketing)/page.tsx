import HeroSection from "@/components/marketing/hero";
import OfferCategories from "@/components/marketing/offer-categories";
import ProductMarquee from "@/components/marketing/product-marquee";
import SiteHeader from "@/components/marketing/site-header";
import SiteFooter from "@/components/marketing/site-footer";
import TrustStrip from "@/components/marketing/trust-strip";
import WhatsAppBtn from "@/components/marketing/whatsapp-btn";

export default function MarketingHome() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-16 px-6 py-16">
        <HeroSection />
        <TrustStrip />
        <ProductMarquee />
        <OfferCategories />
      </main>
      <SiteFooter />
      <WhatsAppBtn />
    </div>
  );
}
