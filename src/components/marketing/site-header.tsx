import Link from "next/link";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/ui/brand-logo";
import { UserMenu } from "@/components/ui/user-menu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="relative z-50 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={40} />
          <h1 className="text-2xl font-bold text-foreground">AND Offer</h1>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <UserMenu user={session.user} links={navLinks} />
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg border-2 border-ecommerce-border bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-ecommerce-secondary-hover hover:border-ecommerce-secondary-border"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg border-2 border-ecommerce-primary bg-ecommerce-primary px-5 py-2.5 text-sm font-semibold text-ecommerce-primary-text shadow-md transition hover:bg-ecommerce-primary-hover hover:border-ecommerce-primary-hover hover:shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
