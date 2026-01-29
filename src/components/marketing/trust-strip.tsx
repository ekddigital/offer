const trustItems = [
  "Direct China supply lines",
  "Verified industrial partners",
  "Unified procurement tracking",
];

export default function TrustStrip() {
  return (
    <section className="flex flex-wrap gap-6 rounded-2xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground">
      {trustItems.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-accent" />
          {item}
        </div>
      ))}
    </section>
  );
}
