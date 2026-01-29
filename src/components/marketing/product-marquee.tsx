const productSignals = [
  "Excavators · Heavy duty",
  "Industrial trucks",
  "iPhone 17 series",
  "Smart logistics kits",
  "Construction tooling",
  "Bulk electronics",
];

function MarqueeRow({ reverse }: { reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex min-w-[200%] gap-4 ${
          reverse ? "animate-marquee-slow" : "animate-marquee"
        }`}
      >
        {[...productSignals, ...productSignals].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductMarquee() {
  return (
    <section className="section-shell space-y-4 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-secondary">
            Moving inventory feed
          </p>
          <h4 className="text-lg font-semibold">Live product momentum</h4>
        </div>
        <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
          Direct China supply
        </span>
      </div>
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
