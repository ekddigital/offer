export default function HeroSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-secondary">
          Unified Commerce Hub
        </p>
        <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Discover every offer from
          <span className="text-gradient from-brand-secondary to-brand-accent">
            {" "}
            A.N.D. GROUP OF COMPANIES{` `}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          A curated marketplace for heavy equipment, mobility, electronics, and
          new ventures—organized for clarity and designed to scale as new
          products launch.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-brand-secondary px-6 py-3 text-sm font-semibold text-brand-secondary-foreground shadow-sm transition hover:bg-brand-secondary-dark">
            Explore Offers
          </button>
          <button className="rounded-full border border-brand-primary/20 px-6 py-3 text-sm font-semibold text-brand-primary transition hover:border-brand-primary/40 hover:bg-brand-primary/5">
            Partner With Us
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-gradient-brand-accent p-8 text-brand-primary-foreground shadow-lg">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-primary-foreground/80">
            Featured category
          </p>
          <h3 className="text-2xl font-semibold">Transport Materials</h3>
          <p className="text-sm text-brand-primary-foreground/90">
            Excavators, trucks, loaders, and enterprise logistics equipment
            shipped directly from Chinese industrial partners.
          </p>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              Enterprise
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              Heavy Equipment
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
