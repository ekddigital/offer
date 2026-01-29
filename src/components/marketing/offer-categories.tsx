import { offerCategories } from "@/lib/data/offer-categories";

export default function OfferCategories() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Core Offer Categories</h3>
        <p className="text-muted-foreground">
          Every category follows the same brand system, so updates are made once
          and reflect everywhere.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {offerCategories.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border border-border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${card.tone}`}
          >
            <h4 className="text-lg font-semibold text-brand-primary">
              {card.title}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {card.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {card.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-brand-primary"
                >
                  {highlight}
                </span>
              ))}
            </div>
            <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary hover:text-brand-secondary-dark">
              View offers
              <span aria-hidden>→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
