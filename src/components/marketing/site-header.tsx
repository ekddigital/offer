export default function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand" />
          <div className="leading-tight">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              A.N.D. GROUP OF COMPANIES LLC
            </p>
            <h1 className="text-lg font-semibold">AndOffer Portal</h1>
          </div>
        </div>
        <button className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-brand-primary-foreground shadow-sm transition hover:bg-brand-primary-dark">
          Get Early Access
        </button>
      </div>
    </header>
  );
}
