import Image from "next/image";
import Link from "next/link";

const heroImages = [
  {
    src: "/products/excavator-kinds.JPG",
    alt: "Excavator lineup",
  },
  {
    src: "/products/excavator-production-site.JPG",
    alt: "Excavators at production site",
  },
  {
    src: "/products/excavator.JPG",
    alt: "Excavator on site",
  },
  {
    src: "/products/trucks.JPG",
    alt: "Industrial trucks",
  },
  {
    src: "/products/iphone.png",
    alt: "iPhone devices",
  },
  {
    src: "/products/samsung-galaxy-ultra-s24-vs-iphone.png",
    alt: "Mobile device lineup",
  },
];

export default function HeroSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-secondary">
          A.N.D. GROUP OF COMPANIES LLC
        </p>
        <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Direct Sourcing from China
          <span className="bg-gradient-to-r from-[#A5F3FC] to-[#22D3EE] bg-clip-text text-transparent">
            {" "}
            via AND Offer{" "}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Your trusted portal for heavy equipment, industrial machinery, and
          electronics. Connect directly with verified Chinese suppliers through
          our secure platform.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-lg border-2 border-ecommerce-primary bg-ecommerce-primary px-6 py-3 text-sm font-semibold text-ecommerce-primary-text shadow-lg transition hover:bg-ecommerce-primary-hover hover:border-ecommerce-primary-hover hover:shadow-xl"
          >
            Explore Offers
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border-2 border-ecommerce-secondary-border bg-ecommerce-secondary px-6 py-3 text-sm font-semibold text-ecommerce-secondary-text transition hover:bg-ecommerce-secondary-hover hover:border-ecommerce-secondary-border"
          >
            Partner With Us
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {heroImages.map((image, index) => (
            <div
              key={image.src}
              className="relative h-40 overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:h-48"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index < 2}
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-brand-primary/10 bg-brand-primary/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
            A.N.D. GROUP OF COMPANIES LLC
          </p>
          <h3 className="mt-2 text-lg font-semibold">Verified sourcing hub</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Consolidated procurement, logistics support, and direct factory
            access—so every offer is faster, clearer, and traceable.
          </p>
        </div>
      </div>
    </section>
  );
}
